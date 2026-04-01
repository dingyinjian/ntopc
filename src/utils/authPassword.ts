import {
  readStoredAuth,
  WEOPC_AUTH_STORAGE_KEY,
  type StoredAuth,
} from "../composables/useOpcRegionDefaults";

async function sha256Hex(plain: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(plain));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function writeAuth(next: StoredAuth) {
  localStorage.setItem(WEOPC_AUTH_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("weopc-auth-changed"));
}

/** 首次设置登录密码（演示：仅存 SHA-256 摘要） */
export async function setStoredPassword(plain: string): Promise<boolean> {
  const auth = readStoredAuth();
  if (!auth?.phone) return false;
  const passwordHash = await sha256Hex(plain);
  writeAuth({ ...auth, passwordHash });
  return true;
}

/** 修改密码：校验旧密码后更新 */
export async function changeStoredPassword(oldPlain: string, newPlain: string): Promise<boolean> {
  const auth = readStoredAuth();
  if (!auth?.phone || !auth.passwordHash) return false;
  if ((await sha256Hex(oldPlain)) !== auth.passwordHash) return false;
  const passwordHash = await sha256Hex(newPlain);
  writeAuth({ ...auth, passwordHash });
  return true;
}
