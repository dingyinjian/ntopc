<script setup lang="ts">
import {
  Button,
  Form,
  Input,
  message,
  Upload,
  type UploadChangeParam,
  type UploadFile,
} from "ant-design-vue";
import { reactive, ref } from "vue";
import type { FormInstance } from "ant-design-vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { useSubmitGuard } from "../../composables/useSubmitGuard";

type SettlementFormState = {
  legalPersonName: string;
  idCardNumber: string;
  phone: string;
  scopeDescription: string;
  credentials: UploadFile[];
};

const formRef = ref<FormInstance | null>(null);

const formState = reactive<SettlementFormState>({
  legalPersonName: "",
  idCardNumber: "",
  phone: "",
  scopeDescription: "",
  credentials: [],
});

const submitGuard = useSubmitGuard({ minIntervalMs: 1000 });

const ID_CARD_REGEX = /^(\d{15}|\d{17}[\dXx])$/;
const PHONE_REGEX = /^1\d{10}$/;

const rules: Record<string, any[]> = {
  legalPersonName: [
    { required: true, message: "请输入法人姓名", trigger: "blur" },
    { min: 2, message: "法人姓名长度需至少 2 个字符", trigger: "blur" },
  ],
  idCardNumber: [
    { required: true, message: "请输入身份证号", trigger: "blur" },
    {
      validator: (_rule: any, value: string) => {
        if (!value || !ID_CARD_REGEX.test(value.trim())) {
          return Promise.reject(new Error("身份证号格式不正确"));
        }
        return Promise.resolve();
      },
      trigger: "blur",
    },
  ],
  phone: [
    { required: true, message: "请输入联系方式（手机号）", trigger: "blur" },
    {
      validator: (_rule: any, value: string) => {
        if (!value || !PHONE_REGEX.test(value.trim())) {
          return Promise.reject(new Error("手机号格式不正确"));
        }
        return Promise.resolve();
      },
      trigger: "blur",
    },
  ],
  scopeDescription: [
    { required: true, message: "请填写经营范围说明", trigger: "blur" },
    { min: 10, message: "经营范围说明至少 10 个字符", trigger: "blur" },
  ],
  credentials: [
    {
      validator: () => {
        if (!formState.credentials.length) {
          return Promise.reject(new Error("请上传企业资质证明（至少 1 份）"));
        }
        if (formState.credentials.length > 5) {
          return Promise.reject(new Error("最多上传 5 份资质证明"));
        }
        return Promise.resolve();
      },
      trigger: "change",
    },
  ],
};

function beforeUpload(): boolean {
  // 不做自动上传，仅保留到 fileList（示例 demo）
  return false;
}

function onUploadChange(info: UploadChangeParam<UploadFile>) {
  formState.credentials = info.fileList;
}

async function onSubmit() {
  await submitGuard.run(async () => {
    try {
      await formRef.value?.validateFields();
      message.success("提交成功（示例：未实际上传/提交到后端）");
      formRef.value?.resetFields();
      formState.credentials = [];
    } catch {
      message.error("请先完成必填项并通过校验");
    }
  });
}
</script>

<template>
  <section class="settlement-page">
    <header class="page-head">
      <h1>OPC 落户申请</h1>
      <p class="lead">填写企业信息与资质证明，提交后将进行审核（示例界面）。</p>
    </header>

    <div class="form-card">
      <Form
        ref="formRef"
        :model="formState"
        :rules="rules"
        layout="vertical"
      >
        <div class="grid-two">
          <Form.Item label="法人姓名" name="legalPersonName">
            <Input v-model:value="formState.legalPersonName" placeholder="请输入法人姓名" />
          </Form.Item>

          <Form.Item label="身份证号" name="idCardNumber">
            <Input v-model:value="formState.idCardNumber" placeholder="请输入身份证号" />
          </Form.Item>
        </div>

        <div class="grid-two">
          <Form.Item label="联系方式" name="phone">
            <Input v-model:value="formState.phone" placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item label="提交说明（示例）">
            <Input
              value="将用于审核联络；以实际后台规则为准。"
              placeholder=""
              disabled
            />
          </Form.Item>
        </div>

        <Form.Item label="经营范围说明" name="scopeDescription">
          <Input.TextArea
            v-model:value="formState.scopeDescription"
            placeholder="请填写企业经营范围、业务方向、主营服务或产品（越具体越好）"
            :auto-size="{ minRows: 4, maxRows: 8 }"
          />
        </Form.Item>

        <Form.Item label="企业资质证明（文件上传）" name="credentials">
          <Upload
            :before-upload="beforeUpload"
            :file-list="formState.credentials"
            :multiple="true"
            :max-count="5"
            accept=".pdf,.png,.jpg,.jpeg"
            @change="onUploadChange"
          >
            <Button icon>
              <UploadOutlined />
              选择文件
            </Button>
            <div class="upload-hint">
              支持 PDF / PNG / JPG；最多上传 5 份。示例仅做前端校验与展示，不会真正上传到服务器。
            </div>
          </Upload>
        </Form.Item>

        <div class="actions">
          <Button
            type="primary"
            @click="onSubmit"
            :loading="submitGuard.loading.value"
            :disabled="submitGuard.loading.value"
          >
            提交
          </Button>
        </div>
      </Form>
    </div>
  </section>
</template>

<style scoped>
.settlement-page {
  padding: 24px 20px 40px;
  max-width: 980px;
  margin: 0 auto;
}

.page-head h1 {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
}

.lead {
  margin: 0 0 18px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.form-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 16px 12px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.grid-two {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;
}

.upload-hint {
  margin-top: 8px;
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
}

@media (max-width: 640px) {
  .grid-two {
    grid-template-columns: 1fr;
  }
}
</style>
