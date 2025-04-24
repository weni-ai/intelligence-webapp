<template>
  <section class="supervisor">
    <BrainHeader data-testid="header" />
    <SupervisorConversations data-testid="supervisor-conversations" />
  </section>
</template>

<script setup>
import BrainHeader from '@/components/Brain/BrainHeader.vue';
import SupervisorConversations from '@/views/AgentBuilder/Supervisor/SupervisorConversations/index.vue';
</script>
