<template>
  <section class="tunings__upgrade-to-multi-agents">
    <header class="upgrade-to-multi-agents__header">
      <UnnnicIntelligenceText
        color="neutral-darkest"
        family="secondary"
        size="body-gt"
        weight="bold"
        data-testid="upgrade-to-multi-agents-title"
      >
        {{ $t('router.tunings.upgrade_to_multi_agents.title') }}
      </UnnnicIntelligenceText>

      <UnnnicIntelligenceText
        color="neutral-cloudy"
        family="secondary"
        size="body-gt"
        data-testid="upgrade-to-multi-agents-description"
      >
        {{ $t('router.tunings.upgrade_to_multi_agents.description') }}
      </UnnnicIntelligenceText>
    </header>

    <UnnnicButton
      type="attention"
      :text="$t('router.tunings.upgrade_to_multi_agents.button')"
      data-testid="upgrade-to-multiagents-button"
      @click="handleUpgradeToMultiagentsModal"
    />

    <UnnnicModalDialog
      v-model:modelValue="openUpgradeToMultiagentsModal"
      data-testid="modal"
      class="upgrade-to-multi-agents__modal"
      showCloseIcon
      icon="error"
      iconScheme="aux-yellow-500"
      :title="$t('router.tunings.upgrade_to_multi_agents.modal.title')"
      size="sm"
      :secondaryButtonProps="{
        text: $t('router.tunings.upgrade_to_multi_agents.modal.cancel'),
      }"
      :primaryButtonProps="{
        text: $t('router.tunings.upgrade_to_multi_agents.modal.upgrade'),
        type: 'attention',
        loading: isUpgrading,
      }"
      @secondary-button-click="handleUpgradeToMultiagentsModal"
      @primary-button-click="upgradeToMultiagents"
    >
      <UnnnicIntelligenceText
        color="neutral-cloudy"
        family="secondary"
        size="body-gt"
      >
        {{ $t('router.tunings.upgrade_to_multi_agents.modal.description') }}
      </UnnnicIntelligenceText>
    </UnnnicModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const openUpgradeToMultiagentsModal = ref(false);
const isUpgrading = ref(false);

function handleUpgradeToMultiagentsModal() {
  openUpgradeToMultiagentsModal.value = !openUpgradeToMultiagentsModal.value;
}

async function upgradeToMultiagents() {
  isUpgrading.value = true;
  const { status } = await store.dispatch('upgradeToMultiagents');
  isUpgrading.value = false;

  handleUpgradeToMultiagentsModal();

  if (status === 'success') {
    router.replace({ name: 'agents' });
  }
}
</script>

<style lang="scss" scoped>
.tunings__upgrade-to-multi-agents {
  border-radius: $unnnic-border-radius-md;
  border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

  padding: $unnnic-spacing-sm;

  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-sm;

  .upgrade-to-multi-agents__header {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-xs;
  }

  .upgrade-to-multi-agents__modal {
    :deep(.unnnic-modal-dialog__container__content) {
      padding-bottom: 0;
    }
  }
}
</style>
