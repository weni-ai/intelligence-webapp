<template>
  <section class="profile__human-support">
    <header class="human-support__header">
      <UnnnicIntelligenceText
        tag="p"
        family="secondary"
        color="neutral-darkest"
        weight="bold"
        size="body-lg"
      >
        {{ $t('profile.human_support.title') }}
      </UnnnicIntelligenceText>

      <UnnnicSwitch
        v-model="profile.humanSupport.current"
        size="small"
        :textRight="
          profile.humanSupport.current
            ? $t('profile.human_support.switch.enabled')
            : $t('profile.human_support.switch.disabled')
        "
      />
    </header>

    <section class="human-support__form">
      <LoadingFormElement
        v-if="loading"
        label
        element="textarea"
      />

      <UnnnicFormElement
        v-else-if="profile.humanSupport.current"
        class="form__element"
        :label="$t('profile.human_support.fields.rules.title')"
        :error="
          errorRequiredFields.humanSupportPrompt
            ? $t('profile.invalid_field')
            : ''
        "
      >
        <UnnnicTextArea
          v-model="profile.humanSupportPrompt.current"
          :placeholder="$t('profile.human_support.fields.rules.placeholder')"
          :type="errorRequiredFields.humanSupportPrompt ? 'error' : 'normal'"
        />
      </UnnnicFormElement>
    </section>
  </section>
</template>

<script setup>
import { computed, watch } from 'vue';

import { useProfileStore } from '@/store/Profile';

import LoadingFormElement from '@/components/LoadingFormElement.vue';

const profile = useProfileStore();

const loading = computed(() => profile.status === 'loading');
const errorRequiredFields = computed(() => profile.errorRequiredFields);

watch(
  () => profile.humanSupport.current,
  (newValue) => {
    if (!newValue) {
      profile.humanSupportPrompt.current = '';
    }
  },
);
</script>

<style lang="scss" scoped>
.profile__human-support {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-sm;

  .human-support__header {
    display: flex;
    gap: $unnnic-spacing-xs;
  }
}
</style>
