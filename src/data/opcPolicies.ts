/** 政策卡片：regionPath 与 element-china-area-data 的 Cascader value 一致 */
export interface OpcPolicyItem {
  id: string;
  parkName: string;
  summary: string;
  details?: string;
  highlights: string[];
  contact?: string;
  sourceName?: string;
  sourceUrl?: string;
  /** 省→市→区 或 省→区（直辖市） */
  regionPath: string[];
}

export const OPC_POLICIES: OpcPolicyItem[] = [
  {
    id: "p1",
    parkName: "杭州未来科技城 OPC 产业园",
    summary:
      "面向人工智能与智能制造初创团队，提供三年场地与算力补贴，配套法务与投融资对接。",
    details:
      "支持对象：初创团队/中小企业（以材料审核为准）。\n支持方式：场地补贴、算力券、投融资对接。\n申报周期：滚动受理，季度评审。",
    highlights: ["免费工位", "创业投资", "算力支持", "法务咨询"],
    sourceName: "园区政策公示（示例）",
    sourceUrl: "https://example.com/policy/p1",
    regionPath: ["33", "3301", "330110"],
  },
  {
    id: "p2",
    parkName: "深圳南山科创园",
    summary: "聚焦硬科技与出海企业，联合头部基金设立专项种子轮，工位与云资源可按团队规模弹性配置。",
    details:
      "支持对象：硬科技/出海企业。\n支持方式：种子轮对接、工位补贴、云资源优惠。\n备注：以入驻协议与园区最新公告为准。",
    highlights: ["免费工位", "创业投资", "出海服务"],
    sourceName: "政策来源链接（示例）",
    sourceUrl: "https://example.com/policy/p2",
    regionPath: ["44", "4403", "440305"],
  },
  {
    id: "p3",
    parkName: "中关村软件园二期",
    summary: "国家级孵化器配套，对符合条件企业给予房租减免与算力券，定期举办产业对接会。",
    highlights: ["算力支持", "房租减免", "产业对接"],
    regionPath: ["11", "110108"],
  },
  {
    id: "p4",
    parkName: "广州琶洲互联网创新集聚区",
    summary: "数字经济企业专项政策，提供联合办公、投融资路演与数据合规指导。",
    highlights: ["免费工位", "投融资路演", "数据合规"],
    regionPath: ["44", "4401", "440106"],
  },
  {
    id: "p5",
    parkName: "成都天府软件园",
    summary: "游戏与文创＋科技企业双赛道扶持，算力与渲染农场资源向中小团队倾斜。",
    highlights: ["算力支持", "渲染资源", "文创扶持"],
    regionPath: ["51", "5101", "510116"],
  },
  {
    id: "p6",
    parkName: "上海张江科学城",
    summary: "生物医药与集成电路方向优先，提供实验场地协调与多轮次跟投融资。",
    highlights: ["创业投资", "实验场地", "跟投融资"],
    regionPath: ["31", "310115"],
  },
  {
    id: "p7",
    parkName: "北京中关村东城数字港",
    summary: "面向智能应用与产业软件企业，提供合规辅导与投融资路演对接服务。",
    highlights: ["免费工位", "投融资路演", "法务咨询"],
    regionPath: ["11", "110101"],
  },
  {
    id: "p8",
    parkName: "杭州上城数字经济园",
    summary: "聚焦数字经济与AI应用，提供算力券与税费减免建议，降低企业初期成本。",
    highlights: ["算力支持", "税费减免", "场地支持"],
    regionPath: ["33", "3301", "330102"],
  },
  {
    id: "p9",
    parkName: "上海徐汇智造中心",
    summary: "支持智能硬件与研发型企业，提供成果转化服务与多渠道创业支持。",
    highlights: ["创业投资", "合规指导", "专家对接"],
    regionPath: ["31", "310104"],
  },
  {
    id: "p10",
    parkName: "张江软件智谷（浦东）",
    summary: "针对软件与集成电路方向，提供专项算力资源与跟投融资通道。",
    highlights: ["算力支持", "跟投融资", "创业辅导"],
    regionPath: ["31", "310115"],
  },
  {
    id: "p11",
    parkName: "成都龙泉驿科创走廊",
    summary: "面向制造业数字化转型企业，提供场地扶持与创业投资配套政策。",
    highlights: ["创业投资", "产业扶持", "场地扶持"],
    regionPath: ["51", "5101", "510112"],
  },
  {
    id: "p12",
    parkName: "西安电子城创新园",
    summary: "聚焦硬科技与软件生态企业，提供算力补贴与房租减免支持。",
    highlights: ["算力支持", "房租减免", "产业对接"],
    regionPath: ["61", "6101", "610113"],
  },
  {
    id: "p13",
    parkName: "深圳福田湾区算力港",
    summary: "面向高成长企业，提供创业投资引入与工程化服务支持。",
    highlights: ["创业投资", "算力支持", "工程化服务"],
    regionPath: ["44", "4403", "440304"],
  },
  {
    id: "p14",
    parkName: "广州海珠数智创新基地",
    summary: "支持数据要素与互联网创新，提供联合办公与投融资路演资源。",
    highlights: ["免费工位", "投融资路演", "数据合规"],
    regionPath: ["44", "4401", "440105"],
  },
  {
    id: "p15",
    parkName: "南通开发区 OPC 科创港",
    summary: "面向先进制造与产业互联网企业，提供场地减免、设备共享与产学研对接服务。",
    details:
      "支持对象：先进制造、产业互联网企业。\n支持方式：租金减免、公共设备共享、产学研协同对接。\n申报材料：营业执照、项目计划书、团队说明等（示例）。",
    highlights: ["场地支持", "设备共享", "产业对接"],
    sourceName: "南通开发区政策公告（示例）",
    sourceUrl: "https://example.com/policy/nt-01",
    regionPath: ["32", "3206"],
  },
  {
    id: "p16",
    parkName: "南通创新区 数字经济加速器",
    summary: "支持AI应用与软件企业，提供算力券、研发补贴及创业辅导资源。",
    details:
      "支持对象：软件与AI应用企业。\n支持方式：算力券、研发补贴、导师辅导。\n兑现方式：按季度核算（示例）。",
    highlights: ["算力支持", "研发补贴", "创业辅导"],
    sourceName: "南通创新区公示（示例）",
    sourceUrl: "https://example.com/policy/nt-02",
    regionPath: ["32", "3206"],
  },
  {
    id: "p17",
    parkName: "南通高新技术产业园 OPC 孵化基地",
    summary: "为初创团队提供联合办公与人才服务，按成长阶段匹配投融资与政策申报辅导。",
    details:
      "支持对象：初创团队。\n支持方式：联合办公、人才服务、政策申报辅导。\n投融资：对接园区合作基金（示例）。",
    highlights: ["免费工位", "创业投资", "政策申报"],
    sourceName: "南通高新区通知（示例）",
    sourceUrl: "https://example.com/policy/nt-03",
    regionPath: ["32", "3206"],
  },
  {
    id: "p18",
    parkName: "南通滨江科创中心",
    summary: "聚焦绿色低碳与新材料方向，提供检验检测资源对接与产业链上下游协同机会。",
    details:
      "支持对象：绿色低碳、新材料企业。\n支持方式：检验检测资源对接、产业链协同、活动路演。\n备注：按园区活动排期参与（示例）。",
    highlights: ["检验检测", "产业协同", "绿色低碳"],
    sourceName: "滨江科创中心政策（示例）",
    sourceUrl: "https://example.com/policy/nt-04",
    regionPath: ["32", "3206"],
  },
  {
    id: "p19",
    parkName: "南通通州湾 算力与数据服务基地",
    summary: "面向数据密集型业务，提供算力支持、云资源优惠与安全合规咨询服务。",
    details:
      "支持对象：数据密集型业务（AI训练/推理、渲染、数据处理）。\n支持方式：算力补贴、云资源优惠、安全合规咨询。\n注意：合规要求与资源额度以最新公告为准（示例）。",
    highlights: ["算力支持", "云资源优惠", "数据合规"],
    sourceName: "通州湾政策来源（示例）",
    sourceUrl: "https://example.com/policy/nt-05",
    regionPath: ["32", "3206"],
  },
];
