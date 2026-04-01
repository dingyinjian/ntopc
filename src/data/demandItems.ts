export type DemandCategory = "AI开发" | "UI设计" | "短视频制作" | "数据标注" | "运营增长";

export interface DemandItem {
  id: string;
  category: DemandCategory;
  title: string;
  subtitle: string;
  /** 具体需求说明（多行） */
  details: string;
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
    details:
      "【背景】内部文档分散在网盘与邮件中，检索效率低，希望建设统一问答入口。\n【功能】支持上传 PDF/Word，按部门做权限隔离；多轮对话需带引用片段；可对接企业微信单点登录。\n【交付】源码与部署文档、2 周试运行期内的缺陷修复；需提供简单管理后台配置知识库与成员。\n【验收】提供 50 条以内测试问答集，准确率与响应时延需达到双方书面约定指标。",
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
    details:
      "【范围】约 40+ 页面，含列表、表单、仪表盘与权限配置模块；需适配 1440 为主、兼容 1280。\n【交付物】Figma 高保真、组件库与命名规范、切图标注说明；关键流程需可点击原型。\n【品牌】已有主色与 Logo，需在此基础上统一圆角、间距与空状态插画风格。\n【时间】分两期：一期核心流程定稿，二期扩展页面与深色模式（可选）。",
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
    details:
      "【时长】30 秒竖版，用于抖音/视频号信息流投放。\n【内容】突出「谁在用、解决什么问题、一键体验」；需我方提供产品录屏素材，你方负责脚本、分镜、配音与字幕。\n【风格】科技感、偏 B 端，避免过度娱乐化；结尾带行动号召与品牌尾版。\n【修改】包含 2 轮合理修改；成片交付 1080p 与压缩版各一版。",
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
    details:
      "【数据量】首期约 2 万条图文对，后续可能按月增量。\n【标注】多级分类、实体框选与简短描述；需按我方提供的标注手册执行，争议样本走仲裁流程。\n【质检】双人抽检比例不低于 10%，错误率需低于约定阈值方可结算。\n【格式】导出为 JSONL，字段定义与样例在合同附件中约定。",
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
    details:
      "【目标】3 个月内社群规模与周活跃达到双方书面 KPI；以开发者与产品经理为主力人群。\n【工作】周更内容选题、每月至少 1 场线上活动、私域社群日常答疑与裂变海报。\n【协作】需与我方产品与市场对齐节奏；数据周报需含新增、活跃、转化漏斗。\n【驻场】希望每周 2 天深圳现场，其余远程；差旅另议。",
    location: "深圳（线下）",
    price: "¥8,000 / 月",
    deadline: "2026-04-18",
    contact: "赵女士 135****7751",
  },
];

