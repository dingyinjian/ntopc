import { computed, ref } from "vue";

export type SubmitGuardOptions = {
  /** 提交锁释放的最短间隔（防抖/防连点），默认 800ms */
  minIntervalMs?: number;
};

/**
 * 全局复用：提交加载 + 防重复提交（防抖/锁）
 * - `run(fn)`：包裹异步提交逻辑，自动维护 loading 与防连点
 */
export function useSubmitGuard(options: SubmitGuardOptions = {}) {
  const minIntervalMs = options.minIntervalMs ?? 800;
  const loading = ref(false);
  const lastStartedAt = ref(0);

  const canSubmit = computed(() => !loading.value);

  async function run<T>(fn: () => Promise<T>): Promise<T | undefined> {
    const now = Date.now();
    if (loading.value) return undefined;
    if (now - lastStartedAt.value < minIntervalMs) return undefined;

    lastStartedAt.value = now;
    loading.value = true;
    try {
      return await fn();
    } finally {
      loading.value = false;
    }
  }

  return { loading, canSubmit, run };
}

