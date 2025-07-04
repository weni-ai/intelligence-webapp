<template>
  <div class="content-bases-page-container">
    <div class="repository-base">
      <div class="repository-base__header">
        <div class="repository-base__header__details">
          <div class="repository-base__header__title">
            <UnnnicButton
              size="small"
              type="tertiary"
              iconCenter="arrow_left_alt"
              scheme="neutral-dark"
              @click="$router.push({ name: 'home' })"
            />

            <UnnnicSkeletonLoading
              v-if="repository.uuid === null"
              tag="div"
              width="120px"
              height="28px"
            />

            <UnnnicIntelligenceText
              v-else
              family="secondary"
              color="neutral-darkest"
              weight="bold"
              size="title-sm"
            >
              {{ repository.name }}
            </UnnnicIntelligenceText>
          </div>

          <UnnnicSkeletonLoading
            v-if="repository.uuid === null"
            tag="div"
            width="300px"
            height="22px"
          />

          <p
            v-else
            class="repository-base__header__description"
          >
            {{ repository.description }}
          </p>
        </div>

        <div class="repository-base__header__actions">
          <RepositoryContentNavigation v-if="canContribute" />

          <UnnnicButton
            v-if="canContribute"
            class="create-base-button"
            iconLeft="add-1"
            @click="isAddContentBaseOpen = true"
          >
            {{ $t('webapp.home.bases.new_knowledge_base') }}
          </UnnnicButton>
        </div>
      </div>

      <UnnnicDivider ySpacing="lg" />

      <div
        v-if="bases.data.length === 0 && bases.status === 'complete'"
        class="bases-list--empty"
      >
        <img
          :src="DorisYawning"
          alt="Doris Yawning"
        />

        <h1 class="bases-list__title">
          {{ $t('intelligences.no_content_base_added') }}
        </h1>
      </div>

      <template v-else>
        <div class="bases-list__header">
          <UnnnicSkeletonLoading
            v-if="repository.uuid === null"
            tag="div"
            width="300px"
            height="28px"
          />

          <UnnnicIntelligenceText
            v-else
            color="neutral-dark"
            family="secondary"
            size="title-sm"
            weight="bold"
          >
            {{
              $tc(
                'webapp.home.bases.knowledge_bases',
                repository.content_bases_count,
              )
            }}
          </UnnnicIntelligenceText>

          <div class="bases-list__header__input">
            <UnnnicInput
              v-model="searchBaseName"
              iconLeft="search-1"
              :placeholder="$t('intelligences.search_content_base_placeholder')"
            />
          </div>
        </div>

        <div
          v-if="basesFiltered.length === 0 && bases.status === 'complete'"
          class="bases-list--empty"
        >
          <img
            :src="DorisDoubtReaction"
            alt="Doris Doubt Reaction"
          />

          <h1 class="bases-list__title">
            {{ $t('intelligences.no_content_base_found') }}
          </h1>
        </div>

        <div class="bases-list">
          <HomeRepositoryCard
            v-for="base in basesFiltered"
            :key="base.id"
            type="content-base"
            :uuid="base.uuid"
            :name="base.title"
            :description="base.description"
            :language="base.language"
            :canContribute="canContribute"
            @delete-base="openDeleteModal"
          />

          <template v-if="bases.status === 'loading'">
            <UnnnicSkeletonLoading
              v-for="i in 3"
              :key="i"
              tag="div"
              height="178px"
            />
          </template>

          <div
            v-show="bases.status !== 'loading'"
            ref="end-of-list-element"
          ></div>
        </div>
      </template>
    </div>

    <UnnnicModal
      v-if="isDeleteModalOpen"
      class="delete-base-modal"
      persistent
      :closeIcon="false"
      :text="$t('webapp.home.bases.edit-base_modal_delete_title')"
      :description="
        $t('webapp.home.bases.edit-base_modal_delete_text', {
          name: isDeleteModalOpen.name,
        })
      "
      @close="isDeleteModalOpen = null"
    >
      <template #icon>
        <UnnnicIcon
          icon="error"
          scheme="aux-red-500"
          size="lg"
        />
      </template>
      <template #options>
        <UnnnicButton
          type="tertiary"
          @click="isDeleteModalOpen = null"
        >
          {{ $t('webapp.home.bases.edit-base_modal_delete_button_cancel') }}
        </UnnnicButton>
        <UnnnicButton
          type="warning"
          :loading="isDeleteModalOpen.loading"
          @click="deleteBase"
        >
          {{ $t('webapp.home.bases.edit-base_modal_delete_button_confirm') }}
        </UnnnicButton>
      </template>
    </UnnnicModal>

    <BaseSettingsForm
      v-if="isAddContentBaseOpen"
      :intelligenceUuid="$route.params.intelligenceUuid"
      @close="isAddContentBaseOpen = false"
      @success="
        ($event) =>
          $router.push({
            name: 'intelligence-content-base-edit',
            params: {
              contentBaseUuid: $event.uuid,
            },
          })
      "
    ></BaseSettingsForm>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import HomeRepositoryCard from '@/components/repository/home/HomeRepositoryCard.vue';
import RepositoryContentNavigation from './Navigation.vue';
import nexusaiAPI from '../../../api/nexusaiAPI';
import BaseSettingsForm from '../../../components/BaseSettingsForm.vue';
import DorisYawning from '@/assets/images/doris-yawning.png';
import DorisDoubtReaction from '@/assets/images/doris-doubt-reaction.png';

export default {
  name: 'RepositoryBase',
  components: {
    HomeRepositoryCard,
    RepositoryContentNavigation,
    BaseSettingsForm,
  },
  data() {
    return {
      searchBaseName: '',

      loadingIntelligence: false,

      repository: {
        uuid: null,
        name: '',
        description: '',
        content_bases_count: 0,
      },

      repositoryUUID: null,

      isDeleteModalOpen: null,
      modalData: {},
      isAddContentBaseOpen: false,

      isShowingEndOfList: false,

      bases: {
        count: null,
        limit: 20,
        offset: 0,
        repositoryUuid: this.repositoryUUID,
        data: [],
        next: null,
        status: null,
      },
    };
  },

  mounted() {},

  beforeUnmount() {
    this.intersectionObserver.unobserve(this.$refs['end-of-list-element']);
  },

  computed: {
    ...mapGetters([
      'getCurrentRepository',
      'getProjectSelected',
      'getOrgSelected',
    ]),

    basesFiltered() {
      return this.bases.data.filter(({ title }) =>
        this.searchBaseName
          ? title.toLowerCase().includes(this.searchBaseName.toLowerCase())
          : true,
      );
    },

    canContribute() {
      return true;
    },

    getAllCategories() {
      if (!this.repository.categories_list) {
        return [];
      }

      const categories = this.repository.categories_list.map(
        (category) => category.name,
      );
      return categories;
    },
  },
  watch: {
    isShowingEndOfList() {
      if (this.isShowingEndOfList && this.bases.status !== 'complete') {
        this.fetchBases();
      }
    },

    '$route.params.intelligenceUuid': {
      immediate: true,

      handler() {
        this.loadingIntelligence = true;

        nexusaiAPI
          .readIntelligence({
            orgUuid: this.$store.state.Auth.connectOrgUuid,
            intelligenceUuid: this.$route.params.intelligenceUuid,
          })
          .then(({ data }) => {
            /*
              uuid
              content_bases_count: Number
              description: String
              name: String
            */

            this.$store.state.Repository.current = data;

            this.repository = data;
          })
          .finally(() => {
            this.loadingIntelligence = false;
          });
      },
    },

    // eslint-disable-next-line
    "repository.uuid"() {
      if (!this.repository.uuid || this.repository.uuid === 'null') {
        return false;
      }

      this.repositoryUUID = this.repository.uuid;

      this.$nextTick(() => {
        this.fetchBases();

        this.intersectionObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            this.isShowingEndOfList = entry.isIntersecting;
          });
        });

        this.intersectionObserver.observe(this.$refs['end-of-list-element']);
      });
    },
  },
  methods: {
    ...mapActions([
      'getQAKnowledgeBasesNext',
      'deleteQAKnowledgeBase',
      'createQAKnowledgeBase',
      'editQAKnowledgeBase',
      'createQAText',
    ]),

    reloadBases() {
      this.bases = {
        count: null,
        limit: 20,
        offset: 0,
        repositoryUuid: this.repositoryUUID,
        data: [],
        next: null,
        status: null,
      };

      this.fetchBases();
    },

    async fetchBases() {
      try {
        this.bases.status = 'loading';

        const { data } = await nexusaiAPI.listIntelligencesContentBases({
          intelligenceUuid: this.$route.params.intelligenceUuid,
          next: this.bases.next,
        });

        this.bases.data = [...this.bases.data, ...data.results];
        this.bases.next = data.next;

        if (!data.next) {
          this.bases.status = 'complete';
        }
      } finally {
        if (this.bases.status === 'loading') {
          this.bases.status = null;
        }
      }
    },

    openDeleteModal(repository) {
      this.isDeleteModalOpen = {
        name: repository.name,
        contentBaseUuid: repository.uuid,
        loading: false,
      };
    },

    async deleteBase() {
      this.isDeleteModalOpen.loading = true;

      await nexusaiAPI.deleteIntelligenceContentBase({
        intelligenceUuid: this.$route.params.intelligenceUuid,
        contentBaseUuid: this.isDeleteModalOpen.contentBaseUuid,
      });

      this.isDeleteModalOpen = null;

      this.reloadBases();
    },
  },
};
</script>

<style lang="scss" scoped>
.delete-base-modal {
  :deep(.unnnic-modal-container-background-body) {
    padding-top: $unnnic-spacing-giant;
  }

  :deep(.unnnic-modal-container-background-body__icon-slot) {
    margin-bottom: $unnnic-spacing-sm;
  }

  :deep(.unnnic-modal-container-background-body-title) {
    padding-bottom: $unnnic-spacing-sm;
  }

  :deep(.unnnic-modal-container-background-body-description-container) {
    padding-bottom: 0;
  }

  :deep(.unnnic-modal-container-background-button) {
    padding-top: $unnnic-spacing-lg;
    padding-bottom: $unnnic-spacing-lg;
  }
}

.content-bases-page-container {
  padding: $unnnic-spacing-lg $unnnic-spacing-lg;
}

.create-base-button {
  min-width: 20.625 * $unnnic-font-size;
}

.bases-list__header {
  display: grid;
  align-items: center;
  gap: $unnnic-spacing-sm;
  grid-template-columns: repeat(
    auto-fill,
    minmax(20.625 * $unnnic-font-size, 1fr)
  );

  &__input {
    grid-column-end: -1;
    grid-column-start: 2;
  }
}

.bases-list {
  margin-top: $unnnic-spacing-md;
  display: grid;
  gap: $unnnic-spacing-sm;
  grid-template-columns: repeat(
    auto-fill,
    minmax(20.625 * $unnnic-font-size, 1fr)
  );

  &--empty {
    margin-top: 7.5 * $unnnic-font-size;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__title {
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-title-sm;
    line-height: $unnnic-font-size-title-sm + $unnnic-line-height-md;
    font-weight: $unnnic-font-weight-bold;
    color: $unnnic-color-neutral-darkest;
    text-align: center;

    margin-block: $unnnic-spacing-md;
  }
}

.repository-base {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $unnnic-spacing-sm;

    &__details {
      display: flex;
      flex-direction: column;
      row-gap: $unnnic-spacing-sm;
    }

    &__title {
      display: flex;
      column-gap: $unnnic-spacing-ant;
      align-items: center;
    }

    &__actions {
      display: flex;
      align-items: center;
      column-gap: $unnnic-spacing-sm;

      .create-base-button {
        min-width: 15.625 * $unnnic-font-size;
      }
    }

    &__description {
      color: $unnnic-color-neutral-dark;
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-body-gt;
      line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
      font-weight: $unnnic-font-weight-regular;

      margin: 0;
    }

    &__categories {
      display: flex;
      flex-wrap: wrap;
      gap: $unnnic-spacing-xs;
    }

    &__tag {
      padding: 0 $unnnic-inset-lg;
      font-size: 15px;
    }
  }

  &__description {
    &__header {
      display: flex;
      justify-content: space-between;
    }

    &__text,
    i {
      margin-top: $unnnic-inset-nano;
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-body-gt;
      color: $unnnic-color-neutral-dark;
      ul li {
        list-style-type: disc;
      }
    }
  }
  &__cards {
    display: grid;
    justify-content: space-between;
    grid-template-columns: repeat(4, 24%);
    margin-top: $unnnic-inset-md;
    gap: $unnnic-spacing-sm;
    @media screen and (max-width: 1400px) {
      grid-template-columns: repeat(3, 32%);
    }

    &__new {
      height: 16.8125rem;
      margin-bottom: $unnnic-inline-sm;
    }
  }
}

:deep(.unnnic-card-intelligence__detail) {
  display: none;
}
:deep(.unnnic-card-intelligence__divider) {
  display: none;
}
:deep(.unnnic-card-intelligence__description) {
  -webkit-line-clamp: 2;
}
:deep(.repository-base__description__text--link) {
  color: $unnnic-color-neutral-dark;
  text-decoration: underline;
}

:deep(.unnnic-modal-container-background-body-description-container) {
  padding-bottom: $unnnic-spacing-sm;
}
</style>
