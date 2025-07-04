<template>
  <section class="conversation-infos">
    <SupervisorUsername :username="username" />

    <UnnnicIntelligenceText
      data-testid="conversation-urn"
      class="conversation-infos__urn"
      tag="p"
      color="neutral-cloudy"
      family="secondary"
      size="body-md"
    >
      {{ formattedUrn }}
    </UnnnicIntelligenceText>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import SupervisorUsername from '@/components/AgentBuilder/Supervisor/SupervisorUsername.vue';
import { formatWhatsappUrn } from '@/utils/formatters';

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  urn: {
    type: String,
    required: true,
  },
});

const formattedUrn = computed(() => formatWhatsappUrn(props.urn));
</script>

<style scoped lang="scss">
.conversation-infos {
  display: grid;

  &__urn {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
