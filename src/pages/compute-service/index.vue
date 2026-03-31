<script setup lang="ts">
import { Button, Input, Select, Tag, message } from "ant-design-vue";
import { CopyOutlined } from "@ant-design/icons-vue";
import { computed, reactive } from "vue";
import { COMPUTE_MODELS } from "../../data/computeModels";

const filters = reactive({
  keyword: "",
  billingType: "全部" as "全部" | "按量计费" | "按次计费",
});
const keywordDraft = reactive({ value: "" });
const billingDraft = reactive<{ value: "全部" | "按量计费" | "按次计费" }>({ value: "全部" });

function applySearch() {
  filters.keyword = keywordDraft.value;
  filters.billingType = billingDraft.value;
}

async function copyModelName(name: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(name);
    } else {
      const input = document.createElement("textarea");
      input.value = name;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.focus();
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    message.success("名称已复制");
  } catch {
    message.error("复制失败，请手动复制");
  }
}

const filteredModels = computed(() => {
  const k = filters.keyword.trim().toLowerCase();

  return COMPUTE_MODELS.filter((m) => {
    const nameMatch = !k || m.name.toLowerCase().includes(k);
    const billingMatch = filters.billingType === "全部" || m.billingType === filters.billingType;
    return nameMatch && billingMatch;
  });
});
</script>

<template>
  <section class="compute-page">
    <header class="head">
      <h1>算力服务</h1>
      <p class="sub">按模型名称和价格筛选可用大模型，支持快速对比输入/补全计费。</p>

      <div class="toolbar">
        <Input
          v-model:value="keywordDraft.value"
          placeholder="输入模型名称搜索"
          class="search"
          allow-clear
          @pressEnter="applySearch"
        />
        <Select
          v-model:value="billingDraft.value"
          class="billing-select"
          :options="[
            { label: '全部计费类型', value: '全部' },
            { label: '按量计费', value: '按量计费' },
            { label: '按次计费', value: '按次计费' },
          ]"
        />
        <Button type="primary" @click="applySearch">搜索</Button>
      </div>
    </header>

    <div class="list">
      <article v-for="item in filteredModels" :key="item.id" class="model-card">
        <button type="button" class="copy-btn" @click="copyModelName(item.name)">
          <CopyOutlined />
        </button>
        <div class="avatar">{{ item.name.slice(0, 2) }}</div>
        <div class="content">
          <h2 class="name">{{ item.name }}</h2>
          <div class="prices">
            <div class="price-line">输入价格 ¥{{ item.inputPrice.toFixed(4) }} / 1M Tokens</div>
            <div class="price-line">补全价格 ¥{{ item.completionPrice.toFixed(4) }} / 1M Tokens</div>
          </div>
          <div class="meta-bottom">
            <Tag color="blue">{{ item.billingType }}</Tag>
            <Tag color="purple">{{ item.modelType }}</Tag>
          </div>
        </div>
      </article>
    </div>

    <p v-if="!filteredModels.length" class="empty">暂无符合条件的模型，请调整搜索条件。</p>
  </section>
</template>

<style scoped>
.compute-page {
  padding: 24px 20px 40px;
  max-width: 1100px;
  margin: 0 auto;
}

.head h1 {
  margin: 0 0 8px;
  font-size: 26px;
  color: #0f172a;
}

.sub {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 14px;
}

.toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px 96px;
  gap: 10px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
}

.search {
  width: 100%;
}

.billing-select {
  width: 100%;
}

.list {
  margin-top: 18px;
  display: grid;
  gap: 12px;
}

.model-card {
  position: relative;
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: 12px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: linear-gradient(145deg, #ffffff 0%, #f8faff 100%);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.copy-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 28px;
  height: 28px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  color: #64748b;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.copy-btn:hover {
  color: #4338ca;
  border-color: #c7d2fe;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #4338ca;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
}

.name {
  margin: 2px 0 15px;
  font-size: 16px;
  color: #0f172a;
  word-break: break-all;
}

.prices {
  display: grid;
  gap: 8px;
  margin-top: 2px;
  margin-bottom: 12px;
  color: #475569;
  font-size: 13px;
}

.price-line b {
  color: #0f172a;
}

.meta-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.empty {
  margin-top: 20px;
  text-align: center;
  color: #94a3b8;
}

@media (max-width: 720px) {
  .toolbar {
    grid-template-columns: 1fr;
  }
}
</style>
