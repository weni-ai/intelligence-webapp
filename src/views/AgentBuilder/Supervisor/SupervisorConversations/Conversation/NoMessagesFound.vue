<template>
  <section class="no-messages-found">
    <UnnnicIcon
      icon="search_off"
      scheme="neutral-dark"
      class="no-messages-found__icon"
    />

    <UnnnicIntelligenceText
      tag="p"
      color="neutral-dark"
      family="secondary"
      size="body-gt"
      weight="bold"
      class="no-messages-found__title"
    >
      {{ $t('agent_builder.supervisor.no_messages_found.title') }}
    </UnnnicIntelligenceText>

    <UnnnicIntelligenceText
      tag="p"
      color="neutral-dark"
      family="secondary"
      size="body-gt"
    >
      <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
      <i18n-t
        keypath="agent_builder.supervisor.no_messages_found.description"
        tag="p"
      >
        <template #studio_link>
          <p
            href="#"
            class="no-messages-found__link"
          >
            {{ $t('agent_builder.supervisor.no_messages_found.studio_link') }}
          </p>
        </template>
      </i18n-t>
    </UnnnicIntelligenceText>
  </section>
</template>

<style scoped lang="scss">
.no-messages-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: calc(100vh - ($unnnic-spacing-xgiant + $unnnic-spacing-ant));

  text-align: center;

  & &__icon {
    $icon-size: 3.5 * $unnnic-font-size;

    font-size: $icon-size;
  }

  &__title {
    margin: $unnnic-spacing-ant 0 $unnnic-spacing-nano 0;
  }

  &__link {
    color: $unnnic-color-neutral-dark;
    font-weight: $unnnic-font-weight-bold;
  }
}
</style>
