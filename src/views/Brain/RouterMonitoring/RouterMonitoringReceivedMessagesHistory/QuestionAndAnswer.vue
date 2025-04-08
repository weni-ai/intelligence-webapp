<template>
  <section class="question-and-answer">
    <template v-if="isLoading">
      <UnnnicSkeletonLoading
        data-testid="skeleton-question"
        class="question-and-answer__skeleton-question"
        tag="div"
        width="100%"
        height="60px"
      />
      <UnnnicSkeletonLoading
        data-testid="skeleton-answer"
        class="question-and-answer__skeleton-answer"
        tag="div"
        width="100%"
        height="60px"
      />
    </template>
    <template v-else>
      <Markdown
        data-testid="question"
        :class="[
          'question-and-answer__message',
          'question-and-answer__question',
        ]"
        :content="data.text"
      />

      <section
        v-if="data.llm.status === 'action'"
        class="question-and-answer__action-started"
        data-testid="action"
      >
        <section class="action-started__text">
          <UnnnicIcon
            data-testid="action-icon"
            icon="bolt"
            size="sm"
            scheme="neutral-cloudy"
          />
          <UnnnicIntelligenceText
            data-testid="action-name"
            color="neutral-cloudy"
            family="secondary"
            size="body-md"
            tag="p"
          >
            {{
              $t('router.monitoring.activated_the_action', {
                action: data.action?.name,
              })
            }}
          </UnnnicIntelligenceText>
        </section>
        <UnnnicButton
          class="action-started__inspect-response"
          data-testid="inspect-response-action"
          size="small"
          :text="$t('router.monitoring.inspect_response.inspect')"
          type="secondary"
          iconLeft="info"
          @click="isDrawerInspectAnswerOpen = true"
        />
      </section>
      <section
        v-else
        class="question-and-answer__answer"
      >
        <PreviewLogs
          v-if="showLogs"
          :logs="logs"
          logsSide="right"
        />

        <section
          v-if="data.llm.response"
          class="question-and-answer__message-container"
        >
          <Markdown
            data-testid="answer"
            :class="[
              'question-and-answer__message',
              'question-and-answer__answer-text',
              `question-and-answer__answer-text--${data.llm.status}`,
            ]"
            :content="data.llm.response"
          />

          <button
            v-if="isAgentsTeamActive"
            :class="[
              'answer__show-logs',
              { 'answer__show-logs--loading': loadingLogs },
            ]"
            :disabled="loadingLogs"
            @click="handleShowLogs"
          >
            <section class="show-logs__icon-container">
              <UnnnicIconLoading
                size="sm"
                class="show-logs__icon"
              />
            </section>
            <p class="show-logs__text">
              {{
                logs.length && showLogs
                  ? $t('router.monitoring.hide_logs')
                  : $t('router.monitoring.show_logs')
              }}
            </p>
          </button>
        </section>

        <UnnnicButton
          v-if="!isAgentsTeamActive"
          class="answer__inspect-response"
          data-testid="inspect-response"
          size="small"
          :text="$t('router.monitoring.inspect_response.title')"
          type="secondary"
          iconLeft="info"
          @click="isDrawerInspectAnswerOpen = true"
        />
      </section>
      <DrawerInspectAnswer
        v-model="isDrawerInspectAnswerOpen"
        data-testid="drawer-inspect-response"
        :inspectionData="data"
      />
    </template>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

import DrawerInspectAnswer from '@/components/Brain/Monitoring/DrawerInspectResponse/index.vue';
import Markdown from '@/components/Markdown.vue';
import PreviewLogs from '@/components/Brain/PreviewLogs.vue';
import { useFeatureFlagsStore } from '@/store/FeatureFlags';
import { useMonitoringStore } from '@/store/Monitoring';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

const featureFlagsStore = useFeatureFlagsStore();
const monitoringStore = useMonitoringStore();

const showLogs = ref(false);
const loadingLogs = ref(false);
const logs = ref([]);
const isDrawerInspectAnswerOpen = ref(false);

const isAgentsTeamActive = computed(() => {
  return featureFlagsStore.flags.agentsTeam;
});

function handleShowLogs() {
  if (loadingLogs.value) return;

  if (logs.value.length) {
    showLogs.value = !showLogs.value;
    return;
  }

  loadLogs();
}

async function loadLogs() {
  loadingLogs.value = true;

  try {
    logs.value = await monitoringStore.loadLogs({
      messageId: props.data.id,
    });

    showLogs.value = true;
  } catch (error) {
    console.error(error);
  } finally {
    loadingLogs.value = false;
  }
}

watch(
  () => props.data.id,
  () => {
    showLogs.value = false;
    logs.value = [];
  },
);
</script>

<style lang="scss" scoped>
.question-and-answer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(auto, 1fr);
  gap: $unnnic-spacing-xs;

  &__question,
  &__skeleton-question {
    grid-column: 1 / span 2;
    grid-row: 1;
  }

  &__answer,
  &__skeleton-answer {
    grid-column: 2 / span 2;
    grid-row: 2;
  }

  &__message {
    height: fit-content;
    width: fit-content;

    border-radius: $unnnic-border-radius-md;

    padding: $unnnic-spacing-ant;

    background-color: $unnnic-color-background-solo;

    color: $unnnic-color-neutral-dark;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-gt;
  }

  &__message-container {
    position: relative;
  }

  &__question {
    font-weight: $unnnic-font-weight-bold;
  }

  &__answer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: $unnnic-spacing-nano;
    width: fit-content;
    justify-self: end;

    &-text {
      justify-self: flex-end;
      padding: $unnnic-spacing-sm $unnnic-spacing-ant;

      &--success,
      &--action {
        color: $unnnic-color-neutral-white;
        background-color: $unnnic-color-weni-600;
      }

      &--failed {
        color: $unnnic-color-neutral-darkest;
        background-color: $unnnic-color-aux-red-100;
      }
    }

    .answer__inspect-response {
      width: 100%;
    }

    .answer__show-logs {
      position: absolute;
      left: $unnnic-spacing-ant;
      bottom: -($unnnic-spacing-xl) / 4;

      border-radius: $unnnic-border-radius-pill;
      border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
      background: $unnnic-color-neutral-white;
      box-shadow: 0px 0px $unnnic-spacing-xs 0 rgba(0, 0, 0, 0.08);

      padding: calc($unnnic-spacing-nano / 2) $unnnic-spacing-ant;

      display: flex;

      cursor: pointer;

      &:active:not(:disabled) {
        box-shadow: inset 0px 0px 8px 0 rgba(0, 0, 0, 0.08);
      }

      &:disabled {
        box-shadow: inset 0px 0px 8px 0 rgba(0, 0, 0, 0.08);
        background-color: $unnnic-color-neutral-soft;
        color: $unnnic-color-neutral-clean;
        cursor: not-allowed;
      }

      .show-logs__text,
      .show-logs__icon {
        color: $unnnic-color-neutral-cloudy;
        font-size: $unnnic-font-size-body-md;
      }

      .show-logs__text {
        font-family: $unnnic-font-family-secondary;
        line-height: $unnnic-line-height-md * 1.75;
      }

      .show-logs__icon {
        opacity: 0;
      }

      .show-logs__icon-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        display: flex;
      }

      &--loading {
        .show-logs__text {
          opacity: 0;
        }

        .show-logs__icon {
          opacity: 1;
        }
      }
    }
  }

  &__action-started {
    grid-column: 1 / 4;
    grid-row: 2;

    display: grid;
    grid-template-columns: repeat(4, 1fr);
    row-gap: $unnnic-spacing-xs;

    .action-started__text {
      grid-column: 1 / 5;
      grid-row: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: $unnnic-spacing-nano;
    }

    .action-started__inspect-response {
      grid-column: 2 / 4;
      grid-row: 2;
    }
  }
}
</style>
