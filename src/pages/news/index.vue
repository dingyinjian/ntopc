<script setup lang="ts">
import { Modal, Pagination, Segmented, Tag, Typography } from "ant-design-vue";
import { computed, ref, watch } from "vue";
import { NEWS_CATEGORIES, NEWS_LIST, type NewsItem, type NewsCategory } from "../../data/news";

const category = ref<NewsCategory | "全部">("全部");
const detailOpen = ref(false);
const activeId = ref<string | null>(null);
const page = ref(1);
const pageSize = ref(4);

const activeNews = computed<NewsItem | null>(() => {
  if (!activeId.value) return null;
  return NEWS_LIST.find((n) => n.id === activeId.value) ?? null;
});

const filtered = computed(() => {
  if (category.value === "全部") return NEWS_LIST;
  return NEWS_LIST.filter((n) => n.category === category.value);
});

const pagedNews = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filtered.value.slice(start, start + pageSize.value);
});

watch(category, () => {
  page.value = 1;
});

function openDetail(id: string) {
  activeId.value = id;
  detailOpen.value = true;
}

function closeDetail() {
  detailOpen.value = false;
}
</script>

<template>
  <section class="news-page">
    <header class="head">
      <h1>新闻资讯</h1>
      <p class="sub">聚合权威来源与园区动态，快速了解政策与行业趋势。</p>

      <div class="filters">
        <span class="label">分类</span>
        <Segmented v-model:value="category" :options="NEWS_CATEGORIES" class="seg" />
      </div>
    </header>

    <div class="list">
      <article
        v-for="item in pagedNews"
        :key="item.id"
        class="news-card"
        role="button"
        tabindex="0"
        @click="openDetail(item.id)"
        @keydown.enter.prevent="openDetail(item.id)"
        @keydown.space.prevent="openDetail(item.id)"
      >
        <div class="row1">
          <Tag color="geekblue" class="cat">{{ item.category }}</Tag>
          <span class="source">来源：{{ item.source }}</span>
        </div>
        <div class="row2">{{ item.title }}</div>
        <div class="row3">{{ item.summary }}</div>
        <div class="row4">{{ item.time }}</div>
      </article>
    </div>

    <div class="pager">
      <Pagination
        v-model:current="page"
        :total="filtered.length"
        :page-size="pageSize"
        :show-size-changer="false"
        :show-total="(total) => `共 ${total} 条`"
      />
    </div>

    <Modal
      v-model:open="detailOpen"
      :title="activeNews?.title || '新闻详情'"
      :footer="null"
      width="780px"
      @cancel="closeDetail"
    >
      <div v-if="activeNews" class="detail">
        <div class="meta">
          <Tag color="geekblue">{{ activeNews.category }}</Tag>
          <span class="meta-item">来源：{{ activeNews.source }}</span>
          <span class="meta-item">时间：{{ activeNews.time }}</span>
        </div>
        <Typography.Paragraph class="detail-summary">
          {{ activeNews.summary }}
        </Typography.Paragraph>
        <pre class="detail-content">{{ activeNews.content }}</pre>
      </div>
    </Modal>
  </section>
</template>

<style scoped>
.news-page {
  padding: 24px 20px 40px;
  max-width: 1100px;
  margin: 0 auto;
}

.head h1 {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
}

.sub {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 12px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
}

.label {
  font-size: 13px;
  font-weight: 700;
  color: #334155;
}

.seg {
  min-width: min(100%, 640px);
}

.list {
  margin-top: 18px;
  display: grid;
  gap: 12px;
}

.pager {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.news-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  cursor: pointer;
  outline: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.news-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
}

.news-card:focus-visible {
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18), 0 12px 28px rgba(15, 23, 42, 0.1);
}

.row1 {
  display: flex;
  align-items: center;
  gap: 10px;
}

.source {
  color: #64748b;
  font-size: 12px;
}

.row2 {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.4;
}

.row3 {
  margin-top: 6px;
  font-size: 13px;
  color: #475569;
  line-height: 1.7;
}

.row4 {
  margin-top: 10px;
  font-size: 12px;
  color: #94a3b8;
}

.detail {
  display: grid;
  gap: 12px;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px;
  align-items: center;
  color: #64748b;
  font-size: 12px;
}

.detail-summary {
  margin: 0;
  color: #334155;
}

.detail-content {
  margin: 0;
  padding: 12px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 12px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  color: #334155;
}

@media (max-width: 640px) {
  .seg {
    width: 100%;
  }
}
</style>
