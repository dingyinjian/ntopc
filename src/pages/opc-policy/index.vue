<script setup lang="ts">
import { PhoneOutlined } from "@ant-design/icons-vue";
import { Button, Cascader, Modal, Tag, Typography } from "ant-design-vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { OPC_POLICIES } from "../../data/opcPolicies";
import { useOpcRegionDefaults } from "../../composables/useOpcRegionDefaults";
import { pathPrefixMatch, regionData } from "../../utils/regionMatch";

const { loadingGeo, geoError, loadIpRegionPath, readStoredAuth } = useOpcRegionDefaults();
const router = useRouter();

const regionValue = ref<string[]>([]);
const initializing = ref(true);
const detailOpen = ref(false);
const activePolicyId = ref<string | null>(null);

const activePolicy = computed(() => {
  if (!activePolicyId.value) return null;
  return OPC_POLICIES.find((p) => p.id === activePolicyId.value) ?? null;
});

const filteredPolicies = computed(() => {
  const sel = Array.isArray(regionValue.value) ? regionValue.value : [];
  if (sel.length === 0) return OPC_POLICIES;
  return OPC_POLICIES.filter((p) => pathPrefixMatch(p.regionPath, sel));
});

const regionLabelText = computed(() => {
  const v = Array.isArray(regionValue.value) ? regionValue.value : [];
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

async function initRegion() {
  initializing.value = true;
  const auth = readStoredAuth();
  if (auth?.profile?.regionPath?.length) {
    regionValue.value = [...auth.profile.regionPath];
  } else {
    regionValue.value = await loadIpRegionPath();
  }
  initializing.value = false;
}

function onAuthChanged() {
  const auth = readStoredAuth();
  if (auth?.profile?.regionPath?.length) {
    regionValue.value = [...auth.profile.regionPath];
  }
}

onMounted(() => {
  void initRegion();
  window.addEventListener("weopc-auth-changed", onAuthChanged);
});

onBeforeUnmount(() => {
  window.removeEventListener("weopc-auth-changed", onAuthChanged);
});

function openPolicyDetail(id: string) {
  activePolicyId.value = id;
  detailOpen.value = true;
}

function closePolicyDetail() {
  detailOpen.value = false;
}

function getContactText(contact?: string): string {
  return contact && contact.trim() ? contact : "400-800-2026";
}

function goToSettlement() {
  detailOpen.value = false;
  void router.push("/opc-settlement");
}
</script>

<template>
  <section class="opc-policy">
    <header class="opc-policy-head">
      <h1>政策支持</h1>
      <p class="lead">全国OPC社区政策查询,办理入驻以及优惠政策</p>

      <div class="toolbar">
        <span class="toolbar-label">地区筛选</span>
        <Cascader
          v-model:value="regionValue"
          :options="regionData"
          :change-on-select="true"
          allow-clear
          placeholder="省 / 市 / 区"
          class="region-cascader"
          :loading="initializing || loadingGeo"
        />
        <span v-if="regionLabelText" class="region-hint">{{ regionLabelText }}</span>
      </div>
      <p v-if="geoError" class="geo-msg">{{ geoError }}</p>
    </header>

    <div v-if="initializing" class="state">正在加载默认地区…</div>

    <div v-else class="card-grid">
      <article
        v-for="item in filteredPolicies"
        :key="item.id"
        class="policy-card"
        role="button"
        tabindex="0"
        @click="openPolicyDetail(item.id)"
        @keydown.enter.prevent="openPolicyDetail(item.id)"
        @keydown.space.prevent="openPolicyDetail(item.id)"
      >
        <h2 class="park">{{ item.parkName }}</h2>
        <p class="summary">{{ item.summary }}</p>
        <p class="contact">
          <PhoneOutlined class="contact-icon" />
          联系方式：{{ getContactText(item.contact) }}
        </p>
        <ul class="highlights" aria-label="政策亮点">
          <li v-for="(h, i) in item.highlights" :key="i">{{ h }}</li>
        </ul>
      </article>
    </div>

    <p v-if="!initializing && !filteredPolicies.length" class="state empty">当前地区下暂无示例政策，请调整筛选条件。</p>

    <Modal
      v-model:open="detailOpen"
      :title="activePolicy?.parkName || '政策详情'"
      :footer="null"
      :mask-closable="true"
      width="720px"
      @cancel="closePolicyDetail"
    >
      <div v-if="activePolicy" class="policy-detail">
        <div class="detail-block">
          <div class="detail-title">政策概述</div>
          <div class="detail-text">{{ activePolicy.summary }}</div>
        </div>

        <div v-if="activePolicy.details" class="detail-block">
          <div class="detail-title">政策详细</div>
          <pre class="detail-pre">{{ activePolicy.details }}</pre>
        </div>

        <div class="detail-block">
          <div class="detail-title">政策亮点</div>
          <div class="tag-row">
            <Tag v-for="(h, i) in activePolicy.highlights" :key="i" color="geekblue">{{ h }}</Tag>
          </div>
        </div>

        <div class="detail-block">
          <div class="detail-title">信息来源</div>
          <div class="detail-text">
            <Typography.Link
              v-if="activePolicy.sourceUrl"
              :href="activePolicy.sourceUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ activePolicy.sourceName || activePolicy.sourceUrl }}
            </Typography.Link>
            <span v-else>—</span>
          </div>
        </div>

        <div class="detail-block">
          <div class="detail-title">联系方式</div>
          <div class="detail-text contact-detail">
            <PhoneOutlined class="contact-icon" />
            {{ getContactText(activePolicy.contact) }}
          </div>
        </div>

        <div class="detail-actions">
          <Button type="primary" @click="goToSettlement">立即申请</Button>
        </div>
      </div>
    </Modal>
  </section>
</template>

<style scoped>
.opc-policy {
  padding: 24px 20px 40px;
  max-width: 1100px;
  margin: 0 auto;
}

.opc-policy-head h1 {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
}

.lead {
  margin: 0 0 20px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
}

.toolbar-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.region-cascader {
  min-width: min(100%, 320px);
}

.region-hint {
  font-size: 12px;
  color: #64748b;
}

.geo-msg {
  margin: 10px 0 0;
  font-size: 12px;
  color: #b45309;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 22px;
}

.policy-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 16px 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  cursor: pointer;
  outline: none;
}

.policy-card:hover {
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
  transform: translateY(-2px);
}

.policy-card:focus-visible {
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.16), 0 12px 28px rgba(15, 23, 42, 0.1);
}

.park {
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.35;
}

.summary {
  margin: 0 0 14px;
  font-size: 13px;
  line-height: 1.65;
  color: #475569;
}

.contact {
  margin: 0 0 12px;
  font-size: 12px;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.contact-icon {
  color: #2563eb;
  font-size: 14px;
}

.contact-detail {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.highlights li {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #4338ca;
  border: 1px solid rgba(99, 102, 241, 0.25);
}

.state {
  margin-top: 20px;
  font-size: 14px;
  color: #64748b;
}

.state.empty {
  text-align: center;
  padding: 28px 12px;
}

.policy-detail {
  display: grid;
  gap: 14px;
}

.detail-block {
  display: grid;
  gap: 8px;
}

.detail-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.detail-text {
  font-size: 13px;
  line-height: 1.7;
  color: #334155;
}

.detail-pre {
  margin: 0;
  padding: 12px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  color: #334155;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 6px;
}

@media (max-width: 640px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .region-cascader {
    width: 100%;
  }
}
</style>
