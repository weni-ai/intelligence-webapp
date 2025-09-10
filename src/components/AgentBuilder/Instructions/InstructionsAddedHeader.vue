<template>
  <header class="instructions-added-header">
    <hgroup
      class="instructions-added-header__infos"
      data-testid="instructions-header-infos"
    >
      <h2
        class="infos__title"
        data-testid="instructions-title"
      >
        {{ $t('agent_builder.instructions.instructions_added.title') }}
      </h2>
      <h3
        class="infos__subtitle"
        data-testid="instructions-subtitle"
      >
        {{
          $t('agent_builder.instructions.instructions_added.subtitle', {
            count: instructionsCount,
          })
        }}
      </h3>
    </hgroup>

    <UnnnicSelectSmart
      v-model="filters"
      :options="filtersOptions"
      orderedByIndex
      multiple
      multipleWithoutSelectsMessage
      autocomplete
      data-testid="instructions-filters"
    />
  </header>
</template>

<script setup>
import { computed } from 'vue';
import i18n from '@/utils/plugins/i18n';

defineProps({
  instructionsCount: {
    type: Number,
    required: true,
  },
});

const filters = defineModel('filters', {
  type: Array,
  required: true,
});

const getFilterTranslation = (filter) =>
  i18n.global.t(
    `agent_builder.instructions.instructions_added.filters.${filter}`,
  );
const filtersOptions = computed(() => [
  {
    label: getFilterTranslation('placeholder'),
    value: '',
  },
  {
    label: getFilterTranslation('default_instructions'),
    value: 'default_instructions',
  },
  {
    label: getFilterTranslation('personalized_instructions'),
    value: 'personalized_instructions',
  },
]);
</script>

<style lang="scss" scoped>
.instructions-added-header {
  display: grid;
  grid-template-columns: 9fr 3fr;
  align-items: center;
  gap: $unnnic-spacing-sm;

  &__infos {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-nano;

    .infos__title {
      margin: 0;

      color: $unnnic-color-neutral-darkest;
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-body-lg;
      font-weight: $unnnic-font-weight-bold;
      line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
    }

    .infos__subtitle {
      margin: 0;

      color: $unnnic-color-neutral-cloudy;
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-body-md;
      font-weight: $unnnic-font-weight-regular;
      line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
    }
  }
}
</style>
