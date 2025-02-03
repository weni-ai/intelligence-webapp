import { usePreviewStore } from '@/store/Preview';

export default (message) => {
  const previewStore = usePreviewStore();
  let trace = message;

  if (message.type === 'trace_update') {
    const traceWithSummaryTreated = {
      ...message,
      trace: {
        ...message.trace,
        summary: message.trace.summary
          .split()
          .at(-1)
          .replace(/[.,!?]$/, ''),
      },
    };

    trace = traceWithSummaryTreated;
  }

  previewStore.addTrace(trace);
};
