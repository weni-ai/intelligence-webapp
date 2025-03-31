<template>
  <section class="catalog">
    <CatalogProductDetails
      v-if="localSelectedProduct"
      :product="localSelectedProduct"
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
        enableSeeProductDetails
        @click="openProductDetails(product)"
        @update:quantity="updateProductQuantity(product.id, $event)"
      />
    </section>

    <section
      v-if="localSelectedProduct || cartItemsQuantity > 0"
      class="catalog__cart"
    >
      <UnnnicButton
        type="primary"
        :text="
          localSelectedProduct
            ? $t('router.preview.catalog.add_to_cart')
            : $tc('router.preview.catalog.view_cart', cartItemsQuantity, {
                quantity: cartItemsQuantity,
              })
        "
        @click="handleCartAction"
      />
    </section>

    <CatalogCartModal
      v-model="isCartOpen"
      :products="cartItems"
      :subtotal="cartSubtotal"
      @update:quantity="updateProductQuantity"
      @close="closeCart"
      @place-order="placeOrder"
    />
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';

import CatalogProduct from './CatalogProduct.vue';
import CatalogProductDetails from './CatalogProductDetails.vue';
import CatalogCartModal from './CatalogCartModal.vue';

const emit = defineEmits([
  'send-message',
  'send-order',
  'update:selectedProduct',
]);

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  selectedProduct: {
    type: Object,
    default: null,
  },
});

const localSelectedProduct = computed({
  get: () => props.selectedProduct,
  set: (value) => emit('update:selectedProduct', value),
});

function openProductDetails(product) {
  localSelectedProduct.value = product;
}

const cartItems = ref([]);

const cartSubtotal = computed(() => {
  const subtotal = cartItems.value.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0,
  );

  return subtotal % 1 === 0 ? subtotal : subtotal.toFixed(2);
});

const order = computed(() => ({
  products: cartItems.value,
  productsQuantity: cartItemsQuantity.value,
  subtotal: cartSubtotal.value,
}));

function getProductIndex(productId) {
  return cartItems.value.findIndex((product) => product.id === productId);
}

function getProductQuantity(productId) {
  const productInCart = cartItems.value.find(
    (product) => product.id === productId,
  );
  return productInCart?.quantity || 0;
}

function updateProductQuantity(productId, quantity) {
  const productIndex = getProductIndex(productId);

  if (productIndex === -1 && quantity > 0) {
    const productToAdd = props.message.catalog_message.products.find(
      (product) => product.id === productId,
    );
    if (productToAdd) {
      cartItems.value.push({ ...productToAdd, quantity });
    }
    return;
  }

  if (quantity === 0 && productIndex !== -1) {
    cartItems.value.splice(productIndex, 1);
    return;
  }

  if (productIndex !== -1) {
    cartItems.value[productIndex].quantity = quantity;
  }
}

const cartItemsQuantity = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + item.quantity, 0);
});

function addProductToCart(productId) {
  const id = productId;
  updateProductQuantity(id, getProductQuantity(id) + 1);
  localSelectedProduct.value = null;
}

function handleCartAction() {
  if (localSelectedProduct.value) {
    addProductToCart(localSelectedProduct.value.id);
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

function placeOrder() {
  emit('send-order', order.value);
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
