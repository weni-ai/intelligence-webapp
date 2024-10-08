<template>
  <section class="customization__container">
    <div class="customization__container__persona">
      <section>
        <p class="customization-title">{{ $t('customization.title') }}</p>
        <p class="customization-sub_title">
          {{ $t('customization.sub_title') }}
        </p>
      </section>
      <div class="customization__form">
        <LoadingFormElement
          v-if="loading"
          label
        />

        <UnnnicFormElement
          v-else
          :label="$t('customization.fields.name')"
          class="customization__form-element"
        >
          <UnnnicInput
            v-model="brain.agent.name.current"
            data-test="input-name"
            :placeholder="$t('customization.placeholders.name')"
            :type="errorRequiredFields.name ? 'error' : 'normal'"
          />

          <FieldErrorRequired v-if="errorRequiredFields.name" />
        </UnnnicFormElement>
      </div>
      <div class="customization__form">
        <LoadingFormElement
          v-if="loading"
          label
        />

        <UnnnicFormElement
          v-else
          :label="$t('customization.fields.occupation')"
          class="customization__form-element"
        >
          <UnnnicInput
            v-model="brain.agent.role.current"
            data-test="input-role"
            :placeholder="$t('customization.placeholders.occupation')"
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
          :label="$t('customization.fields.personality')"
          class="customization__form-element"
        >
          <UnnnicSelectSmart
            data-test="select-personality"
            :modelValue="
              handlePersonalityValue(brain.agent.personality.current)
            "
            :options="personalities"
            orderedByIndex
            @update:model-value="
              brain.agent.personality.current = $event[0].value
            "
          />
        </UnnnicFormElement>
      </div>
      <div class="customization__container__persona">
        <LoadingFormElement
          v-if="loading"
          label
          element="textarea"
        />

        <UnnnicFormElement
          v-else
          :label="$t('customization.fields.goal')"
          class="customization__form-element"
        >
          <UnnnicTextArea
            v-bind="$props"
            v-model="brain.agent.goal.current"
            data-test="textarea"
            :placeholder="$t('customization.placeholders.goal')"
            :type="errorRequiredFields.goal ? 'error' : 'normal'"
          />

          <FieldErrorRequired v-if="errorRequiredFields.goal" />
        </UnnnicFormElement>
      </div>
    </div>

    <div class="customization__container__instructions">
      <section>
        <p class="customization-title">
          {{ $t('customization.instructions.title') }}
        </p>
        <p class="customization-sub_title">
          {{ $t('customization.instructions.sub_title') }}
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
        class="customization__instructions"
      >
        <UnnnicFormElement
          :label="$t('customization.fields.instruction')"
          class="customization__instructions-element"
        >
          <section class="customization__instructions__form_group">
            <UnnnicInput
              v-model="instruction.instruction"
              :data-test="`instruction-${index}`"
              :placeholder="$t('customization.placeholders.instruction')"
            />
            <UnnnicButtonIcon
              v-bind="$props"
              icon="delete-1-1"
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
        :text="$t('customization.instructions.add_instruction_btn')"
        type="tertiary"
        iconLeft="add-1"
        :disabled="false"
        @click="addInstruction"
      />
    </div>

    <UnnnicModal
      v-if="showRemoveModal"
      showModal
      scheme="aux-red-500"
      modalIcon="error"
      :text="$t('customization.instructions.modals.title')"
      :description="$t('customization.instructions.modals.description')"
      :closeIcon="false"
      class="modal-remove-instructions"
      data-test="remove-modal"
    >
      <template #options>
        <UnnnicButton
          type="tertiary"
          @click="showRemoveModal = false"
        >
          {{ $t('customization.instructions.modals.back_btn') }}
        </UnnnicButton>

        <UnnnicButton
          type="warning"
          :loading="removing"
          data-test="btn-remove-inst"
          @click="removeInstruction"
        >
          {{ $t('customization.instructions.modals.remove_btn') }}
        </UnnnicButton>
      </template>
    </UnnnicModal>
  </section>
</template>

<script>
import nexusaiAPI from '../../api/nexusaiAPI';
import LoadingFormElement from '../../components/LoadingFormElement.vue';
import FieldErrorRequired from './Preview/FieldErrorRequired.vue';

export default {
  components: {
    FieldErrorRequired,
    LoadingFormElement,
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
          label: this.$t('customization.fields.personality'),
          value: '',
        },
        {
          label: this.$t('customization.fields.personalities.friendly'),
          value: 'Amigável',
        },
        {
          label: this.$t('customization.fields.personalities.cooperative'),
          value: 'Cooperativo',
        },
        {
          label: this.$t('customization.fields.personalities.extrovert'),
          value: 'Extrovertido',
        },
        {
          label: this.$t('customization.fields.personalities.generous'),
          value: 'Generoso',
        },
        {
          label: this.$t('customization.fields.personalities.relaxed'),
          value: 'Relaxado',
        },
        {
          label: this.$t('customization.fields.personalities.organized'),
          value: 'Organizado',
        },
        {
          label: this.$t('customization.fields.personalities.systematic'),
          value: 'Sistemático',
        },
        {
          label: this.$t('customization.fields.personalities.innovative'),
          value: 'Inovador',
        },
        {
          label: this.$t('customization.fields.personalities.creative'),
          value: 'Criativo',
        },
        {
          label: this.$t('customization.fields.personalities.intellectual'),
          value: 'Intelectual',
        },
      ];
    },

    loading() {
      return this.brain.customizationStatus === 'loading';
    },

    brain() {
      return this.$store.state.Brain;
    },

    errorRequiredFields() {
      return this.brain.customizationErrorRequiredFields;
    },
  },

  mounted() {
    this.$store.dispatch('loadBrainCustomization');
  },

  methods: {
    addInstruction() {
      this.brain.instructions.current.push({
        instruction: '',
      });

      this.brain.instructions.old.push({
        instruction: '',
      });
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

        const { id: removeId } =
          this.brain.instructions.current[this.currentInstruction];

        if (removeId) {
          await nexusaiAPI.router.customization.delete({
            projectUuid: this.$store.state.Auth.connectProjectUuid,
            id: removeId,
          });
        }

        this.brain.instructions.current.splice(this.currentInstruction, 1);
        this.brain.instructions.old.splice(this.currentInstruction, 1);

        this.showRemoveModal = false;
        this.currentInstruction = null;

        this.$store.state.alert = {
          type: 'success',
          text: this.$t('customization.instructions.modals.success_message'),
        };
        if (this.brain.instructions.current.length === 0) {
          this.addInstruction();
        }
      } catch (e) {
        this.$store.state.alert = {
          type: 'error',
          text: this.$t('customization.instructions.modals.error_message'),
        };
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

.customization {
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
