<script setup lang="ts">
import { Avatar, Button, Card, Form, Input, Modal, Statistic, Table, Tag, message } from "ant-design-vue";
import {
  CopyOutlined,
  GiftOutlined,
  LockOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { readStoredAuth } from "../../composables/useOpcRegionDefaults";
import { useSubmitGuard } from "../../composables/useSubmitGuard";
import { changeStoredPassword, setStoredPassword } from "../../utils/authPassword";
import { useInviteProfile } from "../../composables/useInviteProfile";

const {
  bundle,
  loggedPhone,
  refresh,
  totalInvites,
  activatedCount,
  generateInviteCode,
  maskPhone,
} = useInviteProfile();

const pwdOpen = ref(false);
const pwdHasSet = ref(false);
const authUiTick = ref(0);
const pwdForm = reactive({
  old: "",
  new: "",
  confirm: "",
});
const pwdGuard = useSubmitGuard({ minIntervalMs: 800 });

const isLoggedIn = computed(() => !!loggedPhone.value);

const hasPasswordSet = computed(() => {
  authUiTick.value;
  return !!readStoredAuth()?.passwordHash;
});

const passwordStatusText = computed(() => {
  if (!isLoggedIn.value) return "";
  authUiTick.value;
  return readStoredAuth()?.passwordHash ? "已设置登录密码" : "未设置登录密码";
});

const displayName = computed(() => {
  if (!loggedPhone.value) return "未登录";
  return maskPhone(loggedPhone.value);
});

const avatarText = computed(() => {
  const p = loggedPhone.value;
  if (!p || p.length < 4) return "?";
  return p.slice(-1);
});

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("zh-CN", {
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

async function copyCode() {
  const code = bundle.value.inviteCode;
  if (!code) return message.warning("暂无邀请码");
  try {
    await navigator.clipboard.writeText(code);
    message.success("邀请码已复制");
  } catch {
    message.error("复制失败，请手动复制");
  }
}

function onGenerateInviteCode() {
  generateInviteCode();
  message.success("邀请码已生成，可复制分享给好友");
}

function confirmRegenerate() {
  Modal.confirm({
    title: "重新生成邀请码？",
    content: "原邀请码将失效，需重新分享给好友。",
    okText: "确认重新生成",
    cancelText: "取消",
    onOk() {
      generateInviteCode();
      message.success("已生成新的邀请码");
    },
  });
}

const tableColumns = [
  { title: "好友手机号", dataIndex: "maskedPhone", key: "maskedPhone", width: 140 },
  {
    title: "邀请时间",
    key: "invitedAt",
    width: 170,
  },
  {
    title: "状态",
    key: "status",
    width: 100,
  },
  {
    title: "激活时间",
    key: "activatedAt",
    width: 170,
  },
];

const tableData = computed(() =>
  [...bundle.value.records].sort(
    (a, b) => new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime()
  )
);

function openPasswordModal() {
  pwdForm.old = "";
  pwdForm.new = "";
  pwdForm.confirm = "";
  pwdHasSet.value = !!readStoredAuth()?.passwordHash;
  pwdOpen.value = true;
}

function closePasswordModal() {
  pwdOpen.value = false;
}

async function submitPassword() {
  await pwdGuard.run(async () => {
    const n = pwdForm.new.trim();
    const c = pwdForm.confirm.trim();
    if (n.length < 6) {
      message.warning("新密码至少 6 位");
      throw new Error("validation");
    }
    if (n !== c) {
      message.warning("两次输入的新密码不一致");
      throw new Error("validation");
    }
    if (pwdHasSet.value) {
      const ok = await changeStoredPassword(pwdForm.old, n);
      if (!ok) {
        message.error("当前密码错误");
        throw new Error("bad-old");
      }
      message.success("密码已修改");
    } else {
      const ok = await setStoredPassword(n);
      if (!ok) {
        message.error("保存失败，请重新登录后重试");
        throw new Error("save");
      }
      message.success("登录密码已设置");
    }
    authUiTick.value++;
    pwdOpen.value = false;
  });
}

function onAuthChanged() {
  refresh();
  authUiTick.value++;
}

onMounted(() => {
  window.addEventListener("weopc-auth-changed", onAuthChanged);
  authUiTick.value++;
});

onBeforeUnmount(() => {
  window.removeEventListener("weopc-auth-changed", onAuthChanged);
});
</script>

<template>
  <section class="profile-page">
    <header class="page-head">
      <h1>个人中心</h1>
      <p class="sub">管理账号信息与邀请好友数据（演示数据保存在本机浏览器）。</p>
    </header>

    <Card class="user-card" :bordered="false">
      <div class="user-row">
        <Avatar class="user-avatar" :size="80" :style="{ background: '#4f46e5' }">
          <template v-if="isLoggedIn">
            <span class="avatar-char">{{ avatarText }}</span>
          </template>
          <UserOutlined v-else style="font-size: 36px" />
        </Avatar>
        <div class="user-meta">
          <div class="label">用户名</div>
          <div class="name">{{ displayName }}</div>
          <p v-if="!isLoggedIn" class="hint">登录后可同步邀请码与邀请记录</p>
        </div>
      </div>
    </Card>

    <Card v-if="isLoggedIn" class="security-card" title="账号安全" :bordered="false">
      <template #extra>
        <LockOutlined class="card-icon lock-ico" />
      </template>
      <p class="security-desc">
        {{ passwordStatusText }}。设置后可与手机号验证码组合用于后续登录扩展（当前为本地演示）。
      </p>
      <Button type="primary" class="pwd-btn" @click="openPasswordModal">
        {{ hasPasswordSet ? "修改密码" : "设置密码" }}
      </Button>
    </Card>

    <Card class="invite-card" title="邀请好友" :bordered="false">
      <template #extra>
        <GiftOutlined class="card-icon" />
      </template>

      <div v-if="!isLoggedIn" class="guest-tip">请先通过侧栏登录，以查看和生成您的专属邀请码。</div>

      <template v-else>
        <div class="stats-row">
          <Statistic title="总邀请人数" :value="totalInvites">
            <template #prefix>
              <TeamOutlined class="stat-ico" />
            </template>
          </Statistic>
          <Statistic title="已激活人数" :value="activatedCount">
            <template #prefix>
              <UserOutlined class="stat-ico" />
            </template>
          </Statistic>
        </div>
        <p class="invite-desc">
          将邀请码分享给好友，好友在注册时填写并完成激活后，将计入「已激活人数」（演示逻辑）。
        </p>

        <div class="code-block">
          <span class="code-label">我的邀请码</span>
          <template v-if="bundle.inviteCode">
            <div class="code-row">
              <Input
                class="code-input"
                readonly
                :value="bundle.inviteCode"
                placeholder="邀请码"
              >
                <template #suffix>
                  <Button type="link" size="small" @click="copyCode">
                    <CopyOutlined />
                    复制
                  </Button>
                </template>
              </Input>
              <Button type="default" @click="confirmRegenerate">重新生成邀请码</Button>
            </div>
          </template>
          <div v-else class="code-generate">
            <p class="code-empty">您还没有邀请码，生成后可复制分享给好友注册使用。</p>
            <Button type="primary" class="gen-btn" @click="onGenerateInviteCode">
              生成邀请码
            </Button>
          </div>
        </div>

        <h3 class="section-title">邀请记录</h3>
        <Table
          :columns="tableColumns"
          :data-source="tableData"
          :pagination="false"
          row-key="id"
          size="middle"
          class="invite-table"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'invitedAt'">
              {{ formatTime(record.invitedAt) }}
            </template>
            <template v-else-if="column.key === 'status'">
              <Tag v-if="record.status === 'activated'" color="success">已激活</Tag>
              <Tag v-else color="default">待激活</Tag>
            </template>
            <template v-else-if="column.key === 'activatedAt'">
              {{ record.activatedAt ? formatTime(record.activatedAt) : "—" }}
            </template>
          </template>
        </Table>
      </template>
    </Card>

    <Modal
      v-model:open="pwdOpen"
      :title="pwdHasSet ? '修改密码' : '设置登录密码'"
      ok-text="保存"
      cancel-text="取消"
      :confirm-loading="pwdGuard.loading.value"
      :mask-closable="false"
      destroy-on-close
      @ok="submitPassword"
      @cancel="closePasswordModal"
    >
      <Form layout="vertical" class="pwd-form">
        <Form.Item v-if="pwdHasSet" label="当前密码" required>
          <Input.Password v-model:value="pwdForm.old" autocomplete="current-password" placeholder="请输入当前密码" />
        </Form.Item>
        <Form.Item label="新密码" required>
          <Input.Password v-model:value="pwdForm.new" autocomplete="new-password" placeholder="至少 6 位" />
        </Form.Item>
        <Form.Item label="确认新密码" required>
          <Input.Password v-model:value="pwdForm.confirm" autocomplete="new-password" placeholder="再次输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  </section>
</template>

<style scoped>
.profile-page {
  padding: 24px 20px 40px;
  max-width: 960px;
  margin: 0 auto;
}

.page-head h1 {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
}

.sub {
  margin: 0 0 20px;
  color: #64748b;
  font-size: 14px;
}

.user-card {
  margin-bottom: 16px;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
}

.security-card {
  margin-bottom: 16px;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
}

.lock-ico {
  color: #64748b;
}

.security-desc {
  margin: 0 0 14px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}

.pwd-btn {
  background: #111827;
  border-color: #111827;
}

.pwd-btn:hover,
.pwd-btn:focus {
  background: #0b1220;
  border-color: #0b1220;
}

.pwd-form {
  margin-top: 8px;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  flex-shrink: 0;
}

.avatar-char {
  font-size: 32px;
  font-weight: 700;
}

.user-meta .label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.user-meta .name {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.hint {
  margin: 8px 0 0;
  font-size: 13px;
  color: #94a3b8;
}

.invite-card {
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
}

.card-icon {
  color: #a855f7;
  font-size: 18px;
}

.guest-tip {
  padding: 12px 0;
  color: #64748b;
  font-size: 14px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 12px;
}

.stat-ico {
  color: #6366f1;
  margin-right: 4px;
}

.invite-desc {
  margin: 0 0 20px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}

.code-block {
  margin-bottom: 24px;
}

.code-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.code-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 10px;
}

.code-input {
  flex: 1;
  min-width: 200px;
  font-family: ui-monospace, monospace;
  font-weight: 600;
}

.code-generate {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.code-empty {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}

.gen-btn {
  background: #111827;
  border-color: #111827;
}

.gen-btn:hover,
.gen-btn:focus {
  background: #0b1220;
  border-color: #0b1220;
}

.section-title {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.invite-table :deep(.ant-table) {
  border-radius: 10px;
  overflow: hidden;
}
</style>
