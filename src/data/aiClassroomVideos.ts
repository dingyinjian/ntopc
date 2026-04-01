export interface AiClassroomVideoItem {
  id: string;
  category: "产品实战" | "提示词工程" | "RAG知识库" | "部署优化" | "运营增长";
  title: string;
  subtitle: string;
  duration: string;
  cover: string;
  videoUrl: string;
  /** 课程简介 */
  introduction: string;
  /** 课程大纲（按章节顺序） */
  outline: string[];
  /** 核心知识点 */
  corePoints: string[];
}

export function getAiClassroomVideoById(id: string): AiClassroomVideoItem | undefined {
  return AI_CLASSROOM_VIDEOS.find((v) => v.id === id);
}

export const AI_CLASSROOM_VIDEOS: AiClassroomVideoItem[] = [
  {
    id: "v1",
    category: "产品实战",
    title: "AI 应用从 0 到 1：需求拆解方法",
    subtitle: "讲解项目立项、场景拆解与MVP优先级",
    duration: "18:24",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    introduction:
      "本课面向准备落地 AI 产品的同学，从业务问题出发，讲解如何把模糊需求拆成可验证的里程碑。你将学到用户访谈要点、场景边界划分、以及如何用最小成本验证「值不值得做」。课程结合虚构案例演示，便于对照自己的项目套用。",
    outline: [
      "课程导学与 AI 产品常见失败原因",
      "从业务目标到用户故事：需求澄清清单",
      "场景拆解：边界、输入输出与成功指标",
      "MVP 范围与优先级：价值—成本矩阵",
      "小结：输出一份可评审的需求一页纸",
    ],
    corePoints: [
      "需求澄清 vs 功能清单",
      "场景边界与用户故事",
      "MVP 与价值验证",
      "可量化成功指标",
    ],
  },
  {
    id: "v2",
    category: "提示词工程",
    title: "Prompt 工程实战：让模型更稳定",
    subtitle: "提示词模板、评测标准与回归验证",
    duration: "22:06",
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80&auto=format&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    introduction:
      "大模型输出不稳定，往往与提示结构、示例质量、约束条件有关。本课系统介绍提示词模板设计、少样本示例选择、以及如何用小型评测集做回归，让迭代有据可依。适合已在业务中接入文本生成类能力的开发者与产品经理。",
    outline: [
      "提示工程在落地流程中的位置",
      "角色—任务—格式—约束：模板四层结构",
      "少样本与思维链：何时用、如何用",
      "构建评测集与打分规则",
      "版本管理与回归：避免「改好 A 坏了 B」",
    ],
    corePoints: [
      "提示模板结构化",
      "少样本与 CoT 取舍",
      "评测集与打分维度",
      "提示版本回归",
    ],
  },
  {
    id: "v3",
    category: "RAG知识库",
    title: "RAG 检索增强：知识库问答搭建",
    subtitle: "向量库、召回策略与答案可追溯",
    duration: "27:41",
    cover: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
    introduction:
      "企业知识分散在文档与系统中，RAG 是常见解法。本课从文档切分、向量化、召回到生成串起来讲，并强调「答案可追溯」与幻觉控制的基本策略。学完后你能画出自己业务的一套 RAG 架构草图，并知道各环节常见坑点。",
    outline: [
      "RAG 适用场景与局限",
      "文档预处理：切分粒度与元数据",
      "向量库与混合检索（关键词 + 向量）",
      "重排序与上下文拼装",
      "引用片段与拒答策略",
    ],
    corePoints: [
      "切分与 chunk 策略",
      "向量召回与混合检索",
      "rerank 与上下文长度",
      "可追溯引用与拒答",
    ],
  },
  {
    id: "v4",
    category: "部署优化",
    title: "模型部署与成本优化",
    subtitle: "推理性能、批处理与缓存策略",
    duration: "19:38",
    cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80&auto=format&fit=crop",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    introduction:
      "推理延迟与成本是上线后的长期课题。本课介绍批处理、动态批、KV 缓存、量化与弹性扩缩等常见手段，并讨论如何结合监控指标做取舍。适合已有模型服务、希望系统性降本增效的工程同学。",
    outline: [
      "推理链路瓶颈分析",
      "批处理与动态 batch",
      "KV cache 与长上下文",
      "量化与精度权衡",
      "缓存、限流与弹性伸缩",
    ],
    corePoints: [
      "吞吐与延迟权衡",
      "动态批与排队",
      "KV cache 优化",
      "量化 INT8/FP16",
      "结果缓存与降级",
    ],
  },
  {
    id: "v5",
    category: "运营增长",
    title: "AI 产品增长：从种子用户到裂变",
    subtitle: "用户画像、留存漏斗与增长实验",
    duration: "24:10",
    cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    introduction:
      "AI 产品不仅要「好用」，还要「有人用」。本课围绕种子用户获取、激活与留存、以及可复用的增长实验方法展开，帮助你在资源有限时找到可放大的增长杠杆。内容偏方法论，可与自家数据面板对照实践。",
    outline: [
      "AI 产品增长与工具类产品的异同",
      "种子用户与渠道验证",
      "激活与留存：漏斗与分群",
      "增长实验：假设—指标—样本量",
      "裂变与激励的合规边界提示",
    ],
    corePoints: [
      "种子用户与 PMF",
      "留存漏斗分析",
      "A/B 与实验设计",
      "增长杠杆与渠道",
    ],
  },
];
