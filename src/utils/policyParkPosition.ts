import type { OpcPolicyItem } from "../data/opcPolicies";

/**
 * 省+市 对应大致中心点（GCJ-02，与高德一致）。无精确 `parkMap` 时用于展示示意位置，同市政策用 id 做微小偏移以免完全重叠。
 */
const CITY_CENTER_GCJ02: Record<string, [number, number]> = {
  "33-3301": [120.153, 30.287],
  "44-4403": [113.883, 22.553],
  "11-110108": [116.298, 39.959],
  "44-4401": [113.264, 23.129],
  "51-5101": [104.066, 30.572],
  "31-310115": [121.567, 31.245],
  "11-110101": [116.416, 39.928],
  "31-310104": [121.436, 31.183],
  "61-6101": [108.948, 34.263],
  "32-3206": [120.864, 32.017],
};

function jitterFromId(id: string, lng: number, lat: number): { lng: number; lat: number } {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = Math.imul(31, h) + id.charCodeAt(i) || 0;
  const dx = ((h % 160) - 80) / 8000;
  const dy = (((h >> 5) % 160) - 80) / 8000;
  return { lng: lng + dx, lat: lat + dy };
}

/** 详情地图用：优先档案中的精确坐标，否则按省市推算示意点 */
export function getPolicyParkPosition(policy: OpcPolicyItem): { lng: number; lat: number } | null {
  if (policy.parkMap) {
    return { lng: policy.parkMap.lng, lat: policy.parkMap.lat };
  }
  const rp = policy.regionPath;
  if (rp.length < 2) return null;
  const key = `${rp[0]}-${rp[1]}`;
  const center = CITY_CENTER_GCJ02[key];
  if (!center) return null;
  return jitterFromId(policy.id, center[0], center[1]);
}
