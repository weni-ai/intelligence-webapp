<template>
  <UnnnicModalDialog
    :modelValue="modelValue"
    showCloseIcon
    :title="$t('router.preview.catalog.your_cart')"
    @update:model-value="close"
  >
    <CatalogProduct
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </UnnnicModalDialog>
</template>

<script setup>
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

const emit = defineEmits(['update:modelValue']);

function close() {
  emit('update:modelValue', false);
}
</script>
