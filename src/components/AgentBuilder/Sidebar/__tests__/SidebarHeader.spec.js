import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';

import { useProfileStore } from '@/store/Profile';
import i18n from '@/utils/plugins/i18n';

import SidebarHeader from '../SidebarHeader.vue';

const pinia = createTestingPinia();

describe('SidebarHeader.vue', () => {
  let wrapper;
  let profileStore;

  const elements = {
    sidebarHeader: '[data-testid="sidebar-header"]',
    title: '[data-testid="sidebar-header-title"]',
    description: '[data-testid="sidebar-header-description"]',
  };

  beforeEach(() => {
    wrapper = mount(SidebarHeader, {
      global: {
        plugins: [i18n, pinia],
      },
    });

    profileStore = useProfileStore();
  });

  describe('Component structure', () => {
    it('renders the main section element', () => {
      const headerSection = wrapper.find(elements.sidebarHeader);

      expect(headerSection.exists()).toBe(true);
      expect(headerSection.element.tagName).toBe('SECTION');
    });

    it('renders the title as an h1 element', () => {
      const titleElement = wrapper.find(elements.title);

      expect(titleElement.exists()).toBe(true);
      expect(titleElement.element.tagName).toBe('H1');
    });

    it('renders the description as a p element', () => {
      const descriptionElement = wrapper.find(elements.description);

      expect(descriptionElement.exists()).toBe(true);
      expect(descriptionElement.element.tagName).toBe('P');
    });
  });

  describe('Content rendering', () => {
    it('displays the profile agent name in the title', () => {
      const titleElement = wrapper.find(elements.title);
      const expectedText = profileStore.name.old;

      expect(titleElement.text()).toBe(expectedText);
    });

    it('displays the translated description text', () => {
      const descriptionElement = wrapper.find(elements.description);
      const expectedText = i18n.global.t('profile.edit_manager_profile');

      expect(descriptionElement.text()).toBe(expectedText);
    });
  });

  describe('CSS classes and styling', () => {
    it('applies the correct CSS class to the main section', () => {
      const headerSection = wrapper.find(elements.sidebarHeader);

      expect(headerSection.classes()).toContain('sidebar-header');
    });

    it('applies the correct CSS class to the title', () => {
      const titleElement = wrapper.find(elements.title);

      expect(titleElement.classes()).toContain('sidebar-header__title');
    });

    it('applies the correct CSS class to the description', () => {
      const descriptionElement = wrapper.find(elements.description);

      expect(descriptionElement.classes()).toContain(
        'sidebar-header__description',
      );
    });
  });
});
