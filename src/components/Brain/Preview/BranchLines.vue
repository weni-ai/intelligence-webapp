<template>
  <svg
    :width="width"
    :height="height"
    class="branch-lines"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      v-for="(path, index) in generatedPaths"
      :key="index"
      :d="path"
      stroke="#E2E6ED"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script>
export default {
  name: 'BranchLines',
  props: {
    positions: {
      type: Array,
      required: true,
      default: () => [],
    },
    width: {
      type: [Number, String],
      default: '100%',
    },
    height: {
      type: [Number, String],
      default: '100%',
    },
    startY: {
      type: [Number, String],
      default: 0,
    },
  },
  computed: {
    generatedPaths() {
      const paths = [];
      const centerX = 13; // Center X position

      this.positions.forEach((position, index) => {
        const startY = position.startY || 0;
        const endY = position.endY || 142;
        const isLeft = position.isLeft || false;
        const radius = position.radius || 8;
        const targetX = isLeft ? 0 : 25;
        const controlX = isLeft ? centerX - radius : centerX + radius;

        const path = `M${centerX} ${startY}V${endY}C${centerX} ${endY + radius}, ${controlX} ${endY + radius}, ${targetX} ${endY + radius}H${targetX}`;
        paths.push(path);
      });

      return paths;
    },
  },
};
</script>

<style scoped>
.branch-lines {
  position: absolute;
  left: 50%;
  top: v-bind('startY - 8 + "px"');
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 0;
}
</style>
