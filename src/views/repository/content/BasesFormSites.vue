<!-- eslint-disable vue/no-duplicate-attributes -->
<template>
  <section :class="`sites__container sites__container--shape-${shape}`">
    <section
      v-if="items.data.length === 0 && shape !== 'accordion'"
      class="sites__content--empty"
    >
      <UnnnicIntelligenceText
        tag="p"
        family="secondary"
        color="neutral-darkest"
        size="body-lg"
        weight="bold"
        marginBottom="sm"
      >
        {{ $t('content_bases.sites.sidebar_add.title') }}
      </UnnnicIntelligenceText>

      <UnnnicIntelligenceText
        tag="p"
        family="secondary"
        color="neutral-cloudy"
        size="body-gt"
        marginBottom="sm"
      >
        {{ $t('content_bases.sites.sidebar_add.description') }}
      </UnnnicIntelligenceText>

      <UnnnicButton
        size="small"
        type="primary"
        class="sites__content__button-add-site"
        @click="isAddSiteOpen = true"
      >
        {{ $t('content_bases.sites.add_site') }}
      </UnnnicButton>
    </section>

    <BasesFormGenericList
      v-else
      :items="items"
      :shape="shape"
      :title="
        shape === 'accordion'
          ? $t('content_bases.tabs.sites')
          : $t('content_bases.sites.uploaded_sites')
      "
      :description="$t('content_bases.sites.sidebar_add.description')"
      :addText="$t('content_bases.sites.add_site')"
      :filterItem="filterItem"
      @add="isAddSiteOpen = true"
      @remove="onRemove"
    />

    <BarAddSite
      v-if="isAddSiteOpen"
      :contentBaseUuid="contentBaseUuid"
      @close="isAddSiteOpen = false"
      @added-sites="addedSites"
    />

    <UnnnicModal
      v-if="modalDeleteSite"
      :text="$t('content_bases.sites.delete_site.title')"
      :closeIcon="false"
      class="delete-site-modal"
      persistent
      data-test="modal-remove-site"
    >
      <template #icon>
        <UnnnicIcon
          icon="error"
          size="md"
          scheme="aux-red-500"
        />
      </template>

      <template #message>
        <div
          v-html="
            $t('content_bases.sites.delete_site.description', {
              name: modalDeleteSite.name,
            })
          "
        ></div>
      </template>
      <template #options>
        <UnnnicButton
          class="create-repository__container__button"
          type="tertiary"
          @click="modalDeleteSite = false"
        >
          {{ $t('content_bases.sites.delete_site.cancel') }}
        </UnnnicButton>

        <UnnnicButton
          class="create-repository__container__button attention-button"
          type="warning"
          :loading="modalDeleteSite.status === 'deleting'"
          data-test="button-remove"
          @click="remove"
        >
          {{ $t('content_bases.sites.delete_site.delete') }}
        </UnnnicButton>
      </template>
    </UnnnicModal>
  </section>
</template>

<script>
import nexusaiAPI from '../../../api/nexusaiAPI';
import BarAddSite from './BarAddSite.vue';
import BasesFormGenericList from './BasesFormGenericList.vue';

export default {
  components: {
    BarAddSite,
    BasesFormGenericList,
  },
  props: {
    items: Object,
    shape: String,
    filterText: String,
  },

  data() {
    return {
      isAddSiteOpen: false,

      modalDeleteSite: null,
    };
  },

  computed: {
    contentBaseUuid() {
      return (
        this.$route.params.contentBaseUuid ||
        this.$store.state.router.contentBaseUuid
      );
    },
  },

  methods: {
    onRemove({ uuid, created_file_name, status }) {
      if (['fail-upload', 'fail'].includes(status)) {
        this.items.removeItem({ uuid });
      } else {
        this.openDeleteSite(uuid, created_file_name || '');
      }
    },

    addedSites(sites) {
      this.isAddSiteOpen = false;

      sites.forEach((site) => this.items.addItem(site));
    },

    filterItem(item) {
      return item.created_file_name
        ?.toLowerCase()
        .includes(this.filterText?.toLowerCase());
    },

    openDeleteSite(siteUuid, siteURL) {
      this.modalDeleteSite = {
        uuid: siteUuid,
        name: siteURL,
        status: null,
      };
    },

    remove() {
      this.modalDeleteSite.status = 'deleting';

      nexusaiAPI.intelligences.contentBases.sites
        .delete({
          contentBaseUuid: this.contentBaseUuid,
          linkUuid: this.modalDeleteSite.uuid,
        })
        .then(() => {
          this.$store.state.alert = {
            type: 'default',
            text: this.$t('content_bases.files.file_removed_from_base', {
              name: this.modalDeleteSite.name,
            }),
          };

          this.items.removeItem({ uuid: this.modalDeleteSite.uuid });
        })
        .finally(() => {
          this.modalDeleteSite = null;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.delete-site-modal {
  :deep(.unnnic-modal-container-background-body-description-container) {
    padding-bottom: $unnnic-spacing-xs;
  }

  :deep(.unnnic-modal-container-background-body__icon-slot) {
    display: flex;
    justify-content: center;
    margin-bottom: $unnnic-spacing-sm;
  }

  :deep(.unnnic-modal-container-background-body-title) {
    padding-bottom: $unnnic-spacing-sm;
  }

  :deep(.unnnic-modal-container-background-body) {
    padding-top: $unnnic-spacing-giant;
  }
}

.sites {
  &__container {
    flex: 1;
    display: flex;
    flex-direction: column;

    &--shape-normal {
      height: 100%;
    }
  }

  &__content {
    &--empty {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    &__button-add-site {
      width: 12.5 * $unnnic-font-size;
    }
  }
}
</style>
