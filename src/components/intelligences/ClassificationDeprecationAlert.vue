<template>
  <section class="deprecation-alert">
    <UnnnicIcon
      icon="warning"
      filled
      scheme="aux-yellow-500"
      class="deprecation-alert__icon"
    />
    <section class="deprecation-alert__content">
      <UnnnicIntelligenceText
        tag="p"
        size="body-lg"
        family="secondary"
        weight="bold"
        color="aux-yellow-700"
        class="deprecation-alert__title"
      >
        {{ $t('intelligences.classification.deprecation_notice') }}
      </UnnnicIntelligenceText>
      <UnnnicIntelligenceText
        tag="p"
        size="body-md"
        family="secondary"
        color="aux-yellow-700"
        class="deprecation-alert__message"
      >
        <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
        <i18n-t
          keypath="intelligences.classification.use_agents_builder"
          tag="p"
        >
          <template #agents_builder_link>
            <a
              href="#"
              class="deprecation-alert__link"
              data-testid="agents-builder-link"
              @click="goToAgentsBuilder"
            >
              {{ $t('intelligences.classification.agents_builder') }}
            </a>
          </template>
        </i18n-t>
      </UnnnicIntelligenceText>
    </section>
  </section>
</template>

<script setup>
function goToAgentsBuilder() {
  window.parent.postMessage(
    {
      event: 'redirect',
      path: 'agents-builder:init',
    },
    '*',
  );
}
</script>

<style lang="scss" scoped>
.deprecation-alert {
  padding: $unnnic-spacing-sm;

  display: flex;
  align-items: flex-start;
  gap: $unnnic-spacing-ant;

  border-radius: $unnnic-border-radius-md;
  background-color: $unnnic-color-aux-yellow-100;

  &__link {
    color: $unnnic-color-aux-yellow-700;
    font-weight: $unnnic-font-weight-bold;
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
  }
}
</style>
