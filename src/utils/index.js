import { useActionsStore } from '@/store/Actions';
import VERBOSE_LANGUAGES from './verbose_languages';
import env from './env';

export const languageListToDict = (list) =>
  list?.reduce((current, lang) => {
    Object.assign(current, { [lang]: VERBOSE_LANGUAGES[lang] || lang });
    return current;
  }, {});

export const LANGUAGES = languageListToDict(
  env('SUPPORTED_LANGUAGES')
    ?.split('|')
    .map((v) => v.split(':')[0]),
);

export const WENIGPT_OPTIONS = JSON.parse(env('OPTIONS_WENIGPT') || '[]');

export const createDownloadAnchor = ({ name, href }) => {
  const a = document.createElement('a');

  a.setAttribute('download', name);
  a.setAttribute('href', href);

  return a;
};

export const actionGroupIcon = (groupId) => {
  return {
    interactions: 'chat',
    shopping: 'shopping_cart',
    support: 'contact_support',
    media: 'attach_file',
    custom: 'edit_square',
  }[groupId];
};

export const actionInfo = ({ name, prompt, type }) => {
  const actionsStore = useActionsStore();

  const actionType = actionsStore.types.data.find(
    (item) =>
      item.name === name && item.prompt === prompt && item.type === type,
  );

  const group = actionType?.group || 'custom';

  return {
    icon: actionGroupIcon(group),
    group,
  };
};
