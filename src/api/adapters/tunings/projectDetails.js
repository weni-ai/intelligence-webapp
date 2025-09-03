export const ProjectDetailsAdapter = {
  fromApi(apiData) {
    const { indexed_database, agents_backend } = apiData;
    return {
      backend: indexed_database || agents_backend,
    };
  },
};
