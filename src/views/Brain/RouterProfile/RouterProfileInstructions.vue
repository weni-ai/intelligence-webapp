<template>
  <section class="profile__instructions">
    <section>
      <p
        class="instructions__title"
        data-testid="instructions-title"
      >
        {{ $t('profile.instructions.title') }}
      </p>
      <p
        class="instructions__subtitle"
        data-testid="instructions-subtitle"
      >
        {{ $t('profile.instructions.sub_title') }}
      </p>
    </section>

    <LoadingFormElement
      v-if="loading"
      data-testid="loading-instructions"
      label
    />

    <section
      v-for="(instruction, index) in profile.instructions.current"
      v-else
      :key="index"
      class="instructions__list"
    >
      <UnnnicFormElement
        :label="$t('profile.instructions.instruction.title')"
        class="list__element"
      >
        <section class="element__form">
          <UnnnicInput
            v-model="instruction.instruction"
            :data-testid="`instruction-${index}`"
            :placeholder="$t('profile.instructions.instruction.placeholder')"
          />
          <UnnnicButtonIcon
            v-bind="$props"
            icon="delete"
            :data-testid="`btn-delete-inst-${index}`"
            class="btn-color"
            size="small"
            @click="handleShowRemoveModal(index)"
          />
        </section>
      </UnnnicFormElement>
    </section>

    <LoadingFormElement
      v-if="loading"
      data-testid="loading-add-instruction"
    />

    <UnnnicButton
      v-else
      class="instructions__add-button"
      data-testid="btn-add-instruction"
      size="large"
      :text="$t('profile.instructions.add_instruction_btn')"
      type="tertiary"
      iconLeft="add-1"
      :disabled="profile.instructions.current.at(-1)?.instruction === ''"
      @click="addEmptyInstruction"
    />
  </section>

  <UnnnicModal
    v-if="showRemoveModal"
    showModal
    scheme="aux-red-500"
    modalIcon="error"
    :text="$t('profile.instructions.modals.title')"
    :description="$t('profile.instructions.modals.description')"
    :closeIcon="false"
    class="modal-remove-instructions"
    data-testid="remove-modal"
  >
    <template #options>
      <UnnnicButton
        type="tertiary"
        data-testid="btn-back-inst"
        @click="showRemoveModal = false"
      >
        {{ $t('profile.instructions.modals.back_btn') }}
      </UnnnicButton>

      <UnnnicButton
        type="warning"
        :loading="removing"
        data-testid="btn-remove-inst"
        @click="removeInstruction"
      >
        {{ $t('profile.instructions.modals.remove_btn') }}
      </UnnnicButton>
    </template>
  </UnnnicModal>
</template>

<script>
import { useProfileStore } from '@/store/Profile';
import { useAlertStore } from '@/store/Alert.js';

import LoadingFormElement from '@/components/LoadingFormElement.vue';

export default {
  components: {
    LoadingFormElement,
  },

  setup() {
    const profileStore = useProfileStore();
    const alertStore = useAlertStore();

    return {
      alertStore,
      profileStore,
    };
  },

  data() {
    return {
      currentInstruction: 0,
      showRemoveModal: false,
      removing: false,
    };
  },

  computed: {
    loading() {
      return this.profile.status === 'loading';
    },

    profile() {
      return this.profileStore;
    },

    errorRequiredFields() {
      return this.profile.errorRequiredFields;
    },
  },

  methods: {
    addEmptyInstruction() {
      this.profileStore.addEmptyInstruction();
    },

    handleShowRemoveModal(index) {
      this.showRemoveModal = true;
      this.currentInstruction = index;
    },
    async removeInstruction() {
      try {
        this.removing = true;

        await this.profileStore.removeInstruction(this.currentInstruction);

        this.showRemoveModal = false;
        this.currentInstruction = null;

        this.alertStore.add({
          type: 'success',
          text: this.$t('profile.instructions.modals.success_message'),
        });

        if (this.profile.instructions.current.length === 0) {
          this.addEmptyInstruction();
        }
      } catch {
        this.alertStore.add({
          type: 'error',
          text: this.$t('profile.instructions.modals.error_message'),
        });
      } finally {
        this.removing = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-remove-instructions {
  :deep(.unnnic-modal-container-background-body-description-container) {
    padding-bottom: 0;
  }

  :deep(.unnnic-modal-container-background-body-title) {
    padding-bottom: $unnnic-spacing-sm;
  }
}

.profile__instructions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $unnnic-spacing-sm;
  align-self: stretch;

  .instructions__title {
    color: $unnnic-color-neutral-darkest;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-lg;
    font-weight: $unnnic-font-weight-bold;
    line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
  }

  .instructions__subtitle {
    margin-top: $unnnic-spacing-xs;
    color: $unnnic-color-neutral-cloudy;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-gt;
    font-weight: $unnnic-font-weight-regular;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
  }

  .instructions__list {
    width: 100%;

    .list__element {
      width: 100%;

      .element__form {
        display: grid;
        grid-template-columns: 11.6fr 0.4fr;
        gap: $unnnic-spacing-nano;

        button {
          background-color: $unnnic-color-neutral-white !important;
        }
      }
    }
  }

  .instructions__add-button {
    width: 100%;
  }
}
</style>
