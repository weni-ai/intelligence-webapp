<template>
  <section class="agents-team">
    <UnnnicDivider
      ySpacing="lg"
      class="agents-team__divider"
    />

    <ActiveTeam />
  </section>
</template>

<script setup>
import ActiveTeam from './ActiveTeam.vue';
</script>

<style lang="scss" scoped>
section.agents-team {
  display: grid;
  grid-template-rows: auto 1fr;

  .agents-team__divider {
    margin-top: 0;
  }
}
</style>
