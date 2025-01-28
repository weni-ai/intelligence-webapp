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
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

import WS from '@/websocket/setup';

import { usePreviewStore } from '@/store/Preview';

import Tests from '@/views/repository/content/Tests.vue';
import PreviewDetails from './PreviewDetails.vue';

defineProps({
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

const ws = ref(null);
const store = useStore();
const auth = computed(() => store.state.Auth);
const previewStore = usePreviewStore();

function connectMonitoringWS() {
  if (previewStore.ws) return;

  ws.value = new WS({
    project: auth.value.connectProjectUuid,
    token: auth.value.token.replace('Bearer ', ''),
    endpoint: 'preview',
  });
  ws.value.connect();

  previewStore.ws = ws;
}

onMounted(() => connectMonitoringWS());
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
