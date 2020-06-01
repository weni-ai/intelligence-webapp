import qs from 'query-string';
import request from './request';
import utils from './utils';


export default {

  addGroup(name, repositoryUUID, version) {
    return request.$http.post(
      'v2/repository/entity/group/',
      {
        value: name,
        repository: repositoryUUID,
        repository_version: version,
      },
    );
  },

  deleteGroup(groupUuid) {
    return request.$http.delete(`v2/repository/entity/group/${groupUuid}/`);
  },

  deleteEntity(entityId) {
    return request.$http.delete(`v2/repository/entities/${entityId}/`);
  },

  editEntity(entityId, name, groupId) {
    console.log({entityId, name, groupId})
    return request.$http.patch(
      `v2/repository/entities/${entityId}/`,
      {
        value: name,
        group_id: groupId,
      },
    );
  },

  search(repositoryUuid, query = {}) {
    const queryString = qs.stringify({
      repository_uuid: repositoryUuid,
      ...query,
    });
    return new utils.List(`/v2/repository/entities?${queryString}`);
  },
  editEntityName(entityId, value) {
    return request.$http.patch(
      `/v2/repository/entities/${entityId}/`,
      {
        value,
      },
    );
  },
};
