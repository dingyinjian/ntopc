/**
 * 南通市下辖区县（与 element-china-area-data 中 3206 子节点 value 一致）
 * 用于 OPC 政策页「区县筛选」展示
 */
export interface NtPolicyDistrictFilter {
  label: string;
  /** 区县 adcode（省 32 + 市 3206 后的第三级） */
  code: string;
}

export const NT_POLICY_DISTRICT_FILTERS: NtPolicyDistrictFilter[] = [
  { label: "崇川区", code: "320613" },
  { label: "开发区", code: "320671" },
  { label: "通州区", code: "320612" },
  { label: "海门区", code: "320614" },
  { label: "如东县", code: "320623" },
  { label: "如皋市", code: "320682" },
  { label: "启东市", code: "320681" },
  { label: "海安市", code: "320685" },
];
