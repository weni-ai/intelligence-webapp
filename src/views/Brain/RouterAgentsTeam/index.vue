<template>
  <section class="agents-team">
    <ActiveTeam />

    <UnnnicDivider ySpacing="lg" />

    <AgentsGallery />
  </section>
</template>

<script setup>
import ActiveTeam from './ActiveTeam.vue';
import AgentsGallery from './AgentsGallery.vue';
</script>

<style lang="scss" scoped>
section.agents-team {
  display: grid;
  grid-template-rows: auto auto 1fr;
}
</style>
