<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import { useAuthStore } from "@/stores/auth.js";

const { t } = useI18n();
const auth = useAuthStore();
</script>

<template>
  <div class="login">
    <div class="login__card">
      <div class="login__brand dc-mono">
        <span class="login__brand-dot" aria-hidden="true" />
        <span>DEVCENTER</span>
      </div>
      <h1 class="login__title">{{ t("auth.title") }}</h1>
      <p class="login__subtitle">{{ t("auth.subtitle") }}</p>
      <Button
        :label="t('auth.continueWithGoogle')"
        icon="pi pi-google"
        class="login__button"
        @click="auth.loginWithGoogle()"
      />
    </div>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: var(--dc-bg) var(--dc-bg-image);
}

.login__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--dc-space-sm);
  width: 100%;
  max-width: 360px;
  padding: var(--dc-space-2xl) var(--dc-space-xl);
  background: var(--dc-panel-bg);
  border: 1px solid var(--dc-panel-border);
  border-radius: var(--dc-radius-lg);
  box-shadow: var(--dc-shadow-panel);
  text-align: center;
}

.login__brand {
  display: flex;
  align-items: center;
  gap: var(--dc-space-xs);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--dc-text-muted);
  margin-bottom: var(--dc-space-sm);
}

.login__brand-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--dc-accent);
  box-shadow: 0 0 6px var(--dc-accent-glow);
}

.login__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dc-text);
}

.login__subtitle {
  margin: 0 0 var(--dc-space-sm);
  color: var(--dc-text-muted);
  font-size: 0.875rem;
}

.login__button {
  width: 100%;
}
</style>
