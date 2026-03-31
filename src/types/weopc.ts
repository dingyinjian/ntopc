export type Stat = { label: string; value: string };
export type Service = { title: string; desc: string };
export type WeopcData = {
  meta: { title: string; subtitle: string; description: string };
  navs: string[];
  stats: Stat[];
  services: Service[];
  cta: { title: string; desc: string; button: string };
};

export type NavItem = {
  label: string;
  path: string;
};

export const navItems: NavItem[] = [
  { label: "首页", path: "/" },
  { label: "OPC政策", path: "/opc-policy" },
  { label: "OPC社区活动", path: "/opc-community-events" },
  { label: "OPC落户", path: "/opc-settlement" },
  { label: "新闻资讯", path: "/news" },
  { label: "算力服务", path: "/compute-service" },
  { label: "Agent广场", path: "/agent-plaza" },
  { label: "需求广场", path: "/demand-plaza" },
  { label: "AI课堂", path: "/ai-classroom" },
  { label: "交流社区", path: "/community" },
  { label: "个人中心", path: "/profile" },
];

export const defaultHomeData: WeopcData = {
  meta: {
    title: "WeOPC",
    subtitle: "全国一站式OPC服务平台",
    description: "为新一代AI创业者提供工位、算力、资金、政策等全周期创业支持",
  },
  navs: [
    ...navItems.map((item) => item.label),
  ],
  stats: [
    { value: "43", label: "政策支持" },
    { value: "90", label: "社区活动" },
    { value: "5,128", label: "成功落户企业" },
    { value: "300+", label: "算力服务" },
  ],
  services: [
    {
      title: "免费工位与政策红利",
      desc: "覆盖全国多个OPC社区，提供零成本办公空间和政策补贴",
    },
    {
      title: "算力支持与AI工具",
      desc: "最高1000万算力券补贴，免费使用主流AI开发工具",
    },
    {
      title: "订单市场与资源对接",
      desc: "连接300+生态伙伴，获取AI漫剧、开发、设计等订单",
    },
    {
      title: "全周期创业服务",
      desc: "从注册到成长，WeOPC为您提供一站式支持",
    },
  ],
  cta: {
    title: "准备好开启您的OPC之旅了吗？",
    desc: "加入WeOPC，享受政策红利、算力支持、订单对接等全周期创业服务",
    button: "立即免费注册",
  },
};
