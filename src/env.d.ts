/// <reference types="vite/client" />

/** 与 `vite/client` 中的 `ImportMetaEnv` 做声明合并，仅补充本项目用到的变量 */
interface ImportMetaEnv {
  /** 高德 Web 服务 Key（IP 定位、静态地图等），未配置时多为 `undefined` */
  readonly VITE_AMAP_IP_KEY?: string;
  /** 设为 `"false"` 时跳过演示账号种子，见 `seedDemoAuthIfEmpty` */
  readonly VITE_DEMO_LOGIN?: string;
  /** 可选：请求签名等，见 `utils/request.ts` */
  readonly VITE_API_SIGNATURE_SECRET?: string;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}
