<script setup lang="ts">
import { Button, Form, Input, Modal, Pagination, Segmented, Upload, message } from "ant-design-vue";
import type { UploadFile } from "ant-design-vue";
import {
  ClockCircleOutlined,
  CommentOutlined,
  PaperClipOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { useSubmitGuard } from "../../composables/useSubmitGuard";
import { useCommunityQA } from "../../composables/useCommunityQA";
import { readStoredAuth } from "../../composables/useOpcRegionDefaults";
import type { CommunityQuestion } from "../../data/communityQA";

const { questions, addQuestion, addAnswer, answerCountFor, answersForQuestion } = useCommunityQA();

const askOpen = ref(false);
const detailOpen = ref(false);
const activeQuestion = ref<CommunityQuestion | null>(null);
const askGuard = useSubmitGuard({ minIntervalMs: 800 });
const answerGuard = useSubmitGuard({ minIntervalMs: 800 });

const listScope = ref<"all" | "mine">("all");
const authTick = ref(0);

function currentPhone() {
  authTick.value;
  return readStoredAuth()?.phone;
}
const uploadList = ref<UploadFile[]>([]);
const attachmentPayload = ref<{ uid: string; name: string; url: string }[]>([]);

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

const visibleQuestions = computed(() => {
  if (listScope.value === "mine") {
    const phone = currentPhone();
    if (!phone) return [];
    return sortedQuestions.value.filter((q) => q.authorPhone === phone);
  }
  return sortedQuestions.value;
});

const pagedQuestions = computed(() => {
  const list = visibleQuestions.value;
  const start = (page.value - 1) * pageSize.value;
  return list.slice(start, start + pageSize.value);
});

watch(
  visibleQuestions,
  (list) => {
    const maxPage = Math.max(1, Math.ceil(list.length / pageSize.value) || 1);
    if (page.value > maxPage) page.value = maxPage;
  },
  { deep: true }
);

watch(listScope, () => {
  page.value = 1;
});

function onAuthTick() {
  authTick.value++;
}

onMounted(() => {
  window.addEventListener("weopc-auth-changed", onAuthTick);
});

onBeforeUnmount(() => {
  window.removeEventListener("weopc-auth-changed", onAuthTick);
});

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
  uploadList.value = [];
  attachmentPayload.value = [];
  askOpen.value = true;
}

function beforeUploadAttachment(file: File) {
  if (attachmentPayload.value.length >= 5) {
    message.warning("最多上传 5 个附件");
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    message.error(`「${file.name}」超过 5MB`);
    return false;
  }
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const reader = new FileReader();
  reader.onload = () => {
    attachmentPayload.value.push({ uid, name: file.name, url: String(reader.result) });
    uploadList.value = [...uploadList.value, { uid, name: file.name, status: "done" }];
  };
  reader.readAsDataURL(file);
  return false;
}

function onRemoveUpload(file: UploadFile) {
  attachmentPayload.value = attachmentPayload.value.filter((x) => x.uid !== file.uid);
  uploadList.value = uploadList.value.filter((x) => x.uid !== file.uid);
}

function closeAsk() {
  askOpen.value = false;
}

async function submitAsk() {
  await askGuard.run(async () => {
    if (!currentPhone()) {
      message.warning("请先登录后再发布");
      throw new Error("auth");
    }
    if (!askForm.title.trim()) return message.warning("请填写标题");
    if (!askForm.content.trim()) return message.warning("请填写问题内容");
    if (attachmentPayload.value.length === 0) return message.warning("请上传至少一个附件");
    addQuestion(
      askForm.title,
      askForm.content,
      attachmentPayload.value.map(({ name, url }) => ({ name, url }))
    );
    message.success("发布成功");
    askOpen.value = false;
    uploadList.value = [];
    attachmentPayload.value = [];
    page.value = 1;
    listScope.value = "mine";
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
      <div class="scope-bar">
        <span class="scope-label">列表</span>
        <Segmented
          v-model:value="listScope"
          :options="[
            { label: '全部', value: 'all' },
            { label: '我的发布', value: 'mine' },
          ]"
        />
        <p v-if="listScope === 'mine' && !currentPhone()" class="scope-hint">
          请先登录后查看「我的发布」。
        </p>
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
        :total="visibleQuestions.length"
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
        <Form.Item label="附件" required>
          <Upload
            v-model:file-list="uploadList"
            :before-upload="beforeUploadAttachment"
            :max-count="5"
            multiple
            @remove="onRemoveUpload"
          >
            <Button type="default">
              <PaperClipOutlined />
              选择文件（最多 5 个，单文件 ≤ 5MB）
            </Button>
          </Upload>
          <p class="upload-hint">发布问题需上传至少一个附件（演示：文件保存在本机浏览器）。</p>
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

        <div v-if="activeQuestion.attachments?.length" class="attach-block">
          <div class="attach-label">附件</div>
          <ul class="attach-list">
            <li v-for="(att, idx) in activeQuestion.attachments" :key="idx">
              <a :href="att.url" :download="att.name" target="_blank" rel="noopener noreferrer">
                <PaperClipOutlined />
                {{ att.name }}
              </a>
            </li>
          </ul>
        </div>

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

.scope-bar {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.scope-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.scope-hint {
  margin: 0;
  width: 100%;
  font-size: 12px;
  color: #b45309;
}

.upload-hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.attach-block {
  padding: 12px 0;
  border-top: 1px solid #e2e8f0;
}

.attach-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.attach-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.attach-list a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #2563eb;
  font-size: 13px;
  word-break: break-all;
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
