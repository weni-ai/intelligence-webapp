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
        color="neutral-dark"
        family="secondary"
        size="body-gt"
      >
        {{ trace }}
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
</script>

<style lang="scss" scoped>
.preview-logs-details {
  border-radius: $unnnic-border-radius-sm;
  background-color: $unnnic-color-neutral-lightest;

  padding: $unnnic-spacing-sm;

  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-sm;
}
</style>
