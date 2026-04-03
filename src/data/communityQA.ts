export interface CommunityAttachment {
  name: string;
  /** data URL 或占位说明（本地演示） */
  url: string;
}

export interface CommunityQuestion {
  id: string;
  title: string;
  /** 问题正文 */
  content: string;
  authorName: string;
  /** 登录用户发布时记录手机号，用于「我的发布」筛选 */
  authorPhone?: string;
  attachments?: CommunityAttachment[];
  createdAt: string;
}

export interface CommunityAnswer {
  id: string;
  questionId: string;
  content: string;
  authorName: string;
  createdAt: string;
}

/** 首次访问无本地数据时使用 */
export const COMMUNITY_QA_SEED: { questions: CommunityQuestion[]; answers: CommunityAnswer[] } = {
  questions: [
    {
      id: "seed-q1",
      title: "OPC 入驻后算力券一般多久能申请下来？",
      content:
        "我们团队准备下个月入驻园区，想提前了解算力券从提交材料到批复大概要几周？有没有加急通道或常见补材料情况？",
      authorName: "李**",
      createdAt: "2026-03-28T10:20:00.000Z",
    },
    {
      id: "seed-q2",
      title: "企业知识库做 RAG，文档切分粒度大家怎么选？",
      content:
        "目前按章节切分召回还行，但长表格和 FAQ 混排时经常串上下文，想听听各位是按段落、按 token 还是按语义块切的？",
      authorName: "王**",
      createdAt: "2026-03-30T08:15:00.000Z",
    },
  ],
  answers: [
    {
      id: "seed-a1",
      questionId: "seed-q1",
      content:
        "我们当时大概两周多批复，补过一次场地证明。建议提前和园区运营对齐材料清单，避免来回改。（示例回复）",
      authorName: "周**",
      createdAt: "2026-03-28T14:00:00.000Z",
    },
    {
      id: "seed-a2",
      questionId: "seed-q1",
      content: "加急一般要走书面说明，具体以园区当期规则为准。（示例）",
      authorName: "游客",
      createdAt: "2026-03-29T09:30:00.000Z",
    },
    {
      id: "seed-a3",
      questionId: "seed-q2",
      content: "表格我单独拆成小块 + 表头重复进 chunk，FAQ 用一问一答一条，效果会稳一些。（示例）",
      authorName: "陈**",
      createdAt: "2026-03-30T11:00:00.000Z",
    },
  ],
};
