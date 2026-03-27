import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createI18n } from 'vue-i18n';

import SettingsUpgradeToMultiagents from '../SettingsUpgradeToMultiagents.vue';

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      router: {
        tunings: {
          upgrade_to_multi_agents: {
            title: 'Upgrade project to Agent Builder 2.0',
            description:
              'Upgrade your project to use a team of intelligent agents collaborating to make your assistant smarter with minimal effort.',
            button: 'Upgrade',
          },
        },
      },
    },
  },
});

describe('SettingsUpgradeToMultiagents.vue', () => {
  let wrapper;

  const upgradeToMultiagentsTitle = () =>
    wrapper.find('[data-testid="upgrade-to-multi-agents-title"]');
  const upgradeToMultiagentsDescription = () =>
    wrapper.find('[data-testid="upgrade-to-multi-agents-description"]');
  const upgradeToMultiagentsButton = () =>
    wrapper.find('[data-testid="upgrade-to-multiagents-button"]');

  beforeEach(() => {
    wrapper = mount(SettingsUpgradeToMultiagents, {
      global: {
        plugins: [i18n],
      },
    });
  });

  describe('Component rendering', () => {
    it('renders correctly', () => {
      expect(upgradeToMultiagentsTitle().exists()).toBe(true);
      expect(upgradeToMultiagentsDescription().exists()).toBe(true);
      expect(upgradeToMultiagentsButton().exists()).toBe(true);
    });

    it('displays the correct texts', () => {
      expect(upgradeToMultiagentsTitle().text()).toBe(
        'Upgrade project to Agent Builder 2.0',
      );
      expect(upgradeToMultiagentsDescription().text()).toBe(
        'Upgrade your project to use a team of intelligent agents collaborating to make your assistant smarter with minimal effort.',
      );
      expect(upgradeToMultiagentsButton().text()).toBe('Upgrade');
    });
  });

  describe('Button behavior', () => {
    it('emits upgrade-to-multiagents event when button is clicked', async () => {
      await upgradeToMultiagentsButton().trigger('click');

      expect(wrapper.emitted('upgrade-to-multiagents')).toBeTruthy();
      expect(wrapper.emitted('upgrade-to-multiagents')).toHaveLength(1);
    });
  });
});
