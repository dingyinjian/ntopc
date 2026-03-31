<script setup lang="ts">
import { computed } from "vue";
import {
  AppstoreOutlined,
  BankOutlined,
  BookOutlined,
  CloudServerOutlined,
  FireOutlined,
  GiftOutlined,
  HomeOutlined,
  MessageOutlined,
  NotificationOutlined,
  PushpinOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";

type NavTarget = { label: string; path: string };
type NavIcon = { icon: object; tone: string };

const props = defineProps<{
  navTargets: NavTarget[];
  activePath: string;
  title: string;
  subtitle: string;
}>();

const emit = defineEmits<{
  navigate: [path: string];
  auth: [mode: "login" | "register"];
}>();

function onNavigate(path: string) {
  emit("navigate", path);
}

function openAuth(mode: "login" | "register") {
  emit("auth", mode);
}

function navIcon(label: string): NavIcon {
  if (label === "首页") {
    return { icon: HomeOutlined, tone: "blue" };
  }
  if (label === "OPC政策") {
    return { icon: BankOutlined, tone: "green" };
  }
  if (label === "OPC社区活动") {
    return { icon: FireOutlined, tone: "orange" };
  }
  if (label === "OPC落户") {
    return { icon: GiftOutlined, tone: "green" };
  }
  if (label === "新闻资讯") {
    return { icon: NotificationOutlined, tone: "cyan" };
  }
  if (label === "算力服务") {
    return { icon: ThunderboltOutlined, tone: "orange" };
  }
  if (label === "Agent广场") {
    return { icon: CloudServerOutlined, tone: "purple" };
  }
  if (label === "需求广场") {
    return { icon: PushpinOutlined, tone: "purple" };
  }
  if (label === "AI课堂") {
    return { icon: BookOutlined, tone: "blue" };
  }
  if (label === "交流社区") {
    return { icon: MessageOutlined, tone: "cyan" };
  }
  if (label === "个人中心") {
    return { icon: UserOutlined, tone: "pink" };
  }
  return { icon: AppstoreOutlined, tone: "slate" };
}

const navTargetsWithIcons = computed(() =>
  props.navTargets.map((item) => ({
    ...item,
    ...navIcon(item.label),
  }))
);
</script>

<template>
  <aside id="app-sidebar" class="sidebar">
    <div class="logo">{{ title }}</div>
    <p class="logo-sub">{{ subtitle }}</p>
    <span class="alliance">Global AI Alumni Alliance</span>

    <nav class="nav">
      <a
        v-for="item in navTargetsWithIcons"
        :key="item.label"
        href="#"
        :class="{ active: props.activePath === item.path }"
        @click.prevent="onNavigate(item.path)"
      >
        <span class="nav-icon" :class="`tone-${item.tone}`" aria-hidden="true">
          <component :is="item.icon" />
        </span>
        {{ item.label }}
      </a>
    </nav>

    <div class="auth">
      <button type="button" class="btn ghost" @click="openAuth('login')">登录</button>
      <button type="button" class="btn" @click="openAuth('register')">注册会员</button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  align-self: start;
  height: 100vh;
  height: 100dvh;
  padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom))
    max(16px, env(safe-area-inset-left));
  border-right: 1px solid #e5e7eb;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
  min-width: 0;
}

.logo {
  font-size: clamp(1.125rem, 3.2vw, 1.5rem);
  font-weight: 700;
  line-height: 1.22;
  letter-spacing: 0;
  word-break: break-word;
}

.logo-sub {
  margin: 0 0 12px;
  color: #6b7280;
  font-size: 12px;
}

.alliance {
  display: inline-flex;
  align-self: flex-start;
  margin-bottom: 14px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav a {
  text-decoration: none;
  color: #374151;
  font-weight: 400;
  font-size: 14px;
  padding: 9px 10px;
  border-radius: 10px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.nav a:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.nav a.active {
  background: #111827;
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(17, 24, 39, 0.2);
}

.nav-icon {
  width: 18px;
  height: 18px;
  text-align: center;
  flex-shrink: 0;
  opacity: 0.95;
}

.nav-icon :deep(svg) {
  width: 18px;
  height: 18px;
  display: block;
}

.nav-icon.tone-blue {
  color: #2563eb;
}

.nav-icon.tone-green {
  color: #16a34a;
}

.nav-icon.tone-purple {
  color: #7c3aed;
}

.nav-icon.tone-orange {
  color: #ea580c;
}

.nav-icon.tone-cyan {
  color: #0891b2;
}

.nav-icon.tone-pink {
  color: #db2777;
}

.nav-icon.tone-slate {
  color: #64748b;
}

.nav a.active .nav-icon {
  color: #ffffff;
}

.auth {
  margin-top: auto;
  display: grid;
  gap: 10px;
}

.btn {
  border: 1px solid #111827;
  background: #111827;
  color: #ffffff;
  border-radius: 10px;
  min-height: 40px;
  height: auto;
  padding: 10px 16px;
  font-size: clamp(0.75rem, 1.6vw, 0.8125rem);
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  max-width: 100%;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(17, 24, 39, 0.2);
}

.btn.ghost {
  background: #ffffff;
  color: #111827;
  box-shadow: none;
}

.btn.ghost:hover {
  background: #f9fafb;
}

@media (max-width: 1080px) {
  .sidebar {
    position: static;
    height: auto;
    min-height: 0;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .alliance {
    margin-bottom: 8px;
  }

  .nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }

  .nav a {
    flex: 1 1 auto;
    min-width: min(140px, 100%);
    text-align: center;
    font-size: clamp(0.8125rem, 2vw, 0.9375rem);
    padding: 8px 10px;
  }

  .auth {
    margin-top: 8px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: min(288px, 86vw);
    height: 100vh;
    height: 100dvh;
    z-index: 200;
    margin: 0;
    border-right: 1px solid #e5e7eb;
    border-bottom: none;
    box-shadow: none;
    transform: translateX(-100%);
    transition: transform 0.28s ease;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .nav {
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .nav a {
    flex: none;
    min-width: 0;
    text-align: left;
  }
}
</style>
