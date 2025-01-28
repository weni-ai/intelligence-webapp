<template>
  <UnnnicDrawer
    :modelValue="modelValue"
    :title="$t('router.preview.agents_preview')"
    class="preview-drawer"
    size="lg"
    @close="$emit('update:modelValue', false)"
  >
    <template #content>
      <section class="preview-drawer__content">
        <section class="content__preview">
          <Tests
            usePreview
            @messages="handleMessages"
          />
        </section>

        <section class="content__details">
          <PreviewDetails :messages="messages" />
        </section>
      </section>
    </template>
  </UnnnicDrawer>
</template>

<script setup>
import { ref, watch } from 'vue';

import { usePreviewStore } from '@/store/Preview';

import Tests from '@/views/repository/content/Tests.vue';
import PreviewDetails from './PreviewDetails.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

defineEmits(['update:modelValue']);

const messages = ref([]);

const handleMessages = (newMessages) => {
  messages.value = newMessages;
};

const previewStore = usePreviewStore();

watch(
  () => props.modelValue,
  (isModalOpen) => {
    if (isModalOpen && !previewStore.ws) previewStore.connectWS();
    if (!isModalOpen) {
      if (previewStore.ws) previewStore.disconnectWS();
      previewStore.clearTraces();
    }
  },
);
</script>

<style lang="scss" scoped>
.preview-drawer {
  &:deep(.unnnic-drawer__container) .unnnic-drawer__content {
    padding: 0;
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
        gap: 0;

        .messages {
          padding: 0;
        }

        .write-message {
          padding: 0;
        }
      }
    }

    .content__details {
      overflow: hidden;
    }
  }
}
</style>
