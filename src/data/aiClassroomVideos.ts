export interface AiClassroomVideoItem {
  id: string;
  category: "产品实战" | "提示词工程" | "RAG知识库" | "部署优化" | "运营增长";
  title: string;
  subtitle: string;
  duration: string;
  cover: string;
  videoUrl: string;
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
  },
  {
    id: "v2",
    category: "提示词工程",
    title: "Prompt 工程实战：让模型更稳定",
    subtitle: "提示词模板、评测标准与回归验证",
    duration: "22:06",
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80&auto=format&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "v3",
    category: "RAG知识库",
    title: "RAG 检索增强：知识库问答搭建",
    subtitle: "向量库、召回策略与答案可追溯",
    duration: "27:41",
    cover: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
  },
  {
    id: "v4",
    category: "部署优化",
    title: "模型部署与成本优化",
    subtitle: "推理性能、批处理与缓存策略",
    duration: "19:38",
    cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80&auto=format&fit=crop",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "v5",
    category: "运营增长",
    title: "AI 产品增长：从种子用户到裂变",
    subtitle: "用户画像、留存漏斗与增长实验",
    duration: "24:10",
    cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80&auto=format&fit=crop",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
];

