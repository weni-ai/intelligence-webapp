<template>
  <div :class="containerClass">
    <section :class="repositoryBaseEditClass">
      <section class="repository-base-edit__header">
        <UnnnicButton
          v-if="!dontShowBack"
          size="small"
          type="tertiary"
          iconCenter="arrow_left_alt"
          scheme="neutral-dark"
          data-test="back-btn"
          @click="$emit('back')"
        />

        <div>
          <div class="repository-base-edit__header--content">
            <UnnnicSkeletonLoading
              v-if="loadingTitle"
              tag="div"
              width="180px"
              height="28px"
            />

            <h1
              v-else
              id="titleId"
              ref="focusInput"
              class="repository-base-edit__title"
              :contenteditable="canEditTitle"
              @update:model-value="$emit('update:title', $event)"
            >
              {{ title }}
            </h1>
          </div>
        </div>

        <slot name="actions"></slot>
      </section>

      <section
        v-if="description"
        class="repository-base-edit__description"
      >
        {{ description }}
      </section>
    </section>

    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    loadingTitle: Boolean,
    title: {
      type: String,
      default: '',
      required: false,
    },
    canEditTitle: Boolean,
    description: {
      type: String,
      default: '',
      required: false,
    },
    isNoSpaceContainer: {
      type: Boolean,
      default: false,
      required: false,
    },
    dontShowBack: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  emits: ['back', 'update:title'],
  computed: {
    containerClass() {
      return {
        'content-bases-page-container': true,
        'page-container-padding': !this.isNoSpaceContainer,
        'page-container--no-padding': this.isNoSpaceContainer,
      };
    },
    repositoryBaseEditClass() {
      return {
        'repository-base-edit': true,
        'repo-margin-bottom': !this.isNoSpaceContainer,
        'no-margin-bottom': this.isNoSpaceContainer,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.page-container-padding {
  padding: $unnnic-spacing-lg;
}

.page-container--no-padding {
  padding: 0;
}

.no-margin-bottom {
  margin-bottom: 0;
}

.repo-margin-bottom {
  margin-bottom: $unnnic-spacing-md;
}

.content-bases-page-container {
  overflow: hidden;

  background-color: $unnnic-color-background-snow;
  min-height: 100vh;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .repository-base-edit {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &__description {
      margin-top: $unnnic-spacing-sm;

      color: $unnnic-color-neutral-dark;
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-body-gt;
      line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
      font-weight: $unnnic-font-weight-regular;
    }

    &__header {
      display: flex;
      align-items: center;
      column-gap: $unnnic-spacing-ant;

      &__buttons {
        display: flex;
        justify-content: space-between;

        .unnnic-tooltip {
          height: 46px;
          &:nth-child(2) {
            margin: 0 $unnnic-inset-nano;
          }
          &:nth-child(3) {
            margin-right: $unnnic-inset-nano;
          }
        }
      }
      &__button {
        width: 46px;
        height: 46px;
      }
      &--content {
        display: flex;
        align-items: center;
      }
      span {
        cursor: pointer;
        margin-right: $unnnic-spacing-xs;
      }
    }

    &__title {
      border: none;
      margin-right: $unnnic-inset-nano;
      padding: 0;
      margin: 0;

      color: $unnnic-color-neutral-darkest;
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-title-sm;
      line-height: $unnnic-font-size-title-sm + $unnnic-line-height-md;
      font-weight: $unnnic-font-weight-bold;

      &:focus {
        border: none;
        border-radius: 2pt;
        box-shadow: 0 0 0 1pt grey;
        outline: none;
        transition: 0.1s;
      }
    }
  }
}
</style>
