import type { DataItem } from "element-china-area-data";
import { regionData } from "element-china-area-data";

/** 直辖市省级 code：下级直接为区县 */
const MUNICIPALITY_CODES = new Set(["11", "12", "31", "50"]);

function normalize(s: string): string {
  return s
    .replace(/省|市|自治区|壮族自治区|回族自治区|维吾尔自治区|特别行政区|地区|盟|州|区|县|市$/g, "")
    .trim();
}

function labelMatches(label: string, hint: string): boolean {
  if (!hint) return false;
  const a = normalize(label);
  const b = normalize(hint);
  if (!b) return false;
  return a === b || label.includes(hint) || hint.includes(label) || a.includes(b) || b.includes(a);
}

function findChildByHint(children: DataItem[] | undefined, hint: string): DataItem | undefined {
  if (!children?.length || !hint) return undefined;
  const exact = children.find((c) => labelMatches(c.label, hint));
  if (exact) return exact;
  return children.find((c) => hint.includes(normalize(c.label)) || normalize(c.label).includes(normalize(hint)));
}

/**
 * 根据 ip-api（中文）返回的省/市/区名称，解析为 Cascader 的 value 路径（与 regionData 一致）。
 */
export function pathFromGeoNames(
  regionName: string,
  city: string,
  district: string
): string[] | null {
  const province = regionData.find((p) => labelMatches(p.label, regionName));
  if (!province) return null;

  const pCode = province.value;
  if (MUNICIPALITY_CODES.has(pCode)) {
    const ch = province.children;
    // 高德 IP 定位通常只返回“省/市”，不提供区县时不要强行选第一个区
    if (!district) return [pCode];
    const dist =
      findChildByHint(ch, district) ?? findChildByHint(ch, city) ?? undefined;
    if (dist) return [pCode, dist.value];
    return [pCode];
  }

  const cityNode = findChildByHint(province.children, city);
  if (!cityNode) return [pCode];

  // 高德 IP 定位通常只返回“省/市”，不提供区县时不要强行选第一个区
  if (!district) return [pCode, cityNode.value];

  const dist = findChildByHint(cityNode.children, district);
  if (dist) return [pCode, cityNode.value, dist.value];
  return [pCode, cityNode.value];
}

export function pathPrefixMatch(policyPath: string[], selected: string[]): boolean {
  if (!selected.length) return true;
  if (policyPath.length < selected.length) return false;
  for (let i = 0; i < selected.length; i++) {
    if (policyPath[i] !== selected[i]) return false;
  }
  return true;
}

export { regionData, MUNICIPALITY_CODES };
