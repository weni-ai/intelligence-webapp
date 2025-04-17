<template>
  <section
    :class="[
      'question-and-answer__message',
      `question-and-answer__message--${scheme}`,
    ]"
  >
    <Markdown :content="text" />

    <slot />
  </section>
</template>

<script setup>
import Markdown from '@/components/Markdown.vue';

const props = defineProps({
  text: {
    type: String,
    required: true,
  },

  scheme: {
    type: String,
    default: 'neutral',
    validator: (value) => {
      return ['neutral', 'success'].includes(value);
    },
  },
});
</script>

<style lang="scss" scoped>
.question-and-answer__message {
  border-radius: $unnnic-border-radius-md;

  padding: $unnnic-spacing-ant;

  height: fit-content;
  width: fit-content;

  font-family: $unnnic-font-family-secondary;
  font-size: $unnnic-font-size-body-gt;

  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-xs;

  &--neutral {
    background-color: $unnnic-color-background-solo;
    color: $unnnic-color-neutral-dark;
  }

  &--success {
    background-color: $unnnic-color-weni-600;
    color: $unnnic-color-neutral-white;
  }
}
</style>
