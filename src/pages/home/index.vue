<script setup lang="ts">
import { ref } from "vue";
import HomeContent from "../../components/HomeContent.vue";
import { defaultHomeData, type WeopcData } from "../../types/weopc";
import { http } from "../../utils/request";

const data = ref<WeopcData>(defaultHomeData);

async function tryFetchFromApi() {
  try {
    const res = await http.get("/api/weopc/home/", { timeout: 5000 });
    const remote = res.data?.data as WeopcData | undefined;
    if (remote && typeof remote === "object") {
      data.value = remote;
    }
  } catch {
    // Keep default homepage data when backend is unavailable.
  }
}

void tryFetchFromApi();
</script>

<template>
  <HomeContent :data="data" />
</template>
