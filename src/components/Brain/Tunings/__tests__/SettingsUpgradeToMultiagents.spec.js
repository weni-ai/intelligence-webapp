import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import { createStore } from 'vuex';

import SettingsUpgradeToMultiagents from '../SettingsUpgradeToMultiagents.vue';

describe('SettingsUpgradeToMultiagents.vue', () => {
  let wrapper;
  let store;
  let router;

  const upgradeToMultiagentsTitle = () =>
    wrapper.findComponent('[data-testid="upgrade-to-multi-agents-title"]');
  const upgradeToMultiagentsDescription = () =>
    wrapper.findComponent(
      '[data-testid="upgrade-to-multi-agents-description"]',
    );
  const upgradeToMultiagentsButton = () =>
    wrapper.findComponent('[data-testid="upgrade-to-multiagents-button"]');
  const modal = () => wrapper.findComponent('[data-testid="modal"]');

  beforeEach(() => {
    store = createStore({
      actions: {
        upgradeToMultiagents: vi.fn().mockResolvedValue({ status: 'success' }),
      },
    });

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home' },
        { path: '/agents', name: 'agents' },
      ],
    });

    vi.spyOn(router, 'replace');

    wrapper = mount(SettingsUpgradeToMultiagents, {
      global: {
        plugins: [store, router],
      },
    });
  });

  describe('Component rendering', () => {
    it('renders correctly', () => {
      expect(upgradeToMultiagentsTitle().exists()).toBe(true);
      expect(upgradeToMultiagentsDescription().exists()).toBe(true);
      expect(upgradeToMultiagentsButton().exists()).toBe(true);
      expect(modal().exists()).toBe(false);
    });

    it('displays the correct texts', () => {
      const t = wrapper.vm.$t;

      expect(upgradeToMultiagentsTitle().text()).toBe(
        t('router.tunings.upgrade_to_multi_agents.title'),
      );
      expect(upgradeToMultiagentsDescription().text()).toBe(
        t('router.tunings.upgrade_to_multi_agents.description'),
      );
      expect(upgradeToMultiagentsButton().text()).toBe(
        t('router.tunings.upgrade_to_multi_agents.button'),
      );
    });
  });

  describe('Modal behavior', () => {
    it('opens the modal when the button is clicked', async () => {
      expect(modal().exists()).toBe(false);
      await upgradeToMultiagentsButton().trigger('click');
      expect(modal().exists()).toBe(true);
    });

    it('closes the modal when the cancel button is clicked', async () => {
      await upgradeToMultiagentsButton().trigger('click');
      expect(modal().exists()).toBe(true);

      expect(wrapper.vm.openUpgradeToMultiagentsModal).toBe(true);
      await modal().vm.$emit('secondary-button-click');
      expect(wrapper.vm.openUpgradeToMultiagentsModal).toBe(false);
    });
  });

  describe('Upgrade functionality', () => {
    let dispatchSpy;

    beforeEach(async () => {
      dispatchSpy = vi
        .spyOn(store, 'dispatch')
        .mockReturnValue({ status: 'success' });
      await upgradeToMultiagentsButton().trigger('click');
    });

    it('calls the upgradeToMultiagents action when confirm button is clicked', async () => {
      await modal().vm.$emit('primary-button-click');

      expect(dispatchSpy).toHaveBeenCalledWith('upgradeToMultiagents');
    });

    it('shows loading state during upgrade', async () => {
      const upgradePromiseResult = modal().vm.$emit('primary-button-click');

      expect(wrapper.vm.isUpgrading).toBe(true);

      await upgradePromiseResult;

      expect(wrapper.vm.isUpgrading).toBe(false);
    });

    it('navigates to agents page after successful upgrade', async () => {
      await modal().vm.$emit('primary-button-click');

      expect(router.replace).toHaveBeenCalledWith({ name: 'agents' });
    });

    it('does not navigate if upgrade is not successful', async () => {
      vi.spyOn(store, 'dispatch').mockResolvedValueOnce({ status: 'error' });

      await modal().vm.$emit('primary-button-click');

      expect(wrapper.vm.openUpgradeToMultiagentsModal).toBe(false);

      expect(router.replace).not.toHaveBeenCalled();
    });
  });
});
