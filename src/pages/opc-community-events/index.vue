<script setup lang="ts">
import { Button, Cascader, Form, Input, Modal, message } from "ant-design-vue";
import { ArrowRightOutlined, CalendarOutlined, EnvironmentOutlined, FileTextOutlined } from "@ant-design/icons-vue";
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { OPC_COMMUNITY_EVENTS, type OpcCommunityEventItem } from "../../data/opcCommunityEvents";
import { useOpcRegionDefaults } from "../../composables/useOpcRegionDefaults";
import { pathPrefixMatch, regionData } from "../../utils/regionMatch";

const { loadingGeo, geoError, loadIpRegionPath, readStoredAuth } = useOpcRegionDefaults();

const regionValue = ref<string[]>([]);
const initializing = ref(true);
const registerOpen = ref(false);
const activeEvent = ref<OpcCommunityEventItem | null>(null);

const registerForm = reactive({
  name: "",
  phone: "",
  company: "",
  remark: "",
});

const filteredEvents = computed(() => {
  const sel = Array.isArray(regionValue.value) ? regionValue.value : [];
  if (sel.length === 0) return OPC_COMMUNITY_EVENTS;
  return OPC_COMMUNITY_EVENTS.filter((item) => pathPrefixMatch(item.regionPath, sel));
});

const regionLabelText = computed(() => {
  const v = Array.isArray(regionValue.value) ? regionValue.value : [];
  if (v.length === 0) return "";
  const parts: string[] = [];
  let options = regionData as { label: string; value: string; children?: typeof regionData }[];
  for (const code of v) {
    const node = options.find((o) => o.value === code);
    if (!node) break;
    parts.push(node.label);
    options = (node.children ?? []) as typeof options;
  }
  return parts.join(" · ");
});

async function initRegion() {
  initializing.value = true;
  const auth = readStoredAuth();
  if (auth?.profile?.regionPath?.length) {
    regionValue.value = [...auth.profile.regionPath];
  } else {
    regionValue.value = await loadIpRegionPath();
  }
  initializing.value = false;
}

function onAuthChanged() {
  const auth = readStoredAuth();
  if (auth?.profile?.regionPath?.length) {
    regionValue.value = [...auth.profile.regionPath];
  }
}

onMounted(() => {
  void initRegion();
  window.addEventListener("weopc-auth-changed", onAuthChanged);
});

onBeforeUnmount(() => {
  window.removeEventListener("weopc-auth-changed", onAuthChanged);
});

function openRegister(item: OpcCommunityEventItem) {
  activeEvent.value = item;
  registerOpen.value = true;
}

function closeRegister() {
  registerOpen.value = false;
}

function submitRegister() {
  if (!registerForm.name.trim()) {
    message.warning("请填写联系人姓名");
    return;
  }
  if (!/^1\d{10}$/.test(registerForm.phone)) {
    message.warning("请输入正确的手机号");
    return;
  }
  message.success(`已提交报名：${activeEvent.value?.title ?? "活动"}`);
  registerForm.name = "";
  registerForm.phone = "";
  registerForm.company = "";
  registerForm.remark = "";
  registerOpen.value = false;
}
</script>

<template>
  <section class="opc-events">
    <header class="head">
      <h1>OPC 社区活动</h1>
      <p class="lead">根据地区自动绑定默认社区，展示当前可报名活动。</p>

      <div class="toolbar">
        <span class="toolbar-label">社区地区</span>
        <Cascader v-model:value="regionValue" :options="regionData" :change-on-select="true" allow-clear
          placeholder="省 / 市 / 区" class="region-cascader" :loading="initializing || loadingGeo" />
        <span v-if="regionLabelText" class="region-hint">{{ regionLabelText }}</span>
      </div>
      <p v-if="geoError" class="geo-msg">{{ geoError }}</p>
    </header>

    <div v-if="initializing" class="state">正在绑定默认社区…</div>

    <div v-else class="card-grid">
      <article v-for="item in filteredEvents" :key="item.id" class="event-card">
        <div class="event-card-content">
          <div class="period">
            <CalendarOutlined /> {{ item.period }}
          </div>
          <h2 class="title">{{ item.title }}</h2>
          <p class="address">
            <EnvironmentOutlined style="margin-top: 5px;" /> 活动地址：{{ item.address }}
          </p>
          <p class="summary">
            <FileTextOutlined style="margin-top: 5px;" /> {{ item.summary }}
          </p>
        </div>
        <div class="apply-btn" @click="openRegister(item)">
          立即报名
        </div>
      </article>
    </div>

    <p v-if="!initializing && !filteredEvents.length" class="state empty">当前地区暂无活动，请切换地区查看。</p>

    <Modal v-model:open="registerOpen" :title="activeEvent ? `报名：${activeEvent.title}` : '活动报名'" ok-text="提交报名"
      cancel-text="取消" @ok="submitRegister" @cancel="closeRegister">
      <Form layout="vertical">
        <Form.Item label="联系人姓名" required>
          <Input v-model:value="registerForm.name" placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item label="手机号" required>
          <Input v-model:value="registerForm.phone" placeholder="请输入11位手机号" :maxlength="11" />
        </Form.Item>
        <Form.Item label="公司/团队">
          <Input v-model:value="registerForm.company" placeholder="请输入公司或团队名称" />
        </Form.Item>
        <Form.Item label="备注">
          <Input.TextArea v-model:value="registerForm.remark" :auto-size="{ minRows: 2, maxRows: 4 }"
            placeholder="可填写关注议题、参与人数等" />
        </Form.Item>
      </Form>
    </Modal>
  </section>
</template>

<style scoped>
.opc-events {
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

.lead {
  margin: 0 0 20px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
}

.toolbar-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.region-cascader {
  min-width: min(100%, 320px);
}

.region-hint {
  font-size: 12px;
  color: #64748b;
}

.geo-msg {
  margin: 10px 0 0;
  font-size: 12px;
  color: #b45309;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 16px;
  margin-top: 22px;
}

.event-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 16px 16px;
  line-height: 1.6;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.period {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.title {
  margin: 0 0 8px;
  font-size: 17px;
  color: #1e293b;
}

.subtitle {
  margin: 0 0 10px;
  color: #334155;
  font-size: 13px;
}

.address,
.summary {
  margin: 0 0 10px;
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.6;
}

.address {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.summary {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.apply-btn {
  margin-top: 2px;
  padding: 10px 0 0 0;
  color: #4096ff;
  font-size: 14px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  cursor: pointer;
}


.state {
  margin-top: 20px;
  font-size: 14px;
  color: #64748b;
}

.state.empty {
  text-align: center;
  padding: 28px 12px;
}

@media (max-width: 640px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .region-cascader {
    width: 100%;
  }
}
</style>
