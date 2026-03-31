export type NewsCategory = "政策解读" | "产业动态" | "AI前沿" | "园区快讯" | "媒体报道";

export interface NewsItem {
  id: string;
  category: NewsCategory;
  source: string;
  title: string;
  summary: string;
  time: string;
  content: string;
}

export const NEWS_CATEGORIES: Array<{ label: string; value: NewsCategory | "全部" }> = [
  { label: "全部", value: "全部" },
  { label: "政策解读", value: "政策解读" },
  { label: "产业动态", value: "产业动态" },
  { label: "AI前沿", value: "AI前沿" },
  { label: "园区快讯", value: "园区快讯" },
  { label: "媒体报道", value: "媒体报道" },
];

export const NEWS_LIST: NewsItem[] = [
  {
    id: "n1",
    category: "媒体报道",
    source: "央视网",
    title: "多地推出创业扶持新举措，产业园区加速集聚创新要素",
    summary: "围绕场地、资金、算力与人才服务，多地出台组合政策，降低初创企业综合成本。",
    time: "2026-03-22 09:10",
    content:
      "（静态示例内容）\n\n- 重点方向：数字经济、先进制造、AI应用\n- 支持方式：租金减免、算力券、投融资对接\n- 申请建议：提前准备项目计划书与团队材料\n\n提示：此处为 demo 内容，后续可替换为后端接口返回的正文。",
  },
  {
    id: "n2",
    category: "AI前沿",
    source: "澎湃新闻",
    title: "大模型应用进入工程化阶段，企业更关注可控成本与安全合规",
    summary: "从“能跑”到“能用”，AI落地正在向可观测、可治理与可持续的工程化体系演进。",
    time: "2026-03-24 14:35",
    content:
      "（静态示例内容）\n\n工程化关注点：\n1) 成本：推理优化、缓存、弹性伸缩\n2) 安全：权限隔离、数据脱敏、审计\n3) 质量：评测体系、灰度发布、回滚机制",
  },
  {
    id: "n3",
    category: "政策解读",
    source: "园区发布（示例）",
    title: "算力券申领指南：适用对象、额度规则与常见材料清单",
    summary: "以企业类型与业务规模为基准，按月/季度核算，明确申领材料与审核口径。",
    time: "2026-03-26 10:00",
    content:
      "（静态示例内容）\n\n- 适用对象：符合条件的科技型中小企业\n- 关键材料：营业执照、项目说明、用量证明\n- 常见问题：额度结算周期、可用范围、异常处理",
  },
  {
    id: "n4",
    category: "产业动态",
    source: "新华财经（示例）",
    title: "产业链协同加速：从单点创新到生态共建的新阶段",
    summary: "更多园区以“产业链+场景”组织创新，推动上下游与服务机构协同。",
    time: "2026-03-28 08:20",
    content:
      "（静态示例内容）\n\n生态共建常见抓手：\n- 场景开放\n- 联合实验室\n- 供应链金融\n- 标准与合规服务",
  },
  {
    id: "n5",
    category: "园区快讯",
    source: "南通社区公告（示例）",
    title: "南通 OPC 社区活动日程发布：路演、政策解读与资源对接",
    summary: "本月将举办多场活动，覆盖融资路演、算力资源对接与企业合规分享。",
    time: "2026-03-30 16:05",
    content:
      "（静态示例内容）\n\n活动安排：\n- 创业加速营\n- 算力资源对接会\n- 政策申报辅导专场\n\n报名方式：请在活动页提交报名表单。",
  },
];

