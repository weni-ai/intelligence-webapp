import { computed } from 'vue';
import i18n from '@/utils/plugins/i18n';
import { useFeatureFlagsStore } from '@/store/FeatureFlags';

export default function useBrainRoutes() {
  const t = (value) => i18n.global.t(value);
  const featureFlagsStore = useFeatureFlagsStore();

  const isAgentsTeamEnabled = featureFlagsStore.flags.agentsTeam;

  return computed(() => {
    if (isAgentsTeamEnabled) {
      return [
        {
          title: t('agent_builder.tabs.supervisor.title'),
          description: t('agent_builder.tabs.supervisor.description'),
          page: 'supervisor',
          icon: 'sms',
        },
        {
          title: t('agent_builder.tabs.profile.title'),
          description: t('agent_builder.tabs.profile.description'),
          page: 'profile',
          icon: 'person',
        },
        {
          title: t('agent_builder.tabs.instructions.title'),
          description: t('agent_builder.tabs.instructions.description'),
          page: 'instructions',
          icon: 'format_list_bulleted',
        },
        {
          title: t('agent_builder.tabs.agents.title'),
          description: t('agent_builder.tabs.agents.description'),
          page: 'agents',
          icon: 'workspaces',
        },
        {
          title: t('agent_builder.tabs.knowledge.title'),
          description: t('agent_builder.tabs.knowledge.description'),
          page: 'knowledge',
          icon: 'article',
        },
        {
          title: t('agent_builder.tabs.tunings.title'),
          description: t('agent_builder.tabs.tunings.description'),
          page: 'tunings',
          icon: 'settings',
        },
      ];
    }

    return [
      {
        title: t('router.tabs.monitoring'),
        description: t('router.monitoring.description'),
        page: 'router-monitoring',
        icon: 'bar_chart',
        preview: false,
        tag: t('new'),
      },
      {
        title: t('router.tabs.profile'),
        description: t('profile.description'),
        page: 'router-profile',
        icon: 'person',
        preview: true,
      },
      {
        title: t('router.tabs.content'),
        description: t('content_bases.description'),
        page: 'router-content',
        icon: 'article',
        preview: true,
      },
      {
        title: t('router.tabs.actions'),
        description: t('router.actions.description'),
        page: 'router-actions',
        icon: 'bolt',
        preview: true,
      },
      {
        title: t('router.tabs.tunings'),
        description: t('router.tunings.description'),
        page: 'router-tunings',
        icon: 'settings',
        preview: true,
      },
    ];
  });
}
