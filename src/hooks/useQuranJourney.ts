"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/services/supabase";
import { EMPTY_JOURNEY, JOURNEY_EVENT, JourneyData, mergeJourney, readJourney, writeJourney } from "@/lib/quran-journey";

export function useQuranJourney() {
  const [data, setData] = useState<JourneyData>(EMPTY_JOURNEY);
  const [loaded, setLoaded] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [syncState, setSyncState] = useState<"device" | "syncing" | "synced" | "error">("device");

  useEffect(() => {
    const local = readJourney();
    setData(local);
    setLoaded(true);
    const onJourney = (event: Event) => setData((event as CustomEvent<JourneyData>).detail || readJourney());
    window.addEventListener(JOURNEY_EVENT, onJourney);
    return () => window.removeEventListener(JOURNEY_EVENT, onJourney);
  }, []);

  useEffect(() => {
    if (!loaded || !isSupabaseConfigured) return;
    let active = true;
    const supabase = createClient();
    const sync = async () => {
      setSyncState("syncing");
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!active || !user) {
        if (active) { setAuthenticated(false); setSyncState("device"); }
        return;
      }
      setAuthenticated(true);
      const local = readJourney();
      const { data: row, error } = await supabase.from("quran_user_data").select("payload").eq("user_id", user.id).maybeSingle();
      if (error) { setSyncState("error"); return; }
      const merged = row?.payload ? mergeJourney(local, row.payload as JourneyData) : local;
      writeJourney(merged);
      setData(merged);
      const { error: upsertError } = await supabase.from("quran_user_data").upsert({ user_id: user.id, payload: merged, updated_at: new Date().toISOString() });
      if (active) setSyncState(upsertError ? "error" : "synced");
    };
    sync();
    return () => { active = false; };
  }, [loaded]);

  const update = useCallback(async (updater: (current: JourneyData) => JourneyData) => {
    const next = updater(readJourney());
    writeJourney(next);
    setData(next);
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) return;
    setSyncState("syncing");
    const { error } = await supabase.from("quran_user_data").upsert({ user_id: user.id, payload: next, updated_at: new Date().toISOString() });
    setSyncState(error ? "error" : "synced");
  }, []);

  return { data, loaded, authenticated, syncState, update };
}

