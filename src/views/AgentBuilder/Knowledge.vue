<template>
  <section class="knowledge">
    <AgentBuilderHeader
      data-testid="knowledge-header"
      :withDivider="false"
      actionsSize="none"
    />

    <RouterContentBase
      data-testid="router-content-base"
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
import { get } from 'lodash';

import nexusaiAPI from '@/api/nexusaiAPI';

import RouterContentBase from '@/views/Brain/RouterContentBase.vue';
import { useFilesPagination } from '@/views/ContentBases/filesPagination';
import { useSitesPagination } from '@/views/ContentBases/sitesPagination';

import AgentBuilderHeader from '@/components/AgentBuilder/Header.vue';

const route = useRoute();
const store = useStore();

const text = ref({
  open: true,
  status: null,
  uuid: null,
  oldValue: '',
  value: '',
});

const contentBaseUuid = computed(
  () => route.params.contentBaseUuid || store.state.router.contentBaseUuid,
);

const files = useFilesPagination({
  contentBaseUuid: contentBaseUuid.value,
});

const sites = useSitesPagination({
  contentBaseUuid: contentBaseUuid.value,
});

async function loadContentBaseText() {
  text.value.status = 'loading';

  const { data: contentBaseTextsData } =
    await nexusaiAPI.intelligences.contentBases.texts.list({
      contentBaseUuid: contentBaseUuid.value,
    });

  const textData = get(contentBaseTextsData, 'results.0.text', '');
  const uuid = get(contentBaseTextsData, 'results.0.uuid', '');

  store.state.Brain.contentText.uuid = text.value.uuid = uuid;
  const textValue = textData === '--empty--' ? '' : textData;

  store.state.Brain.contentText.current = store.state.Brain.contentText.old =
    textValue;

  text.value.value = textValue;
  text.value.oldValue = textValue;
  text.value.status = null;
}

onMounted(() => {
  loadContentBaseText();
  files.loadNext();
  sites.loadNext();
});
</script>

<style lang="scss" scoped>
.knowledge {
  height: 100%;
  width: 100%;

  display: grid;
  grid-template-rows: auto 1fr;
  gap: $unnnic-spacing-md;
}
</style>
