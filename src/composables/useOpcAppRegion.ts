import { computed, ref } from "vue";
import { regionData } from "../utils/regionMatch";
import { useOpcRegionDefaults } from "./useOpcRegionDefaults";

/** 全站当前选中的省市区（与 element-china-area-data Cascader value 一致） */
const regionPath = ref<string[]>([]);
const regionReady = ref(false);

export function useOpcAppRegion() {
  const { loadIpRegionPath, readStoredAuth, loadingGeo, geoError } = useOpcRegionDefaults();

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
      regionPath.value = await loadIpRegionPath();
    }
    regionReady.value = true;
  }

  function onAuthChanged() {
    const auth = readStoredAuth();
    if (auth?.profile?.regionPath?.length) {
      regionPath.value = [...auth.profile.regionPath];
    } else {
      void loadIpRegionPath().then((p) => {
        regionPath.value = p;
      });
    }
  }

  return {
    regionPath,
    regionReady,
    regionLabelText,
    loadingGeo,
    geoError,
    bootstrap,
    onAuthChanged,
  };
}
