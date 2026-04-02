<script setup lang="ts">
import { CloudOutlined, RobotOutlined, SearchOutlined, ThunderboltOutlined } from "@ant-design/icons-vue";

type AgentCard = {
  name: string;
  desc: string;
  icon: object;
};

const AGENTS: AgentCard[] = [
  {
    name: "通用智能助理",
    desc: "对话式智能助手：写方案、写文案、做总结，支持多轮追问。",
    icon: RobotOutlined,
  },
  {
    name: "知识库问答（RAG）",
    desc: "上传资料后检索增强问答：引用可追溯，适合企业知识库场景。",
    icon: SearchOutlined,
  },
  {
    name: "算力与部署优化",
    desc: "推理性能与成本优化建议：批处理、缓存、量化与弹性伸缩。",
    icon: ThunderboltOutlined,
  },
  {
    name: "多模型工作台",
    desc: "一站式接入不同模型与工具，适配产品、运营与研发的协作流程。",
    icon: CloudOutlined,
  },
];

function openAgent() {
  window.open("https://ai.guxuan.cloud/", "_blank", "noopener,noreferrer");
}
</script>

<template>
  <section class="agent-page">
    <header class="head">
      <h1>Agent 广场</h1>
      <p class="sub">精选智能 Agent，点击卡片即可进入使用。</p>
    </header>

    <div class="grid">
      <article
        v-for="a in AGENTS"
        :key="a.name"
        class="agent-card"
        role="button"
        tabindex="0"
        @click="openAgent"
        @keydown.enter.prevent="openAgent"
        @keydown.space.prevent="openAgent"
      >
        <div class="icon" aria-hidden="true">
          <component :is="a.icon" />
        </div>
        <div class="name">{{ a.name }}</div>
        <p class="desc">{{ a.desc }}</p>
        <div class="cta">前往使用</div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.agent-page {
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
  margin: 0 0 18px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

.agent-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px 16px 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
  outline: none;
}

.agent-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
  transform: translateY(-1px);
}

.agent-card:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  border: 1px solid rgba(99, 102, 241, 0.25);
  color: #4338ca;
  margin-bottom: 10px;
}

.icon :deep(svg) {
  width: 20px;
  height: 20px;
}

.name {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
}

.desc {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.65;
  min-height: 44px;
}

.cta {
  margin-top: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #2563eb;
}
</style>
