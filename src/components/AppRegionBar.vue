<script setup lang="ts">
import { Cascader } from "ant-design-vue";
import { EnvironmentOutlined } from "@ant-design/icons-vue";
import { useOpcAppRegion } from "../composables/useOpcAppRegion";
import { regionData } from "../utils/regionMatch";

const { regionPath, regionLabelText, loadingGeo, geoError } = useOpcAppRegion();
</script>

<template>
  <div class="app-region-bar" aria-label="所在地区">
    <span class="bar-icon" aria-hidden="true">
      <EnvironmentOutlined />
    </span>
    <span class="bar-label">所在地区</span>
    <Cascader
      v-model:value="regionPath"
      :options="regionData"
      :change-on-select="true"
      allow-clear
      placeholder="省 / 市 / 区"
      class="region-cascader"
      :loading="loadingGeo"
    />
    <span v-if="regionLabelText" class="region-hint">{{ regionLabelText }}</span>
    <span v-if="geoError" class="geo-msg" :title="geoError">{{ geoError }}</span>
  </div>
</template>

<style scoped>
.app-region-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.88);
  border-bottom: 1px solid rgba(226, 232, 240, 0.95);
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
}

.bar-icon {
  display: inline-flex;
  color: #10b981;
  font-size: 16px;
}

.bar-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.region-cascader {
  min-width: 200px;
  max-width: min(100%, 320px);
}

.region-hint {
  font-size: 12px;
  color: #64748b;
  max-width: 100%;
}

.geo-msg {
  font-size: 11px;
  color: #b45309;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 480px) {
  .region-cascader {
    width: 100%;
    max-width: none;
  }
}
</style>
