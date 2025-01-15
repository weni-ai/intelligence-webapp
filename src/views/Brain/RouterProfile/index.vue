<template>
  <section class="profile">
    <UnnnicDivider
      data-testid="divider"
      ySpacing="md"
      class="profile__divider"
    />

    <RouterProfileGeneralInfo />

    <RouterProfileInstructions />
  </section>
</template>

<script setup>
import { onMounted } from 'vue';

import { useProfileStore } from '@/store/Profile';
import { useAlertStore } from '@/store/Alert.js';

import i18n from '@/utils/plugins/i18n';

import RouterProfileGeneralInfo from './RouterProfileGeneralInfo.vue';
import RouterProfileInstructions from './RouterProfileInstructions.vue';

const profileStore = useProfileStore();
const alertStore = useAlertStore();

onMounted(() => {
  profileStore.load().then(() => {
    if (profileStore.status === 'error') {
      alertStore.add({
        type: 'error',
        text: i18n.global.t('profile.invalid_get_data'),
      });
    }
  });
});
</script>

<style lang="scss" scoped>
.profile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  gap: $unnnic-spacing-md;

  .profile__divider {
    margin: 0;
  }
}
</style>
