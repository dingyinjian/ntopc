import { ref } from "vue";
import type { DemandItem } from "../data/demandItems";

const PUBLISH_KEY = "weopc_demand_my_publishes";
const ORDERS_KEY = "weopc_demand_my_orders";

export interface DemandOrderRecord {
  id: string;
  demandId: string;
  demandTitle: string;
  intro: string;
  quote: string;
  eta: string;
  createdAt: string;
}

function loadPublishes(): DemandItem[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(PUBLISH_KEY);
    if (!raw) return [];
    const o = JSON.parse(raw) as DemandItem[];
    return Array.isArray(o) ? o : [];
  } catch {
    return [];
  }
}

function loadOrders(): DemandOrderRecord[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const o = JSON.parse(raw) as DemandOrderRecord[];
    return Array.isArray(o) ? o : [];
  } catch {
    return [];
  }
}

function savePublishes(list: DemandItem[]) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(PUBLISH_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

function saveOrders(list: DemandOrderRecord[]) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

const myPublishes = ref<DemandItem[]>(loadPublishes());
const myOrders = ref<DemandOrderRecord[]>(loadOrders());
let loaded = false;

function ensureLoaded() {
  if (loaded) return;
  myPublishes.value = loadPublishes();
  myOrders.value = loadOrders();
  loaded = true;
}

export function useDemandUser() {
  ensureLoaded();

  function addPublish(item: DemandItem) {
    myPublishes.value = [item, ...myPublishes.value];
    savePublishes(myPublishes.value);
  }

  function addOrder(rec: Omit<DemandOrderRecord, "id" | "createdAt">) {
    const row: DemandOrderRecord = {
      ...rec,
      id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    myOrders.value = [row, ...myOrders.value];
    saveOrders(myOrders.value);
  }

  return {
    myPublishes,
    myOrders,
    addPublish,
    addOrder,
  };
}
