<template>
  <section class="catalog">
    <CatalogProductDetails
      v-if="selectedProduct"
      :product="selectedProduct"
    />
    <section
      v-else
      class="catalog__products"
    >
      <CatalogProduct
        v-for="(product, index) in message.catalog_message.products"
        :key="`product-${index}`"
        class="catalog__product"
        data-testid="catalog-product"
        :product="product"
        :quantity="getProductQuantity(product.id)"
        @click="openProductDetails(product)"
        @update:quantity="updateProductQuantity(product.id, $event)"
      />
    </section>

    <section
      v-if="selectedProduct || cartItemsQuantity > 0"
      class="catalog__cart"
    >
      <UnnnicButton
        type="primary"
        :text="
          selectedProduct
            ? $t('router.preview.catalog.add_to_cart')
            : $t('router.preview.catalog.view_cart', {
                quantity: cartItemsQuantity,
              })
        "
        @click="handleCartAction"
      />
    </section>

    <CatalogCartModal
      v-model="isCartOpen"
      :products="cartItems"
      @close="closeCart"
    />
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';

import CatalogProduct from './CatalogProduct.vue';
import CatalogProductDetails from './CatalogProductDetails.vue';
import CatalogCartModal from './CatalogCartModal.vue';

const emit = defineEmits(['send-message']);

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

const selectedProduct = ref(null);
function openProductDetails(product) {
  selectedProduct.value = product;
}

const cartItems = ref(
  props.message.catalog_message.products.map((product) => ({
    ...product,
    quantity: 0,
  })),
);

function getProductIndex(productId) {
  return cartItems.value.findIndex((product) => product.id === productId);
}

function getProductQuantity(productId) {
  return cartItems.value[getProductIndex(productId)]?.quantity || 0;
}

function updateProductQuantity(productId, quantity) {
  const productIndex = getProductIndex(productId);
  if (productIndex === -1) return;

  cartItems.value[productIndex].quantity = quantity;
}

const cartItemsQuantity = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + item.quantity, 0);
});

function addProductToCart(productId) {
  const id = productId;
  updateProductQuantity(id, getProductQuantity(id) + 1);
  selectedProduct.value = null;
}

function handleCartAction() {
  if (selectedProduct.value) {
    addProductToCart(selectedProduct.value.id);
  } else {
    openCart();
  }
}

const isCartOpen = ref(false);
function openCart() {
  isCartOpen.value = true;
}
function closeCart() {
  isCartOpen.value = false;
}
</script>

<style lang="scss" scoped>
.catalog {
  overflow: hidden;

  height: 100%;

  display: grid;
  grid-template-rows: 1fr auto;

  &__products {
    overflow-y: auto;
  }

  &__cart {
    border-top: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

    padding: $unnnic-spacing-sm $unnnic-spacing-md;

    display: grid;
  }
}
</style>
