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

  return {
    ...trace,
    trace: { ...trace.trace, ...traceData },
    collaboratorInvoked: updatedCollaborator,
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
