import i18n from './plugins/i18n';

export function processTrace({ trace, collaboratorInvoked }) {
  const traceData = trace?.trace?.trace || {};
  const {
    orchestrationTrace: {
      invocationInput: { agentCollaboratorInvocationInput } = {},
      observation: { agentCollaboratorInvocationOutput } = {},
      modelInvocationInput,
      modelInvocationOutput,
    } = {},
  } = traceData;

  const updatedCollaborator = addAgentToTrace({
    collaboratorInvoked,
    input: agentCollaboratorInvocationInput,
    output: agentCollaboratorInvocationOutput,
    trace: traceData,
  });

  const traceConfig = getTraceConfig({ trace: traceData });

  return {
    ...trace,
    trace: {
      ...trace.trace,
      trace: modelInvocationInput || modelInvocationOutput ? null : trace.trace,
    },
    config: {
      ...traceConfig,
      collaboratorInvoked: updatedCollaborator,
    },
  };
}

function getTraceConfig({ trace: traceToUpdate }) {
  const trace = { ...traceToUpdate };
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
      icon: 'menu_book',
    },
    {
      key: knowledgeBaseLookupInput,
      summary: i18n.global.t('agent_builder.traces.searching_knowledge_base'),
      icon: 'menu_book',
    },
    {
      key: modelInvocationInput,
      summary: i18n.global.t('agent_builder.traces.invoking_model'),
      icon: 'workspaces',
    },
    {
      key: modelInvocationOutput,
      summary: i18n.global.t('agent_builder.traces.model_response_received'),
      icon: 'workspaces',
    },
    {
      key: rationale,
      summary: i18n.global.t('agent_builder.traces.thinking'),
      icon: 'emoji_objects',
    },
    {
      key: agentCollaboratorInvocationInput,
      summary: i18n.global.t('agent_builder.traces.delegating_to_agent'),
      icon: 'login',
    },
    {
      key: agentCollaboratorInvocationOutput,
      summary: i18n.global.t('agent_builder.traces.forwarding_to_manager'),
      icon: 'logout',
    },
    {
      key: actionGroupInvocationInput,
      summary: i18n.global.t('agent_builder.traces.executing_tool', {
        function: actionGroupInvocationInput?.function?.split('-')?.[0],
      }),
      icon: 'build',
    },
    {
      key: actionGroupInvocationOutput,
      summary: i18n.global.t('agent_builder.traces.tool_result_received'),
      icon: 'build',
    },
    trace.agentCollaboratorName
      ? {
          key: finalResponse,
          summary: i18n.global.t(
            'agent_builder.traces.preparing_response_for_manager',
          ),
          icon: 'chat_bubble',
        }
      : {
          key: finalResponse,
          summary: i18n.global.t(
            'agent_builder.traces.preparing_final_response',
          ),
          icon: 'question_answer',
        },
    {
      key: guardrailTrace,
      summary: i18n.global.t('agent_builder.traces.applying_safety_rules'),
      icon: 'security',
    },
  ];

  const matched = mappingRules.find(({ key }) => key !== undefined);
  if (matched) {
    trace.summary = matched.summary;
    trace.icon = matched.icon;
  }

  return {
    summary: trace.summary,
    icon: trace.icon,
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
