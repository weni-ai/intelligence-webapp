<template>
  <section
    data-testid="preview-details"
    class="preview-details"
  >
    <UnnnicTab
      data-testid="preview-details-tabs"
      class="preview-details__tabs"
      :modelValue="selectedTab"
      :tabs="detailTabs"
      @change="selectedTab = $event"
    >
      <template
        v-for="tab in detailTabs"
        :key="tab"
        #[`tab-head-${tab}`]
      >
        {{ $t(`router.preview.${tab}`) }}
      </template>
    </UnnnicTab>

    <section
      ref="contentRef"
      data-testid="preview-details-content"
      class="preview-details__content"
    >
      <section
        v-if="selectedTab === 'visual_flow'"
        data-testid="preview-details-visual-flow"
        class="details__visual-flow"
      >
        <PreviewVisualFlow />
      </section>

      <section
        v-else
        data-testid="preview-details-logs"
        class="details__logs"
      >
        <PreviewLogs
          :logs="previewStore.collaboratorsTraces"
          @scroll-to-bottom="scrollContentToBottom"
        />
      </section>
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue';

import PreviewLogs from '@/components/Brain/PreviewLogs.vue';
import PreviewVisualFlow from './PreviewVisualFlow.vue';
import { usePreviewStore } from '@/store/Preview';

const selectedTab = ref('visual_flow');
const detailTabs = ['visual_flow', 'logs'];

const contentRef = ref(null);
const previewStore = usePreviewStore();

const scrollContentToBottom = () => {
  contentRef.value.scrollTo({
    top: contentRef.value.scrollHeight,
    behavior: 'smooth',
  });
};
</script>

<style lang="scss" scoped>
.preview-details {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__tabs {
    padding: $unnnic-spacing-sm $unnnic-spacing-md 0;
  }

  &__content {
    overflow: hidden auto;

    padding: 0 $unnnic-spacing-md;

    height: 100%;
  }
}
</style>
