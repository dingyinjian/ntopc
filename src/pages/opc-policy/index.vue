<script setup lang="ts">
import { PhoneOutlined } from "@ant-design/icons-vue";
import { Button, Modal, Tag } from "ant-design-vue";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import PolicyParkMap from "../../components/PolicyParkMap.vue";
import { NT_POLICY_DISTRICT_FILTERS } from "../../data/ntPolicyDistrictFilters";
import { OPC_POLICIES } from "../../data/opcPolicies";
import { useNtDistrictFilter } from "../../composables/useNtDistrictFilter";
import { getPolicyParkPosition } from "../../utils/policyParkPosition";
import { useOpcAppRegion } from "../../composables/useOpcAppRegion";
import { pathPrefixMatch } from "../../utils/regionMatch";

const { regionPath, regionReady } = useOpcAppRegion();
const { ntDistrictFilter, isNantongContext, applyNtDistrictFilter } = useNtDistrictFilter(regionPath);
const router = useRouter();
const detailOpen = ref(false);
const activePolicyId = ref<string | null>(null);

const activePolicy = computed(() => {
  if (!activePolicyId.value) return null;
  return OPC_POLICIES.find((p) => p.id === activePolicyId.value) ?? null;
});

function firstHighlight(highlights: string[] | undefined): string {
  return highlights?.[0] || "政策支持";
}

const activeHighlights = computed(() => activePolicy.value?.highlights ?? []);

const parkMapPosition = computed(() => {
  const p = activePolicy.value;
  if (!p) return null;
  return getPolicyParkPosition(p);
});

function uniqById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of items) {
    if (seen.has(x.id)) continue;
    seen.add(x.id);
    out.push(x);
  }
  return out;
}

function byRegionPrefix(prefix: string[]) {
  if (!prefix.length) return [];
  return OPC_POLICIES.filter((p) => pathPrefixMatch(p.regionPath, prefix));
}

const policyLayers = computed(() => {
  const sel = Array.isArray(regionPath.value) ? regionPath.value : [];
  const province = sel[0] ? [sel[0]] : [];
  const city = sel[0] && sel[1] ? [sel[0], sel[1]] : [];
  const district = sel[0] && sel[1] && sel[2] ? [sel[0], sel[1], sel[2]] : [];

  const park = activePolicy.value ? [activePolicy.value] : [];
  const districtList = district.length ? byRegionPrefix(district) : [];
  const cityList = city.length ? byRegionPrefix(city) : [];
  const provinceList = province.length ? byRegionPrefix(province) : [];

  // 去重：园区政策优先展示在第一块
  const parkIds = new Set(park.map((x) => x.id));
  const districtDedup = uniqById(districtList.filter((x) => !parkIds.has(x.id)));
  const cityDedup = uniqById(cityList.filter((x) => !parkIds.has(x.id)));
  const provinceDedup = uniqById(provinceList.filter((x) => !parkIds.has(x.id)));

  return {
    sel,
    park,
    district: districtDedup,
    city: cityDedup,
    province: provinceDedup,
  };
});

const policyListItems = computed(() => {
  const park = policyLayers.value.park.map((p) => ({ ...p, level: "园区政策" as const }));
  const city = policyLayers.value.city.map((p) => ({ ...p, level: "市级政策" as const }));
  const province = policyLayers.value.province.map((p) => ({ ...p, level: "省级政策" as const }));

  const merged = [...park, ...city, ...province];
  const seen = new Set<string>();
  const out: Array<(typeof merged)[number]> = [];
  for (const item of merged) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
});

const filteredPolicies = computed(() => {
  const sel = Array.isArray(regionPath.value) ? regionPath.value : [];
  const list =
    sel.length === 0 ? OPC_POLICIES : OPC_POLICIES.filter((p) => pathPrefixMatch(p.regionPath, sel));
  return applyNtDistrictFilter(list);
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
      <p class="lead">根据顶部「所在地区」展示当前区域相关政策，办理入驻以及优惠政策。</p>

      <div v-if="regionReady && isNantongContext" class="district-toolbar" aria-label="南通区县筛选">
        <span class="district-toolbar-label">区县筛选</span>
        <div class="district-tags">
          <Tag
            class="district-tag"
            :color="ntDistrictFilter === 'all' ? 'blue' : 'default'"
            @click="ntDistrictFilter = 'all'"
          >
            全部
          </Tag>
          <Tag
            v-for="d in NT_POLICY_DISTRICT_FILTERS"
            :key="d.code"
            class="district-tag"
            :color="ntDistrictFilter === d.code ? 'blue' : 'default'"
            @click="ntDistrictFilter = d.code"
          >
            {{ d.label }}
          </Tag>
        </div>
        <p class="district-hint">开发区为南通经济技术开发区；全市通用政策在任选区县时均会显示。</p>
      </div>
    </header>

    <div v-if="!regionReady" class="state">正在加载默认地区…</div>

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

    <p v-if="regionReady && !filteredPolicies.length" class="state empty">
      当前筛选下暂无政策，可切换顶部地区或区县筛选查看。
    </p>

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
          <div class="detail-text">{{ activePolicy.summary }}</div>
        </div>

        <div class="detail-block">
          <div class="detail-title">园区特色</div>
          <div class="tag-row">
            <Tag v-for="name in activeHighlights" :key="name" color="geekblue">{{ name }}</Tag>
          </div>
        </div>

        <div class="detail-block">
          <div class="detail-title">政策列表</div>
          <ul class="policy-list">
            <li v-for="p in policyListItems" :key="p.id" class="policy-item">
              <div class="policy-left">
                <div class="policy-headline">
                  <div class="policy-tags">
                    <Tag color="blue">{{ firstHighlight(p.highlights) }}</Tag>
                  </div>
                  <a
                    v-if="p.sourceUrl"
                    class="policy-link"
                    :href="p.sourceUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ p.parkName }}
                  </a>
                  <span v-else class="policy-link muted-link">{{ p.parkName }}</span>
                </div>
                <p class="policy-summary">{{ p.summary }}</p>
              </div>
              <Tag :color="p.level === '园区政策' ? 'purple' : p.level === '市级政策' ? 'green' : 'orange'">
                {{ p.level }}
              </Tag>
            </li>
          </ul>
        </div>

        <div class="detail-block">
          <div class="detail-title">联系方式</div>
          <div class="detail-text contact-detail">
            <PhoneOutlined class="contact-icon" />
            {{ getContactText(activePolicy.contact) }}
          </div>
          <div v-if="parkMapPosition" class="park-map-wrap">
            <div class="detail-subtitle">园区地图定位</div>
            <PolicyParkMap
              :key="activePolicy.id"
              :lng="parkMapPosition.lng"
              :lat="parkMapPosition.lat"
              :title="activePolicy.parkName"
            />
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
  margin: 0 0 16px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.district-toolbar {
  margin-top: 4px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
}

.district-toolbar-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 10px;
}

.district-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.district-tag {
  margin: 0;
  cursor: pointer;
  user-select: none;
}

.district-hint {
  margin: 10px 0 0;
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
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

.detail-subtitle {
  margin-top: 4px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.park-map-wrap {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.detail-text {
  font-size: 13px;
  line-height: 1.7;
  color: #334155;
}

.detail-name {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
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

.layer-list {
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.layer-item {
  padding: 12px 14px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: grid;
  gap: 6px;
}

.layer-name {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.policy-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 6px;
}

.policy-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.policy-left {
  min-width: 0;
  flex: 1;
  display: grid;
  gap: 8px;
}

.policy-headline {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.policy-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.policy-link {
  color: #2563eb;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
  text-decoration: none;
  word-break: break-word;
}

.policy-link:hover {
  text-decoration: underline;
}

.muted-link {
  color: #64748b;
  cursor: default;
}

.policy-summary {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: #64748b;
}

</style>
