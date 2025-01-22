<template>
  <Popover>
    <template #default>
      <UnnnicButton
        ref="selector"
        type="secondary"
        size="small"
        iconCenter="more_vert"
      />
    </template>

    <template #children="{ popoverId }">
      <section
        :popoverId
        trigger="click"
        horizontal="right-right"
        vertical="top-bottom"
        class="view-filter__popover"
      >
        <UnnnicIntelligenceText
          tag="p"
          family="secondary"
          size="body-md"
          color="neutral-cloudy"
        >
          {{ $t('router.monitoring.filters.view.title') }}
        </UnnnicIntelligenceText>

        <ul class="popover__options">
          <li
            v-for="option of viewOptions"
            :key="option"
            class="options__option"
          >
            <UnnnicRadio
              v-model="viewFilter"
              :value="option"
              size="sm"
            >
              {{ $t(`router.monitoring.filters.view.${option}`) }}
            </UnnnicRadio>
          </li>
        </ul>
      </section>
    </template>
  </Popover>
</template>

<script setup>
import { ref } from 'vue';

import Popover from '@/views/Brain/Popover.vue';

const viewFilter = ref('channels');
const viewOptions = ref(['channels', 'preview']);
</script>

<style lang="scss" scoped>
.view-filter {
  &__popover {
    padding: $unnnic-spacing-sm;

    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-xs;

    border-radius: $unnnic-border-radius-sm;
    background-color: $unnnic-color-background-snow;

    box-shadow: $unnnic-shadow-level-near;

    .popover__options {
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-xs;

      margin: 0;
      padding: 0;
      list-style: none;
    }
  }
}
</style>
