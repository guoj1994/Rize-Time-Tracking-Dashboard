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
import type { ActivityCategory, AppUsage, LiveEntry, SessionConfig, SessionState } from '../types';

interface TrackingValue {
  state: SessionState;
  config: SessionConfig | null;
  trackingEnabled: boolean;
  sessionSeconds: number;
  remainingSeconds: number | null;
  justCompleted: boolean;
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
  startFocus: (config: SessionConfig) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  dismissCompletion: () => void;
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
  const [state, setState] = useState<SessionState>('idle');
  const [config, setConfig] = useState<SessionConfig | null>(null);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [justCompleted, setJustCompleted] = useState(false);
  const [trackedSeconds, setTrackedSeconds] = useState(seedTrackedSeconds);
  const [focusSeconds, setFocusSeconds] = useState(seedFocusSeconds);
  const [meetingSeconds] = useState(seedMeetingSeconds);
  const [breakSeconds] = useState(seedBreakSeconds);
  const [sessions, setSessions] = useState(seedSessions);
  const [apps, setApps] = useState<AppUsage[]>(seedAppUsage);
  const [websites, setWebsites] = useState<AppUsage[]>(seedWebsiteUsage);
  const [rotationTick, setRotationTick] = useState(0);
  const [liveLog, setLiveLog] = useState<LiveEntry[]>([]);
  const [overrides, setOverrides] = useState<Record<string, ActivityCategory>>({});

  const rotationIndex = Math.floor(rotationTick / ROTATION_SECONDS) % focusRotation.length;
  const rotating = focusRotation[rotationIndex];
  const activeApp = rotating.app;
  const activeWebsite = rotating.website ?? null;

  useEffect(() => {
    if (state !== 'running') return;
    const id = window.setInterval(() => {
      setSessionSeconds((value) => value + 1);
      setTrackedSeconds((value) => value + 1);
      setFocusSeconds((value) => value + 1);
      setRotationTick((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [state]);

  useEffect(() => {
    if (state !== 'running') return;
    setApps((list) => addSeconds(list, activeApp, 'app', rotating.category));
    if (activeWebsite) setWebsites((list) => addSeconds(list, activeWebsite, 'website', rotating.category));
  }, [state, rotationTick, activeApp, activeWebsite, rotating.category]);

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
        aiCategory: verdict.category,
        confidence: verdict.confidence,
        reason: verdict.reason
      },
      ...log].
      slice(0, 12);
    });
  }, [state, rotationTick, activeApp, activeWebsite]);

  const finishSession = useCallback((completed: boolean) => {
    setState('idle');
    setSessionSeconds(0);
    setJustCompleted(completed);
  }, []);

  useEffect(() => {
    if (!config || config.plannedSeconds <= 0) return;
    if (state !== 'running') return;
    if (sessionSeconds < config.plannedSeconds) return;
    finishSession(true);
  }, [sessionSeconds, state, config, finishSession]);

  const startFocus = useCallback((next: SessionConfig) => {
    setConfig(next);
    setSessionSeconds(0);
    setTrackingEnabled(true);
    setJustCompleted(false);
    setState('running');
    setSessions((count) => count + 1);
  }, []);

  const pauseSession = useCallback(() => setState('paused'), []);
  const resumeSession = useCallback(() => setState('running'), []);
  const endSession = useCallback(() => finishSession(false), [finishSession]);
  const dismissCompletion = useCallback(() => setJustCompleted(false), []);

  const toggleTracking = useCallback(() => {
    setTrackingEnabled((value) => {
      if (value) finishSession(false);
      return !value;
    });
  }, [finishSession]);

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
      config,
      trackingEnabled,
      sessionSeconds,
      remainingSeconds,
      justCompleted,
      trackedSeconds,
      focusSeconds,
      meetingSeconds,
      breakSeconds,
      sessions,
      currentApp: state === 'running' ? activeApp : 'Idle',
      currentWebsite: state === 'running' ? activeWebsite : null,
      apps,
      websites,
      liveLog,
      toggleTracking,
      startFocus,
      pauseSession,
      resumeSession,
      endSession,
      dismissCompletion,
      categoryFor,
      isOverridden,
      setCategory
    }),
    [
    state,
    config,
    trackingEnabled,
    sessionSeconds,
    remainingSeconds,
    justCompleted,
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
    pauseSession,
    resumeSession,
    endSession,
    dismissCompletion,
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