<template>
  <section class="not-found">
    <UnnnicIcon
      icon="warning"
      size="avatar-sm"
      scheme="neutral-cleanest"
    />

    <UnnnicIntelligenceText
      color="neutral-dark"
      family="secondary"
      size="body-gt"
      weight="bold"
      marginTop="xs"
    >
      {{ $t('content_bases.files.preview.not_found.title') }}
    </UnnnicIntelligenceText>

    <UnnnicIntelligenceText
      color="neutral-cloudy"
      family="secondary"
      size="body-gt"
      marginTop="nano"
    >
      <span v-html="$t('content_bases.files.preview.not_found.description')" />
    </UnnnicIntelligenceText>
  </section>
</template>

<style lang="scss" scoped>
.not-found {
  $skeleton-loading-height: 30.125 * $unnnic-font-size;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: $skeleton-loading-height;
}
</style>
