<template>
  <section
    ref="logList"
    class="preview-logs"
  >
    <TransitionGroup
      class="preview-logs__logs"
      name="logs"
      tag="ol"
      @enter="updateProgressBarHeight('agent')"
    >
      <li
        v-for="(log, logIndex) in logs"
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
            <!-- TODO: Translate button text -->
            <button
              class="step__see-full"
              @click="openModalLogFullDetails"
            >
              See full details
            </button>
          </li>
        </TransitionGroup>
      </li>
    </TransitionGroup>

    <article class="preview-logs__progress-bar" />

    <!-- TODO: Remove this temp buttons and their functions -->
    <button @click="addAgent">Add Agent</button>
    <button @click="addStep">Add Step</button>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const logs = ref([
  {
    agent_name: 'Agata Batata',
    steps: [
      'Greeting',
      'Order cancellation request',
      'Forwarded to Order Analyst',
      'Cancel Order skill activated',
    ],
  },
  {
    agent_name: 'Order Analyst',
    steps: ['Cancel order skill activated'],
  },
]);

const progressHeight = ref(0);

onMounted(() => {
  updateProgressBarHeight('mount');
});

function openModalLogFullDetails() {
  alert('TODO: Open modal log full details');
}

const addAgent = () => {
  logs.value.push({
    agent_name: `New Log ${logs.value.length + 1}`,
    steps: ['New step'],
  });
};
const addStep = () => {
  logs.value.at(-1).steps.push('New step');
};

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
