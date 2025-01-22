import { beforeEach, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';

import { createTestingPinia } from '@pinia/testing';
import { useAgentsTeamStore } from '@/store/AgentsTeam';

import AgentCardEmpty from '../AgentCardEmpty.vue';
import i18n from '@/utils/plugins/i18n';

const pinia = createTestingPinia({
  initialState: {
    linkToCreateAgent: '#',
  },
});

describe('AgentCardEmpty.vue', () => {
  let wrapper;

  const agentsTeamStore = useAgentsTeamStore();

  beforeEach(() => {
    wrapper = mount(AgentCardEmpty, {
      global: {
        plugins: [pinia],
      },
    });
  });

  const agentCardEmpty = () => wrapper.find('[data-testid="agent-card-empty"]');

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should renders correctly', async () => {
    const icon = wrapper.find('[data-testid="agent-card-empty-icon"]');
    const title = wrapper.find('[data-testid="agent-card-empty-title"]');

    expect(agentCardEmpty().exists()).toBe(true);
    expect(icon.exists()).toBe(true);
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe(i18n.global.t('router.agents_team.create_agent'));
  });

  it('should create new agent when card is clicked', async () => {
    const windowOpenSpy = vi.spyOn(window, 'open');
    await agentCardEmpty().trigger('click');

    expect(windowOpenSpy).toHaveBeenCalledWith(
      agentsTeamStore.linkToCreateAgent,
      '_blank',
    );
  });
});
