<template>
  <h2 data-testid="new-instruction-title">
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
    data-testid="add-instruction-button"
    :text="$t('agent_builder.instructions.new_instruction.add_instruction')"
  />
</template>

<script setup>
import { ref } from 'vue';

const instruction = ref('');
</script>

<style lang="scss" scoped></style>
