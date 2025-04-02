<template>
  <section class="agents-preview">
    <UnnnicIntelligenceText
      tag="p"
      family="secondary"
      size="body-lg"
      color="neutral-darkest"
      weight="bold"
      data-testid="credentials-description"
    >
      {{ $t('router.tunings.settings.agents_preview.title') }}
    </UnnnicIntelligenceText>

    <form class="agents-preview__form">
      <section class="form__field">
        <UnnnicSwitch
          v-model="tuningsStore.settings.data.progressiveFeedback"
          :textRight="
            $t(
              'router.tunings.settings.agents_preview.agents_progressive_feedback.title',
            )
          "
        />

        <UnnnicIntelligenceText
          tag="p"
          family="secondary"
          size="body-gt"
          color="neutral-clean"
          class="form__description"
        >
          {{
            $t(
              'router.tunings.settings.agents_preview.agents_progressive_feedback.description',
            )
          }}
        </UnnnicIntelligenceText>
      </section>
    </form>
  </section>
</template>

<script setup>
import { useTuningsStore } from '@/store/Tunings';

const tuningsStore = useTuningsStore();
</script>

<style lang="scss" scoped>
.agents-preview {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-sm;

  &__form {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-sm;

    .form__field {
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-nano;
    }
  }
}
</style>
