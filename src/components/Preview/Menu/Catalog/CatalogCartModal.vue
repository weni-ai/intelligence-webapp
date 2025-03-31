<template>
  <UnnnicModalDialog
    class="catalog-cart-modal"
    :modelValue="modelValue"
    showCloseIcon
    :title="$t('router.preview.catalog.your_cart')"
    @update:model-value="close"
  >
    <section class="catalog-cart-modal__products">
      <CatalogProduct
        v-for="product in products"
        :key="product.id"
        :product="product"
        :quantity="product.quantity"
        @update:quantity="$emit('update:quantity', product.id, $event)"
      />
    </section>

    <section class="catalog-cart-modal__subtotal">
      <UnnnicIntelligenceText
        tag="p"
        color="neutral-dark"
        family="secondary"
        size="body-lg"
        weight="black"
      >
        {{ $t('router.preview.catalog.subtotal') }}
      </UnnnicIntelligenceText>

      <UnnnicIntelligenceText
        tag="p"
        color="weni-600"
        family="secondary"
        size="title-sm"
        weight="black"
      >
        {{ `${products[0].currency} ${productsSubtotal}` }}
      </UnnnicIntelligenceText>
    </section>

    <UnnnicButton
      class="catalog-cart-modal__place-order"
      :text="$t('router.preview.catalog.place_order')"
      :disabled="!productsSubtotal"
    />
  </UnnnicModalDialog>
</template>

<script setup>
import { computed } from 'vue';

import CatalogProduct from './CatalogProduct.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  products: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'update:quantity']);

const productsSubtotal = computed(() => {
  const subtotal = props.products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0,
  );

  return subtotal % 1 === 0 ? subtotal : subtotal.toFixed(2);
});

function close() {
  emit('update:modelValue', false);
}
</script>

<style lang="scss" scoped>
.catalog-cart-modal {
  :deep(.unnnic-modal-dialog__container__content) {
    padding: 0;
  }

  &__subtotal {
    padding: $unnnic-spacing-sm $unnnic-spacing-md;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $unnnic-spacing-xs;

    border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
  }

  &__place-order {
    margin: $unnnic-spacing-sm $unnnic-spacing-md $unnnic-spacing-md
      $unnnic-spacing-md;

    width: calc(100% - ($unnnic-spacing-md * 2));
  }
}
</style>
