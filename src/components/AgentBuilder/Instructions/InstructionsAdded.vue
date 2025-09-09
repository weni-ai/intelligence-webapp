<template>
  <section class="instructions-added">
    <h2
      class="instructions-added__title"
      data-testid="instructions-title"
    >
      {{ $t('agent_builder.instructions.instructions_added.title') }}
    </h2>

    <section
      :class="[
        'instructions-added__instructions',
        {
          'instructions-added__instructions--loading':
            instructionsStore.instructions.status === 'loading',
        },
      ]"
      data-testid="instructions"
    >
      <template v-if="instructionsStore.instructions.status === 'loading'">
        <UnnnicSkeletonLoading
          v-for="index in 10"
          :key="index"
          tag="div"
          width="100%"
          height="60px"
          data-testid="instruction-loading"
        />
      </template>
      <template v-else>
        <Instruction
          v-for="(instruction, index) in instructionsDefault"
          :key="index"
          data-testid="instruction-default"
          :text="instruction"
          :tag="
            $t(
              'agent_builder.instructions.instructions_added.default_instruction',
            )
          "
        />
        <Instruction
          v-for="instruction in instructionsStore.instructions.data"
          :key="instruction.id"
          data-testid="instruction-added"
          :text="instruction.text"
        />
      </template>
    </section>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useInstructionsStore } from '@/store/Instructions';

import Instruction from './Instruction.vue';
import i18n from '@/utils/plugins/i18n';

const instructionsStore = useInstructionsStore();
if (instructionsStore.instructions.status === null) {
  instructionsStore.loadInstructions();
}

const instructionsDefault = computed(() =>
  i18n.global.tm(
    'agent_builder.instructions.instructions_added.default_instructions',
  ),
);
</script>

<style lang="scss" scoped>
.instructions-added {
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

  &__instructions {
    display: flex;
    flex-direction: column;

    border-radius: $unnnic-border-radius-md;
    border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

    &--loading {
      gap: $unnnic-spacing-nano;

      border: none;
      border-radius: 0;
    }
  }
}
</style>
