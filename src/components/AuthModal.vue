<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Checkbox as ACheckbox } from "ant-design-vue";
import { writeAuthWithMockRegion } from "../composables/useOpcRegionDefaults";

const props = defineProps<{
  visible: boolean;
  mode: "login" | "register";
}>();

const emit = defineEmits<{
  close: [];
}>();

const formMode = ref<"login" | "register">(props.mode);
const phone = ref("");
const code = ref("");
const agreed = ref(false);
const sending = ref(false);
const countdown = ref(0);

watch(
  () => props.mode,
  (nextMode) => {
    formMode.value = nextMode;
  }
);

watch(
  () => props.visible,
  (open) => {
    if (!open) {
      phone.value = "";
      code.value = "";
      agreed.value = false;
      sending.value = false;
      countdown.value = 0;
    }
  }
);

const title = computed(() => (formMode.value === "login" ? "欢迎登录" : "注册会员"));
const subtitle = computed(() =>
  formMode.value === "login"
    ? "手机号验证码登录，更安全更便捷"
    : "无需单独页面，直接完成注册并登录"
);
const submitText = computed(() => (formMode.value === "login" ? "立即登录" : "注册并登录"));

const canSend = computed(() => /^1\d{10}$/.test(phone.value) && countdown.value === 0 && !sending.value);
const canSubmit = computed(() => /^1\d{10}$/.test(phone.value) && /^\d{4,6}$/.test(code.value) && agreed.value);

function closeModal() {
  emit("close");
}

function switchMode(mode: "login" | "register") {
  formMode.value = mode;
}

function openAgreement() {
  window.open("https://weopc.com.cn/", "_blank", "noopener,noreferrer");
}

function openPrivacy() {
  window.open("https://weopc.com.cn/", "_blank", "noopener,noreferrer");
}

function sendCode() {
  if (!canSend.value) return;
  sending.value = true;
  setTimeout(() => {
    sending.value = false;
    countdown.value = 60;
    const timer = window.setInterval(() => {
      countdown.value -= 1;
      if (countdown.value <= 0) {
        window.clearInterval(timer);
      }
    }, 1000);
  }, 500);
}

function submitAuth() {
  if (!canSubmit.value) return;
  /** 接入后端后替换为接口返回的 profile.regionPath */
  writeAuthWithMockRegion(phone.value, ["33", "3301", "330106"]);
  window.dispatchEvent(new CustomEvent("weopc-auth-changed"));
  closeModal();
}
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="auth-mask" @click="closeModal">
      <Transition name="zoom">
        <div class="auth-panel" @click.stop>
          <button class="close-btn" type="button" aria-label="关闭" @click="closeModal">×</button>
          <h3>{{ title }}</h3>
          <p class="sub">{{ subtitle }}</p>

          <div class="mode-switch">
            <button type="button" :class="{ active: formMode === 'login' }" @click="switchMode('login')">登录</button>
            <button type="button" :class="{ active: formMode === 'register' }" @click="switchMode('register')">注册</button>
          </div>

          <label class="field">
            <span>手机号</span>
            <input v-model="phone" type="tel" maxlength="11" placeholder="请输入11位手机号" />
          </label>

          <label class="field">
            <span>验证码</span>
            <div class="code-row">
              <input v-model="code" type="text" maxlength="6" placeholder="请输入验证码" />
              <button class="send-btn" type="button" :disabled="!canSend" @click="sendCode">
                {{ sending ? "发送中..." : countdown > 0 ? `${countdown}s` : "发送验证码" }}
              </button>
            </div>
          </label>

          <a-checkbox v-model:checked="agreed" class="agreement">
            <span>
              已阅读并同意
              <button type="button" @click.prevent="openAgreement">《用户协议》</button>
              与
              <button type="button" @click.prevent="openPrivacy">《隐私政策》</button>
            </span>
          </a-checkbox>

          <button class="submit-btn" type="button" :disabled="!canSubmit" @click="submitAuth">{{ submitText }}</button>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.auth-mask {
  position: fixed;
  inset: 0;
  z-index: 400;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
}

.auth-panel {
  width: min(460px, 94vw);
  border-radius: 16px;
  padding: 22px 20px 20px;
  background: #ffffff;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
  position: relative;
}

.close-btn {
  position: absolute;
  right: 10px;
  top: 8px;
  border: none;
  background: transparent;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
}

h3 {
  margin: 0;
  font-size: 22px;
}

.sub {
  margin: 8px 0 14px;
  color: #6b7280;
  font-size: 13px;
}

.mode-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 14px;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 4px;
}

.mode-switch button {
  border: none;
  height: 34px;
  border-radius: 8px;
  background: transparent;
  color: #374151;
  cursor: pointer;
}

.mode-switch button.active {
  background: #ffffff;
  color: #111827;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

.field {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}

.field span {
  font-size: 13px;
  color: #374151;
}

input {
  width: 100%;
  height: 40px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
}

input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
}

.code-row {
  display: grid;
  grid-template-columns: 1fr 108px;
  gap: 8px;
}

.send-btn {
  border: 1px solid #d1d5db;
  background: #fff;
  border-radius: 10px;
  font-size: 12px;
  cursor: pointer;
}

.send-btn:disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

.agreement {
  margin: 4px 0 14px;
  display: block;
}

.agreement :deep(.ant-checkbox-wrapper) {
  align-items: flex-start;
}

.agreement span,
.agreement :deep(.ant-checkbox + span) {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
}

.agreement button {
  border: none;
  padding: 0;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
  font-size: 12px;
}

.submit-btn {
  width: 100%;
  height: 42px;
  border: none;
  border-radius: 10px;
  color: #fff;
  background: linear-gradient(135deg, #4f46e5, #2563eb);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.25);
}

.submit-btn:disabled {
  background: #c7d2fe;
  cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
  transition: transform 0.22s ease, opacity 0.22s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  transform: translateY(8px) scale(0.98);
  opacity: 0;
}
</style>
