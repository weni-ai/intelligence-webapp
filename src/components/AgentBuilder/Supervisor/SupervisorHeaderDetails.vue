<template>
  <p
    class="supervisor-header-details"
    @click="openDetailsModal"
  >
    {{ $t('agent_builder.supervisor.learn_details_conversations') }}
  </p>
</template>

<script setup>
import { ref } from 'vue';

const isDetailsModalOpen = ref(false);

function openDetailsModal() {
  isDetailsModalOpen.value = true;
}
</script>

<style scoped lang="scss">
.supervisor-header-details {
  display: initial;

  color: $unnnic-color-neutral-cloudy;
  font-size: $unnnic-font-size-body-gt;
  font-weight: $unnnic-font-weight-bold;
  font-family: $unnnic-font-family-secondary;
  text-decoration: underline;

  cursor: pointer;
}
</style>
