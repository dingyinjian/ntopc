<script setup lang="ts">
import { Tag } from "ant-design-vue";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getAiClassroomVideoById } from "../../data/aiClassroomVideos";

const route = useRoute();
const router = useRouter();

const course = computed(() => getAiClassroomVideoById(route.params.id as string));

function backToList() {
  void router.push("/ai-classroom");
}
</script>

<template>
  <section v-if="course" class="course-detail">
    <div class="detail-bar">
      <button type="button" class="back-link" @click="backToList">
        <ArrowLeftOutlined />
        返回课程列表
      </button>
    </div>

    <header class="detail-head">
      <Tag color="blue">{{ course.category }}</Tag>
      <h1 class="detail-title">{{ course.title }}</h1>
      <p class="detail-sub">{{ course.subtitle }}</p>
      <p class="meta">时长 {{ course.duration }}</p>
    </header>

    <div class="player-card">
      <video
        class="player"
        :src="course.videoUrl"
        controls
        playsinline
        preload="metadata"
        :poster="course.cover"
      />
    </div>

    <section class="block">
      <h2 class="block-title">课程简介</h2>
      <p class="block-text">{{ course.introduction }}</p>
    </section>

    <section class="block">
      <h2 class="block-title">课程大纲</h2>
      <ol class="outline-list">
        <li v-for="(line, i) in course.outline" :key="i" class="outline-item">
          <span class="outline-idx">{{ i + 1 }}</span>
          <span>{{ line }}</span>
        </li>
      </ol>
    </section>

    <section class="block">
      <h2 class="block-title">核心知识点</h2>
      <ul class="points">
        <li v-for="(p, i) in course.corePoints" :key="i" class="point-item">{{ p }}</li>
      </ul>
    </section>
  </section>

  <section v-else class="course-detail not-found">
    <div class="detail-bar">
      <button type="button" class="back-link" @click="backToList">
        <ArrowLeftOutlined />
        返回课程列表
      </button>
    </div>
    <p class="nf-text">未找到该课程。</p>
  </section>
</template>

<style scoped>
.course-detail {
  padding: 16px 20px 40px;
  max-width: 960px;
  margin: 0 auto;
}

.detail-bar {
  margin-bottom: 16px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #2563eb;
  font-family: inherit;
}

.back-link:hover {
  color: #1d4ed8;
}

.detail-head {
  margin-bottom: 20px;
}

.detail-title {
  margin: 12px 0 8px;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.35;
}

.detail-sub {
  margin: 0 0 8px;
  font-size: 15px;
  color: #475569;
  line-height: 1.6;
}

.meta {
  margin: 0;
  font-size: 13px;
  color: #94a3b8;
}

.player-card {
  border-radius: 12px;
  overflow: hidden;
  background: #0f172a;
  border: 1px solid #e2e8f0;
  margin-bottom: 28px;
}

.player {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: min(70vh, 540px);
  background: #000;
}

.block {
  margin-bottom: 28px;
}

.block-title {
  margin: 0 0 12px;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
}

.block-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.75;
  color: #334155;
}

.outline-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.outline-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  color: #334155;
  line-height: 1.55;
}

.outline-idx {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #4338ca;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.points {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.point-item {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  color: #3730a3;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  border: 1px solid rgba(99, 102, 241, 0.25);
}

.not-found {
  min-height: 40vh;
}

.nf-text {
  margin-top: 24px;
  color: #64748b;
  font-size: 15px;
}
</style>
