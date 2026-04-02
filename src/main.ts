import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { seedDemoAuthIfEmpty } from "./composables/useOpcRegionDefaults";
import "ant-design-vue/dist/reset.css";
import "./style.css";

seedDemoAuthIfEmpty();

createApp(App).use(router).mount("#app");
