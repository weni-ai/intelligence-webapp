<template>
  <section class="preview-menu">
    <header
      class="preview-menu__header"
      data-testid="menu-header"
    >
      <UnnnicIntelligenceText
        data-testid="menu-title"
        color="weni-600"
        family="secondary"
        weight="bold"
        size="body-lg"
      >
        {{ dynamicTitle }}
      </UnnnicIntelligenceText>

      <section
        class="header__close-button"
        data-testid="menu-close-button"
        @click="handleClose"
      >
        <UnnnicIcon
          icon="close"
          scheme="weni-600"
          size="avatar-nano"
        />
      </section>
    </header>
    <section
      class="preview-menu__content"
      data-testid="menu-content"
    >
      <component
        :is="resolvedComponent"
        v-model:selectedProduct="selectedProduct"
        :message="message"
        data-testid="menu-content-component"
        @send-message="$emit('send-message', $event)"
        @send-order="$emit('send-order', $event)"
      />
    </section>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';

import ListMessages from './ListMessages.vue';
import Catalog from './Catalog/index.vue';
import i18n from '@/utils/plugins/i18n';

const emit = defineEmits(['update:model-value', 'send-message', 'send-order']);
const selectedProduct = ref(null);

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
    required: false,
  },
  title: {
    type: String,
    default: 'Menu',
    required: false,
  },
  message: {
    type: Object,
    required: true,
  },
});

const resolvedComponent = computed(() => {
  const messageData = props.message;
  if (!messageData) return null;

  if (messageData.interaction_type === 'list' && messageData.list_message) {
    return ListMessages;
  }

  if (messageData.catalog_message) {
    return Catalog;
  }

  return null;
});

const dynamicTitle = computed(() => {
  if (resolvedComponent.value === Catalog && selectedProduct.value) {
    return selectedProduct.value.product;
  }

  if (resolvedComponent.value === Catalog) {
    return i18n.global.t('router.preview.catalog.title');
  }

  return props.title;
});

const handleClose = () => {
  if (resolvedComponent.value === Catalog && selectedProduct.value) {
    selectedProduct.value = null;
  } else {
    emit('update:model-value', false);
  }
};
</script>

<style lang="scss" scoped>
.preview-menu {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    background-color: $unnnic-color-weni-100;
    padding: $unnnic-spacing-sm $unnnic-spacing-md;

    .header__close-button {
      display: flex;

      cursor: pointer;
    }
  }

  &__content {
    overflow-y: auto;

    height: 100%;
  }
}
</style>
