<script setup lang="ts">
import { Button, Form, Input, Modal, Select, Tag, message } from "ant-design-vue";
import { CalendarOutlined, DollarCircleOutlined, EnvironmentOutlined, PhoneOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { computed, reactive, ref } from "vue";
import { DEMAND_CATEGORIES, DEMAND_LIST, type DemandCategory } from "../../data/demandItems";
import { useSubmitGuard } from "../../composables/useSubmitGuard";

const filter = reactive({
  keyword: "",
  category: "全部" as DemandCategory | "全部",
});

const publishOpen = ref(false);
const submitGuard = useSubmitGuard({ minIntervalMs: 1000 });
const applyOpen = ref(false);
const applyingDemandId = ref<string | null>(null);
const applyGuard = useSubmitGuard({ minIntervalMs: 1000 });
const detailOpen = ref(false);
const detailDemandId = ref<string | null>(null);

const publishForm = reactive({
  category: "AI开发" as DemandCategory,
  title: "",
  subtitle: "",
  details: "",
  price: "",
  deadline: "",
  contact: "",
  location: "",
});

const applyForm = reactive({
  intro: "",
  quote: "",
  eta: "",
});

const filteredDemands = computed(() => {
  const k = filter.keyword.trim().toLowerCase();
  return DEMAND_LIST.filter((item) => {
    const byCategory = filter.category === "全部" || item.category === filter.category;
    const byKeyword =
      !k ||
      item.title.toLowerCase().includes(k) ||
      item.subtitle.toLowerCase().includes(k) ||
      item.details.toLowerCase().includes(k) ||
      item.contact.toLowerCase().includes(k) ||
      item.location.toLowerCase().includes(k);
    return byCategory && byKeyword;
  });
});

function openDetail(id: string) {
  detailDemandId.value = id;
  detailOpen.value = true;
}

function closeDetail() {
  detailOpen.value = false;
}

const detailDemand = computed(() => {
  if (!detailDemandId.value) return null;
  return DEMAND_LIST.find((d) => d.id === detailDemandId.value) ?? null;
});

function acceptOrder(id: string) {
  applyingDemandId.value = id;
  applyOpen.value = true;
}

const applyingDemand = computed(() => {
  if (!applyingDemandId.value) return null;
  return DEMAND_LIST.find((d) => d.id === applyingDemandId.value) ?? null;
});

function fromDetailToApply() {
  if (detailDemandId.value) {
    applyingDemandId.value = detailDemandId.value;
    detailOpen.value = false;
    applyOpen.value = true;
  }
}

function resetApplyForm() {
  applyForm.intro = "";
  applyForm.quote = "";
  applyForm.eta = "";
}

async function submitApply() {
  await applyGuard.run(async () => {
    if (!applyForm.intro.trim()) return message.warning("请填写自我介绍");
    if (!applyForm.quote.trim()) return message.warning("请填写报价");
    if (!applyForm.eta.trim()) return message.warning("请填写预计交付时间");
    message.success("申请已提交（示例）");
    applyOpen.value = false;
    resetApplyForm();
  });
}

function resetPublishForm() {
  publishForm.category = "AI开发";
  publishForm.title = "";
  publishForm.subtitle = "";
  publishForm.details = "";
  publishForm.price = "";
  publishForm.deadline = "";
  publishForm.contact = "";
  publishForm.location = "";
}

async function submitPublish() {
  await submitGuard.run(async () => {
    if (!publishForm.title.trim()) return message.warning("请填写需求标题");
    if (!publishForm.subtitle.trim()) return message.warning("请填写需求副标题");
    if (!publishForm.details.trim()) return message.warning("请填写具体需求详情");
    if (!publishForm.price.trim()) return message.warning("请填写预算价格");
    if (!publishForm.deadline.trim()) return message.warning("请填写截止时间");
    if (!publishForm.location.trim()) return message.warning("请填写地点");
    if (!publishForm.contact.trim()) return message.warning("请填写联系方式");
    message.success("发布成功（示例）");
    publishOpen.value = false;
    resetPublishForm();
  });
}
</script>

<template>
  <section class="demand-page">
    <header class="head">
      <div class="head-top">
        <div>
          <h1>需求广场</h1>
          <p class="sub">快速发布与匹配需求，支持按分类和关键词检索。</p>
        </div>
        <Button type="primary" class="publish-btn" @click="publishOpen = true">
          <PlusOutlined />
          发布需求
        </Button>
      </div>

      <div class="toolbar">
        <Input
          v-model:value="filter.keyword"
          allow-clear
          placeholder="搜索标题 / 副标题 / 详情 / 地点 / 联系方式"
        />
        <div class="category-tags">
          <Tag
            v-for="item in DEMAND_CATEGORIES"
            :key="item.value"
            class="category-tag"
            :color="filter.category === item.value ? 'blue' : 'default'"
            @click="filter.category = item.value"
          >
            {{ item.label }}
          </Tag>
        </div>
      </div>
    </header>

    <div class="list">
      <article
        v-for="item in filteredDemands"
        :key="item.id"
        class="demand-card"
        role="button"
        tabindex="0"
        @click="openDetail(item.id)"
        @keydown.enter.prevent="openDetail(item.id)"
        @keydown.space.prevent="openDetail(item.id)"
      >
        <div class="row row1">
          <Tag color="geekblue">{{ item.category }}</Tag>
        </div>
        <div class="row title">{{ item.title }}</div>
        <div class="row subtitle">{{ item.subtitle }}</div>
        <div class="meta-line">
          <div class="row icon-row">
            <EnvironmentOutlined class="row-icon icon-location" />
            地点：{{ item.location }}
          </div>
          <div class="row icon-row">
            <DollarCircleOutlined class="row-icon icon-price" />
            价格：{{ item.price }}
          </div>
          <div class="row icon-row">
            <CalendarOutlined class="row-icon icon-deadline" />
            截止时间：{{ item.deadline }}
          </div>
          <div class="row icon-row">
            <PhoneOutlined class="row-icon icon-contact" />
            联系方式：{{ item.contact }}
          </div>
        </div>
        <div class="actions">
          <Button type="primary" @click.stop="acceptOrder(item.id)">接单</Button>
        </div>
      </article>
    </div>

    <p v-if="!filteredDemands.length" class="empty">暂无匹配需求，请尝试调整搜索条件。</p>

    <Modal
      v-model:open="detailOpen"
      :title="detailDemand?.title || '需求详情'"
      :footer="null"
      width="680px"
      @cancel="closeDetail"
    >
      <div v-if="detailDemand" class="detail-wrap">
        <div class="detail-block">
          <Tag color="geekblue">{{ detailDemand.category }}</Tag>
        </div>
        <div class="detail-block">
          <div class="detail-label">副标题</div>
          <div class="detail-text">{{ detailDemand.subtitle }}</div>
        </div>
        <div class="detail-block">
          <div class="detail-label">具体需求详情</div>
          <pre class="detail-pre">{{ detailDemand.details }}</pre>
        </div>
        <div class="detail-info">
          <div class="detail-row">
            <EnvironmentOutlined class="row-icon icon-location" />
            <span>地点：{{ detailDemand.location }}</span>
          </div>
          <div class="detail-row">
            <DollarCircleOutlined class="row-icon icon-price" />
            <span>价格：{{ detailDemand.price }}</span>
          </div>
          <div class="detail-row">
            <CalendarOutlined class="row-icon icon-deadline" />
            <span>截止时间：{{ detailDemand.deadline }}</span>
          </div>
          <div class="detail-row">
            <PhoneOutlined class="row-icon icon-contact" />
            <span>联系方式：{{ detailDemand.contact }}</span>
          </div>
        </div>
        <div class="detail-footer">
          <Button @click="closeDetail">关闭</Button>
          <Button type="primary" @click="fromDetailToApply">接单</Button>
        </div>
      </div>
    </Modal>

    <Modal
      v-model:open="publishOpen"
      title="发布需求"
      ok-text="提交发布"
      cancel-text="取消"
      :confirm-loading="submitGuard.loading.value"
      @ok="submitPublish"
      @cancel="publishOpen = false"
    >
      <Form layout="vertical">
        <Form.Item label="需求分类">
          <Select v-model:value="publishForm.category" :options="DEMAND_CATEGORIES.slice(1)" />
        </Form.Item>
        <Form.Item label="需求标题">
          <Input v-model:value="publishForm.title" placeholder="请输入需求标题" />
        </Form.Item>
        <Form.Item label="需求副标题">
          <Input v-model:value="publishForm.subtitle" placeholder="请输入需求副标题" />
        </Form.Item>
        <Form.Item label="具体需求详情">
          <Input.TextArea
            v-model:value="publishForm.details"
            :auto-size="{ minRows: 5, maxRows: 14 }"
            placeholder="请描述背景、交付范围、验收标准等（可多行）"
          />
        </Form.Item>
        <Form.Item label="预算价格">
          <Input v-model:value="publishForm.price" placeholder="如：¥8,000 - ¥12,000" />
        </Form.Item>
        <Form.Item label="截止时间">
          <Input v-model:value="publishForm.deadline" placeholder="如：2026-04-30" />
        </Form.Item>
        <Form.Item label="地点">
          <Input v-model:value="publishForm.location" placeholder="如：杭州（线上/线下）" />
        </Form.Item>
        <Form.Item label="联系方式">
          <Input v-model:value="publishForm.contact" placeholder="请输入联系人与电话" />
        </Form.Item>
      </Form>
    </Modal>

    <Modal
      v-model:open="applyOpen"
      title="接单申请"
      :footer="null"
      :mask-closable="true"
      @cancel="applyOpen = false"
    >
      <div v-if="applyingDemand" class="apply-wrap">
        <div class="apply-info">
          <div class="info-line"><span>需求标题：</span>{{ applyingDemand.title }}</div>
          <div class="info-line"><span>价格：</span>{{ applyingDemand.price }}</div>
          <div class="info-line"><span>截止时间：</span>{{ applyingDemand.deadline }}</div>
        </div>

        <Form layout="vertical">
          <Form.Item label="自我介绍">
            <Input.TextArea
              v-model:value="applyForm.intro"
              :auto-size="{ minRows: 3, maxRows: 5 }"
              placeholder="请简要介绍过往经验、擅长方向和相关案例"
            />
          </Form.Item>
          <Form.Item label="报价">
            <Input v-model:value="applyForm.quote" placeholder="如：¥9,000（含2次修改）" />
          </Form.Item>
          <Form.Item label="预计交付时间">
            <Input v-model:value="applyForm.eta" placeholder="如：7天 / 2026-04-20 前交付" />
          </Form.Item>
          <div class="apply-actions">
            <Button type="primary" :loading="applyGuard.loading.value" @click="submitApply">
              提交申请
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  </section>
</template>

<style scoped>
.demand-page {
  padding: 24px 20px 40px;
  max-width: 1100px;
  margin: 0 auto;
}

.head-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.head h1 {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
}

.sub {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 14px;
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tag {
  cursor: pointer;
  user-select: none;
}

.publish-btn {
  background: #111827;
  border-color: #111827;
}

.publish-btn:hover,
.publish-btn:focus {
  background: #0b1220;
  border-color: #0b1220;
}

.list {
  margin-top: 18px;
  display: grid;
  gap: 12px;
}

.demand-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px 16px;
  line-height: 1.6;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.demand-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
}

.demand-card:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.row {
  color: #475569;
  font-size: 13px;
  margin-bottom: 8px;
}

.row1 {
  margin-bottom: 6px;
}

.title {
  color: #0f172a;
  font-size: 17px;
  font-weight: 700;
  margin: 10px 0;
}

.subtitle {
  color: #334155;
}

.icon-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 0;
}

.meta-line {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  margin-bottom: 8px;
}

.icon-price {
  color: #f59e0b;
}

.icon-location {
  color: #10b981;
}

.icon-deadline {
  color: #8b5cf6;
}

.icon-contact {
  color: #2563eb;
}

.row-icon {
  font-size: 14px;
}

.actions {
  margin-top: 6px;
  display: flex;
  justify-content: flex-end;
}

.empty {
  margin-top: 18px;
  text-align: center;
  color: #94a3b8;
}

.detail-wrap {
  display: grid;
  gap: 14px;
}

.detail-block {
  font-size: 14px;
}

.detail-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.detail-text {
  color: #334155;
  line-height: 1.65;
}

.detail-pre {
  margin: 0;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  color: #334155;
  font-family: inherit;
}

.detail-info {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
  display: grid;
  gap: 10px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #334155;
}

.detail-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}

.apply-wrap {
  display: grid;
  gap: 12px;
}

.apply-info {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
}

.info-line {
  font-size: 13px;
  color: #334155;
  line-height: 1.7;
}

.info-line span {
  color: #64748b;
}

.apply-actions {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 720px) {
  .head-top {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
