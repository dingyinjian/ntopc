<script setup lang="ts">
import { computed, ref } from "vue";
import { EnvironmentOutlined } from "@ant-design/icons-vue";

const props = defineProps<{
  lng: number;
  lat: number;
  title: string;
}>();

const imgError = ref(false);

const amapKey = (import.meta.env.VITE_AMAP_IP_KEY as string | undefined)?.trim();
const hasValidWebKey = Boolean(amapKey && amapKey !== "PUT_YOUR_AMAP_IP_KEY_HERE");

const staticMapUrl = computed(() => {
  if (!hasValidWebKey || imgError.value) return "";
  const { lng, lat } = props;
  const loc = `${lng},${lat}`;
  const markers = `mid,,A:${lng},${lat}`;
  return `https://restapi.amap.com/v3/staticmap?location=${loc}&zoom=15&size=640*260&scale=2&markers=${encodeURIComponent(markers)}&key=${amapKey}`;
});

const openInAmapHref = computed(
  () =>
    `https://uri.amap.com/marker?position=${props.lng},${props.lat}&name=${encodeURIComponent(props.title)}`
);

function onImgError() {
  imgError.value = true;
}
</script>

<template>
  <div class="policy-park-map" aria-label="园区位置地图">
    <div v-if="staticMapUrl" class="map-frame">
      <img
        class="map-img"
        :src="staticMapUrl"
        :alt="`${title}位置示意图（标注为园区所在位置）`"
        loading="lazy"
        decoding="async"
        @error="onImgError"
      />
    </div>
    <div v-else class="map-fallback">
      <EnvironmentOutlined class="map-fallback-icon" />
      <p class="map-fallback-text">示意位置 · {{ lng.toFixed(4) }}, {{ lat.toFixed(4) }}</p>
      <p class="map-fallback-hint">配置 <code>VITE_AMAP_IP_KEY</code> 后可显示高德静态地图</p>
    </div>
    <a
      class="map-link"
      :href="openInAmapHref"
      target="_blank"
      rel="noopener noreferrer"
    >
      在高德地图中打开园区位置
    </a>
  </div>
</template>

<style scoped>
.policy-park-map {
  display: grid;
  gap: 10px;
}

.map-frame {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background: #e8f4fc;
  min-height: 200px;
}

.map-img {
  display: block;
  width: 100%;
  height: auto;
  vertical-align: middle;
}

.map-fallback {
  display: grid;
  gap: 8px;
  justify-items: center;
  text-align: center;
  padding: 28px 16px;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
  background: linear-gradient(165deg, #f8fafc 0%, #f1f5f9 100%);
}

.map-fallback-icon {
  font-size: 32px;
  color: #0d9488;
}

.map-fallback-text {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.map-fallback-hint {
  margin: 0;
  font-size: 11px;
  color: #94a3b8;
}

.map-fallback-hint code {
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 4px;
  background: #e2e8f0;
  color: #475569;
}

.map-link {
  font-size: 12px;
  font-weight: 600;
  color: #0d9488;
  text-decoration: none;
  justify-self: start;
}

.map-link:hover {
  text-decoration: underline;
}
</style>
