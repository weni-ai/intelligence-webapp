<template>
  <section class="conversation-infos">
    <UnnnicIntelligenceText
      data-testid="conversation-urn"
      class="conversation-infos__urn"
      tag="h3"
      color="neutral-darkest"
      family="secondary"
      size="body-gt"
      weight="bold"
    >
      {{ urn }}
    </UnnnicIntelligenceText>
    <UnnnicIntelligenceText
      data-testid="conversation-last-message"
      class="conversation-infos__last-message"
      tag="p"
      color="neutral-cloudy"
      family="secondary"
      size="body-md"
    >
      {{ lastMessage }}
    </UnnnicIntelligenceText>
  </section>
</template>
<script setup>
const props = defineProps({
  urn: {
    type: String,
    required: true,
  },
  lastMessage: {
    type: String,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.conversation-infos {
  display: grid;

  &__urn,
  &__last-message {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
