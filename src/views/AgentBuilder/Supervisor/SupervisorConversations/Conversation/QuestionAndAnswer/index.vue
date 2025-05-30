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

    <ForwardedHumanSupport
      v-else-if="data.forwarded_human_support"
      class="question-and-answer__forwarded-human-support"
    />

    <template v-else>
      <Message
        v-if="data?.source_type === 'user'"
        class="question-and-answer__question"
        :content="data"
      />

      <section
        v-if="data?.source_type === 'agent'"
        class="question-and-answer__answer"
      >
        <PreviewLogs
          v-if="showLogs"
          :logs="logs"
          logsSide="right"
        />

        <Message
          class="question-and-answer__answer-text"
          :content="data"
          scheme="success"
        >
          <ViewLogsButton
            :disabled="loadingLogs"
            :loading="loadingLogs"
            :active="showLogs"
            @click="handleShowLogs"
          />
        </Message>
      </section>
    </template>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';

import PreviewLogs from '@/components/Brain/PreviewLogs.vue';
import ForwardedHumanSupport from './ForwardedHumanSupport.vue';
import { useMonitoringStore } from '@/store/Monitoring';
import Message from './Message.vue';
import ViewLogsButton from './ViewLogsButton.vue';
import { processLog } from '@/utils/previewLogs';

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

const monitoringStore = useMonitoringStore();

const showLogs = ref(false);
const loadingLogs = ref(false);
const logs = ref([]);

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
    const responseLogs = await monitoringStore.loadLogs({
      messageId: props.data.id,
    });

    let collaborator = '';
    logs.value = responseLogs.map((log) => {
      const proccesedLog = processLog({
        log,
        currentAgent: collaborator,
      });

      collaborator = proccesedLog.config.currentAgent;

      return proccesedLog;
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
  margin-bottom: $unnnic-spacing-xs;

  display: grid;
  grid-template-columns: repeat(3, 1fr);

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

  &__answer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: $unnnic-spacing-nano;
    justify-self: end;

    width: fit-content;

    &-text {
      justify-self: flex-end;
      padding: $unnnic-spacing-ant;
      background-color: $unnnic-color-weni-600;
      color: $unnnic-color-neutral-white;
    }

    .answer__inspect-response {
      width: 100%;
    }
  }

  &__forwarded-human-support {
    grid-column: 1 / 4;
  }
}
</style>
