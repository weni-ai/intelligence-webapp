import { computed } from 'vue';
import i18n from '@/utils/plugins/i18n';

export default function useBrainRoutes() {
  const t = (value) => i18n.global.t(value);

  return computed(() => [
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
  ]);
}
