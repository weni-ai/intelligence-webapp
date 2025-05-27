<template>
  <section
    class="content-section"
    v-html="html"
  />
</template>

<script>
import DOMPurify from 'dompurify';
import { marked } from 'marked';

export default {
  props: {
    content: {
      type: String,
      default: '',
    },
  },

  computed: {
    html() {
      marked.setOptions({
        breaks: true,
        gfm: false,
      });

      const processedContent = this.content
        // Convert • bullet points to proper Markdown list syntax
        .replace(/\n•\s*/g, '\n* ')
        // Handle cases where • appears at the start of content
        .replace(/^•\s*/g, '* ')

      return DOMPurify.sanitize(marked.parse(processedContent));
    },
  },
};
</script>

<style scoped>
.content-section {
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}
</style>
