<template>
  <section class="order-summary">
    <header class="order-summary__header">
      <UnnnicIcon
        icon="shopping_bag"
        size="avatar-nano"
        scheme="neutral-white"
      />
      <UnnnicIntelligenceText
        tag="h2"
        color="neutral-white"
        family="secondary"
        size="body-gt"
        weight="bold"
      >
        {{ $t('router.preview.catalog.order_summary') }}
      </UnnnicIntelligenceText>
    </header>

    <section class="order-summary__content">
      <UnnnicIntelligenceText
        tag="p"
        color="neutral-white"
        family="secondary"
        size="body-md"
      >
        {{ order.productsQuantity }}
        {{ $tc('router.preview.catalog.items', order.productsQuantity) }}
      </UnnnicIntelligenceText>

      <UnnnicIntelligenceText
        tag="p"
        color="neutral-white"
        family="secondary"
        size="body-md"
        weight="bold"
      >
        {{ $t('router.preview.catalog.subtotal') }}:
        {{ `${getCurrencySymbol()} ${order.subtotal}` }}
      </UnnnicIntelligenceText>
    </section>

    <UnnnicButton
      class="order-summary__view-details"
      type="primary"
      :text="$t('router.preview.catalog.view_order_details')"
      size="small"
      @click="handleViewOrderDetails"
    />

    <CatalogCartModal
      v-model="isOrderDetailsOpen"
      :products="order.products"
      :subtotal="order.subtotal"
      :enablePlaceOrder="false"
    />
  </section>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

import CatalogCartModal from '@/components/Preview/Menu/Catalog/CatalogCartModal.vue';

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['view-details', 'close-order-details']);

function getCurrencySymbol() {
  return props.order.products[0]?.currency || '$';
}

const isOrderDetailsOpen = ref(false);

function handleViewOrderDetails() {
  isOrderDetailsOpen.value = !isOrderDetailsOpen.value;
}
</script>

<style lang="scss" scoped>
.order-summary {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-xs;

  &__header {
    display: flex;
    align-items: center;
    gap: $unnnic-spacing-nano;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-nano;

    padding-bottom: $unnnic-spacing-ant;

    border-bottom: $unnnic-border-width-thinner solid $unnnic-color-weni-300;
  }

  &__view-details.unnnic-button {
    width: 100%;

    padding-left: $unnnic-spacing-xl;
    padding-right: $unnnic-spacing-xl;
  }
}
</style>
