import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  focusRotation,
  seedAppUsage,
  seedBreakSeconds,
  seedFocusSeconds,
  seedMeetingSeconds,
  seedSessions,
  seedTrackedSeconds,
  seedWebsiteUsage } from
'../data/tracking';
import { classify } from '../utils/classify';
import type { ActivityCategory, AppUsage, LiveEntry, SessionConfig, SessionKind, SessionPhase } from '../types';

interface TrackingValue {
  phase: SessionPhase;
  kind: SessionKind | null;
  config: SessionConfig | null;
  trackingEnabled: boolean;
  elapsedSeconds: number;
  remainingSeconds: number | null;
  trackedSeconds: number;
  focusSeconds: number;
  meetingSeconds: number;
  breakSeconds: number;
  sessions: number;
  currentApp: string;
  currentWebsite: string | null;
  apps: AppUsage[];
  websites: AppUsage[];
  liveLog: LiveEntry[];
  toggleTracking: () => void;
  startFocus: (input: {taskName: string;projectId: string | null;plannedSeconds: number;}) => void;
  startMeeting: () => void;
  startBreak: (plannedSeconds: number) => void;
  takeBreak: (plannedSeconds: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  skipBreak: () => void;
  endBreak: () => void;
  startNextFocus: () => void;
  categoryFor: (id: string, fallback: ActivityCategory) => ActivityCategory;
  isOverridden: (id: string) => boolean;
  setCategory: (id: string, category: ActivityCategory) => void;
}

const TrackingContext = createContext<TrackingValue | null>(null);

const ROTATION_SECONDS = 9;

function addSeconds(list: AppUsage[], name: string, kind: AppUsage['kind'], category: AppUsage['category']) {
  const index = list.findIndex((item) => item.name === name);
  if (index === -1) return [...list, { name, kind, category, seconds: 1 }];
  const next = [...list];
  next[index] = { ...next[index], seconds: next[index].seconds + 1 };
  return next;
}

export function TrackingProvider({ children }: {children: React.ReactNode;}) {
  const [phase, setPhase] = useState<SessionPhase>('idle');
  const [kind, setKind] = useState<SessionKind | null>(null);
  const [config, setConfig] = useState<SessionConfig | null>(null);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [trackedSeconds, setTrackedSeconds] = useState(seedTrackedSeconds);
  const [focusSeconds, setFocusSeconds] = useState(seedFocusSeconds);
  const [meetingSeconds, setMeetingSeconds] = useState(seedMeetingSeconds);
  const [breakSeconds, setBreakSeconds] = useState(seedBreakSeconds);
  const [sessions, setSessions] = useState(seedSessions);
  const [apps, setApps] = useState<AppUsage[]>(seedAppUsage);
  const [websites, setWebsites] = useState<AppUsage[]>(seedWebsiteUsage);
  const [rotationTick, setRotationTick] = useState(0);
  const [liveLog, setLiveLog] = useState<LiveEntry[]>([]);
  const [overrides, setOverrides] = useState<Record<string, ActivityCategory>>({});

  const isFocusRunning = phase === 'running' && kind === 'focus';
  const isMeetingRunning = phase === 'running' && kind === 'meeting';
  const isBreakRunning = phase === 'running' && kind === 'break';

  const rotationIndex = Math.floor(rotationTick / ROTATION_SECONDS) % focusRotation.length;
  const rotating = focusRotation[rotationIndex];
  const activeApp = isFocusRunning ? rotating.app : isMeetingRunning ? 'Google Meet' : 'Away from keyboard';
  const activeWebsite = isFocusRunning ? rotating.website ?? null : null;

  // Tick the clock for any active session.
  useEffect(() => {
    if (phase !== 'running') return;
    const id = window.setInterval(() => {
      setElapsedSeconds((value) => value + 1);
      if (kind === 'focus') {
        setTrackedSeconds((value) => value + 1);
        setFocusSeconds((value) => value + 1);
        setRotationTick((value) => value + 1);
      } else if (kind === 'meeting') {
        setTrackedSeconds((value) => value + 1);
        setMeetingSeconds((value) => value + 1);
      } else if (kind === 'break') {
        setBreakSeconds((value) => value + 1);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, kind]);

  // Local capture only happens during an actual focus session.
  useEffect(() => {
    if (!isFocusRunning) return;
    setApps((list) => addSeconds(list, activeApp, 'app', rotating.category));
    if (activeWebsite) setWebsites((list) => addSeconds(list, activeWebsite, 'website', rotating.category));
  }, [isFocusRunning, rotationTick, activeApp, activeWebsite, rotating.category]);

  useEffect(() => {
    if (!isFocusRunning) return;
    setLiveLog((log) => {
      const head = log[0];
      if (head && head.app === activeApp && head.website === activeWebsite) {
        const next = [...log];
        next[0] = { ...head, seconds: head.seconds + 1 };
        return next;
      }
      const verdict = classify(activeApp, activeWebsite);
      return [
      {
        id: `live-${Date.now()}`,
        app: activeApp,
        website: activeWebsite,
        seconds: 1,
        aiCategory: verdict.category,
        confidence: verdict.confidence,
        reason: verdict.reason
      },
      ...log].
      slice(0, 12);
    });
  }, [isFocusRunning, rotationTick, activeApp, activeWebsite]);

  // Natural completion: focus -> offer a break. Break -> offer the next focus. Meeting just ends.
  useEffect(() => {
    if (phase !== 'running' || !config || config.plannedSeconds <= 0) return;
    if (elapsedSeconds < config.plannedSeconds) return;
    if (kind === 'focus') {
      setPhase('breakOffer');
      setElapsedSeconds(0);
    } else if (kind === 'break') {
      setPhase('breakDone');
      setElapsedSeconds(0);
    } else {
      setPhase('idle');
      setKind(null);
      setConfig(null);
      setElapsedSeconds(0);
    }
  }, [elapsedSeconds, phase, kind, config]);

  const begin = useCallback((next: SessionConfig) => {
    setConfig(next);
    setKind(next.kind);
    setElapsedSeconds(0);
    setTrackingEnabled(true);
    setPhase('running');
    setSessions((count) => count + 1);
  }, []);

  const startFocus = useCallback(
    (input: {taskName: string;projectId: string | null;plannedSeconds: number;}) =>
    begin({ kind: 'focus', taskName: input.taskName, projectId: input.projectId, plannedSeconds: input.plannedSeconds }),
    [begin]
  );

  const startMeeting = useCallback(
    () => begin({ kind: 'meeting', taskName: 'Meeting', projectId: null, plannedSeconds: 0 }),
    [begin]
  );

  const startBreak = useCallback(
    (plannedSeconds: number) => begin({ kind: 'break', taskName: '', projectId: null, plannedSeconds }),
    [begin]
  );

  const takeBreak = useCallback(
    (plannedSeconds: number) => begin({ kind: 'break', taskName: '', projectId: null, plannedSeconds }),
    [begin]
  );

  const pauseSession = useCallback(() => setPhase((current) => current === 'running' ? 'paused' : current), []);
  const resumeSession = useCallback(() => setPhase((current) => current === 'paused' ? 'running' : current), []);

  const endSession = useCallback(() => {
    setPhase('idle');
    setKind(null);
    setConfig(null);
    setElapsedSeconds(0);
  }, []);

  const skipBreak = useCallback(() => {
    setPhase('idle');
    setKind(null);
    setConfig(null);
    setElapsedSeconds(0);
  }, []);

  const endBreak = useCallback(() => {
    setPhase('breakDone');
    setElapsedSeconds(0);
  }, []);

  const startNextFocus = useCallback(() => {
    setPhase('idle');
    setKind(null);
    setConfig(null);
    setElapsedSeconds(0);
  }, []);

  const toggleTracking = useCallback(() => {
    setTrackingEnabled((value) => {
      if (value) {
        setPhase('idle');
        setKind(null);
        setConfig(null);
        setElapsedSeconds(0);
      }
      return !value;
    });
  }, []);

  const categoryFor = useCallback(
    (id: string, fallback: ActivityCategory) => overrides[id] ?? fallback,
    [overrides]
  );
  const isOverridden = useCallback((id: string) => id in overrides, [overrides]);
  const setCategory = useCallback(
    (id: string, category: ActivityCategory) => setOverrides((current) => ({ ...current, [id]: category })),
    []
  );

  const remainingSeconds =
  config && config.plannedSeconds > 0 ? Math.max(0, config.plannedSeconds - elapsedSeconds) : null;

  const value = useMemo<TrackingValue>(
    () => ({
      phase,
      kind,
      config,
      trackingEnabled,
      elapsedSeconds,
      remainingSeconds,
      trackedSeconds,
      focusSeconds,
      meetingSeconds,
      breakSeconds,
      sessions,
      currentApp: phase === 'running' ? activeApp : 'Idle',
      currentWebsite: phase === 'running' ? activeWebsite : null,
      apps,
      websites,
      liveLog,
      toggleTracking,
      startFocus,
      startMeeting,
      startBreak,
      takeBreak,
      pauseSession,
      resumeSession,
      endSession,
      skipBreak,
      endBreak,
      startNextFocus,
      categoryFor,
      isOverridden,
      setCategory
    }),
    [
    phase,
    kind,
    config,
    trackingEnabled,
    elapsedSeconds,
    remainingSeconds,
    trackedSeconds,
    focusSeconds,
    meetingSeconds,
    breakSeconds,
    sessions,
    activeApp,
    activeWebsite,
    apps,
    websites,
    liveLog,
    toggleTracking,
    startFocus,
    startMeeting,
    startBreak,
    takeBreak,
    pauseSession,
    resumeSession,
    endSession,
    skipBreak,
    endBreak,
    startNextFocus,
    categoryFor,
    isOverridden,
    setCategory]

  );

  return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>;
}

export function useTracking(): TrackingValue {
  const context = useContext(TrackingContext);
  if (!context) throw new Error('useTracking must be used inside a TrackingProvider');
  return context;
}