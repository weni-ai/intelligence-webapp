<template>
  <UnnnicSkeletonLoading v-if="tuningsStore.settings.status === 'loading'" />

  <section
    v-else
    class="settings-agents-team"
  >
    <AgentsPreview />
  </section>
</template>

<script setup>
import AgentsPreview from './AgentsPreview.vue';
import { useTuningsStore } from '@/store/Tunings';

const tuningsStore = useTuningsStore();
</script>
