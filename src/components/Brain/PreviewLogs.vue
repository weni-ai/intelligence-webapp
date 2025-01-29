<template>
  <section
    ref="logList"
    class="preview-logs"
  >
    <p
      v-if="!processedLogs.length"
      class="preview-logs__empty"
    >
      {{ $t('router.preview.no_logs_registered') }}
    </p>

    <TransitionGroup
      class="preview-logs__logs"
      name="logs"
      tag="ol"
      @enter="updateProgressBarHeight('agent')"
    >
      <li
        v-for="(log, logIndex) in processedLogs"
        :key="logIndex"
        class="logs__log"
      >
        <p class="log__agent-name">{{ log.agent_name }}</p>

        <TransitionGroup
          name="steps"
          tag="ol"
          class="log__steps"
          @enter="updateProgressBarHeight('step')"
        >
          <li
            v-for="(step, stepIndex) in log.steps"
            :key="stepIndex"
            class="steps__step"
          >
            <p>{{ step }}</p>
            <button
              class="step__see-full"
              @click="openModalLogFullDetails(log.summary, log.trace)"
            >
              {{ $t('router.preview.see_full_details') }}
            </button>
          </li>
        </TransitionGroup>
      </li>
    </TransitionGroup>

    <article class="preview-logs__progress-bar" />

    <PreviewLogsDetailsModal
      v-model="showDetailsModal"
      :title="selectedLog.summary"
      :trace="selectedLog.trace"
    />
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import { usePreviewStore } from '@/store/Preview';
import { useAgentsTeamStore } from '@/store/AgentsTeam';
import PreviewLogsDetailsModal from './Preview/PreviewLogsDetailsModal.vue';

const previewStore = usePreviewStore();
const agentsTeamStore = useAgentsTeamStore();

const showDetailsModal = ref(false);
const selectedLog = ref({
  summary: '',
  trace: '',
});

const processedLogs = computed(() => {
  if (!agentsTeamStore.activeTeam.data) return [];

  const { collaboratorsTraces: traces } = previewStore;
  const { agents: activeTeam, manager } = agentsTeamStore.activeTeam.data || {};

  return traces.reduce((logsByAgent, trace) => {
    const agent = activeTeam.find(
      (agent) => agent.external_id === trace.trace.agentId,
    );

    const agentToLog = agent || manager;
    if (!agentToLog) return logsByAgent;

    const lastLog = logsByAgent.at(-1);
    if (lastLog?.external_id !== agentToLog.external_id) {
      logsByAgent.push({
        external_id: agentToLog.external_id,
        agent_name: agentToLog.name || 'Manager',
        steps: [],
        summary: trace.summary,
        trace,
      });
    }

    logsByAgent.at(-1)?.steps.push(trace.summary || 'Unknown');
    return logsByAgent;
  }, []);
});

const progressHeight = ref(0);

onMounted(() => {
  updateProgressBarHeight('mount');

  if (!agentsTeamStore.activeTeam.data) {
    agentsTeamStore.loadActiveTeam();
  }
});

function openModalLogFullDetails(summary, trace) {
  selectedLog.value = { summary, trace };
  showDetailsModal.value = true;
}

const logTranslateY = 24;

function updateProgressBarHeight(type = 'agent') {
  nextTick(() => {
    if (!['mount', 'agent', 'step'].includes(type)) {
      throw new Error('Invalid type passed to updateProgressHeight function');
    }

    const logList = document.querySelector('.preview-logs');
    if (!logList) return;

    const firstLog = logList.querySelector('.log__agent-name:first-child');
    const lastLog = logList.querySelector(
      '.logs__log:last-child .steps__step:last-child p',
    );

    if (firstLog && lastLog) {
      const firstLogRect = firstLog.getBoundingClientRect();
      const lastLogRect = lastLog.getBoundingClientRect();
      const animationOffset = type === 'agent' ? logTranslateY : 0;
      progressHeight.value =
        animationOffset +
        lastLogRect.bottom -
        firstLogRect.top -
        firstLogRect.height / 2 -
        lastLogRect.height / 2;
    }
  });
}

watch(
  () => previewStore.collaboratorsTraces,
  (newTraces) => {
    if (newTraces.length === 0) {
      progressHeight.value = 0;
    }
  },
);
</script>

<style scoped lang="scss">
.logs-enter-active {
  transition: all 0.5s ease-out;
}
.logs-enter-from {
  $logTranslateY: -24px;
  opacity: 0;
  transform: translateY($logTranslateY);
}

.steps-enter-active {
  transition: all 0.5s ease-out;
}
.steps-enter-from {
  opacity: 0;
}

.preview-logs {
  position: relative;

  margin: 0 auto;

  .preview-logs__empty {
    margin: 0;
    padding: 0;

    color: $unnnic-color-neutral-clean;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-gt;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
  }

  .preview-logs__logs {
    position: relative;

    margin: 0;
    margin-left: $unnnic-spacing-sm;

    padding: 0;

    list-style: none;

    .logs__log {
      margin-bottom: $unnnic-spacing-sm;

      %progressDot {
        &::before {
          content: '•';

          position: absolute;
          left: -$unnnic-spacing-sm + -$unnnic-spacing-nano;
          z-index: 1;

          color: $unnnic-color-neutral-cleanest;
        }
      }

      .log__agent-name {
        margin-bottom: $unnnic-spacing-xs;

        color: $unnnic-color-neutral-darkest;
        font-family: $unnnic-font-family-secondary;
        font-weight: $unnnic-font-weight-bold;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;

        @extend %progressDot;
      }

      .log__steps {
        margin: 0;
        margin-left: $unnnic-spacing-md - $unnnic-spacing-ant;

        padding: 0;

        display: grid;
        gap: $unnnic-spacing-xs;

        list-style: none;

        .steps__step {
          &:first-letter {
            text-transform: uppercase;
          }
          color: $unnnic-color-neutral-cloudy;
          font-family: $unnnic-font-family-secondary;
          font-size: $unnnic-font-size-body-gt;
          line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;

          @extend %progressDot;

          .step__see-full {
            padding: 0;
            border: none;
            background-color: transparent;

            color: $unnnic-color-neutral-clean;

            font-family: $unnnic-font-family-secondary;
            font-size: $unnnic-font-size-body-md;
            line-height: $unnnic-font-size-body-md + $unnnic-line-height-md;

            cursor: pointer;
          }
        }
      }

      &:last-child {
        .steps__step:last-of-type {
          color: $unnnic-color-weni-600;

          &::before {
            color: $unnnic-color-weni-600;
          }

          .step__see-full {
            color: $unnnic-color-weni-600;
          }
        }
      }
    }
  }

  .preview-logs__progress-bar {
    position: absolute;
    top: calc(($unnnic-font-size-body-gt + $unnnic-line-height-md) / 2);

    width: $unnnic-border-width-thinner;
    height: v-bind('progressHeight + "px"');

    background-color: $unnnic-color-neutral-cleanest;

    transition: height 0.6s ease;
  }
}
</style>
