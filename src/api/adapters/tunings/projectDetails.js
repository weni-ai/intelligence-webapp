export const ProjectDetailsAdapter = {
  fromApi(apiData) {
    const {
      indexed_database,
      agents_backend,
      manager_foundation_model,
      integrated_agents,
      instruction_character_count,
    } = apiData;
    return {
      backend: indexed_database || agents_backend,
      agentsModels: [
        { name: 'Manager', model: manager_foundation_model },
        ...integrated_agents.map((ag) => ({
          ...ag,
          model: ag.foundation_model,
        })),
      ],
      charactersCount: instruction_character_count,
    };
  },
};
