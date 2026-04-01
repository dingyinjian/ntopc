import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../pages/home/index.vue";
import OpcPolicyPage from "../pages/opc-policy/index.vue";
import OpcCommunityEventsPage from "../pages/opc-community-events/index.vue";
import OpcSettlementPage from "../pages/opc-settlement/index.vue";
import NewsPage from "../pages/news/index.vue";
import ComputeServicePage from "../pages/compute-service/index.vue";
import AgentPlazaPage from "../pages/agent-plaza/index.vue";
import DemandPlazaPage from "../pages/demand-plaza/index.vue";
import AiClassroomPage from "../pages/ai-classroom/index.vue";
import AiClassroomDetailPage from "../pages/ai-classroom/detail.vue";
import CommunityPage from "../pages/community/index.vue";
import ProfilePage from "../pages/profile/index.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomePage },
    { path: "/opc-policy", component: OpcPolicyPage },
    { path: "/opc-community-events", component: OpcCommunityEventsPage },
    { path: "/opc-settlement", component: OpcSettlementPage },
    { path: "/news", component: NewsPage },
    { path: "/compute-service", component: ComputeServicePage },
    { path: "/agent-plaza", component: AgentPlazaPage },
    { path: "/demand-plaza", component: DemandPlazaPage },
    { path: "/ai-classroom", component: AiClassroomPage },
    { path: "/ai-classroom/:id", component: AiClassroomDetailPage },
    { path: "/community", component: CommunityPage },
    { path: "/profile", component: ProfilePage },
  ],
});

export default router;
