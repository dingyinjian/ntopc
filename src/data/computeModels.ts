export type BillingType = "按量计费" | "按次计费";
export type ModelKind = "VLM模型" | "大语言模型";

export interface ComputeModelItem {
  id: string;
  name: string;
  avatar: string;
  inputPrice: number;
  completionPrice: number;
  billingType: BillingType;
  modelType: ModelKind;
}

export const COMPUTE_MODELS: ComputeModelItem[] = [
  {
    id: "m1",
    name: "qwen3-vl-30b-a3b-instruct-fp8",
    avatar: "QV",
    inputPrice: 0.0019,
    completionPrice: 0.0052,
    billingType: "按量计费",
    modelType: "VLM模型",
  },
  {
    id: "m2",
    name: "qwen3.5-122b-a10b-fp8",
    avatar: "Q3",
    inputPrice: 0.0068,
    completionPrice: 0.0199,
    billingType: "按次计费",
    modelType: "大语言模型",
  },
];

