<template>
  <UnnnicModalDialog
    :modelValue="modelValue"
    data-testid="modal"
    class="modal-upgrade-to-multi-agents"
    showCloseIcon
    :title="$t('router.tunings.upgrade_to_multi_agents.modal.title')"
    size="sm"
    :secondaryButtonProps="{
      text: $t('router.tunings.upgrade_to_multi_agents.modal.cancel'),
    }"
    :primaryButtonProps="{
      text: $t('router.tunings.upgrade_to_multi_agents.modal.upgrade'),
      loading: isUpgrading,
    }"
    @update:model-value="emit('update:modelValue', $event)"
    @secondary-button-click="close"
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
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const isUpgrading = ref(false);
const emit = defineEmits(['update:modelValue']);
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

function close() {
  emit('update:modelValue', false);
}

async function upgradeToMultiagents() {
  isUpgrading.value = true;
  const { status } = await store.dispatch('upgradeToMultiagents');
  isUpgrading.value = false;

  close();

  if (status === 'success') {
    window.parent.postMessage(
      {
        event: 'upgrade-to-multi-agents',
        value: JSON.stringify(true),
      },
      '*',
    );
  }
}
</script>

<style lang="scss" scoped>
.upgrade-to-multi-agents__modal {
  :deep(.unnnic-modal-dialog__container__content) {
    padding-bottom: 0;
  }
}
</style>
