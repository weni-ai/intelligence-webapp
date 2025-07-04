<template>
  <section class="obstructive-error">
    <img v-bind="currentError.image" />

    <h1>{{ $t(`obstructive_error.${errorType}.title`) }}</h1>

    <p>{{ $t(`obstructive_error.${errorType}.description`) }}</p>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

import DorisFacePalm from '@/assets/images/doris-face-palm-reaction.png';
import DorisSignalingStop from '@/assets/images/doris-signaling-to-stop.png';

const store = useStore();

const errors = {
  default: {
    image: {
      src: DorisFacePalm,
      alt: 'Doris Face Palm Reaction',
    },
  },

  unauthorized: {
    image: {
      src: DorisSignalingStop,
      alt: 'Doris Signaling to Stop',
    },
  },
};

const errorType = computed(() => {
  const { obstructiveError } = store.state;

  return Object.keys(errors).includes(obstructiveError)
    ? obstructiveError
    : 'default';
});

const currentError = computed(() => {
  return errors[errorType.value];
});
</script>

<style lang="scss">
.obstructive-error {
  min-height: 100vh;
  padding: $unnnic-spacing-lg $unnnic-spacing-md;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  img {
    margin-bottom: $unnnic-spacing-md;
  }

  h1 {
    margin: 0;
    margin-bottom: $unnnic-spacing-xs;

    color: $unnnic-color-neutral-darkest;
    font-family: $unnnic-font-family-secondary;
    font-weight: $unnnic-font-weight-bold;
    font-size: $unnnic-font-size-title-sm;
    line-height: $unnnic-font-size-title-sm + $unnnic-line-height-md;
  }

  p {
    margin: 0;

    color: $unnnic-color-neutral-cloudy;
    font-family: $unnnic-font-family-secondary;
    font-weight: $unnnic-font-weight-regular;
    font-size: $unnnic-font-size-body-gt;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
  }
}
</style>
