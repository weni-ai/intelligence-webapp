import i18n from './plugins/i18n';
import * as Sentry from '@sentry/browser';

/**
 * Processes a trace object and updates it with additional configuration and collaborator information.
 *
 * @param {Object} trace - The original trace object to process
 * @param {string} currentAgent - The name of the collaborator that was invoked
 *
 * @example
 * const result = processTrace({
 *   trace: { trace: { trace: { orchestrationTrace: { ... } } } },
 *   currentAgent: 'agent1'
 * });
 *
 * @returns
 * {
 *   trace: {
 *     trace: {
 *       orchestrationTrace: { ... }
 *     }
 *   }
 *   config: {
 *     summary: 'string',
 *     icon: 'string'
 *     currentAgent: 'string'
 *   }
 * }
 */
export function processTrace({ trace, currentAgent }) {
  const traceData = trace?.trace?.trace || {};
  const {
    orchestrationTrace: {
      invocationInput: { agentCollaboratorInvocationInput } = {},
      observation: { agentCollaboratorInvocationOutput } = {},
      modelInvocationInput,
      modelInvocationOutput,
    } = {},
  } = traceData;

  const traceConfig = getTraceConfig({ trace: traceData });

  const updatedCollaborator = addAgentToConfig({
    currentAgent,
    input: agentCollaboratorInvocationInput,
    output: agentCollaboratorInvocationOutput,
    config: traceConfig,
  });

  return {
    ...trace,
    trace: {
      ...trace.trace,
      trace: modelInvocationInput || modelInvocationOutput ? null : trace.trace,
    },
    config: {
      ...traceConfig,
      currentAgent: updatedCollaborator,
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

  const traceT = (key) => i18n.global.t(`agent_builder.traces.${key}`);

  const mappingRules = [
    {
      key: knowledgeBaseLookupOutput,
      summary: traceT('search_result_received'),
      icon: 'menu_book',
    },
    {
      key: knowledgeBaseLookupInput,
      summary: traceT('searching_knowledge_base'),
      icon: 'menu_book',
    },
    {
      key: modelInvocationInput,
      summary: traceT('invoking_model'),
      icon: 'workspaces',
    },
    {
      key: modelInvocationOutput,
      summary: traceT('model_response_received'),
      icon: 'workspaces',
    },
    {
      key: rationale,
      summary: traceT('thinking'),
      icon: 'emoji_objects',
    },
    {
      key: agentCollaboratorInvocationInput,
      summary: traceT('delegating_to_agent'),
      icon: 'login',
    },
    {
      key: agentCollaboratorInvocationOutput,
      summary: traceT('forwarding_to_manager'),
      icon: 'logout',
    },
    {
      key: actionGroupInvocationInput,
      summary: traceT('executing_tool', {
        function: actionGroupInvocationInput?.function?.split('-')?.[0],
      }),
      icon: 'build',
    },
    {
      key: actionGroupInvocationOutput,
      summary: traceT('tool_result_received'),
      icon: 'build',
    },
    trace.agentCollaboratorName
      ? {
          key: finalResponse,
          summary: traceT('preparing_response_for_manager'),
          icon: 'chat_bubble',
        }
      : {
          key: finalResponse,
          summary: traceT('preparing_final_response'),
          icon: 'question_answer',
        },
    {
      key: guardrailTrace,
      summary: traceT('applying_safety_rules'),
      icon: 'security',
    },
  ];

  let summary = '';
  let icon = '';

  const matched = mappingRules.find(({ key }) => key !== undefined);
  if (matched) {
    summary = matched.summary;
    icon = matched.icon;
  } else {
    const error = new Error('No matching trace rules found');
    error.trace = JSON.stringify(trace);
    Sentry.captureException(error);
  }

  return {
    summary,
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
