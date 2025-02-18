<template>
  <UnnnicModalDialog
    showCloseIcon
    showActionsDivider
    :title="currentStep.title"
    size="lg"
    :secondaryButtonProps="{
      text: $t('back'),
      'data-test': 'previous-button',
    }"
    :primaryButtonProps="{
      text: currentStep === lastStep ? $t('finish') : $t('next'),
      disabled: !isPrimaryButtonActive,
      loading: isLoading,
      'data-test': 'next-button',
    }"
    @secondary-button-click="goToPreviousStep"
    @primary-button-click="goToNextStep"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #leftSidebar>
      <LeftSidebar v-bind="leftSidebarProps" />
    </template>

    <section class="action-body">
      <StepSelectActionType
        v-if="currentStep.name === 'select_action_type'"
        v-model:templateUuid="templateUuid"
        v-model:sendLlmToFlow="sendLlmToFlow"
        :group="actionGroup"
      />

      <StepDescribe
        v-if="currentStep.name === 'describe'"
        v-model:description="description"
        v-model:actionType="actionType"
        v-model:sendLlmToFlow="sendLlmToFlow"
      />

      <StepSelectFlow
        v-if="currentStep.name === 'select_flow'"
        v-model:flowUuid="flowUuid"
        :name="name"
        :items="items"
        @update:name="isCustom ? (name = $event) : null"
      />

      <StepNominateAction
        v-if="currentStep.name === 'nominate_action'"
        v-model:name="name"
        :loading="loadingGenerateName"
      />
    </section>
  </UnnnicModalDialog>
</template>

<script>
import { useStore } from 'vuex';
import { usePagination } from '@/views/ContentBases/pagination';
import { useAlertStore } from '@/store/Alert.js';
import { useActionsStore } from '@/store/Actions.js';
import nexusaiAPI from '../../api/nexusaiAPI';
import LeftSidebar from './LeftSidebar.vue';
import StepSelectFlow from './steps/SelectFlow.vue';
import StepDescribe from './steps/Describe.vue';
import StepNominateAction from './steps/NominateAction.vue';
import StepSelectActionType from './steps/SelectActionType.vue';

export default {
  components: {
    LeftSidebar,
    StepSelectActionType,
    StepDescribe,
    StepSelectFlow,
    StepNominateAction,
  },

  props: {
    actionGroup: {
      type: String,
      required: true,
    },

    actionToEditUuid: {
      type: String,
      default: '',
    },
  },

  emits: ['update:modelValue', 'added', 'previousStep'],

  setup() {
    const alertStore = useAlertStore();
    const store = useStore();

    const items = usePagination({
      load: {
        request: nexusaiAPI.router.actions.flows.list,
        params: {
          projectUuid: store.state.Auth.connectProjectUuid,
          name: '',
        },
      },
    });

    const actionsStore = useActionsStore();

    return {
      alertStore,

      items,
      actionsStore,
    };
  },

  data() {
    return {
      isLoading: false,

      currentStepIndex: 0,

      name: '',
      loadingGenerateName: false,
      description: '',
      actionType: 'custom',
      flowUuid: '',
      templateUuid: '',
      sendLlmToFlow: false,
    };
  },

  computed: {
    isCustom() {
      return this.actionGroup === 'custom';
    },

    leftSidebarProps() {
      const baseProps = {
        steps: this.steps,
      };

      if (this.actionToEdit) {
        return {
          ...baseProps,
          title: this.$t('content_bases.actions.edit_action'),
          description: this.$t(
            'router.monitoring.improve_response.edit_action',
            {
              name: this.actionToEdit.name,
            },
          ),
        };
      }

      if (this.isCustom) {
        return {
          ...baseProps,
          title: this.$t('modals.actions.add.title'),
          description: this.$t('modals.actions.add.description'),
        };
      }

      return {
        ...baseProps,
        title: this.$t('modals.actions.add.custom_title', {
          name: this.$t(`action_type_selector.types.${this.actionGroup}.title`),
        }),
        description: this.$t('modals.actions.add.custom_description'),
      };
    },

    steps() {
      const steps = [];

      if (this.isCustom) {
        steps.push({
          name: 'describe',
          title: this.$t('modals.actions.add.steps.describe.title'),
        });
      } else {
        steps.push({
          name: 'select_action_type',
          title: this.$t('modals.actions.add.steps.describe.title'),
        });
      }

      steps.push({
        name: 'select_flow',
        title: this.$t('modals.actions.add.steps.select_flow.title'),
      });

      if (this.isCustom) {
        steps.push({
          name: 'nominate_action',
          title: this.$t('modals.actions.add.steps.nominate_action.title'),
        });
      }

      return steps.map((step, index) => ({
        ...step,
        active: index === this.currentStepIndex,
      }));
    },

    firstStep() {
      return this.steps.at(0);
    },

    lastStep() {
      return this.steps.at(-1);
    },

    currentStep() {
      return this.steps.find(({ active }) => active);
    },

    isPrimaryButtonActive() {
      if (this.currentStep.name === 'describe') {
        return this.description.trim();
      }

      if (this.currentStep.name === 'select_flow') {
        return this.flowUuid;
      }

      if (this.currentStep.name === 'nominate_action') {
        return this.name.trim();
      }

      return true;
    },

    actionToEdit() {
      return this.actionsStore.actions.data.find(
        (action) => action.uuid === this.actionToEditUuid,
      );
    },
  },

  mounted() {
    if (this.actionToEdit) {
      this.syncDataActionToEdit();
    }
  },

  methods: {
    close() {
      this.$emit('update:modelValue', false);
    },

    syncDataActionToEdit() {
      this.description = this.actionToEdit.prompt;
      this.flowUuid = this.actionToEdit.flow_uuid;
      this.name = this.actionToEdit.name;
    },

    async addAction() {
      try {
        this.isLoading = true;

        const data = this.templateUuid
          ? {
              flowUuid: this.flowUuid,
              templateUuid: this.templateUuid,
              send_llm_response_to_flow: this.sendLlmToFlow,
            }
          : {
              name: this.name,
              prompt: this.description,
              flowUuid: this.flowUuid,
              type: this.actionType,
              send_llm_response_to_flow: this.sendLlmToFlow,
            };

        const { name } = await this.actionsStore.add(data);

        this.alertStore.add({
          type: 'success',
          text: this.$t('modals.actions.add.messages.success', {
            name,
          }),
        });
      } finally {
        this.isLoading = false;

        this.close();
      }
    },

    async editAction() {
      if (!this.actionToEdit) return;

      try {
        this.isLoading = true;
        const action = await this.actionsStore.edit({
          uuid: this.actionToEdit.uuid,
          name: this.name,
          flow_uuid: this.flowUuid,
          prompt: this.description,
        });

        this.alertStore.add({
          type: 'success',
          text: this.$t('modals.actions.edit.messages.success', {
            name: action.name,
          }),
        });
      } finally {
        this.isLoading = false;

        this.close();
      }
    },

    goToPreviousStep() {
      if (this.currentStep === this.firstStep) {
        this.close();
        this.$emit('previousStep');
      } else {
        this.currentStepIndex -= 1;
      }
    },

    goToNextStep() {
      if (this.currentStep === this.lastStep) {
        this.actionToEdit ? this.editAction() : this.addAction();
      } else {
        if (this.isNeedGenerateName()) this.generateActionName();
        this.currentStepIndex += 1;
      }
    },

    async generateActionName() {
      this.loadingGenerateName = true;

      try {
        const response =
          await nexusaiAPI.router.actions.generatedNames.generate({
            projectUuid: this.$store.state.Auth.connectProjectUuid,
            chatbot_goal: this.$t(
              'modals.actions.add.steps.generate_action_name.chatbot_goal',
            ),
            context: this.$t(
              'modals.actions.add.steps.generate_action_name.context',
              {
                description: this.description,
              },
            ),
          });

        this.name = response.data.action_name;
      } finally {
        this.loadingGenerateName = false;
      }
    },

    isNeedGenerateName() {
      return this.currentStep.name === 'select_flow' && !this.actionToEdit;
    },
  },
};
</script>

<style lang="scss" scoped>
.action-body {
  height: 22 * $unnnic-font-size;
  display: flex;
  flex-direction: column;
}

.flow-modal {
  :deep(.unnnic-modal-container-background) {
    width: 100%;
    max-width: 37.75 * $unnnic-font-size;
  }

  :deep(.unnnic-modal-container-background-body-description-container) {
    padding-bottom: 0;
  }

  &__container {
    display: flex;
    flex-direction: column;
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: $unnnic-spacing-md;

    &__fill {
      display: flex;
      align-items: flex-start;
      gap: $unnnic-spacing-xs;

      &__container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      &__bar {
        width: 7.8125rem;
        height: 0.5rem;
        border-radius: $unnnic-border-radius-pill;
        background: $unnnic-color-neutral-soft;

        &--green {
          background: $unnnic-color-weni-600;
        }
      }
    }
  }
}
</style>
