<script setup lang="ts">
import { Button, Form, Input, Modal, Pagination, message } from "ant-design-vue";
import {
  ClockCircleOutlined,
  CommentOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { computed, reactive, ref, watch } from "vue";
import { useSubmitGuard } from "../../composables/useSubmitGuard";
import { useCommunityQA } from "../../composables/useCommunityQA";
import type { CommunityQuestion } from "../../data/communityQA";

const { questions, addQuestion, addAnswer, answerCountFor, answersForQuestion } = useCommunityQA();

const askOpen = ref(false);
const detailOpen = ref(false);
const activeQuestion = ref<CommunityQuestion | null>(null);
const askGuard = useSubmitGuard({ minIntervalMs: 800 });
const answerGuard = useSubmitGuard({ minIntervalMs: 800 });

const askForm = reactive({
  title: "",
  content: "",
});

const answerBody = ref("");

const page = ref(1);
const pageSize = ref(10);

const sortedQuestions = computed(() => {
  return [...questions.value].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});

const pagedQuestions = computed(() => {
  const list = sortedQuestions.value;
  const start = (page.value - 1) * pageSize.value;
  return list.slice(start, start + pageSize.value);
});

watch(
  sortedQuestions,
  (list) => {
    const maxPage = Math.max(1, Math.ceil(list.length / pageSize.value) || 1);
    if (page.value > maxPage) page.value = maxPage;
  },
  { deep: true }
);

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function openAsk() {
  askForm.title = "";
  askForm.content = "";
  askOpen.value = true;
}

function closeAsk() {
  askOpen.value = false;
}

async function submitAsk() {
  await askGuard.run(async () => {
    if (!askForm.title.trim()) return message.warning("请填写标题");
    if (!askForm.content.trim()) return message.warning("请填写问题内容");
    addQuestion(askForm.title, askForm.content);
    message.success("发布成功");
    askOpen.value = false;
    page.value = 1;
  });
}

function openDetail(q: CommunityQuestion) {
  activeQuestion.value = q;
  answerBody.value = "";
  detailOpen.value = true;
}

function closeDetail() {
  detailOpen.value = false;
}

watch(detailOpen, (open) => {
  if (!open) activeQuestion.value = null;
});

async function submitAnswer() {
  await answerGuard.run(async () => {
    const q = activeQuestion.value;
    if (!q) return;
    if (!answerBody.value.trim()) return message.warning("请填写回答内容");
    addAnswer(q.id, answerBody.value);
    message.success("回答已发布");
    answerBody.value = "";
  });
}

const detailAnswers = computed(() => {
  if (!activeQuestion.value) return [];
  return answersForQuestion(activeQuestion.value.id);
});
</script>

<template>
  <section class="community-page">
    <header class="head">
      <div class="head-row">
        <div>
          <h1>交流社区</h1>
          <p class="sub">发布提问、浏览问题并参与回答（数据保存在本机浏览器，便于演示）。</p>
        </div>
        <Button type="primary" class="ask-btn" @click="openAsk">
          <PlusOutlined />
          发布提问
        </Button>
      </div>
    </header>

    <div class="question-list">
      <article
        v-for="q in pagedQuestions"
        :key="q.id"
        class="q-card"
        role="button"
        tabindex="0"
        @click="openDetail(q)"
        @keydown.enter.prevent="openDetail(q)"
        @keydown.space.prevent="openDetail(q)"
      >
        <h2 class="q-title">{{ q.title }}</h2>
        <p class="q-body">{{ q.content }}</p>
        <div class="q-meta">
          <span class="meta-item">
            <UserOutlined />
            {{ q.authorName }}
          </span>
          <span class="meta-item">
            <ClockCircleOutlined />
            {{ formatTime(q.createdAt) }}
          </span>
          <span class="meta-item answer-count">
            <CommentOutlined />
            回答 {{ answerCountFor(q.id) }}
          </span>
        </div>
      </article>
    </div>

    <div class="pager">
      <Pagination
        v-model:current="page"
        :total="sortedQuestions.length"
        :page-size="pageSize"
        :show-size-changer="false"
        :show-total="(total) => `共 ${total} 条`"
      />
    </div>

    <Modal
      v-model:open="askOpen"
      title="发布提问"
      ok-text="发布"
      cancel-text="取消"
      :confirm-loading="askGuard.loading.value"
      @ok="submitAsk"
      @cancel="closeAsk"
    >
      <Form layout="vertical">
        <Form.Item label="标题" required>
          <Input v-model:value="askForm.title" placeholder="一句话说明你想讨论什么" />
        </Form.Item>
        <Form.Item label="问题" required>
          <Input.TextArea
            v-model:value="askForm.content"
            :auto-size="{ minRows: 5, maxRows: 12 }"
            placeholder="请描述背景、已尝试的方案或具体困惑"
          />
        </Form.Item>
      </Form>
    </Modal>

    <Modal
      v-model:open="detailOpen"
      :title="activeQuestion?.title || '问题详情'"
      width="720px"
      :footer="null"
      :mask-closable="true"
      @cancel="closeDetail"
    >
      <div v-if="activeQuestion" class="detail-wrap">
        <div class="detail-meta">
          <span><UserOutlined /> {{ activeQuestion.authorName }}</span>
          <span><ClockCircleOutlined /> {{ formatTime(activeQuestion.createdAt) }}</span>
          <span><CommentOutlined /> 共 {{ answerCountFor(activeQuestion.id) }} 条回答</span>
        </div>
        <div class="detail-body">{{ activeQuestion.content }}</div>

        <div class="answers-head">回答</div>
        <ul v-if="detailAnswers.length" class="answer-list">
          <li v-for="a in detailAnswers" :key="a.id" class="answer-item">
            <div class="answer-meta">
              <span>{{ a.authorName }}</span>
              <span class="answer-time">{{ formatTime(a.createdAt) }}</span>
            </div>
            <p class="answer-text">{{ a.content }}</p>
          </li>
        </ul>
        <p v-else class="no-answer">暂时还没有回答，来做第一个吧。</p>

        <div class="reply-box">
          <div class="reply-label">写回答</div>
          <Input.TextArea
            v-model:value="answerBody"
            :auto-size="{ minRows: 4, maxRows: 10 }"
            placeholder="分享你的经验或建议"
          />
          <div class="reply-actions">
            <Button type="primary" :loading="answerGuard.loading.value" @click="submitAnswer">
              提交回答
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  </section>
</template>

<style scoped>
.community-page {
  padding: 24px 20px 40px;
  max-width: 900px;
  margin: 0 auto;
}

.head-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.head h1 {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
}

.sub {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.ask-btn {
  background: #111827;
  border-color: #111827;
}

.ask-btn:hover,
.ask-btn:focus {
  background: #0b1220;
  border-color: #0b1220;
}

.question-list {
  margin-top: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.q-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  outline: none;
}

.q-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
}

.q-card:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.q-title {
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
}

.q-body {
  margin: 0 0 12px;
  font-size: 14px;
  color: #475569;
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.q-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 18px;
  font-size: 13px;
  color: #64748b;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.answer-count {
  color: #2563eb;
  font-weight: 600;
}

.detail-wrap {
  display: grid;
  gap: 16px;
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  font-size: 13px;
  color: #64748b;
}

.detail-meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.detail-body {
  font-size: 14px;
  line-height: 1.75;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-word;
}

.answers-head {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.answer-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.answer-item {
  padding: 12px 14px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.answer-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
}

.answer-time {
  font-weight: 400;
}

.answer-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.65;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-word;
}

.no-answer {
  margin: 0;
  font-size: 13px;
  color: #94a3b8;
}

.reply-box {
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.reply-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.reply-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.pager {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}
</style>
