import { ref } from "vue";
import { readStoredAuth } from "./useOpcRegionDefaults";

const STORAGE_KEY = "weopc_event_registrations";

export interface EventRegistrationRecord {
  id: string;
  eventId: string;
  title: string;
  phone: string;
  createdAt: string;
}

function loadAll(): EventRegistrationRecord[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const o = JSON.parse(raw) as EventRegistrationRecord[];
    return Array.isArray(o) ? o : [];
  } catch {
    return [];
  }
}

function saveAll(list: EventRegistrationRecord[]) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

const records = ref<EventRegistrationRecord[]>(loadAll());
let loaded = false;

function ensureLoaded() {
  if (loaded) return;
  records.value = loadAll();
  loaded = true;
}

export function useEventRegistrations() {
  ensureLoaded();

  function registerEvent(eventId: string, title: string) {
    const auth = readStoredAuth();
    const phone = auth?.phone ?? "";
    const row: EventRegistrationRecord = {
      id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      eventId,
      title,
      phone,
      createdAt: new Date().toISOString(),
    };
    records.value = [row, ...records.value];
    saveAll(records.value);
  }

  function participatedEventIds(phone: string): Set<string> {
    const p = phone.trim();
    if (!p) return new Set();
    return new Set(records.value.filter((r) => r.phone === p).map((r) => r.eventId));
  }

  return {
    records,
    registerEvent,
    participatedEventIds,
  };
}
