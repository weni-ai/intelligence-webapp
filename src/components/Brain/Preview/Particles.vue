<template>
  <section id="particles-container">
    <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
    <vue-particles
      id="particles"
      :options="{
        fullScreen: {
          enable: false,
        },
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 60,
        particles: {
          color: {
            value: [color],
          },
          links: {
            enable: false,
          },
          move: {
            direction: 'top',
            enable: true,
            outModes: 'out',
            random: false,
            speed: 0.8,
            straight: false,
          },
          collisions: {
            enable: true,
            mode: 'bounce',
          },
          number: {
            value: 10,
          },
          opacity: {
            value: 0.5,
            random: false,
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 2, max: 8 },
            random: true,
          },
        },
        detectRetina: true,
      }"
    />
  </section>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: '#63B3ED',
    validator: (value) => {
      return ['#63B3ED', '#F6AD55'].includes(value);
    },
  },
});
</script>
