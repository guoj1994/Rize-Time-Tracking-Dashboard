import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  dailyTargetSeconds,
  focusRotation,
  seedAppUsage,
  seedBreakSeconds,
  seedFocusSeconds,
  seedMeetingSeconds,
  seedSessions,
  seedTrackedSeconds,
  seedWebsiteUsage,
  sounds } from
'../data/tracking';
import { classify } from '../utils/classify';
import type { ActivityCategory, AppUsage, LiveEntry, SessionConfig, SessionKind, SessionState } from '../types';

export const defaultConfig: SessionConfig = {
  kind: 'focus',
  plannedSeconds: 45 * 60,
  goal: '',
  taskId: null,
  projectId: null,
  clientId: null,
  sound: 'silence',
  autoBreak: true,
  blockDistractions: false,
  muteNotifications: true
};

interface TrackingValue {
  state: SessionState;
  sessionKind: SessionKind | null;
  config: SessionConfig | null;
  trackingEnabled: boolean;
  sessionSeconds: number;
  remainingSeconds: number | null;
  trackedSeconds: number;
  focusSeconds: number;
  meetingSeconds: number;
  breakSeconds: number;
  sessions: number;
  targetSeconds: number;
  currentApp: string;
  currentWebsite: string | null;
  apps: AppUsage[];
  websites: AppUsage[];
  liveLog: LiveEntry[];
  launcherKind: SessionKind | null;
  lastCompleted: SessionKind | null;
  soundId: string;
  musicPlaying: boolean;
  openLauncher: (kind: SessionKind) => void;
  closeLauncher: () => void;
  beginSession: (config: SessionConfig) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  toggleTracking: () => void;
  toggleMusic: () => void;
  cycleSound: () => void;
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
  const [state, setState] = useState<SessionState>('locked');
  const [sessionKind, setSessionKind] = useState<SessionKind | null>(null);
  const [config, setConfig] = useState<SessionConfig | null>(null);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [trackedSeconds, setTrackedSeconds] = useState(seedTrackedSeconds);
  const [focusSeconds, setFocusSeconds] = useState(seedFocusSeconds);
  const [meetingSeconds, setMeetingSeconds] = useState(seedMeetingSeconds);
  const [breakSeconds, setBreakSeconds] = useState(seedBreakSeconds);
  const [sessions, setSessions] = useState(seedSessions);
  const [apps, setApps] = useState<AppUsage[]>(seedAppUsage);
  const [websites, setWebsites] = useState<AppUsage[]>(seedWebsiteUsage);
  const [rotationTick, setRotationTick] = useState(0);
  const [liveLog, setLiveLog] = useState<LiveEntry[]>([]);
  const [launcherKind, setLauncherKind] = useState<SessionKind | null>(null);
  const [lastCompleted, setLastCompleted] = useState<SessionKind | null>(null);
  const [soundId, setSoundId] = useState('silence');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, ActivityCategory>>({});

  const rotationIndex = Math.floor(rotationTick / ROTATION_SECONDS) % focusRotation.length;
  const rotating = focusRotation[rotationIndex];
  const isMeeting = sessionKind === 'meeting';
  const activeApp = isMeeting ? 'Google Meet' : rotating.app;
  const activeWebsite = isMeeting ? null : rotating.website ?? null;

  useEffect(() => {
    if (state !== 'running' && state !== 'break') return;
    const id = window.setInterval(() => {
      setSessionSeconds((value) => value + 1);
      if (state === 'break') {
        setBreakSeconds((value) => value + 1);
        return;
      }
      setTrackedSeconds((value) => value + 1);
      if (sessionKind === 'meeting') setMeetingSeconds((value) => value + 1);else
      setFocusSeconds((value) => value + 1);
      setRotationTick((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [state, sessionKind]);

  useEffect(() => {
    if (state !== 'running') return;
    setApps((list) => addSeconds(list, activeApp, 'app', isMeeting ? 'meeting' : rotating.category));
    if (activeWebsite) setWebsites((list) => addSeconds(list, activeWebsite, 'website', rotating.category));
  }, [state, rotationTick, activeApp, activeWebsite, isMeeting, rotating.category]);

  useEffect(() => {
    if (state !== 'running') return;
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
        aiCategory: isMeeting ? 'meeting' : verdict.category,
        confidence: isMeeting ? 0.99 : verdict.confidence,
        reason: isMeeting ? 'Started from the Meeting session type' : verdict.reason
      },
      ...log].
      slice(0, 12);
    });
  }, [state, rotationTick, activeApp, activeWebsite, isMeeting]);

  const finishSession = useCallback(
    (completed: SessionKind | null, promptBreak: boolean) => {
      setState('locked');
      setSessionKind(null);
      setSessionSeconds(0);
      setMusicPlaying(false);
      setLastCompleted(completed);
      if (promptBreak) setLauncherKind('break');
    },
    []
  );

  useEffect(() => {
    if (!config || config.plannedSeconds <= 0) return;
    if (state !== 'running' && state !== 'break') return;
    if (sessionSeconds < config.plannedSeconds) return;
    finishSession(config.kind, config.kind !== 'break' && config.autoBreak);
  }, [sessionSeconds, state, config, finishSession]);

  const openLauncher = useCallback((kind: SessionKind) => setLauncherKind(kind), []);
  const closeLauncher = useCallback(() => setLauncherKind(null), []);

  const beginSession = useCallback((next: SessionConfig) => {
    setConfig(next);
    setSessionKind(next.kind);
    setSessionSeconds(0);
    setSoundId(next.sound);
    setMusicPlaying(next.sound !== 'silence');
    setTrackingEnabled(true);
    setLauncherKind(null);
    setLastCompleted(null);
    setState(next.kind === 'break' ? 'break' : 'running');
    if (next.kind !== 'break') setSessions((count) => count + 1);
  }, []);

  const pauseSession = useCallback(() => setState('paused'), []);
  const resumeSession = useCallback(
    () => setState(sessionKind === 'break' ? 'break' : 'running'),
    [sessionKind]
  );
  const endSession = useCallback(() => finishSession(null, false), [finishSession]);

  const toggleTracking = useCallback(() => {
    setTrackingEnabled((value) => {
      if (value) finishSession(null, false);
      return !value;
    });
  }, [finishSession]);

  const toggleMusic = useCallback(() => setMusicPlaying((value) => !value), []);
  const cycleSound = useCallback(() => {
    setSoundId((current) => {
      const index = sounds.findIndex((sound) => sound.id === current);
      return sounds[(index + 1) % sounds.length].id;
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
  config && config.plannedSeconds > 0 ? Math.max(0, config.plannedSeconds - sessionSeconds) : null;

  const value = useMemo<TrackingValue>(
    () => ({
      state,
      sessionKind,
      config,
      trackingEnabled,
      sessionSeconds,
      remainingSeconds,
      trackedSeconds,
      focusSeconds,
      meetingSeconds,
      breakSeconds,
      sessions,
      targetSeconds: dailyTargetSeconds,
      currentApp: state === 'running' ? activeApp : state === 'break' ? 'Away from keyboard' : 'Idle',
      currentWebsite: state === 'running' ? activeWebsite : null,
      apps,
      websites,
      liveLog,
      launcherKind,
      lastCompleted,
      soundId,
      musicPlaying,
      openLauncher,
      closeLauncher,
      beginSession,
      pauseSession,
      resumeSession,
      endSession,
      toggleTracking,
      toggleMusic,
      cycleSound,
      categoryFor,
      isOverridden,
      setCategory
    }),
    [
    state,
    sessionKind,
    config,
    trackingEnabled,
    sessionSeconds,
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
    launcherKind,
    lastCompleted,
    soundId,
    musicPlaying,
    openLauncher,
    closeLauncher,
    beginSession,
    pauseSession,
    resumeSession,
    endSession,
    toggleTracking,
    toggleMusic,
    cycleSound,
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