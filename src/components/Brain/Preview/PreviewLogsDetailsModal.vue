<template>
  <UnnnicModalDialog
    :modelValue="modelValue"
    showCloseIcon
    size="md"
    :title="title"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <section class="preview-logs-details">
      <UnnnicIntelligenceText
        class="preview-logs-details__trace"
        tag="p"
        color="neutral-dark"
        family="secondary"
        size="body-gt"
      >
        {{ prettyPrintJSON(trace) }}
      </UnnnicIntelligenceText>
    </section>
  </UnnnicModalDialog>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  trace: {
    type: Object,
    required: true,
  },
});

defineEmits(['update:modelValue']);

function prettyPrintJSON(json) {
  const jsonString = JSON.stringify(json, null, '\t');

  return jsonString;
}
</script>

<style lang="scss" scoped>
.preview-logs-details {
  border-radius: $unnnic-border-radius-sm;
  background-color: $unnnic-color-neutral-lightest;

  padding: $unnnic-spacing-sm;

  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-sm;

  &__trace {
    white-space: pre-wrap;
  }
}
</style>
