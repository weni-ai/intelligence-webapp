<template>
  <UnnnicDrawer
    data-testid="preview-drawer"
    :modelValue="modelValue"
    :title="$t('router.preview.agents_preview')"
    class="preview-drawer"
    size="xl"
    @close="$emit('update:modelValue', false)"
  >
    <template #title>
      <section
        data-testid="preview-drawer-header"
        class="preview-drawer__header"
      >
        <UnnnicIntelligenceText
          data-testid="preview-drawer-title"
          tag="h2"
          family="secondary"
          size="title-sm"
          weight="bold"
          color="neutral-darkest"
        >
          {{ $t('router.preview.agents_preview') }}
        </UnnnicIntelligenceText>
        <ContentItemActions
          data-testid="preview-drawer-actions"
          :actions="previewHeaderActions"
          minWidth="175px"
        />
      </section>
    </template>
    <template #content>
      <section
        data-testid="preview-drawer-content"
        class="preview-drawer__content"
      >
        <section
          data-testid="preview-drawer-preview"
          class="content__preview"
        >
          <Tests
            :key="refreshPreviewValue"
            usePreview
          />
        </section>

        <section
          data-testid="preview-drawer-details"
          class="content__details"
        >
          <PreviewDetails />
        </section>
      </section>
    </template>
  </UnnnicDrawer>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { usePreviewStore } from '@/store/Preview';

import Tests from '@/views/repository/content/Tests.vue';
import PreviewDetails from './PreviewDetails.vue';
import ContentItemActions from '@/views/repository/content/ContentItemActions.vue';
import i18n from '@/utils/plugins/i18n';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

defineEmits(['update:modelValue']);

const previewStore = usePreviewStore();

watch(
  () => props.modelValue,
  (isModalOpen) => {
    if (isModalOpen && !previewStore.ws) previewStore.connectWS();
  },
);

const previewHeaderActions = computed(() => [
  {
    scheme: 'neutral-dark',
    icon: 'refresh',
    text: i18n.global.t('router.preview.options.refresh'),
    onClick: refreshPreview,
  },
]);

const refreshPreviewValue = ref(0);

function refreshPreview() {
  refreshPreviewValue.value += 1;
  previewStore.clearTraces();
}
</script>

<style lang="scss" scoped>
.preview-drawer {
  &:deep(.unnnic-drawer__container) .unnnic-drawer__content {
    padding: 0;
  }

  &__header {
    display: flex;
    gap: $unnnic-spacing-xs;
    align-items: center;
  }

  &__content {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;

    .content__preview {
      display: flex;
      border-right: $unnnic-border-width-thinner solid
        $unnnic-color-neutral-soft;

      :deep(.quick-test) {
        padding: $unnnic-spacing-sm $unnnic-spacing-md;
        gap: $unnnic-spacing-xs;

        .messages {
          padding: 0;

          margin-right: -$unnnic-spacing-ant;
          padding-right: $unnnic-spacing-ant;
        }

        .write-message {
          padding: 0;
        }

        .message-input {
          padding: $unnnic-spacing-sm;
          padding-right: $unnnic-spacing-giant;
        }
      }
    }

    .content__details {
      overflow: hidden;
    }
  }
}
</style>
