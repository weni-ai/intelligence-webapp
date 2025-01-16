<template>
  <section class="profile">
    <UnnnicDivider
      data-testid="divider"
      ySpacing="md"
      class="profile__divider"
    />

    <RouterProfileGeneralInfo data-testid="general-info" />

    <UnnnicDivider
      data-testid="divider"
      ySpacing="md"
      class="profile__divider"
    />

    <RouterProfileInstructions data-testid="instructions" />
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
section.profile {
  display: grid;
  grid-template-rows: repeat(2, auto 1fr);

  .profile__divider:first-of-type {
    margin-top: 0;
  }
}
</style>
