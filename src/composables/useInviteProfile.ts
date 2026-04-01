import { computed, ref } from "vue";
import { readStoredAuth } from "./useOpcRegionDefaults";

export interface InviteRecord {
  id: string;
  /** 脱敏手机号 */
  maskedPhone: string;
  invitedAt: string;
  status: "pending" | "activated";
  activatedAt?: string;
}

export interface InviteBundle {
  inviteCode: string;
  records: InviteRecord[];
}

function genInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `WEOPC-${s}`;
}

function maskPhone(phone: string): string {
  const p = phone.trim();
  if (p.length >= 11) return `${p.slice(0, 3)}****${p.slice(-4)}`;
  return p;
}

function storageKey(phone: string): string {
  return `weopc_invite_${phone}`;
}

function loadBundle(phone: string): InviteBundle {
  if (typeof localStorage === "undefined") {
    return { inviteCode: "", records: [] };
  }
  try {
    const raw = localStorage.getItem(storageKey(phone));
    if (raw) {
      const o = JSON.parse(raw) as Partial<InviteBundle>;
      if (typeof o.inviteCode === "string" && Array.isArray(o.records)) {
        return { inviteCode: o.inviteCode, records: o.records as InviteRecord[] };
      }
    }
    const initial: InviteBundle = {
      inviteCode: "",
      records: [],
    };
    localStorage.setItem(storageKey(phone), JSON.stringify(initial));
    return initial;
  } catch {
    return { inviteCode: "", records: [] };
  }
}

function saveBundle(phone: string, bundle: InviteBundle) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(storageKey(phone), JSON.stringify(bundle));
  } catch {
    /* ignore */
  }
}

export function useInviteProfile() {
  const bundle = ref<InviteBundle>({ inviteCode: "", records: [] });
  const loggedPhone = ref<string | null>(null);

  function refresh() {
    const auth = readStoredAuth();
    const phone = auth?.phone?.trim() || null;
    loggedPhone.value = phone;
    if (!phone) {
      bundle.value = { inviteCode: "", records: [] };
      return;
    }
    bundle.value = loadBundle(phone);
  }

  refresh();

  const totalInvites = computed(() => bundle.value.records.length);
  const activatedCount = computed(
    () => bundle.value.records.filter((r) => r.status === "activated").length
  );

  /** 生成或重新生成邀请码并保存（由页面决定是否在「重新生成」时二次确认） */
  function generateInviteCode() {
    const phone = loggedPhone.value;
    if (!phone) return;
    bundle.value = {
      ...bundle.value,
      inviteCode: genInviteCode(),
    };
    saveBundle(phone, bundle.value);
  }

  return {
    bundle,
    loggedPhone,
    refresh,
    totalInvites,
    activatedCount,
    generateInviteCode,
    maskPhone,
  };
}
