<template>
  <section class="instructions-section">
    <h2
      class="instructions-section__title"
      data-testid="instructions-section-title"
    >
      {{ $t('agent_builder.instructions.instructions_list.title') }}
    </h2>

    <UnnnicTab
      :tabs="tabs"
      :activeTab="activeTab"
      @change="instructionsStore.activeInstructionsListTab = $event"
    >
      <template
        v-for="tab in tabs"
        :key="tab"
        #[`tab-head-${tab}`]
      >
        {{ $t(`agent_builder.instructions.instructions_list.tabs.${tab}`) }}
      </template>
      <template #[`tab-panel-${activeTab}`]>
        <p class="instructions-section__tab-description">
          {{
            $t(
              `agent_builder.instructions.instructions_list.tabs.${activeTab}_description`,
            )
          }}
        </p>
      </template>
    </UnnnicTab>
    <InstructionsList
      v-if="activeTab === 'default'"
      :instructions="instructionsDefault"
      :isLoading="false"
      :showActions="false"
    />
    <InstructionsList
      v-if="activeTab === 'custom'"
      :instructions="instructionsStore.instructions.data"
      :isLoading="instructionsStore.instructions.status === 'loading'"
      showActions
    />
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useInstructionsStore } from '@/store/Instructions';

import InstructionsList from './InstructionsList.vue';
import i18n from '@/utils/plugins/i18n';

const instructionsStore = useInstructionsStore();

if (instructionsStore.instructions.status === null) {
  instructionsStore.loadInstructions();
}

const tabs = ref(['default', 'safety_topics', 'custom']);
const activeTab = computed(() => instructionsStore.activeInstructionsListTab);

const instructionsDefault = computed(() =>
  i18n.global
    .tm('agent_builder.instructions.instructions_list.default_instructions')
    .map((instruction, index) => ({
      id: `default-${index}`,
      text: instruction,
    })),
);
</script>

<style lang="scss" scoped>
.instructions-section {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-sm;

  &__title {
    margin: 0;

    color: $unnnic-color-neutral-darkest;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-lg;
    font-weight: $unnnic-font-weight-bold;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
  }

  &__tab-description {
    color: $unnnic-color-neutral-cloudy;

    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-gt;
    font-weight: $unnnic-font-weight-regular;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
  }
}
</style>
