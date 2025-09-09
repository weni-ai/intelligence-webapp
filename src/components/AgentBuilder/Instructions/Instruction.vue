<template>
  <section class="instruction">
    <template v-if="isEditing">
      <UnnnicInput
        v-model="editingText"
        class="instruction__input"
        data-testid="instruction-input"
        size="sm"
        :maxLength="200"
      />
      <UnnnicButton
        :text="$t('agent_builder.instructions.save_instruction')"
        type="secondary"
        size="small"
        :disabled="editingText.trim() === ''"
        :loading="instruction.status === 'loading'"
        data-testid="instruction-save-button"
        @click="saveEditingInstruction"
      />
      <UnnnicButton
        :text="$t('agent_builder.instructions.cancel_instruction')"
        type="tertiary"
        size="small"
        data-testid="instruction-cancel-button"
        @click="cancelEditingInstruction"
      />
    </template>

    <template v-else>
      <p
        class="instruction__text"
        data-testid="instruction-text"
      >
        {{ instruction.text }}
      </p>

      <p
        v-if="tag"
        class="instruction__tag"
        data-testid="instruction-tag"
      >
        {{ tag }}
      </p>

      <ContentItemActions
        v-if="showActions"
        :actions="actions"
        data-testid="instruction-actions"
      />
    </template>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import i18n from '@/utils/plugins/i18n';

import { useInstructionsStore } from '@/store/Instructions';

import ContentItemActions from '@/views/repository/content/ContentItemActions.vue';

const props = defineProps({
  instruction: {
    type: Object,
    required: true,
  },
  tag: {
    type: String,
    default: '',
  },
  showActions: {
    type: Boolean,
    default: true,
  },
});

const instructionsStore = useInstructionsStore();

const isEditing = ref(false);
const editingText = ref(props.instruction.text);

const actions = computed(() => [
  {
    text: i18n.global.t('agent_builder.instructions.edit_instruction'),
    icon: 'edit_square',
    scheme: 'neutral-dark',
    onClick: () => (isEditing.value = true),
  },
]);

async function saveEditingInstruction() {
  const { status } = await instructionsStore.editInstruction(
    props.instruction.id,
    editingText.value,
  );

  if (status === 'complete') isEditing.value = false;
}

function cancelEditingInstruction() {
  isEditing.value = false;
  editingText.value = props.instruction.text;
}
</script>

<style lang="scss" scoped>
.instruction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $unnnic-spacing-nano;

  padding: $unnnic-spacing-sm;

  &:not(:last-child) {
    border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
  }

  &__text {
    margin: 0;
    color: $unnnic-color-neutral-cloudy;

    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-gt;
    font-weight: $unnnic-font-weight-regular;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
  }

  &__tag {
    border-radius: $unnnic-border-radius-pill;

    padding: $unnnic-spacing-nano $unnnic-spacing-ant;
    margin-left: $unnnic-spacing-ant;

    background-color: $unnnic-color-neutral-light;
    color: $unnnic-color-neutral-darkest;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-md;
    font-weight: $unnnic-font-weight-regular;
    line-height: $unnnic-font-size-body-md + $unnnic-line-height-md;
  }

  &__input {
    width: 100%;
  }
}
</style>
