<template>
  <BrainHeader />

  <section class="knowledge">
    <RouterContentBase
      :filesProp="files"
      :sitesProp="sites"
      :textProp="text"
      :textLoading="text.status === 'loading'"
      @update:files="(v) => (files = v)"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import RouterContentBase from '@/views/Brain/RouterContentBase.vue';
import { useFilesPagination } from '@/views/ContentBases/filesPagination';
import { useSitesPagination } from '@/views/ContentBases/sitesPagination';

import BrainHeader from '@/components/Brain/BrainHeader.vue';

const route = useRoute();
const store = useStore();

const loadingContentBase = ref(false);
const dropdownOpen = ref(false);
const refreshPreviewValue = ref(0);
const isMobilePreviewModalOpen = ref(false);

const previewMessages = ref('');

const text = ref({
  open: true,
  status: null,
  uuid: null,
  oldValue: '',
  value: '',
});

const routerTunings = ref({
  brainOn: true,
});

const contentBase = ref({
  title: '',
  description: '',
  language: '',
});

const contentBaseUuid = computed(
  () => route.params.contentBaseUuid || store.state.router.contentBaseUuid,
);

const intelligenceUuid = computed(
  () => route.params.intelligenceUuid || store.state.router.intelligenceUuid,
);

const files = useFilesPagination({
  contentBaseUuid: contentBaseUuid.value,
});

const sites = useSitesPagination({
  contentBaseUuid: contentBaseUuid.value,
});

onMounted(() => {
  files.loadNext();
  sites.loadNext();
});
</script>

<style lang="scss" scoped>
.knowledge {
  height: 100%;
  width: 100%;

  display: grid;
}
</style>
