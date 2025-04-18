import { flushPromises, mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { expect } from 'vitest';
import BrainSideBar from '@/components/Brain/BrainSideBar.vue';
import { createTestingPinia } from '@pinia/testing';

const routes = [
  { path: '/monitoring', name: 'router-monitoring', component: {} },
  { path: '/profile', name: 'router-profile', component: {} },
  { path: '/agents-team', name: 'router-agents-team', component: {} },
  { path: '/content', name: 'router-content', component: {} },
  { path: '/actions', name: 'router-actions', component: {} },
  { path: '/tunings', name: 'router-tunings', component: {} },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

describe('BrainSideBar', () => {
  let wrapper;

  const pinia = createTestingPinia();

  beforeEach(() => {
    wrapper = mount(BrainSideBar, {
      global: {
        plugins: [router, pinia],
      },
    });
  });

  test('renders correctly with props and initial state', async () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).not.toContain('collapsed');
    expect(wrapper.findComponent('[data-test="floating-btn"]').exists()).toBe(
      false,
    );

    await wrapper.trigger('mouseover');

    expect(wrapper.findComponent('[data-test="floating-btn"]').exists()).toBe(
      true,
    );

    await wrapper.trigger('mouseleave');

    expect(wrapper.findComponent('[data-test="floating-btn"]').exists()).toBe(
      false,
    );
  });

  test('toggles the collapsing of the sidebar by clicking on the button', async () => {
    expect(wrapper.classes()).not.toContain('collapsed');

    await wrapper.trigger('mouseover');

    const button = wrapper.findComponent('[data-test="floating-btn"]');

    expect(button.exists()).toBe(true);

    await button.trigger('click');

    expect(wrapper.classes()).toContain('collapsed');
    expect(button.exists()).toBe(true);

    await button.trigger('click');

    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(wrapper.classes()).not.toContain('collapsed');

    await wrapper.trigger('mouseleave');

    expect(wrapper.findComponent('[data-test="floating-btn"]').exists()).toBe(
      false,
    );
  });

  test('verifies the state changes when handleButtonClick is called', async () => {
    expect(wrapper.vm.isCollapsed).toBe(false);
    expect(wrapper.vm.isSideBarVisible).toBe(true);

    await wrapper.vm.handleButtonClick();

    expect(wrapper.vm.isCollapsed).toBe(true);
    expect(wrapper.vm.isSideBarVisible).toBe(false);

    expect(wrapper.vm.isCollapsed).toBe(true);
    setTimeout(() => {
      expect(wrapper.vm.isSideBarVisible).toBe(true);
    }, 300);
  });

  test('navigates to the correct tab when clicking on a sidebar item', async () => {
    const sidebarItems = wrapper.findAll('[data-test="nav-router"]');
    expect(sidebarItems.length).toBe(5);

    const pushSpy = vi.spyOn(router, 'push');

    await sidebarItems[2].trigger('click');
    expect(pushSpy).toHaveBeenCalledWith({ name: 'router-content' });
  });

  test('runs the navigation correctly in afterEach', async () => {
    const afterEachMock = vi.fn();
    router.afterEach(afterEachMock);

    router.push('/profile');
    await flushPromises();

    expect(afterEachMock).toHaveBeenCalled();
  });

  test('renders UnnnicSideBar only when isSideBarVisible is true', async () => {
    const wrapper = mount(BrainSideBar, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.vm.isSideBarVisible).toBe(true);
    expect(wrapper.findComponent('[data-test="side-bar-menu"]').exists()).toBe(
      true,
    );

    await wrapper.vm.handleButtonClick();

    expect(wrapper.vm.isSideBarVisible).toBe(false);
    expect(wrapper.findComponent('[data-test="side-bar-menu"]').exists()).toBe(
      false,
    );

    await wrapper.vm.handleButtonClick();

    await new Promise((resolve) => setTimeout(resolve, 300));
    await flushPromises();

    expect(wrapper.vm.isSideBarVisible).toBe(true);
    expect(wrapper.findComponent('[data-test="side-bar-menu"]').exists()).toBe(
      true,
    );
  });
});
