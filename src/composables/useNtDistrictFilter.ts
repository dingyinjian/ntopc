import { computed, ref, watch, type Ref } from "vue";
import { NT_POLICY_DISTRICT_FILTERS } from "../data/ntPolicyDistrictFilters";

export function isNantongPrefix(sel: string[]): boolean {
  return sel.length >= 2 && sel[0] === "32" && sel[1] === "3206";
}

export function useNtDistrictFilter(regionPath: Ref<string[]>) {
  const ntDistrictFilter = ref<"all" | string>("all");

  const isNantongContext = computed(() => {
    const sel = Array.isArray(regionPath.value) ? regionPath.value : [];
    return isNantongPrefix(sel);
  });

  watch(
    regionPath,
    (path) => {
      const sel = Array.isArray(path) ? path : [];
      if (!isNantongPrefix(sel)) {
        ntDistrictFilter.value = "all";
        return;
      }
      const d = sel[2];
      if (d && NT_POLICY_DISTRICT_FILTERS.some((x) => x.code === d)) {
        ntDistrictFilter.value = d;
      } else {
        ntDistrictFilter.value = "all";
      }
    },
    { deep: true }
  );

  function applyNtDistrictFilter<T extends { regionPath: string[] }>(list: T[]): T[] {
    const sel = Array.isArray(regionPath.value) ? regionPath.value : [];
    if (!isNantongPrefix(sel) || ntDistrictFilter.value === "all") return list;
    const code = ntDistrictFilter.value;
    return list.filter((p) => {
      const rp = p.regionPath;
      if (rp[0] !== "32" || rp[1] !== "3206") return true;
      if (rp.length === 2) return true;
      return rp[2] === code;
    });
  }

  return { ntDistrictFilter, isNantongContext, applyNtDistrictFilter };
}
