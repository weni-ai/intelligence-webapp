<template>
  <section
    class="new-instruction"
    data-testid="new-instruction"
  >
    <h2
      class="new-instruction__title"
      data-testid="new-instruction-title"
    >
      {{ $t('agent_builder.instructions.new_instruction.title') }}
    </h2>
    <UnnnicTextArea
      v-model="instruction"
      data-testid="new-instruction-textarea"
      :placeholder="
        $t('agent_builder.instructions.new_instruction.textarea.placeholder')
      "
      :message="
        $t('agent_builder.instructions.new_instruction.textarea.description')
      "
      :maxLength="200"
    />
    <UnnnicButton
      class="new-instruction__add-instruction-button"
      data-testid="add-instruction-button"
      :disabled="!instruction.trim()"
      :text="$t('agent_builder.instructions.new_instruction.add_instruction')"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue';

const instruction = ref('');
</script>

<style lang="scss" scoped>
.new-instruction {
  border-radius: $unnnic-border-radius-md;
  border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
  padding: $unnnic-spacing-sm;

  display: grid;
  grid-template-columns: repeat(12, 1fr);
  row-gap: $unnnic-spacing-sm;

  & > * {
    grid-column: 1 / -1;
  }

  &__title {
    margin: 0;

    color: $unnnic-color-neutral-darkest;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-lg;
    font-weight: $unnnic-font-weight-bold;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
  }

  &__add-instruction-button {
    grid-column: 1 / 5;
  }
}
</style>
