<template>
  <img
    v-if="icon && agentIcon"
    :src="agentIcon"
    class="content__icon"
    data-testid="agent-icon"
  />
</template>

<script setup>
import { computed } from 'vue';

import OrdersAgent from '@/assets/icons/agents/OrdersAgent.svg';
import CustomIcon1 from '@/assets/icons/agents/CustomIcon1.svg';
import CustomIcon2 from '@/assets/icons/agents/CustomIcon2.svg';
import CustomIcon3 from '@/assets/icons/agents/CustomIcon3.svg';
import CustomIcon4 from '@/assets/icons/agents/CustomIcon4.svg';
import CustomIcon5 from '@/assets/icons/agents/CustomIcon5.svg';
import CustomIcon6 from '@/assets/icons/agents/CustomIcon6.svg';
import CustomIcon7 from '@/assets/icons/agents/CustomIcon7.svg';
import CustomIcon8 from '@/assets/icons/agents/CustomIcon8.svg';
import CustomIcon9 from '@/assets/icons/agents/CustomIcon9.svg';
import CustomIcon10 from '@/assets/icons/agents/CustomIcon10.svg';
import CustomIcon11 from '@/assets/icons/agents/CustomIcon11.svg';
import CustomIcon12 from '@/assets/icons/agents/CustomIcon12.svg';
import CustomIcon13 from '@/assets/icons/agents/CustomIcon13.svg';
import CustomIcon14 from '@/assets/icons/agents/CustomIcon14.svg';
import CustomIcon15 from '@/assets/icons/agents/CustomIcon15.svg';
import CustomIcon16 from '@/assets/icons/agents/CustomIcon16.svg';
import CustomIcon17 from '@/assets/icons/agents/CustomIcon17.svg';
import CustomIcon18 from '@/assets/icons/agents/CustomIcon18.svg';
import CustomIcon19 from '@/assets/icons/agents/CustomIcon19.svg';
import CustomIcon20 from '@/assets/icons/agents/CustomIcon20.svg';
import CustomIcon21 from '@/assets/icons/agents/CustomIcon21.svg';
import CustomIcon22 from '@/assets/icons/agents/CustomIcon22.svg';
import CustomIcon23 from '@/assets/icons/agents/CustomIcon23.svg';
import CustomIcon24 from '@/assets/icons/agents/CustomIcon24.svg';

const agentIcons = {
  OrdersAgent,
  CustomIcon1,
  CustomIcon2,
  CustomIcon3,
  CustomIcon4,
  CustomIcon5,
  CustomIcon6,
  CustomIcon7,
  CustomIcon8,
  CustomIcon9,
  CustomIcon10,
  CustomIcon11,
  CustomIcon12,
  CustomIcon13,
  CustomIcon14,
  CustomIcon15,
  CustomIcon16,
  CustomIcon17,
  CustomIcon18,
  CustomIcon19,
  CustomIcon20,
  CustomIcon21,
  CustomIcon22,
  CustomIcon23,
  CustomIcon24,
};

const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
});

const agentIcon = computed(() => {
  if (!props.icon) return;

  return agentIcons[props.icon] || null;
});
</script>
