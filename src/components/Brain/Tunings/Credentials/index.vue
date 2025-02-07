<template>
  <section class="credentials__container">
    <UnnnicIntelligenceText
      tag="p"
      family="secondary"
      size="body-gt"
      color="neutral-cloudy"
      data-testid="credentials-description"
    >
      {{ $t('router.tunings.credentials.description') }}
    </UnnnicIntelligenceText>

    <section class="credentials__form">
      <CredentialsSkeleton
        v-if="tuningsStore.credentials.data === null"
        data-testid="credentials-skeleton"
      />
      <template v-else>
        <UnnnicFormElement
          v-for="(credential, key) in credentials"
          :key="key"
          :label="credential.label"
          data-testid="credentials-form-element"
        >
          <UnnnicInput
            v-model="credential.value"
            :nativeType="credential.is_confidential ? 'password' : 'text'"
            :placeholder="credential.placeholder || credential.label"
            data-testid="credentials-form-input"
          />
        </UnnnicFormElement>

        <UnnnicButton
          data-testid="credentials-save-button"
          :disabled="!tuningsStore.isCredentialsValid"
          :loading="tuningsStore.credentials.status === 'loading'"
          @click="saveChanges"
        >
          {{ $t('save_changes') }}
        </UnnnicButton>
      </template>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue';

import { useTuningsStore } from '@/store/Tunings';

import CredentialsSkeleton from './CredentialsSkeleton.vue';

const tuningsStore = useTuningsStore();

const credentials = computed(() => tuningsStore.credentials.data);

function saveChanges() {
  tuningsStore.saveCredentials();
}

onMounted(() => {
  tuningsStore.fetchCredentials();
});
</script>

<style lang="scss" scoped>
.credentials__container {
  display: grid;
  gap: $unnnic-spacing-sm;

  .credentials__form {
    display: grid;
    gap: $unnnic-spacing-sm;
  }
}
</style>
