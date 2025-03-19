import { reactive } from 'vue';
import { configureCache, GrowthBook } from '@growthbook/growthbook';
import globalStore from '@/store';

const gbKey = Symbol('growthbook');
const gbInstance = reactive(
  new GrowthBook({
    apiHost: runtimeVariables.get('VITE_GROWTHBOOK_API_HOST'),
    clientKey: runtimeVariables.get('VITE_GROWTHBOOK_CLIENT_KEY'),
    attributes: {
      weni_project: globalStore.state.Auth.connectProjectUuid || '',
      weni_org: globalStore.state.Auth.connectOrgUuid || '',
    },
  }),
);

configureCache({
  cacheKey: 'gbFeaturesCache',
  maxAge: 1000 * 60 * 60 * 0.5,
});

const initializeGrowthBook = async () => {
  try {
    await gbInstance.init();
    return gbInstance;
  } catch (e) {
    console.error('Error initializing GrowthBook:', e);
    return null;
  }
};

export { gbKey, gbInstance, initializeGrowthBook };
