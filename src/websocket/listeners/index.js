import monitoringListener from './messages';
import previewListener from './preview';

export default ({ ws, type = 'monitoring' }) => {
  const createListener = (callback) => (payload) => callback(payload);

  if (type === 'monitoring') {
    ws.on('ws', createListener(monitoringListener.create));
  } else if (type === 'preview') {
    ws.on('trace_update', createListener(previewListener.addTrace));
  }
};
