<template>
  <section
    class="catalog-product"
    @click="$emit('click')"
  >
    <section class="product__image">
      <img
        class="image__element"
        src="#"
      />
    </section>

    <section class="product__content">
      <header class="content__header">
        <UnnnicIntelligenceText
          color="neutral-dark"
          family="secondary"
          weight="bold"
          size="body-gt"
        >
          {{ product.product }}
        </UnnnicIntelligenceText>
        <UnnnicIntelligenceText
          class="header__description"
          color="neutral-cloudy"
          family="secondary"
          weight="regular"
          size="body-md"
        >
          {{ product.description }}
        </UnnnicIntelligenceText>
      </header>

      <footer class="content__footer">
        <UnnnicIntelligenceText
          color="weni-600"
          family="secondary"
          weight="bold"
          size="body-gt"
        >
          {{ product.currency || '$' }} {{ product.price }}
        </UnnnicIntelligenceText>

        <section
          class="content__actions"
          @click.stop
        >
          <button
            class="actions__button"
            @click.stop="decrementQuantity"
          >
            <UnnnicIcon
              icon="check_indeterminate_small"
              scheme="neutral-cloudy"
              size="avatar-nano"
            />
          </button>

          <UnnnicIntelligenceText
            color="neutral-dark"
            family="secondary"
            weight="bold"
            size="body-gt"
          >
            {{ quantity }}
          </UnnnicIntelligenceText>

          <button
            class="actions__button"
            @click.stop="incrementQuantity"
          >
            <UnnnicIcon
              icon="add"
              scheme="neutral-cloudy"
              size="avatar-nano"
            />
          </button>
        </section>
      </footer>
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

defineEmits(['click']);

const quantity = ref(0);

const incrementQuantity = () => {
  quantity.value++;
};

const decrementQuantity = () => {
  if (quantity.value > 0) {
    quantity.value--;
  }
};
</script>

<style lang="scss" scoped>
.catalog-product {
  border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

  padding: $unnnic-spacing-sm $unnnic-spacing-md;

  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: $unnnic-spacing-xs;
  align-items: center;

  cursor: pointer;

  &:hover {
    background-color: $unnnic-color-neutral-lightest;
  }

  .product__image {
    border-radius: $unnnic-border-radius-sm;
    overflow: hidden;

    width: 100%;
    aspect-ratio: 1/1;

    background-color: $unnnic-color-neutral-soft;

    .image__element {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .product__content {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-xs;

    overflow: hidden;

    .content__header {
      display: flex;
      flex-direction: column;

      .header__description {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }

    .content__footer {
      display: flex;
      justify-content: space-between;
      gap: $unnnic-spacing-xs;

      .content__actions {
        display: flex;
        gap: $unnnic-spacing-ant;

        .actions__button {
          background-color: transparent;
          border: none;
          padding: 0;

          display: flex;

          cursor: pointer;
        }
      }
    }
  }
}
</style>
