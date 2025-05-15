import { defineStore } from 'pinia';

import { computed, ref } from 'vue';

import WS from '@/websocket/setup';

import { useAgentsTeamStore } from './AgentsTeam';
import globalStore from '.';

export const usePreviewStore = defineStore('preview', () => {
  const auth = computed(() => globalStore.state.Auth);

  const ws = ref(null);
  const traces = ref([]);
  const collaboratorInvoked = ref('');
  const collaboratorsTraces = computed(() =>
    traces.value
      .filter((trace) => trace.type === 'trace_update')
      .map((trace) => trace.trace),
  );
  const activeAgent = computed(() => {
    const agentsTeamStore = useAgentsTeamStore();
    const lastTrace = traces.value.at(-1)?.trace;

    const lastTraceAgentId = lastTrace?.agentCollaboratorName || 'manager';

    const agent = agentsTeamStore.activeTeam.data?.agents?.find(
      (agent) => agent.id && lastTraceAgentId && agent.id === lastTraceAgentId,
    );

    return {
      ...(agent || agentsTeamStore.activeTeam.data?.manager),
      currentTask: lastTrace?.summary,
    };
  });

  function addTrace(update) {
    const {
      orchestrationTrace: {
        invocationInput: { agentCollaboratorInvocationInput } = {},
        observation: { agentCollaboratorInvocationOutput } = {},
      } = {},
    } = update?.trace?.trace || {};

    const traceInvokingAgent =
      agentCollaboratorInvocationInput?.agentCollaboratorName;
    const traceOutputAgent =
      agentCollaboratorInvocationOutput?.agentCollaboratorName;

    if (traceInvokingAgent) collaboratorInvoked.value = traceInvokingAgent;
    else if (traceOutputAgent) collaboratorInvoked.value = '';

    const agentCollaboratorName =
      traceInvokingAgent || traceOutputAgent || collaboratorInvoked.value;

    if (agentCollaboratorName) {
      update.trace.agentCollaboratorName = agentCollaboratorName;
    }

    traces.value.push(update);
  }

  function clearTraces() {
    traces.value = [];
  }

  function connectWS() {
    if (ws.value) return;

    const newWs = new WS({
      project: auth.value.connectProjectUuid,
      token: auth.value.token.replace('Bearer ', ''),
      endpoint: 'preview',
    });
    newWs.connect();

    ws.value = newWs;
  }

  function disconnectWS() {
    if (!ws.value) return;

    ws.value.disconnect();
    ws.value = null;
  }

  return {
    ws,
    connectWS,
    disconnectWS,
    clearTraces,
    activeAgent,
    collaboratorsTraces,
    traces,
    addTrace,
    collaboratorInvoked,
  };
});
