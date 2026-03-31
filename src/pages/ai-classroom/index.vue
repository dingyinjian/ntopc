<script setup lang="ts">
import { Modal, Pagination, Tag } from "ant-design-vue";
import { computed, ref, watch } from "vue";
import { AI_CLASSROOM_VIDEOS, type AiClassroomVideoItem } from "../../data/aiClassroomVideos";

const page = ref(1);
const pageSize = ref(4);
const playOpen = ref(false);
const activeVideoId = ref<string | null>(null);
const category = ref<
  "全部" | "产品实战" | "提示词工程" | "RAG知识库" | "部署优化" | "运营增长"
>("全部");

const activeVideo = computed<AiClassroomVideoItem | null>(() => {
  if (!activeVideoId.value) return null;
  return AI_CLASSROOM_VIDEOS.find((v) => v.id === activeVideoId.value) ?? null;
});

const filteredVideos = computed(() => {
  if (category.value === "全部") return AI_CLASSROOM_VIDEOS;
  return AI_CLASSROOM_VIDEOS.filter((v) => v.category === category.value);
});

const pagedVideos = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filteredVideos.value.slice(start, start + pageSize.value);
});

function openVideo(id: string) {
  activeVideoId.value = id;
  playOpen.value = true;
}

watch(category, () => {
  page.value = 1;
});
</script>

<template>
  <section class="classroom-page">
    <header class="head">
      <h1>AI课堂</h1>
      <p class="sub">视频课程列表（点击卡片即可播放）。</p>
      <div class="category-tags">
        <Tag :color="category === '全部' ? 'blue' : 'default'" class="tag-btn" @click="category = '全部'">全部</Tag>
        <Tag
          :color="category === '产品实战' ? 'blue' : 'default'"
          class="tag-btn"
          @click="category = '产品实战'"
        >产品实战</Tag>
        <Tag
          :color="category === '提示词工程' ? 'blue' : 'default'"
          class="tag-btn"
          @click="category = '提示词工程'"
        >提示词工程</Tag>
        <Tag
          :color="category === 'RAG知识库' ? 'blue' : 'default'"
          class="tag-btn"
          @click="category = 'RAG知识库'"
        >RAG知识库</Tag>
        <Tag
          :color="category === '部署优化' ? 'blue' : 'default'"
          class="tag-btn"
          @click="category = '部署优化'"
        >部署优化</Tag>
        <Tag
          :color="category === '运营增长' ? 'blue' : 'default'"
          class="tag-btn"
          @click="category = '运营增长'"
        >运营增长</Tag>
      </div>
    </header>

    <div class="video-grid">
      <article
        v-for="item in pagedVideos"
        :key="item.id"
        class="video-card"
        role="button"
        tabindex="0"
        @click="openVideo(item.id)"
        @keydown.enter.prevent="openVideo(item.id)"
        @keydown.space.prevent="openVideo(item.id)"
      >
        <div class="cover-wrap">
          <img class="cover" :src="item.cover" :alt="item.title" loading="lazy" />
          <span class="duration">{{ item.duration }}</span>
        </div>
        <div class="card-cat">{{ item.category }}</div>
        <div class="title">{{ item.title }}</div>
        <div class="subtitle">{{ item.subtitle }}</div>
      </article>
    </div>

    <div class="pager">
      <Pagination
        v-model:current="page"
        :total="filteredVideos.length"
        :page-size="pageSize"
        :show-size-changer="false"
        :show-total="(total) => `共 ${total} 条`"
      />
    </div>

    <Modal
      v-model:open="playOpen"
      :title="activeVideo?.title || '视频播放'"
      :footer="null"
      width="900px"
      @cancel="playOpen = false"
    >
      <div v-if="activeVideo" class="player-wrap">
        <video class="player" :src="activeVideo.videoUrl" controls autoplay playsinline />
      </div>
    </Modal>
  </section>
</template>

<style scoped>
.classroom-page {
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

.sub {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 14px;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.tag-btn {
  cursor: pointer;
  user-select: none;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 14px;
}

.video-card {
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 10px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  cursor: pointer;
  outline: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.video-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
}

.cover-wrap {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

.duration {
  position: absolute;
  right: 8px;
  bottom: 8px;
  font-size: 12px;
  color: #fff;
  background: rgba(15, 23, 42, 0.78);
  padding: 2px 8px;
  border-radius: 999px;
}

.title {
  margin-top: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.5;
}

.card-cat {
  margin-top: 8px;
  font-size: 12px;
  color: #4f46e5;
  font-weight: 600;
}

.subtitle {
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}

.pager {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.player-wrap {
  border-radius: 10px;
  overflow: hidden;
}

.player {
  width: 100%;
  max-height: 70vh;
  background: #000;
}
</style>
