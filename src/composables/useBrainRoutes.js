import { computed } from 'vue';
import i18n from '@/utils/plugins/i18n';
import { useFeatureFlagsStore } from '@/store/FeatureFlags';

export default function useBrainRoutes() {
  const t = (value) => i18n.global.t(value);

  const isAgentsTeamEnabled = useFeatureFlagsStore().flags.agentsTeam;

  if (isAgentsTeamEnabled) {
    return computed(() => [
      {
        title: 'monitoring',
        description: t('router.monitoring.description'),
        page: 'monitoring',
        icon: 'bar_chart',
        preview: false,
        tag: t('new'),
      },
      {
        title: 'profile',
        description: t('profile.description'),
        page: 'profile',
        icon: 'person',
        preview: true,
      },
      {
        title: 'agents-team',
        description: t('router.agents_team.description'),
        page: 'agents-team',
        icon: 'workspaces',
        preview: false,
      },
      {
        title: 'content',
        description: t('content_bases.description'),
        page: 'content',
        icon: 'article',
        preview: true,
      },
      {
        title: 'tunings',
        description: t('router.tunings.description'),
        page: 'tunings',
        icon: 'settings',
        preview: true,
      },
    ]);
  }

  return computed(() => [
    {
      title: 'monitoring',
      description: t('router.monitoring.description'),
      page: 'router-monitoring',
      icon: 'bar_chart',
      preview: false,
      tag: t('new'),
    },
    {
      title: 'profile',
      description: t('profile.description'),
      page: 'router-profile',
      icon: 'person',
      preview: true,
    },
    {
      title: 'content',
      description: t('content_bases.description'),
      page: 'router-content',
      icon: 'article',
      preview: true,
    },
    {
      title: 'actions',
      description: t('router.actions.description'),
      page: 'router-actions',
      icon: 'bolt',
      preview: true,
    },
    {
      title: 'tunings',
      description: t('router.tunings.description'),
      page: 'router-tunings',
      icon: 'settings',
      preview: true,
    },
  ]);
}
