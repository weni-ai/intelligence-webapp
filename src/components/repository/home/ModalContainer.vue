<template>
  <Transition name="modal-transition">
    <div
      v-if="showModal"
      class="modal-container"
    >
      <div class="modal-container__content">
        <div class="modal-container__content__background">
          <section class="modal-container__content__background__header">
            <UnnnicIconSvg
              size="lg"
              icon="keyboard-arrow-down-1"
              clickable
              @click="closeModal()"
            />

            <div class="modal-container__content__background__header__text">
              <div
                class="modal-container__content__background__header__text__title"
              >
                {{ infoModal.title }}
              </div>
              <div
                class="modal-container__content__background__header__text__subtitle"
              >
                {{ infoModal.subtitle }}
              </div>
            </div>
          </section>

          <section
            v-if="infoModal.type === 0"
            class="modal-container__content__background__content"
          >
            <div class="modal-container__content__background__content__tags">
              <span
                v-for="tag in infoModal.intents"
                :key="tag.id"
              >
                <UnnnicTag
                  :text="tag.value"
                  type="indicator"
                  :count="tag.examples__count"
                  scheme="aux-blue"
                  clickable
                  enableTooltip
                  :tooltipText="$t('webapp.intelligences_lib.intent_count')"
                  @click="goToIntentList(tag.id)"
                />
              </span>
            </div>
          </section>

          <section
            v-else
            class="modal-container__content__background__content"
          >
            <div class="modal-container__content__background__content__list">
              <span
                v-for="language in infoModal.languages"
                :key="language"
              >
                {{ languageVerbose(language) }}
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import VERBOSE_LANGUAGES from '@/utils/verbose_languages';

export default {
  name: 'ModalContainer',
  props: {
    infoModal: {
      type: Object,
      default: null,
    },
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeModal() {
      this.$emit('closeModal');
    },
    goToIntentList(intent) {
      this.$router.push(
        `/${this.infoModal.ownerNickname}/${this.infoModal.slug}/intentlist/${intent}`,
      );
    },
    languageVerbose(language) {
      return VERBOSE_LANGUAGES[language] || language;
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-transition-leave-to {
  animation: transition 0.2s reverse;
}

.modal-transition-enter-active {
  animation: transition 0.2s;
}

@keyframes transition {
  100% {
    transform: translateY(0%);
  }
  0% {
    transform: translateY(100%);
  }
}

.modal-container {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.24);

  &__content {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: flex-end;
    align-items: flex-end;

    &__background {
      width: 100%;
      height: 60%;
      transition: opacity 0.9s;
      background-color: $unnnic-color-background-snow;
      overflow: hidden;
      padding: $unnnic-inline-xl;

      &__header {
        display: flex;
        border-bottom: 0.0625rem solid $unnnic-color-neutral-soft;
        padding-bottom: $unnnic-inset-md;

        &__text {
          margin-left: $unnnic-inline-md;

          &__title {
            margin-bottom: $unnnic-inset-xs;
            font-family: $unnnic-font-family-secondary;
            font-weight: $unnnic-font-weight-bold;
            font-size: $unnnic-font-size-title-sm;
            line-height: $unnnic-font-size-title-sm + $unnnic-line-height-medium;
            color: $unnnic-color-neutral-black;
          }

          &__subtitle {
            font-family: $unnnic-font-family-secondary;
            font-weight: $unnnic-font-weight-regular;
            font-size: $unnnic-font-size-body-gt;
            line-height: $unnnic-font-size-body-gt + $unnnic-line-height-medium;
            color: $unnnic-color-neutral-cloudy;
          }
        }
      }

      &__content {
        overflow: auto;
        margin-top: $unnnic-inset-md;
        height: 80%;

        &__tags {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;

          span {
            margin: $unnnic-inset-nano;
          }
        }
        &__list {
          display: flex;
          flex-direction: column;
          overflow: auto;

          span {
            color: $unnnic-color-neutral-darkest;
          }
        }
      }
    }
  }
}
</style>
