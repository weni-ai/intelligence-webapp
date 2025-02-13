<template>
  <UnnnicDrawer
    :modelValue="modelValue"
    class="assign-agent-drawer"
    :title="$t('router.agents_team.drawer.title', { name: agent.name })"
    :primaryButtonText="$t('router.agents_team.drawer.assign')"
    :disabledPrimaryButton="!hasAllCredentialsWithValue"
    :loadingPrimaryButton="
      tuningsStore.credentials.status === 'loading' || isAssigning
    "
    @primary-button-click="toggleAgentAssignment"
    @close="close"
  >
    <template #content>
      <section class="assign-agent-drawer__content">
        <section
          v-if="hasCredentialsWithValue"
          class="assign-agent-drawer__credentials"
        >
          <UnnnicIntelligenceText
            tag="p"
            family="secondary"
            size="body-gt"
            color="neutral-dark"
          >
            {{ $t('router.agents_team.drawer.credentials_used_by_this_agent') }}
          </UnnnicIntelligenceText>

          <section class="credentials__list">
            <UnnnicIntelligenceText
              v-for="(credential, key) in credentialsWithValue"
              :key="key"
              tag="p"
              family="secondary"
              size="body-md"
              color="neutral-clean"
            >
              {{ credential.label }}
            </UnnnicIntelligenceText>
          </section>
        </section>

        <UnnnicIntelligenceText
          tag="p"
          family="secondary"
          size="body-gt"
          color="neutral-cloudy"
        >
          {{ $t('router.agents_team.drawer.description') }}
        </UnnnicIntelligenceText>

        <UnnnicFormElement
          v-for="(credential, key) in credentialsWithoutValue"
          :key="key"
          :label="credential.label"
        >
          <UnnnicInput
            :modelValue="getCredentialValue(credential.name)"
            :placeholder="credential.placeholder || credential.label"
            @update:model-value="
              tuningsStore.updateCredentialValue(credential.name, $event)
            "
          />
        </UnnnicFormElement>

        <section class="assign-agent-drawer__shared-info">
          <UnnnicIcon
            scheme="neutral-cleanest"
            icon="info"
            size="sm"
            filled
          />
          <UnnnicIntelligenceText
            tag="p"
            family="secondary"
            size="body-md"
            color="neutral-clean"
          >
            {{
              $t('router.agents_team.drawer.credentials_shared_with_all_agents')
            }}
          </UnnnicIntelligenceText>
        </section>
      </section>
    </template>
  </UnnnicDrawer>
</template>

<script setup>
import { useTuningsStore } from '@/store/Tunings';
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  agent: {
    type: Object,
    required: true,
  },
  isAssigning: {
    type: Boolean,
    required: false,
  },
});

const emit = defineEmits(['update:modelValue', 'assign']);

const tuningsStore = useTuningsStore();

const hasCredentialsWithValue = computed(() => {
  return props.agent.credentials?.some((credential) => {
    const [index, type] = tuningsStore.getCredentialIndex(credential.name);

    return tuningsStore.initialCredentials?.[type]?.[index]?.value;
  });
});

const credentialsWithoutValue = computed(() => {
  return (
    props.agent.credentials?.filter((credential) => {
      const [index, type] = tuningsStore.getCredentialIndex(credential.name);
      const value = tuningsStore.initialCredentials[type][index].value;
      return !value?.trim();
    }) || []
  );
});

const credentialsWithValue = computed(() => {
  const withoutValueNames = credentialsWithoutValue.value.map(
    (cred) => cred.name,
  );
  return (
    props.agent.credentials?.filter(
      (credential) =>
        getCredentialValue(credential.name) &&
        !withoutValueNames.includes(credential.name),
    ) || []
  );
});

const hasAllCredentialsWithValue = computed(() => {
  if (!props.agent.credentials?.length) return false;

  return props.agent.credentials.every((credential) => {
    const [index, type] = tuningsStore.getCredentialIndex(credential.name);
    const value = tuningsStore.credentials.data[type][index].value;
    return !!value?.trim();
  });
});

function close() {
  emit('update:modelValue', false);
}

async function toggleAgentAssignment() {
  await tuningsStore.saveCredentials();
  emit('assign');
}

const getCredentialValue = (credentialName) => {
  const [index, type] = tuningsStore.getCredentialIndex(credentialName);

  return tuningsStore.credentials.data[type][index].value;
};
</script>

<style lang="scss" scoped>
.assign-agent-drawer {
  &__content {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-sm;
  }

  &__credentials {
    border-radius: $unnnic-border-radius-md;
    border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

    padding: $unnnic-spacing-sm;

    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-nano;

    .credentials__list {
      display: flex;
      flex-direction: column;
    }
  }

  &__shared-info {
    border-radius: $unnnic-border-radius-sm;
    border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

    padding: $unnnic-spacing-ant;

    display: flex;
    align-items: center;
    gap: $unnnic-spacing-xs;
  }
}
</style>
