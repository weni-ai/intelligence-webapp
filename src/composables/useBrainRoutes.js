import { computed } from 'vue';
import i18n from '@/utils/plugins/i18n';
import { useFeatureFlagsStore } from '@/store/FeatureFlags';

export default function useBrainRoutes() {
  const t = (value) => i18n.global.t(value);

  const isAgentsTeamEnabled = useFeatureFlagsStore().flags.agentsTeam;

  return computed(() =>
    [
      {
        title: 'monitoring',
        description: t('router.monitoring.description'),
        page: 'router-monitoring',
        icon: 'bar_chart',
        preview: false,
        tag: t('new'),
      },
      {
        title: 'personalization',
        page: 'router-personalization',
        icon: 'person',
        preview: true,
      },
      isAgentsTeamEnabled
        ? {
            title: 'agents-team',
            description: t('router.agents_team.description'),
            page: 'router-agents-team',
            icon: 'workspaces',
            preview: false,
          }
        : null,
      {
        title: 'content',
        description: t('content_bases.description'),
        page: 'router-content',
        icon: 'article',
        preview: true,
      },
      isAgentsTeamEnabled
        ? null
        : {
            title: 'actions',
            description: t('router.actions.description'),
            page: 'router-actions',
            icon: 'bolt',
            preview: true,
          },
      {
        title: 'tunings',
        page: 'router-tunings',
        icon: 'settings',
        preview: true,
      },
    ].filter((obj) => obj),
  );
}
