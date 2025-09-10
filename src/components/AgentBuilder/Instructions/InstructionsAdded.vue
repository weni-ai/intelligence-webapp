<template>
  <section class="instructions-added">
    <InstructionsAddedHeader
      data-testid="instructions-header"
      :instructionsCount="instructionsCount"
    />

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
          :instruction="{
            id: `default-${index}`,
            text: instruction,
          }"
          :showActions="false"
          :tag="
            $t(
              'agent_builder.instructions.instructions_added.default_instruction',
            )
          "
        />
        <Instruction
          v-for="instruction in instructionsStore.instructions.data"
          :key="instruction.id"
          :instruction="instruction"
          data-testid="instruction-added"
        />
      </template>
    </section>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useInstructionsStore } from '@/store/Instructions';

import i18n from '@/utils/plugins/i18n';

import Instruction from './Instruction.vue';
import InstructionsAddedHeader from './InstructionsAddedHeader.vue';

const instructionsStore = useInstructionsStore();
if (instructionsStore.instructions.status === null) {
  instructionsStore.loadInstructions();
}

const instructionsDefault = computed(() =>
  i18n.global.tm(
    'agent_builder.instructions.instructions_added.default_instructions',
  ),
);

const instructionsCount = computed(
  () =>
    instructionsStore.instructions.data.length +
    instructionsDefault.value.length,
);
</script>

<style lang="scss" scoped>
.instructions-added {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-sm;

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
