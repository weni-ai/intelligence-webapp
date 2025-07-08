<template>
  <UnnnicSkeletonLoading
    v-if="isLoading"
    tag="div"
    width="100%"
    height="58px"
  />

  <tr
    v-else
    class="conversation-row"
    :class="{ 'conversation-row--selected': isSelected }"
  >
    <section class="conversation-row__main-infos">
      <td class="main-infos__avatar">
        <p class="avatar__letter">{{ conversation?.username?.[0] || '-' }}</p>
      </td>

      <td class="main-infos__user-data">
        <ConversationInfos
          :username="conversation.username"
          :urn="conversation.urn"
        />
      </td>

      <td class="main-infos__status">
        <UnnnicTag
          class="cell__status"
          :scheme="statusProps.scheme"
          :text="statusProps.text"
        />
      </td>
    </section>

    <section class="conversation-row__secondary-infos">
      <td
        v-if="csatProps"
        class="secondary-infos__csat"
      >
        <UnnnicTag
          :scheme="csatProps.scheme"
          :text="csatProps.text"
        />
      </td>

      <td class="secondary-infos__date">
        <ConversationDate :date="conversation.created_on" />
      </td>
    </section>
  </tr>
</template>

<script setup>
import { computed } from 'vue';

import i18n from '@/utils/plugins/i18n';

import ConversationDate from './ConversationDate.vue';
import ConversationInfos from './ConversationInfos.vue';

const props = defineProps({
  conversation: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const t = (key) => i18n.global.t(key);

const statusProps = computed(() => {
  const status = props.conversation.status || 'in_progress';

  const baseStatus = {
    text: t(`agent_builder.supervisor.status.${status}`),
  };

  const mapStatus = {
    in_progress: {
      scheme: 'aux-blue-500',
    },
    resolved: {
      scheme: 'aux-green-500',
    },
    unresolved: {
      scheme: 'aux-red-500',
    },
  };

  return {
    ...baseStatus,
    ...mapStatus[status],
  };
});

const csatProps = computed(() => {
  const mapCsat = {
    very_satisfied: {
      text: 'Very satisfied',
    },
    satisfied: {
      text: 'Satisfied',
    },
    neutral: {
      text: 'Neutral',
    },
    unsatisfied: {
      text: 'Unsatisfied',
    },
    very_unsatisfied: {
      text: 'Very unsatisfied',
    },
  };

  return mapCsat[props.conversation.csat];
});
</script>

<style lang="scss" scoped>
.conversation-row {
  position: relative;

  border-radius: $unnnic-border-radius-md;

  padding: $unnnic-spacing-xs $unnnic-spacing-sm;

  display: flex;
  gap: $unnnic-spacing-sm;
  align-items: center;
  justify-content: space-between;

  cursor: pointer;

  &--selected,
  &:hover {
    background-color: $unnnic-color-background-sky;
  }

  &::after {
    content: '';
    background-color: $unnnic-color-neutral-light;

    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

    width: calc(100% - $unnnic-spacing-sm * 2);
    height: $unnnic-border-width-thinner;
  }

  td {
    padding: 0;
  }

  &__main-infos,
  &__secondary-infos {
    display: flex;
    gap: $unnnic-spacing-sm;
    align-items: center;
  }

  &__main-infos {
    .main-infos__avatar {
      min-width: 35px;
      min-height: 35px;

      border-radius: 50%;
      background-color: $unnnic-color-weni-100;

      display: flex;
      align-items: center;
      justify-content: center;

      .avatar__letter {
        font-family: $unnnic-font-family-secondary;
        font-size: $unnnic-font-size-body-gt;
        font-weight: $unnnic-font-weight-bold;
        color: $unnnic-color-weni-600;
      }
    }

    .main-infos__status,
    .secondary-infos__date {
      white-space: nowrap;
    }
  }
}
</style>
