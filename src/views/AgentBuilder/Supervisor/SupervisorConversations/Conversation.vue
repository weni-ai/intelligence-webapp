<template>
  <section class="conversation">
    <h1 class="conversation__title">{{ conversation }}</h1>
  </section>
</template>

<script setup>
import { computed } from 'vue';

import { useSupervisorStore } from '@/store/Supervisor';

const supervisorStore = useSupervisorStore();

const conversation = computed(() => supervisorStore.selectedConversation);
</script>
