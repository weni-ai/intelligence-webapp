<template>
  <section class="preview-details">
    <UnnnicTab
      v-model="selectedTab"
      :tabs="detailTabs"
    >
      <template
        v-for="tab in detailTabs"
        :key="tab"
        #[`tab-head-${tab}`]
      >
        {{ $t(`router.preview.${tab}`) }}
      </template>
    </UnnnicTab>

    <section class="preview-details__content">
      <section
        v-if="selectedTab === 'visual_flow'"
        class="details__visual-flow"
      >
        <!-- TODO: Add visual flow content -->
      </section>

      <section
        v-else
        class="details__logs"
      >
        <p
          v-if="!messages.length"
          class="details__logs__empty"
        >
          {{ $t('router.preview.no_logs_registered') }}
        </p>
        <template v-else>
          <!-- TODO: Add logs content -->
        </template>
      </section>
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  messages: {
    type: Array,
    required: true,
  },
});

const selectedTab = ref('visual_flow');
const detailTabs = ['visual_flow', 'logs'];
</script>

<style lang="scss" scoped>
.preview-details {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__content {
    flex: 1;
    margin-top: $unnnic-spacing-md;
    overflow: auto;
  }
}

.details {
  &__logs {
    &__empty {
      color: $unnnic-color-neutral-cloudy;
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-body-gt;
      line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
      font-weight: $unnnic-font-weight-regular;
    }
  }
}
</style>
