import i18n from './plugins/i18n';
import * as Sentry from '@sentry/browser';

/**
 * Processes a trace object and updates it with additional configuration and collaborator information.
 *
 * @param {Object} trace - The original trace object to process
 * @param {string} currentAgent - The name of the collaborator that was invoked
 *
 * @example
 * const result = processLog({
 *   trace: { trace: { trace: { orchestrationTrace: { ... } } } },
 *   currentAgent: 'string'
 * });
 *
 * @returns
 * {
 *   type: 'trace_update',
 *   data: {
 *     sessionId: 'string',
 *     orchestrationTrace: { ... } or guardrailTrace: { ... } or other relevant traces
 *   },
 *   config: {
 *     summary: 'string',
 *     icon: 'string',
 *     currentAgent: 'string'
 *   }
 * }
 */
export function processLog({ log, currentAgent }) {
  const trace = log?.trace?.trace || log?.trace || {};

  const {
    orchestrationTrace: {
      invocationInput: { agentCollaboratorInvocationInput } = {},
      observation: { agentCollaboratorInvocationOutput } = {},
      modelInvocationInput,
      modelInvocationOutput,
    } = {},
  } = trace;

  const configData = {};

  const updatedCollaborator = addAgentToConfig({
    currentAgent,
    input: agentCollaboratorInvocationInput,
    output: agentCollaboratorInvocationOutput,
    config: configData,
  });

  const traceConfig = getLogConfig({ trace, config: configData });

  return {
    type: log?.type,
    data: modelInvocationInput || modelInvocationOutput ? null : log?.trace,
    config: {
      ...configData,
      ...traceConfig,
      currentAgent: updatedCollaborator,
    },
  };
}

function getLogConfig({ trace, config }) {
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

  const traceT = (key, params) =>
    i18n.global.t(`agent_builder.traces.${key}`, params);

  const mappingRules = [
    {
      key: knowledgeBaseLookupOutput,
      summary: traceT('search_result_received'),
      category: 'knowledge',
      icon: 'article',
    },
    {
      key: knowledgeBaseLookupInput,
      summary: traceT('searching_knowledge_base'),
      category: 'knowledge',
      icon: 'article',
    },
    {
      key: modelInvocationInput,
      summary: traceT('invoking_model'),
      category: 'model',
      icon: 'workspaces',
    },
    {
      key: modelInvocationOutput,
      summary: traceT('model_response_received'),
      category: 'model',
      icon: 'workspaces',
    },
    {
      key: rationale,
      summary: traceT('thinking'),
      category: 'thinking',
      icon: 'lightbulb',
    },
    {
      key: agentCollaboratorInvocationInput,
      summary: traceT('delegating_to_agent'),
      category: 'delegating_to_agent',
      icon: 'login',
    },
    {
      key: agentCollaboratorInvocationOutput,
      summary: traceT('forwarding_to_manager'),
      category: 'forwarding_to_manager',
      icon: 'logout',
    },
    {
      key: actionGroupInvocationInput,
      summary: traceT('executing_tool', {
        function: actionGroupInvocationInput?.function?.split('-')?.[0],
      }),
      category: 'tool',
      icon: 'build',
    },
    {
      key: actionGroupInvocationOutput,
      summary: traceT('tool_result_received'),
      category: 'tool',
      icon: 'build',
    },
    config?.agentName
      ? {
          key: finalResponse,
          summary: traceT('sending_response_for_manager'),
          category: 'forwarding_to_manager',
          icon: 'chat_bubble',
        }
      : {
          key: finalResponse,
          summary: traceT('sending_final_response'),
          category: 'forwarding_to_manager',
          icon: 'question_answer',
        },
    {
      key: guardrailTrace,
      summary: traceT('applying_safety_rules'),
      category: 'applying_guardrails',
      icon: 'shield',
    },
  ];

  let summary = '';
  let icon = '';
  let category = '';

  const matched = mappingRules.find(({ key }) => key !== undefined);
  if (matched) {
    summary = matched.summary;
    icon = matched.icon;
    category = matched.category;
  } else {
    const error = new Error('No matching trace rules found');
    error.trace = JSON.stringify(trace);
    Sentry.captureException(error);
  }

  return {
    summary,
    category,
    icon,
  };
}

/**
 * This function is necessary to maintain agent sequencing according to the invoke,
 * since the agent only sends its ID in the input and output, and not in all of its traces
 * @param {Object} config - The config object to update
 * @param {string} currentAgent - The name of the collaborator that was invoked
 * @param {Object} input - The input object
 * @param {Object} output - The output object
 */
function addAgentToConfig({ currentAgent, input, output, config }) {
  const traceInvokingAgent = input?.agentCollaboratorName;
  const traceOutputAgent = output?.agentCollaboratorName;

  let updatedCollaborator = currentAgent;
  if (traceInvokingAgent) updatedCollaborator = traceInvokingAgent;
  else if (traceOutputAgent) updatedCollaborator = '';

  const agentName =
    traceInvokingAgent || traceOutputAgent || updatedCollaborator;

  if (agentName) {
    config.agentName = agentName;
  }

  return updatedCollaborator;
}
