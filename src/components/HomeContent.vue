<script setup lang="ts">
import { computed } from "vue";
import {
  BankOutlined,
  FireOutlined,
  GiftOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons-vue";
import type { WeopcData } from "../types/weopc";

type BadgeTone = "green" | "blue" | "pink" | "orange";
const serviceBadges: Array<{ icon: object; tone: BadgeTone }> = [
  { icon: GiftOutlined, tone: "green" },
  { icon: ThunderboltOutlined, tone: "blue" },
  { icon: BankOutlined, tone: "pink" },
  { icon: FireOutlined, tone: "orange" },
];

const props = defineProps<{
  data: WeopcData;
}>();

const servicesWithBadge = computed(() =>
  props.data.services.map((item, index) => ({
    ...item,
    badge: serviceBadges[index % serviceBadges.length],
  }))
);
</script>

<template>
  <main id="home-content" class="content">
    <section id="hero" class="hero">
      <div class="hero-main">
        <span class="hero-tag">WeOPC</span>
        <h1>{{ data.meta.title }}</h1>
        <h2>{{ data.meta.subtitle }}</h2>
        <p>{{ data.meta.description }}</p>
      </div>
      <aside class="hero-side">
        <p class="hero-side-label">平台速览</p>
        <div class="hero-side-grid">
          <article class="hero-metric" v-for="item in data.stats" :key="item.label">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </article>
        </div>
      </aside>
    </section>

    <section id="stats" class="stats">
      <article class="stat-card" v-for="item in data.stats" :key="item.label">
        <strong>{{ item.value }}</strong>
        <span>{{ item.label }}</span>
      </article>
    </section>

    <section id="services" class="services">
      <div class="services-head">
        <h3>全周期创业服务</h3>
        <p>从注册到成长，WeOPC为您提供一站式支持</p>
      </div>
      <div class="service-grid">
        <article class="service-card" v-for="item in servicesWithBadge" :key="item.title">
          <span class="service-icon" :class="`is-${item.badge.tone}`">
            <component :is="item.badge.icon" />
          </span>
          <h4>{{ item.title }}</h4>
          <p>{{ item.desc }}</p>
        </article>
      </div>
    </section>

    <section id="cta" class="cta">
      <div class="cta-inner">
        <div class="cta-copy">
          <h3>{{ data.cta.title }}</h3>
          <p>{{ data.cta.desc }}</p>
        </div>
        <div class="cta-action">
          <button type="button" class="btn">{{ data.cta.button }}</button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.content {
  padding: clamp(14px, 3.2vw, 28px) clamp(10px, 2.2vw, 22px) clamp(22px, 4vw, 44px);
  display: grid;
  gap: clamp(20px, 3vw, 28px);
  min-width: 0;
  box-sizing: border-box;
  max-width: 1320px;
  margin: 0 auto;
}

.hero {
  background:
    radial-gradient(120% 130% at 100% 0%, rgba(79, 70, 229, 0.12) 0%, rgba(79, 70, 229, 0) 50%),
    #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: clamp(14px, 2.2vw, 18px);
  padding: clamp(16px, 3.2vw, 26px);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(240px, 360px);
  gap: clamp(18px, 3vw, 28px);
}

.hero-main {
  min-width: 0;
}

.hero-side {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 12px;
  background: #fafbfe;
}

.hero-side-label {
  margin: 0 0 10px;
  color: #64748b;
  font-size: 12px;
}

.hero-side-grid {
  display: grid;
  gap: 6px;
}

.hero-metric {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e8edf4;
}

.hero-metric strong {
  font-size: 16px;
  line-height: 1.2;
}

.hero-metric span {
  color: #6b7280;
  font-size: 12px;
}

.hero-tag {
  display: inline-flex;
  margin-bottom: 10px;
  border-radius: 999px;
  padding: 5px 12px;
  border: 1px solid #dbeafe;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 600;
}

.hero h1 {
  margin: 0 0 8px;
  font-size: clamp(1.22rem, 3.2vw, 1.8rem);
  line-height: 1.28;
  letter-spacing: 0;
  word-break: break-word;
  font-weight: 700;
}

.hero,
.stats,
.services,
.cta {
  scroll-margin-top: 18px;
}

.hero h2 {
  margin: 0 0 8px;
  font-size: clamp(0.95rem, 2.2vw, 1.2rem);
  font-weight: 600;
  line-height: 1.4;
  word-break: break-word;
}

.hero p {
  margin: 0;
  max-width: 780px;
  color: #4b5563;
  line-height: 1.68;
  font-size: clamp(0.8125rem, 1.8vw, 0.9375rem);
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  position: relative;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e6edf6;
  border-radius: 16px;
  padding: 20px 16px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 124px;
  text-align: center;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 4px;
  background: #cbd5e1;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 24px rgba(15, 23, 42, 0.1);
}

.stat-card strong {
  font-size: clamp(1.35rem, 3.8vw, 1.95rem);
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.stats .stat-card:nth-child(1) strong {
  color: #12b981;
}

.stats .stat-card:nth-child(1)::before {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.stats .stat-card:nth-child(2) strong {
  color: #eab308;
}

.stats .stat-card:nth-child(2)::before {
  background: linear-gradient(90deg, #f59e0b, #facc15);
}

.stats .stat-card:nth-child(3) strong {
  color: #d946ef;
}

.stats .stat-card:nth-child(3)::before {
  background: linear-gradient(90deg, #d946ef, #ec4899);
}

.stats .stat-card:nth-child(4) strong {
  color: #3b82f6;
}

.stats .stat-card:nth-child(4)::before {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.stat-card span {
  color: #64748b;
  font-size: clamp(0.75rem, 1.8vw, 0.875rem);
  font-weight: 500;
}

.services {
  padding: 12px 0 8px;
  border-top: 1px solid #e6ebf2;
  margin-top: 2px;
}

.services-head {
  text-align: center;
  margin-bottom: 22px;
}

.services-head h3 {
  font-size: clamp(1.125rem, 3.2vw, 1.875rem);
  font-weight: 650;
  color: #0f172a;
  margin-bottom: 10px;
  line-height: 1.38;
}

.services-head p {
  color: #6b7280;
  font-size: clamp(0.8125rem, 2.1vw, 1.0625rem);
  line-height: 1.72;
  padding: 0 clamp(4px, 2vw, 12px);
}

.service-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.service-card {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px;
  background: #ffffff;
  min-height: 168px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}

.service-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 24px rgba(15, 23, 42, 0.1);
}

.service-icon {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 14px;
}

.service-icon :deep(svg) {
  width: 18px;
  height: 18px;
  display: block;
}

.service-icon.is-green {
  color: #16a34a;
  background: #eaf9ef;
}

.service-icon.is-blue {
  color: #2563eb;
  background: #e9f1ff;
}

.service-icon.is-pink {
  color: #db2777;
  background: #fdeaf4;
}

.service-icon.is-orange {
  color: #c2410c;
  background: #fff2e7;
}

.service-card h4 {
  margin: 0 0 6px;
  font-size: clamp(0.875rem, 1.8vw, 1rem);
  line-height: 1.55;
  font-weight: 600;
  word-break: break-word;
}

.service-card p {
  margin: 0;
  color: #6b7280;
  line-height: 1.68;
  font-size: clamp(0.75rem, 1.7vw, 0.9375rem);
  word-break: break-word;
}

.cta {
  position: relative;
  overflow: hidden;
  border: 1px solid #e8e4ef;
  border-radius: clamp(16px, 3vw, 22px);
  padding: clamp(26px, 5vw, 42px) clamp(20px, 4vw, 36px);
  background:
    radial-gradient(90% 100% at 0% 0%, rgba(253, 230, 224, 0.65) 0%, rgba(253, 230, 224, 0) 55%),
    radial-gradient(80% 90% at 100% 100%, rgba(237, 233, 254, 0.55) 0%, rgba(237, 233, 254, 0) 50%),
    linear-gradient(165deg, #fdfcfb 0%, #f8f6fc 45%, #faf8f6 100%);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  margin-top: 4px;
}

.cta-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(20px, 4vw, 36px);
  flex-wrap: wrap;
}

.cta-copy {
  flex: 1 1 260px;
  min-width: 0;
  text-align: left;
}

.cta-action {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.cta h3 {
  margin: 0 0 8px;
  color: #111827;
  font-size: clamp(1.25rem, 3.2vw, 2.05rem);
  font-weight: 650;
  line-height: 1.35;
  word-break: break-word;
}

.cta p {
  margin: 0;
  color: #64748b;
  font-size: clamp(0.875rem, 2vw, 1.05rem);
  line-height: 1.65;
  max-width: 620px;
}

.btn {
  border: 1px solid #111827;
  background: #111827;
  color: #ffffff;
  min-width: 180px;
  border-radius: 10px;
  min-height: 46px;
  height: auto;
  padding: 12px 24px;
  font-size: clamp(0.8125rem, 1.8vw, 0.95rem);
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  max-width: 100%;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.18);
}

.cta .btn {
  white-space: nowrap;
}

@media (max-width: 640px) {
  .cta-inner {
    flex-direction: column;
    align-items: stretch;
  }

  .cta-copy {
    text-align: center;
  }

  .cta p {
    max-width: none;
  }

  .cta-action {
    justify-content: center;
  }

  .cta .btn {
    width: 100%;
  }
}

@media (max-width: 1080px) {
  .content {
    max-width: 100%;
  }

  .hero {
    grid-template-columns: 1fr;
  }

  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .service-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .content {
    gap: 16px;
  }

  .hero {
    padding: 18px 16px;
  }

  .service-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .content {
    padding: 12px 8px 18px;
  }

  .stats {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .stat-card {
    min-height: 102px;
    padding: 14px 12px;
  }

  .service-card {
    min-height: 0;
  }
}
</style>
