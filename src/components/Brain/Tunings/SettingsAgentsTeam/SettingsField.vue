<template>
  <section class="form__field">
    <UnnnicSwitch
      :modelValue="modelValue"
      :textRight="textRight"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <UnnnicIntelligenceText
      tag="p"
      family="secondary"
      size="body-gt"
      color="neutral-clean"
      class="form__description"
    >
      {{ description }}
    </UnnnicIntelligenceText>
  </section>
</template>

<script setup>
const emit = defineEmits(['update:modelValue']);

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  textRight: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
</script>
