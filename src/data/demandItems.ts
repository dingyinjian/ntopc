export type DemandCategory = "AI开发" | "UI设计" | "短视频制作" | "数据标注" | "运营增长";

export interface DemandItem {
  id: string;
  category: DemandCategory;
  title: string;
  subtitle: string;
  location: string;
  price: string;
  deadline: string;
  contact: string;
}

export const DEMAND_CATEGORIES: Array<{ label: string; value: DemandCategory | "全部" }> = [
  { label: "全部", value: "全部" },
  { label: "AI开发", value: "AI开发" },
  { label: "UI设计", value: "UI设计" },
  { label: "短视频制作", value: "短视频制作" },
  { label: "数据标注", value: "数据标注" },
  { label: "运营增长", value: "运营增长" },
];

export const DEMAND_LIST: DemandItem[] = [
  {
    id: "d1",
    category: "AI开发",
    title: "企业知识库问答助手开发",
    subtitle: "接入企业文档，支持多轮问答与权限控制",
    location: "杭州（线上/线下）",
    price: "¥12,000 - ¥20,000",
    deadline: "2026-04-20",
    contact: "王经理 138****1024",
  },
  {
    id: "d2",
    category: "UI设计",
    title: "SaaS后台管理系统重设计",
    subtitle: "需交付高保真原型与设计规范文档",
    location: "上海（线上）",
    price: "¥6,000 - ¥10,000",
    deadline: "2026-04-16",
    contact: "刘女士 137****8890",
  },
  {
    id: "d3",
    category: "短视频制作",
    title: "AI产品宣传短视频",
    subtitle: "30 秒产品介绍视频，含脚本与配音",
    location: "广州（线上/线下）",
    price: "¥3,000 / 条",
    deadline: "2026-04-10",
    contact: "陈老师 159****6203",
  },
  {
    id: "d4",
    category: "数据标注",
    title: "多模态训练数据清洗与标注",
    subtitle: "图文数据分类、质检与格式化导出",
    location: "北京（线上）",
    price: "¥0.18 / 条起",
    deadline: "2026-04-28",
    contact: "周工 186****4311",
  },
  {
    id: "d5",
    category: "运营增长",
    title: "AI应用社区冷启动运营",
    subtitle: "负责内容节奏、活动策划与私域增长",
    location: "深圳（线下）",
    price: "¥8,000 / 月",
    deadline: "2026-04-18",
    contact: "赵女士 135****7751",
  },
];

