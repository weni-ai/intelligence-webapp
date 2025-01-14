<template>
  <section class="profile__container">
    <div class="profile__container__persona">
      <section>
        <p class="profile-title">{{ $t('profile.title') }}</p>
        <p class="profile-sub_title">
          {{ $t('profile.sub_title') }}
        </p>
      </section>
      <div class="profile__form">
        <LoadingFormElement
          v-if="loading"
          label
        />

        <UnnnicFormElement
          v-else
          :label="$t('profile.fields.name')"
          class="profile__form-element"
        >
          <UnnnicInput
            v-model="brain.name.current"
            data-test="input-name"
            :placeholder="$t('profile.placeholders.name')"
            :type="errorRequiredFields.name ? 'error' : 'normal'"
          />

          <FieldErrorRequired v-if="errorRequiredFields.name" />
        </UnnnicFormElement>
      </div>
      <div class="profile__form">
        <LoadingFormElement
          v-if="loading"
          label
        />

        <UnnnicFormElement
          v-else
          :label="$t('profile.fields.occupation')"
          class="profile__form-element"
        >
          <UnnnicInput
            v-model="brain.role.current"
            data-test="input-role"
            :placeholder="$t('profile.placeholders.occupation')"
            :type="errorRequiredFields.role ? 'error' : 'normal'"
          />

          <FieldErrorRequired v-if="errorRequiredFields.role" />
        </UnnnicFormElement>

        <LoadingFormElement
          v-if="loading"
          label
        />

        <UnnnicFormElement
          v-else
          :label="$t('profile.fields.personality')"
          class="profile__form-element"
        >
          <UnnnicSelectSmart
            data-test="select-personality"
            :modelValue="handlePersonalityValue(brain.personality.current)"
            :options="personalities"
            orderedByIndex
            @update:model-value="brain.personality.current = $event[0].value"
          />
        </UnnnicFormElement>
      </div>
      <div class="profile__container__persona">
        <LoadingFormElement
          v-if="loading"
          label
          element="textarea"
        />

        <UnnnicFormElement
          v-else
          :label="$t('profile.fields.goal')"
          class="profile__form-element"
        >
          <UnnnicTextArea
            v-bind="$props"
            v-model="brain.goal.current"
            data-test="textarea"
            :placeholder="$t('profile.placeholders.goal')"
            :type="errorRequiredFields.goal ? 'error' : 'normal'"
          />

          <FieldErrorRequired v-if="errorRequiredFields.goal" />
        </UnnnicFormElement>
      </div>
    </div>

    <div class="profile__container__instructions">
      <section>
        <p class="profile-title">
          {{ $t('profile.instructions.title') }}
        </p>
        <p class="profile-sub_title">
          {{ $t('profile.instructions.sub_title') }}
        </p>
      </section>

      <LoadingFormElement
        v-if="loading"
        label
      />

      <section
        v-for="(instruction, index) in brain.instructions.current"
        v-else
        :key="index"
        class="profile__instructions"
      >
        <UnnnicFormElement
          :label="$t('profile.fields.instruction')"
          class="profile__instructions-element"
        >
          <section class="profile__instructions__form_group">
            <UnnnicInput
              v-model="instruction.instruction"
              :data-test="`instruction-${index}`"
              :placeholder="$t('profile.placeholders.instruction')"
            />
            <UnnnicButtonIcon
              v-bind="$props"
              icon="delete"
              :data-test="`btn-delete-inst-${index}`"
              class="btn-color"
              size="small"
              @click="handleShowRemoveModal(index)"
            />
          </section>
        </UnnnicFormElement>
      </section>

      <LoadingFormElement v-if="loading" />

      <UnnnicButton
        v-else
        data-test="btn-add-instruction"
        size="large"
        :text="$t('profile.instructions.add_instruction_btn')"
        type="tertiary"
        iconLeft="add-1"
        :disabled="brain.instructions.current.at(-1)?.instruction === ''"
        @click="addEmptyInstruction"
      />
    </div>

    <UnnnicModal
      v-if="showRemoveModal"
      showModal
      scheme="aux-red-500"
      modalIcon="error"
      :text="$t('profile.instructions.modals.title')"
      :description="$t('profile.instructions.modals.description')"
      :closeIcon="false"
      class="modal-remove-instructions"
      data-test="remove-modal"
    >
      <template #options>
        <UnnnicButton
          type="tertiary"
          @click="showRemoveModal = false"
        >
          {{ $t('profile.instructions.modals.back_btn') }}
        </UnnnicButton>

        <UnnnicButton
          type="warning"
          :loading="removing"
          data-test="btn-remove-inst"
          @click="removeInstruction"
        >
          {{ $t('profile.instructions.modals.remove_btn') }}
        </UnnnicButton>
      </template>
    </UnnnicModal>
  </section>
</template>

<script>
import { useProfileStore } from '@/store/Profile';
import LoadingFormElement from '../../components/LoadingFormElement.vue';
import FieldErrorRequired from './Preview/FieldErrorRequired.vue';
import { onMounted } from 'vue';
import { useAlertStore } from '@/store/Alert.js';
import i18n from '@/utils/plugins/i18n';

export default {
  components: {
    FieldErrorRequired,
    LoadingFormElement,
  },

  setup() {
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

    return {
      alertStore,
      profileStore,
    };
  },

  data() {
    return {
      currentInstruction: 0,
      showRemoveModal: false,
      saving: false,
      removing: false,
    };
  },

  computed: {
    personalities() {
      return [
        {
          label: this.$t('profile.fields.personality'),
          value: '',
        },
        {
          label: this.$t('profile.fields.personalities.friendly'),
          value: 'Amigável',
        },
        {
          label: this.$t('profile.fields.personalities.cooperative'),
          value: 'Cooperativo',
        },
        {
          label: this.$t('profile.fields.personalities.extrovert'),
          value: 'Extrovertido',
        },
        {
          label: this.$t('profile.fields.personalities.generous'),
          value: 'Generoso',
        },
        {
          label: this.$t('profile.fields.personalities.relaxed'),
          value: 'Relaxado',
        },
        {
          label: this.$t('profile.fields.personalities.organized'),
          value: 'Organizado',
        },
        {
          label: this.$t('profile.fields.personalities.systematic'),
          value: 'Sistemático',
        },
        {
          label: this.$t('profile.fields.personalities.innovative'),
          value: 'Inovador',
        },
        {
          label: this.$t('profile.fields.personalities.creative'),
          value: 'Criativo',
        },
        {
          label: this.$t('profile.fields.personalities.intellectual'),
          value: 'Intelectual',
        },
      ];
    },

    loading() {
      return this.brain.status === 'loading';
    },

    brain() {
      return this.profileStore;
    },

    errorRequiredFields() {
      return this.brain.errorRequiredFields;
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
    handlePersonalityValue(value) {
      const personality = this.personalities.find((e) => value === e.value);

      return [personality];
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

        if (this.brain.instructions.current.length === 0) {
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

.profile {
  &-title {
    color: $unnnic-color-neutral-dark;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-gt;
    font-weight: $unnnic-font-weight-bold;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
  }

  &-sub_title {
    margin-top: $unnnic-spacing-xs;
    color: $unnnic-color-neutral-cloudy;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-gt;
    font-weight: $unnnic-font-weight-regular;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
  }

  &__container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
    gap: $unnnic-spacing-md;

    &__persona {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-sm;

      &__label {
        margin-bottom: $unnnic-spacing-nano;
      }
    }

    &__instructions {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: $unnnic-spacing-sm;
      align-self: stretch;

      button {
        width: 100%;
      }
    }
  }

  &__form {
    display: flex;
    align-items: flex-start;
    gap: $unnnic-spacing-sm;
    align-self: stretch;

    &-element {
      width: 100%;
    }
  }

  &__personality {
    display: flex;
    flex-wrap: wrap;
    gap: $unnnic-spacing-xs;

    &__item {
      display: flex;
      padding: $unnnic-spacing-xs $unnnic-spacing-ant;
      border-radius: $unnnic-border-radius-sm;
      border: 1px solid $unnnic-color-neutral-cleanest;
      background-color: $unnnic-color-neutral-lightest;
      flex-direction: column;
      align-items: flex-start;
      cursor: pointer;

      p {
        color: $unnnic-color-neutral-darkest;
        font-family: $unnnic-font-family-secondary;
        font-size: $unnnic-font-size-body-gt;
        font-weight: $unnnic-font-weight-regular;
        line-height: $unnnic-line-height-md;
      }
    }

    &-selected,
    :hover {
      border-color: $unnnic-color-weni-300;
      background-color: $unnnic-color-weni-100;
    }
  }

  &__form-element {
    :deep(textarea) {
      display: block;
    }

    :deep(.error-list) {
      margin-bottom: -$unnnic-spacing-nano;
    }

    :deep(.unnnic-text-area.md.error textarea::placeholder) {
      color: $unnnic-color-neutral-cleanest;
    }
  }

  &__instructions {
    width: 100%;

    &__form_group {
      display: grid;
      grid-template-columns: 11.6fr 0.4fr;
      gap: $unnnic-spacing-nano;

      button {
        background-color: $unnnic-color-neutral-white !important;
      }
    }

    &-element {
      width: 100%;
    }
  }
}
</style>
