export const ConversationAdapter = {
  /**
   * Transform API response data to frontend format
   * @param {Object} apiData - Raw API response data
   * @returns {Object} Transformed data for frontend use
   */
  fromApi(apiData) {
    const statusMap = {
      resolved: 'resolved',
      unresolved: 'unresolved',
      abandoned: 'unengaged',
    };

    const csatMap = {
      1: 'very_satisfied',
      2: 'satisfied',
      3: 'neutral',
      4: 'dissatisfied',
      5: 'very_dissatisfied',
    };

    if (apiData.results) {
      return {
        ...apiData,
        results: apiData.results.map((result) => ({
          id: result.external_id,
          start: result.created_on,
          end: result.end_date,
          username: result.name,
          urn: result.urn,
          status: statusMap[result.resolution] || 'in_progress',
          csat: csatMap[result.csat] || null,
          transferred_to_human_support: result.has_chats_room,
          topics: result.topic,
        })),
      };
    }

    return apiData;
  },

  /**
   * Transform frontend filter parameters to API format
   * @param {Object} filterData - Frontend filter parameters
   * @returns {Object} Transformed parameters for API request
   */
  toApi(filterData) {
    const {
      page,
      start,
      end,
      search,
      status = [],
      csat = [],
      topics = [],
    } = filterData;

    const statusMap = {
      resolved: 0,
      unresolved: 1,
      in_progress: 2,
      unengaged: 3,
    };

    const csatMap = {
      very_satisfied: 1,
      satisfied: 2,
      neutral: 3,
      dissatisfied: 4,
      very_dissatisfied: 5,
    };

    const params = {
      page,
      start_date: start,
      end_date: end,
      ...(search && { search }),
      ...(status.length > 0 && {
        resolution: status.map((statusItem) => statusMap[statusItem]),
      }),
      ...(csat.length > 0 && {
        csat: csat.map((csatItem) => csatMap[csatItem]),
      }),
      ...(topics.length > 0 && { topics }),
      ...(status.includes('transferred_to_human_support') && {
        has_chats_room: true,
      }),
    };

    return params;
  },
};
