import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { message } from "ant-design-vue";

function getToken(): string | null {
  // 兼容不同项目/后端约定：按需调整 key
  return localStorage.getItem("weopc_token") || localStorage.getItem("token");
}

function isAbsoluteUrl(url: string | undefined): boolean {
  return typeof url === "string" && /^https?:\/\//i.test(url);
}

function normalizeErrorMessage(err: unknown): string {
  const anyErr = err as any;
  const data = anyErr?.response?.data;
  const msg = data?.message || data?.msg || data?.error;
  return (msg || anyErr?.message || "请求失败，请稍后重试").toString();
}

// 生成“稳定字符串”，用于签名（key 会按字典序排序）
function stableStringify(value: any): string {
  if (value === null || value === undefined) return "";
  if (typeof value !== "object") return String(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `"${k}":${stableStringify(value[k])}`).join(",")}}`;
}

async function hmacSha256Base64(secret: string, content: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(content));
  const bytes = new Uint8Array(signature);
  // base64
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function buildSignature(config: AxiosRequestConfig): Promise<Record<string, string>> {
  const secret = (import.meta.env.VITE_API_SIGNATURE_SECRET as string | undefined)?.trim();
  if (!secret) return {};

  // 让签名尽可能覆盖关键内容；后端如有不同规则请自行调整
  const payload = stableStringify({
    method: config.method,
    url: config.url,
    params: config.params,
    data: config.data,
  });

  const signature = await hmacSha256Base64(secret, payload);
  const timestamp = String(Date.now());
  return {
    "X-Signature": signature,
    "X-Timestamp": timestamp,
  };
}

/**
 * 统一的 HTTP 请求封装。
 * 后续项目中所有网络请求尽量从这里发起，便于拦截器/错误处理/超时等集中管理。
 */
export const http = axios.create({
  timeout: 10000,
});

http.interceptors.request.use(async (config) => {
  const url = config.url;
  const attachAuth = !isAbsoluteUrl(url);

  // token
  const token = getToken();
  if (token && attachAuth) {
    config.headers = config.headers ?? {};
    // 常见约定：Authorization: Bearer <token>
    (config.headers as any).Authorization = `Bearer ${token}`;
  }

  // signature（可选）
  try {
    if (!attachAuth) return config;
    const signHeaders = await buildSignature(config);
    if (Object.keys(signHeaders).length) {
      config.headers = config.headers ?? {};
      Object.assign(config.headers as any, signHeaders);
    }
  } catch {
    // 签名失败不阻塞业务请求；后端如强校验请把异常上报
  }

  return config;
});

http.interceptors.response.use(
  (res) => {
    // 若后端使用 code/msg 结构，在成功回包时也做一次“业务成功”校验
    const data = res.data as any;
    const code = data?.code;
    const msg = data?.msg || data?.message;
    if (typeof code !== "undefined" && code !== 0 && code !== 200) {
      message.error(msg || "接口返回错误");
    }
    return res;
  },
  (err) => {
    message.error(normalizeErrorMessage(err));

    const status = err?.response?.status as number | undefined;
    if (status === 401 || status === 403) {
      // 可选：通知应用登录态失效
      window.dispatchEvent(new CustomEvent("weopc-auth-expired"));
    }

    return Promise.reject(err);
  }
);

