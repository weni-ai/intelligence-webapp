import i18n from './plugins/i18n';

export function processTrace({ trace, collaboratorInvoked }) {
  const traceData = trace?.trace?.trace || {};
  const {
    orchestrationTrace: {
      invocationInput: { agentCollaboratorInvocationInput } = {},
      observation: { agentCollaboratorInvocationOutput } = {},
    } = {},
  } = traceData;

  const updatedCollaborator = addAgentToTrace({
    collaboratorInvoked,
    input: agentCollaboratorInvocationInput,
    output: agentCollaboratorInvocationOutput,
    trace: traceData,
  });

  const traceWithSummary = addSummaryToTrace({ trace: traceData });

  return {
    ...trace,
    trace: { ...traceWithSummary },
    collaboratorInvoked: updatedCollaborator,
  };
}

function addSummaryToTrace({ trace }) {
  const {
    orchestrationTrace: {
      invocationInput: {
        agentCollaboratorInvocationInput,
        knowledgeBaseLookupInput,
        actionGroupInvocationInput,
      } = {},
      observation: {
        agentCollaboratorInvocationOutput,
        knowledgeBaseLookupOutput,
        actionGroupInvocationOutput,
        finalResponse,
      } = {},
      modelInvocationInput,
      modelInvocationOutput,
      rationale,
    } = {},
    guardrailTrace,
  } = trace;

  const mappingRules = [
    {
      key: knowledgeBaseLookupOutput,
      summary: i18n.global.t('agent_builder.traces.search_result_received'),
    },
    {
      key: knowledgeBaseLookupInput,
      summary: i18n.global.t('agent_builder.traces.searching_knowledge_base'),
    },
    {
      key: modelInvocationInput,
      summary: i18n.global.t('agent_builder.traces.invoking_model'),
    },
    {
      key: modelInvocationOutput,
      summary: i18n.global.t('agent_builder.traces.model_response_received'),
    },
    {
      key: rationale,
      summary: i18n.global.t('agent_builder.traces.thinking'),
    },
    {
      key: agentCollaboratorInvocationInput,
      summary: i18n.global.t('agent_builder.traces.delegating_to_agent'),
    },
    {
      key: agentCollaboratorInvocationOutput,
      summary: i18n.global.t('agent_builder.traces.forwarding_to_manager'),
    },
    {
      key: actionGroupInvocationInput,
      summary: i18n.global.t('agent_builder.traces.executing_tool', {
        function: actionGroupInvocationInput?.function?.split('-')?.[0],
      }),
    },
    {
      key: actionGroupInvocationOutput,
      summary: i18n.global.t('agent_builder.traces.tool_result_received'),
    },
    trace.agentCollaboratorName
      ? {
          key: finalResponse,
          summary: i18n.global.t(
            'agent_builder.traces.preparing_response_for_manager',
          ),
        }
      : {
          key: finalResponse,
          summary: i18n.global.t(
            'agent_builder.traces.preparing_final_response',
          ),
        },
    {
      key: guardrailTrace,
      summary: i18n.global.t('agent_builder.traces.applying_safety_rules'),
    },
  ];

  const matched = mappingRules.find(({ key }) => key !== undefined);
  if (matched) {
    trace.summary = matched.summary;
    trace.icon = matched.icon;
    if (typeof matched.showTraces === 'boolean') {
      trace.showTraces = matched.showTraces;
    }
  }

  return {
    ...trace,
    summary: trace.summary,
  };
}

function addAgentToTrace({ collaboratorInvoked, input, output, trace }) {
  const traceInvokingAgent = input?.agentCollaboratorName;
  const traceOutputAgent = output?.agentCollaboratorName;

  let updatedCollaborator = collaboratorInvoked;
  if (traceInvokingAgent) updatedCollaborator = traceInvokingAgent;
  else if (traceOutputAgent) updatedCollaborator = '';

  const agentCollaboratorName =
    traceInvokingAgent || traceOutputAgent || updatedCollaborator;

  if (agentCollaboratorName) {
    trace.agentCollaboratorName = agentCollaboratorName;
  }

  return updatedCollaborator;
}
