<template>
  <svg
    :width="width"
    :height="height"
    class="branch-lines"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="branchGradient"
        x1="19"
        y1="0"
        x2="19"
        y2="150"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#086766" />
        <stop
          offset="1"
          stop-color="#4DFBEA"
        />
      </linearGradient>
    </defs>

    <!-- Regular lines -->
    <path
      v-for="(path, index) in regularPaths"
      :key="`regular-${index}`"
      :d="path.d"
      stroke="#E2E6ED"
      stroke-width="1"
      stroke-linejoin="round"
    />
    <!-- Colored line rendered last -->
    <path
      v-if="coloredPath"
      :d="coloredPath.d"
      stroke="url(#branchGradient)"
      stroke-width="3"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
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
  coloredLineIndex: {
    type: Number,
    default: -1,
  },
});

const generatePath = (position) => {
  const centerX = 13;
  const startY = position.startY || 0;
  const endY = position.endY || 142;
  const isLeft = position.isLeft || true;
  const radius = position.radius || 8;
  const targetX = isLeft ? 0 : 25;
  const controlX = isLeft ? centerX - radius : centerX + radius;

  return {
    d: `M${centerX} ${startY}V${endY}C${centerX} ${endY + radius}, ${controlX} ${endY + radius}, ${targetX} ${endY + radius}H${targetX}`,
  };
};

const regularPaths = computed(() => {
  return props.positions
    .map((position, index) => {
      if (index === props.coloredLineIndex) return null;
      return generatePath(position);
    })
    .filter(Boolean);
});

const coloredPath = computed(() => {
  if (
    props.coloredLineIndex < 0 ||
    props.coloredLineIndex >= props.positions.length
  )
    return null;
  return generatePath(props.positions[props.coloredLineIndex]);
});
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
