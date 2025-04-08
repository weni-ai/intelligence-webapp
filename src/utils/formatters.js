import i18n from '@/utils/plugins/i18n';

/**
 * Formats an array of items into a human-readable string with proper conjunction
 * @param {Array} items - Array of items to format
 * @returns {String} Formatted string like "item1, item2 and item3"
 */
export function formatListToReadable(items) {
  if (!Array.isArray(items)) {
    return '';
  }

  if (items.length === 0) {
    return '';
  }

  if (items.length === 1) {
    return items[0];
  }

  const lastItem = items.at(-1);
  const otherItems = items.slice(0, -1).join(', ');

  return `${otherItems}${i18n.global.t('and')}${lastItem}`;
}
