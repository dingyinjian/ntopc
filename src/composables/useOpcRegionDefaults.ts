import { ref } from "vue";
import { pathFromGeoNames } from "../utils/regionMatch";
import { http } from "../utils/request";

export const WEOPC_AUTH_STORAGE_KEY = "weopc_auth";

/** 模块级共享，便于主布局与多页共用同一定位加载状态 */
const loadingGeo = ref(true);
const geoError = ref<string | null>(null);

export interface AuthRegionProfile {
  /** 登录用户档案中的省市区路径（与 Cascader value 一致），登录后由后端/本地写入 */
  regionPath: string[];
}

export interface StoredAuth {
  phone: string;
  profile?: AuthRegionProfile;
  /** 登录密码 SHA-256 十六进制摘要（可选，个人中心设置/修改密码后写入） */
  passwordHash?: string;
}

export function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(WEOPC_AUTH_STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as StoredAuth;
    if (o?.phone && Array.isArray(o.profile?.regionPath)) return o;
    if (o?.phone) return o;
    return null;
  } catch {
    return null;
  }
}

/** 开发用：登录成功时写入示例档案；接入真实 API 后替换为接口返回的 regionPath */
export function writeAuthWithMockRegion(phone: string, regionPath: string[]) {
  const payload: StoredAuth = {
    phone,
    profile: { regionPath },
  };
  localStorage.setItem(WEOPC_AUTH_STORAGE_KEY, JSON.stringify(payload));
}

// 默认地区：江苏省·南通市（省+市两级；若选择区县则由用户/定位结果补全）
const DEFAULT_FALLBACK_PATH = ["32", "3206"];

export function useOpcRegionDefaults() {
  function parseRectangleCenter(rectangle: string | undefined): { lng: number; lat: number } | null {
    if (!rectangle) return null;
    // 高德：rectangle = "lng1,lat1;lng2,lat2"
    const parts = rectangle.split(";");
    if (parts.length !== 2) return null;
    const [aLng, aLat] = parts[0].split(",").map((x) => Number(x));
    const [bLng, bLat] = parts[1].split(",").map((x) => Number(x));
    if (![aLng, aLat, bLng, bLat].every((n) => Number.isFinite(n))) return null;
    return { lng: (aLng + bLng) / 2, lat: (aLat + bLat) / 2 };
  }

  function normalizeAmapCity(city: unknown): string {
    // 高德在直辖市/部分场景可能返回 "" 或 [] 或 "[]"
    if (Array.isArray(city)) return city.join("");
    if (typeof city === "string") return city === "[]" ? "" : city;
    return "";
  }

  function getBrowserLocation(timeoutMs = 8000): Promise<{ lng: number; lat: number }> {
    return new Promise((resolve, reject) => {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lng: pos.coords.longitude, lat: pos.coords.latitude }),
        (err) => reject(err),
        {
          enableHighAccuracy: true,
          timeout: timeoutMs,
          maximumAge: 0,
        }
      );
    });
  }

  async function reverseGeocodeToPath(amapKey: string, lng: number, lat: number): Promise<string[] | null> {
    const regeoRes = await http.get("https://restapi.amap.com/v3/geocode/regeo", {
      params: {
        key: amapKey,
        output: "JSON",
        location: `${lng},${lat}`,
        extensions: "base",
        radius: 500,
      },
    });

    const regeoData = regeoRes.data as {
      status?: string;
      info?: string;
      regeocode?: {
        addressComponent?: {
          city?: unknown;
          province?: string;
          district?: unknown;
        };
      };
    };

    if (regeoData.status !== "1") return null;
    const ac = regeoData.regeocode?.addressComponent;
    const province = (ac?.province ?? "").toString();
    const city = normalizeAmapCity(ac?.city);
    const district = normalizeAmapCity(ac?.district);

    const path = pathFromGeoNames(province, city, district);
    return path?.length ? path : null;
  }

  async function loadIpRegionPath(): Promise<string[]> {
    loadingGeo.value = true;
    geoError.value = null;
    const amapKey =
      (import.meta.env.VITE_AMAP_IP_KEY as string | undefined)?.trim() ||
      "PUT_YOUR_AMAP_IP_KEY_HERE";

    if (!amapKey || amapKey === "PUT_YOUR_AMAP_IP_KEY_HERE") {
      loadingGeo.value = false;
      return [...DEFAULT_FALLBACK_PATH];
    }
    try {
      // 1) 优先：浏览器定位（更准确，可到区）
      try {
        const { lng, lat } = await getBrowserLocation();
        const path = await reverseGeocodeToPath(amapKey, lng, lat);
        if (path?.length) return path;
      } catch {
        // 用户拒绝/超时/不支持：继续走 IP 方案兜底
      }

      // 2) 兜底：IP 定位 -> rectangle 中心点 -> 逆地理编码到区
      const ipRes = await http.get("https://restapi.amap.com/v3/ip", {
        params: { key: amapKey, output: "JSON" },
      });
      const ipData = ipRes.data as {
        status?: string;
        info?: string;
        province?: string;
        city?: unknown;
        rectangle?: string;
      };

      if (ipData.status !== "1") {
        geoError.value = `定位服务暂不可用${ipData.info ? `：${ipData.info}` : ""}`;
        return [...DEFAULT_FALLBACK_PATH];
      }

      const center = parseRectangleCenter(ipData.rectangle);
      if (center) {
        const path = await reverseGeocodeToPath(amapKey, center.lng, center.lat);
        if (path?.length) return path;
      }

      // 3) 最后：只用 IP 的省/市（无区）
      const province = (ipData.province ?? "").toString();
      const city = normalizeAmapCity(ipData.city);
      const path = pathFromGeoNames(province, city, "");
      return path?.length ? path : [...DEFAULT_FALLBACK_PATH];
    } catch {
      geoError.value = "网络异常，已使用默认地区";
      return [...DEFAULT_FALLBACK_PATH];
    } finally {
      loadingGeo.value = false;
    }
  }

  return {
    loadingGeo,
    geoError,
    loadIpRegionPath,
    readStoredAuth,
    DEFAULT_FALLBACK_PATH,
  };
}
