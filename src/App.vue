<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppRegionBar from "./components/AppRegionBar.vue";
import AuthModal from "./components/AuthModal.vue";
import SidebarMenu from "./components/SidebarMenu.vue";
import { useOpcAppRegion } from "./composables/useOpcAppRegion";
import { defaultHomeData, navItems } from "./types/weopc";

const { bootstrap, onAuthChanged } = useOpcAppRegion();

const route = useRoute();
const router = useRouter();
const menuOpen = ref(false);
const authVisible = ref(false);
const authMode = ref<"login" | "register">("login");
const appTitle = defaultHomeData?.meta?.title ?? "WeOPC";
const appSubtitle = defaultHomeData?.meta?.subtitle ?? "全国一站式OPC服务平台";
const navTargets = computed(() => navItems);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}

watch(menuOpen, (open) => {
  if (typeof document === "undefined") return;
  document.body.style.overflow = open || authVisible.value ? "hidden" : "";
});

watch(authVisible, (open) => {
  if (typeof document === "undefined") return;
  document.body.style.overflow = open || menuOpen.value ? "hidden" : "";
});

function navigateTo(path: string) {
  if (route.path !== path) {
    router.push(path);
  }
  menuOpen.value = false;
}

function openAuth(mode: "login" | "register") {
  authMode.value = mode;
  authVisible.value = true;
}

function closeAuth() {
  authVisible.value = false;
}

function onViewportChange() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(min-width: 769px)").matches) {
    menuOpen.value = false;
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    closeMenu();
    closeAuth();
  }
}

onMounted(() => {
  void bootstrap();
  window.addEventListener("resize", onViewportChange);
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("weopc-auth-changed", onAuthChanged);
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
  window.removeEventListener("resize", onViewportChange);
  window.removeEventListener("keydown", onKeydown);
  window.removeEventListener("weopc-auth-changed", onAuthChanged);
});
</script>

<template>
  <div class="page" :class="{ 'is-menu-open': menuOpen }">
    <header class="mobile-bar" aria-label="顶部导航">
      <span class="mobile-bar-title">{{ appTitle }}</span>
      <button
        type="button"
        class="menu-toggle"
        :aria-expanded="menuOpen"
        aria-controls="app-sidebar"
        aria-label="菜单"
        @click="toggleMenu"
      >
        <span class="menu-toggle-bars" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </header>

    <div v-show="menuOpen" class="drawer-backdrop" aria-hidden="true" @click="closeMenu" />

    <SidebarMenu
      :nav-targets="navTargets"
      :active-path="route.path"
      :title="appTitle"
      :subtitle="appSubtitle"
      @navigate="navigateTo"
      @auth="openAuth"
    />
    <main id="route-content" class="route-content">
      <div class="route-shell">
        <AppRegionBar />
        <div class="route-view">
          <RouterView />
        </div>
      </div>
    </main>
    <AuthModal :visible="authVisible" :mode="authMode" @close="closeAuth" />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  grid-template-columns: minmax(240px, 280px) minmax(0, 1fr);
  background: linear-gradient(165deg, #eef2ff 0%, #f4f6fb 42%, #eef1f7 100%);
  color: #111827;
  font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  box-sizing: border-box;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

@media (min-width: 769px) {
  .page {
    height: 100dvh;
    overflow: hidden;
  }
}

.route-content {
  min-width: 0;
}

.route-shell {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
}

.route-view {
  flex: 1;
  min-height: 0;
  min-width: 0;
}

@media (min-width: 769px) {
  .route-content {
    height: 100dvh;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
}

.mobile-bar {
  display: none;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 120;
  padding: max(10px, env(safe-area-inset-top)) max(14px, env(safe-area-inset-right)) 10px max(14px, env(safe-area-inset-left));
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-sizing: border-box;
}

.mobile-bar-title {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-toggle {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin: 0;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.menu-toggle:active {
  background: #f3f4f6;
}

.menu-toggle-bars {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 20px;
}

.menu-toggle-bars span {
  display: block;
  height: 2px;
  border-radius: 1px;
  background: #111827;
}

.drawer-backdrop {
  display: none;
}

@media (max-width: 1080px) {
  .page {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .mobile-bar {
    display: flex;
  }

  .drawer-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 180;
    background: rgba(15, 23, 42, 0.45);
    -webkit-tap-highlight-color: transparent;
  }

  .page {
    grid-template-columns: 1fr;
  }

  :deep(.sidebar) {
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

  .page.is-menu-open :deep(.sidebar) {
    transform: translateX(0);
    box-shadow: 4px 0 16px rgba(15, 23, 42, 0.1);
  }
}

@media (min-width: 769px) {
  .drawer-backdrop {
    display: none !important;
  }
}
</style>

