<script setup lang="ts">
import { Button, Form, Input, Modal, Segmented, Tag, message } from "ant-design-vue";
import { CalendarOutlined, EnvironmentOutlined, FileTextOutlined } from "@ant-design/icons-vue";
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { NT_POLICY_DISTRICT_FILTERS } from "../../data/ntPolicyDistrictFilters";
import { OPC_COMMUNITY_EVENTS, type OpcCommunityEventItem } from "../../data/opcCommunityEvents";
import { useEventRegistrations } from "../../composables/useEventRegistrations";
import { useNtDistrictFilter } from "../../composables/useNtDistrictFilter";
import { useOpcAppRegion } from "../../composables/useOpcAppRegion";
import { readStoredAuth } from "../../composables/useOpcRegionDefaults";
import { useSubmitGuard } from "../../composables/useSubmitGuard";
import { pathPrefixMatch } from "../../utils/regionMatch";

const { regionPath, regionReady } = useOpcAppRegion();
const { ntDistrictFilter, isNantongContext, applyNtDistrictFilter } = useNtDistrictFilter(regionPath);
const { registerEvent, participatedEventIds } = useEventRegistrations();

const eventListScope = ref<"all" | "joined">("all");
const authTick = ref(0);

function onAuthTick() {
  authTick.value++;
}

onMounted(() => {
  window.addEventListener("weopc-auth-changed", onAuthTick);
});

onBeforeUnmount(() => {
  window.removeEventListener("weopc-auth-changed", onAuthTick);
});
const detailOpen = ref(false);
const detailEvent = ref<OpcCommunityEventItem | null>(null);
const registerOpen = ref(false);
const activeEvent = ref<OpcCommunityEventItem | null>(null);
const submitGuard = useSubmitGuard({ minIntervalMs: 800 });

const registerForm = reactive({
  name: "",
  phone: "",
  company: "",
  remark: "",
});

const mergedRegionEvents = computed(() => {
  const sel = Array.isArray(regionPath.value) ? regionPath.value : [];
  const list =
    sel.length === 0
      ? OPC_COMMUNITY_EVENTS
      : OPC_COMMUNITY_EVENTS.filter((item) => pathPrefixMatch(item.regionPath, sel));
  return applyNtDistrictFilter(list);
});

const filteredEvents = computed(() => {
  authTick.value;
  const list = mergedRegionEvents.value;
  if (eventListScope.value !== "joined") return list;
  const phone = readStoredAuth()?.phone ?? "";
  const ids = participatedEventIds(phone);
  return list.filter((item) => ids.has(item.id));
});

function openDetail(item: OpcCommunityEventItem) {
  detailEvent.value = item;
  detailOpen.value = true;
}

function closeDetail() {
  detailOpen.value = false;
}

function openRegister(item: OpcCommunityEventItem) {
  activeEvent.value = item;
  registerOpen.value = true;
}

function openRegisterFromDetail() {
  if (!detailEvent.value) return;
  activeEvent.value = detailEvent.value;
  detailOpen.value = false;
  registerOpen.value = true;
}

function closeRegister() {
  registerOpen.value = false;
}

async function submitRegister() {
  await submitGuard.run(async () => {
    if (!registerForm.name.trim()) {
      message.warning("请填写联系人姓名");
      return;
    }
    if (!/^1\d{10}$/.test(registerForm.phone)) {
      message.warning("请输入正确的手机号");
      return;
    }
    const ev = activeEvent.value;
    if (ev) {
      registerEvent(ev.id, ev.title);
    }
    message.success(`已提交报名：${activeEvent.value?.title ?? "活动"}`);
    registerForm.name = "";
    registerForm.phone = "";
    registerForm.company = "";
    registerForm.remark = "";
    registerOpen.value = false;
  });
}

function onEventScopeChange(val: string | number) {
  authTick.value;
  if (val === "joined" && !readStoredAuth()?.phone) {
    message.info("请先登录后查看「我参与的」");
  }
}
</script>

<template>
  <section class="opc-events">
    <header class="head">
      <h1>OPC 社区活动</h1>
      <p class="lead">根据顶部「所在地区」展示当前区域可报名活动。</p>

      <div class="event-scope-bar">
        <span class="scope-label">活动列表</span>
        <Segmented
          v-model:value="eventListScope"
          :options="[
            { label: '全部', value: 'all' },
            { label: '我参与的', value: 'joined' },
          ]"
          @change="onEventScopeChange"
        />
      </div>

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
        <p class="district-hint">开发区为南通经济技术开发区；全市活动在各区县筛选下均会显示。</p>
      </div>
    </header>

    <div v-if="!regionReady" class="state">正在加载默认地区…</div>

    <div v-else class="card-grid">
      <article
        v-for="item in filteredEvents"
        :key="item.id"
        class="event-card"
        role="button"
        tabindex="0"
        @click="openDetail(item)"
        @keydown.enter.prevent="openDetail(item)"
        @keydown.space.prevent="openDetail(item)"
      >
        <div class="event-card-content">
          <div class="period">
            <CalendarOutlined /> {{ item.period }}
          </div>
          <h2 class="title">{{ item.title }}</h2>
          <p class="address">
            <EnvironmentOutlined style="margin-top: 5px;" /> 活动地址：{{ item.address }}
          </p>
          <p class="summary">
            <FileTextOutlined style="margin-top: 5px;" /> {{ item.summary }}
          </p>
        </div>
        <div class="apply-btn" @click.stop="openRegister(item)">
          立即报名
        </div>
      </article>
    </div>

    <p v-if="regionReady && !filteredEvents.length" class="state empty">
      当前筛选下暂无活动，可切换顶部地区或区县筛选查看。
    </p>

    <Modal
      v-model:open="detailOpen"
      :title="detailEvent?.title || '活动详情'"
      :footer="null"
      width="640px"
      :mask-closable="true"
      @cancel="closeDetail"
    >
      <div v-if="detailEvent" class="detail-wrap">
        <div class="detail-meta">
          <div class="detail-line">
            <CalendarOutlined class="detail-icon icon-time" />
            <span>{{ detailEvent.period }}</span>
          </div>
          <div v-if="detailEvent.subtitle" class="detail-subtitle">{{ detailEvent.subtitle }}</div>
        </div>
        <div class="detail-block">
          <div class="detail-label">活动地址</div>
          <div class="detail-text icon-line">
            <EnvironmentOutlined class="detail-icon icon-addr" />
            {{ detailEvent.address }}
          </div>
        </div>
        <div class="detail-block">
          <div class="detail-label">活动介绍</div>
          <div class="detail-summary">
            <FileTextOutlined class="detail-icon icon-doc" />
            <span>{{ detailEvent.summary }}</span>
          </div>
        </div>
        <div class="detail-footer">
          <Button @click="closeDetail">关闭</Button>
          <Button type="primary" @click="openRegisterFromDetail">立即报名</Button>
        </div>
      </div>
    </Modal>

    <Modal
      v-model:open="registerOpen"
      :title="activeEvent ? `报名：${activeEvent.title}` : '活动报名'"
      ok-text="提交报名"
      cancel-text="取消"
      :confirm-loading="submitGuard.loading.value"
      @ok="submitRegister"
      @cancel="closeRegister"
    >
      <Form layout="vertical">
        <Form.Item label="联系人姓名" required>
          <Input v-model:value="registerForm.name" placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item label="手机号" required>
          <Input v-model:value="registerForm.phone" placeholder="请输入11位手机号" :maxlength="11" />
        </Form.Item>
        <Form.Item label="公司/团队">
          <Input v-model:value="registerForm.company" placeholder="请输入公司或团队名称" />
        </Form.Item>
        <Form.Item label="备注">
          <Input.TextArea v-model:value="registerForm.remark" :auto-size="{ minRows: 2, maxRows: 4 }"
            placeholder="可填写关注议题、参与人数等" />
        </Form.Item>
      </Form>
    </Modal>
  </section>
</template>

<style scoped>
.opc-events {
  padding: 24px 20px 40px;
  max-width: 1100px;
  margin: 0 auto;
}

.head h1 {
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

.event-scope-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
  margin-bottom: 14px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 14px;
}

.event-scope-bar .scope-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
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
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 16px;
  margin-top: 22px;
}

.event-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 16px 16px;
  line-height: 1.6;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.event-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
}

.event-card:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.period {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.title {
  margin: 0 0 8px;
  font-size: 17px;
  color: #1e293b;
}

.subtitle {
  margin: 0 0 10px;
  color: #334155;
  font-size: 13px;
}

.address,
.summary {
  margin: 0 0 10px;
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.6;
}

.address {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.summary {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.apply-btn {
  margin-top: 2px;
  padding: 10px 0 0 0;
  color: #4096ff;
  font-size: 14px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  cursor: pointer;
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

.detail-wrap {
  display: grid;
  gap: 16px;
}

.detail-meta {
  padding: 12px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.detail-line {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #334155;
  line-height: 1.5;
}

.detail-subtitle {
  margin-top: 8px;
  font-size: 13px;
  color: #64748b;
}

.detail-block {
  font-size: 14px;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 6px;
}

.detail-text {
  color: #334155;
  line-height: 1.65;
}

.icon-line {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.detail-summary {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 13px;
  color: #475569;
  line-height: 1.65;
}

.detail-summary span {
  flex: 1;
  min-width: 0;
}

.detail-icon {
  flex-shrink: 0;
  margin-top: 2px;
  font-size: 15px;
}

.icon-time {
  color: #8b5cf6;
}

.icon-addr {
  color: #10b981;
}

.icon-doc {
  color: #2563eb;
}

.detail-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
}

</style>
