<template>
  <section
    class="preview-full-page"
    :style="{ height: `${height}px` }"
  >
    <Preview />
  </section>
</template>

<script>
import Preview from '../repository/content/Preview.vue';

export default {
  components: {
    Preview,
  },

  data() {
    return {
      height: 10,
    };
  },

  mounted() {
    document.documentElement.style.overscrollBehavior = 'none';

    if (window.visualViewport && window.visualViewport.height)
      this.height = window.visualViewport.height;

    window.addEventListener('resize', () => {
      if (!window.visualViewport) {
        return;
      }

      this.height = window.visualViewport.height;
    });
  },
};
</script>

<style lang="scss" scoped>
.preview-full-page {
  display: flex;
  height: 100%;
  overflow: hidden;
  padding: $unnnic-spacing-sm;
}
</style>
