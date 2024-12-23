<template>
  <section class="skill">
    <img
      class="skill__icon"
      :src="icons[icon]"
    />

    <UnnnicIntelligenceText
      class="skill__title"
      tag="p"
      family="secondary"
      size="body-md"
      color="neutral-cloudy"
    >
      {{ title }}
    </UnnnicIntelligenceText>
  </section>
</template>

<script setup>
import VtexIcon from '@/assets/icons/vtex.svg';
import UpsIcon from '@/assets/icons/ups.svg';
import CreditCardIcon from '@/assets/icons/credit-card.png';
import CancelIcon from '@/assets/icons/cancel.png';
import GiftIcon from '@/assets/icons/gift.png';
import BalanceIcon from '@/assets/icons/balance.png';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

const icons = {
  vtex: VtexIcon,
  ups: UpsIcon,
  credit_card: CreditCardIcon,
  cancel: CancelIcon,
  gift: GiftIcon,
  balance: BalanceIcon,
};
</script>

<style lang="scss" scoped>
.skill {
  border-radius: $unnnic-border-radius-sm;
  border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

  padding: $unnnic-spacing-nano $unnnic-spacing-xs;

  display: flex;
  align-items: center;
  gap: $unnnic-spacing-nano;

  &__icon {
    width: $unnnic-icon-size-xs;
    height: $unnnic-icon-size-xs;
  }

  &__title {
    white-space: nowrap;
  }
}
</style>
