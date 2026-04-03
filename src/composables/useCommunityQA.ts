import { ref } from "vue";
import type { CommunityAnswer, CommunityQuestion } from "../data/communityQA";
import { COMMUNITY_QA_SEED } from "../data/communityQA";
import { readStoredAuth } from "./useOpcRegionDefaults";

const STORAGE_KEY = "weopc_community_qa";

function maskPhone(phone: string): string {
  const p = phone.trim();
  if (p.length >= 11) return `${p.slice(0, 3)}****${p.slice(-4)}`;
  return p || "用户";
}

function currentAuthorName(): string {
  const auth = readStoredAuth();
  if (auth?.phone) return maskPhone(auth.phone);
  return "游客";
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function loadFromStorage(): { questions: CommunityQuestion[]; answers: CommunityAnswer[] } {
  if (typeof localStorage === "undefined") {
    return { questions: [...COMMUNITY_QA_SEED.questions], answers: [...COMMUNITY_QA_SEED.answers] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = {
        questions: [...COMMUNITY_QA_SEED.questions],
        answers: [...COMMUNITY_QA_SEED.answers],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const o = JSON.parse(raw) as { questions?: CommunityQuestion[]; answers?: CommunityAnswer[] };
    const questions = Array.isArray(o.questions) ? o.questions : [];
    const answers = Array.isArray(o.answers) ? o.answers : [];
    if (questions.length === 0) {
      const initial = {
        questions: [...COMMUNITY_QA_SEED.questions],
        answers: [...COMMUNITY_QA_SEED.answers],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return { questions, answers };
  } catch {
    return { questions: [...COMMUNITY_QA_SEED.questions], answers: [...COMMUNITY_QA_SEED.answers] };
  }
}

function persist(questions: CommunityQuestion[], answers: CommunityAnswer[]) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ questions, answers }));
  } catch {
    /* ignore */
  }
}

const questions = ref<CommunityQuestion[]>([]);
const answers = ref<CommunityAnswer[]>([]);
let loaded = false;

function ensureLoaded() {
  if (loaded) return;
  const data = loadFromStorage();
  questions.value = data.questions;
  answers.value = data.answers;
  loaded = true;
}

export function useCommunityQA() {
  ensureLoaded();

  function addQuestion(title: string, content: string, attachments?: { name: string; url: string }[]) {
    const t = title.trim();
    const c = content.trim();
    if (!t || !c) return;
    const auth = readStoredAuth();
    const atts =
      attachments?.filter((x) => x.name && x.url).map((x) => ({ name: x.name, url: x.url })) ?? [];
    const q: CommunityQuestion = {
      id: genId("q"),
      title: t,
      content: c,
      authorName: currentAuthorName(),
      authorPhone: auth?.phone,
      attachments: atts.length ? atts : undefined,
      createdAt: new Date().toISOString(),
    };
    questions.value = [q, ...questions.value];
    persist(questions.value, answers.value);
  }

  function addAnswer(questionId: string, content: string) {
    const c = content.trim();
    if (!c) return;
    const a: CommunityAnswer = {
      id: genId("a"),
      questionId,
      content: c,
      authorName: currentAuthorName(),
      createdAt: new Date().toISOString(),
    };
    answers.value = [...answers.value, a];
    persist(questions.value, answers.value);
  }

  function answerCountFor(questionId: string): number {
    return answers.value.filter((x) => x.questionId === questionId).length;
  }

  function answersForQuestion(questionId: string): CommunityAnswer[] {
    return answers.value
      .filter((x) => x.questionId === questionId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  return {
    questions,
    answers,
    addQuestion,
    addAnswer,
    answerCountFor,
    answersForQuestion,
  };
}
