export interface OpcCommunityEventItem {
  id: string;
  period: string;
  title: string;
  subtitle: string;
  address: string;
  summary: string;
  regionPath: string[];
}

export const OPC_COMMUNITY_EVENTS: OpcCommunityEventItem[] = [
  {
    id: "e1",
    period: "2026-04-12 ~ 2026-04-12 14:00-17:00",
    title: "南通 OPC 创业加速营（第一期）",
    subtitle: "聚焦 AI 应用落地与团队增长",
    address: "南通开发区 OPC 科创港 A1 路演厅",
    summary: "邀请投资人、技术导师与园区服务方现场答疑，涵盖融资准备、产品冷启动与政策申报。",
    regionPath: ["32", "3206", "320671"],
  },
  {
    id: "e2",
    period: "2026-04-18 ~ 2026-04-18 09:30-12:00",
    title: "通州湾算力资源对接会",
    subtitle: "企业算力采购与补贴政策专场",
    address: "南通通州湾 算力与数据服务基地 3F 会议室",
    summary: "面向模型训练与推理企业，解读算力券申领流程，并提供资源供应商一对一咨询。",
    regionPath: ["32", "3206", "320612"],
  },
  {
    id: "e6",
    period: "2026-04-15 ~ 2026-04-15 14:00-16:00",
    title: "崇川区 OPC 创业者茶话会",
    subtitle: "产品与融资轻量交流",
    address: "南通创新区 数字经济加速器 共享空间",
    summary: "面向早期团队，交流产品验证与首轮融资准备，园区服务专员现场答疑。",
    regionPath: ["32", "3206", "320613"],
  },
  {
    id: "e7",
    period: "2026-04-25 ~ 2026-04-25 09:00-11:30",
    title: "如皋市 企业数字化转型沙龙",
    subtitle: "制造与服务企业专场",
    address: "如皋软件园 OPC 企业服务站 路演厅",
    summary: "分享数字化改造案例与补贴政策，提供服务商对接与诊断预约。",
    regionPath: ["32", "3206", "320682"],
  },
  {
    id: "e8",
    period: "2026-05-15 ~ 2026-05-15 13:30-17:00",
    title: "南通 OPC 社区季度开放日",
    subtitle: "全市企业均可报名",
    address: "南通市 OPC 服务中心（具体场地以短信通知为准）",
    summary: "政策解读、资源对接与社区伙伴展示，适合首次了解 OPC 的企业与团队。",
    regionPath: ["32", "3206"],
  },
  {
    id: "e9",
    period: "2026-05-03 ~ 2026-05-03 14:00-17:00",
    title: "启东沿海产业对接交流会",
    subtitle: "海洋装备与新能源主题",
    address: "启东沿海科创园 会议中心",
    summary: "产业链上下游企业对接与政策咨询，含园区参观与交流晚宴（示例）。",
    regionPath: ["32", "3206", "320681"],
  },
  {
    id: "e10",
    period: "2026-05-10 ~ 2026-05-10 10:00-12:00",
    title: "海安高新区 智能制造路演日",
    subtitle: "技改与工业互联网案例分享",
    address: "海安高新区 展示中心",
    summary: "本地制造企业路演与需求发布，技术服务商现场对接。",
    regionPath: ["32", "3206", "320685"],
  },
  {
    id: "e3",
    period: "2026-04-22 ~ 2026-04-22 13:30-16:30",
    title: "杭州 OPC 社区产品增长沙龙",
    subtitle: "从 0 到 1 的用户增长实践",
    address: "杭州未来科技城 OPC 产业园 多功能厅",
    summary: "分享早期产品增长方法与运营案例，适合初创团队市场负责人参加。",
    regionPath: ["33", "3301"],
  },
  {
    id: "e4",
    period: "2026-04-28 ~ 2026-04-28 19:00-21:00",
    title: "深圳硬科技项目路演夜",
    subtitle: "投资人闭门反馈会",
    address: "深圳南山科创园 B2 路演空间",
    summary: "精选 8 个硬科技项目进行路演，提供投资人反馈及后续对接机会。",
    regionPath: ["44", "4403"],
  },
  {
    id: "e5",
    period: "2026-05-08 ~ 2026-05-08 10:00-12:00",
    title: "上海张江产业政策解读会",
    subtitle: "创业团队政策红利导航",
    address: "上海张江科学城 创新中心报告厅",
    summary: "围绕产业政策、人才政策、研发补贴与税收优惠进行集中解读。",
    regionPath: ["31", "310115"],
  },
];

