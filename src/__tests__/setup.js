import { vi } from 'vitest';

import { config } from '@vue/test-utils';
import i18n from '@/utils/plugins/i18n';
import lodash from 'lodash';
import UnnnicSystemPlugin from '@/utils/UnnnicSystemPlugin.js';
import UnnnicDivider from '@/components/Divider.vue';
import UnnnicIntelligenceHeader from '@/components/unnnic-intelligence/Header.vue';
import UnnnicIntelligenceText from '@/components/unnnic-intelligence/Text.vue';

vi.hoisted(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    enumerable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

class IntersectionObserverMock {
  observe() {}

  unobserve() {}

  disconnect() {}
}

global.IntersectionObserver = IntersectionObserverMock;

vi.stubEnv('SUPPORTED_LANGUAGES', 'en:English|fr:French|es:Spanish');
vi.stubEnv(
  'OPTIONS_WENIGPT',
  '[{"name": "golfinho-1", "description": "router.tunings.fields.golfinho-1", "model": "golfinho-1"}, {"name": "shark-1", "description": "router.tunings.fields.shark-1", "model": "shark-1"}]',
);

config.global.plugins = [i18n, UnnnicSystemPlugin];
config.global.components = {
  UnnnicDivider,
  UnnnicIntelligenceHeader,
  UnnnicIntelligenceText,
};

vi.spyOn(lodash, 'debounce').mockImplementation((fn) => fn);
