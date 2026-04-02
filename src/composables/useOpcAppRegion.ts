import { computed, ref } from "vue";
import { regionData } from "../utils/regionMatch";
import { DEFAULT_APP_REGION_PATH, useOpcRegionDefaults } from "./useOpcRegionDefaults";

/** 全站当前选中的省市区（与 element-china-area-data Cascader value 一致） */
const regionPath = ref<string[]>([]);
const regionReady = ref(false);

export function useOpcAppRegion() {
  const { readStoredAuth, loadingGeo, geoError } = useOpcRegionDefaults();

  const regionLabelText = computed(() => {
    const v = Array.isArray(regionPath.value) ? regionPath.value : [];
    if (v.length === 0) return "";
    const parts: string[] = [];
    let options = regionData as { label: string; value: string; children?: typeof regionData }[];
    for (const code of v) {
      const node = options.find((o) => o.value === code);
      if (!node) break;
      parts.push(node.label);
      options = (node.children ?? []) as typeof options;
    }
    return parts.join(" · ");
  });

  async function bootstrap() {
    const auth = readStoredAuth();
    if (auth?.profile?.regionPath?.length) {
      regionPath.value = [...auth.profile.regionPath];
    } else {
      // 不按 IP/定位初始化，默认南通市（省+市）
      geoError.value = null;
      regionPath.value = [...DEFAULT_APP_REGION_PATH];
    }
    loadingGeo.value = false;
    regionReady.value = true;
  }

  function onAuthChanged() {
    const auth = readStoredAuth();
    if (auth?.profile?.regionPath?.length) {
      regionPath.value = [...auth.profile.regionPath];
    } else {
      geoError.value = null;
      regionPath.value = [...DEFAULT_APP_REGION_PATH];
    }
    loadingGeo.value = false;
  }

  /** 恢复为当前用户档案中的地区；未登录或无档案时为站点默认（南通市） */
  function restoreUserRegion() {
    onAuthChanged();
  }

  return {
    regionPath,
    regionReady,
    regionLabelText,
    loadingGeo,
    geoError,
    bootstrap,
    onAuthChanged,
    restoreUserRegion,
  };
}
