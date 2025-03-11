import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

/**
 * Composable for handling infinite scroll functionality
 * @param {Function} loadMoreCallback - Function to call when end of list is reached
 * @returns {Object} Infinite scroll utilities
 */
export default function useInfiniteScroll(loadMoreCallback) {
  const endOfListElement = ref(null);
  const intersectionObserver = ref(null);
  const isShowingEndOfList = ref(false);
  const isInitialCheck = ref(true);

  const isElementInViewport = (el) => {
    if (!el) return false;

    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  const checkVisibilityAndLoad = () => {
    if (endOfListElement.value && isElementInViewport(endOfListElement.value)) {
      isShowingEndOfList.value = true;
      if (loadMoreCallback) {
        loadMoreCallback();
      }
    }
  };

  const setupIntersectionObserver = () => {
    if (intersectionObserver.value) {
      cleanup();
    }

    intersectionObserver.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isShowingEndOfList.value = entry.isIntersecting;

          if (entry.isIntersecting && loadMoreCallback) {
            console.log('Intersection detected, loading more content');
            loadMoreCallback();
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      },
    );

    if (endOfListElement.value) {
      intersectionObserver.value.observe(endOfListElement.value);

      if (isInitialCheck.value) {
        isInitialCheck.value = false;
        nextTick(() => {
          checkVisibilityAndLoad();
        });
      }
    }
  };

  const cleanup = () => {
    if (intersectionObserver.value) {
      if (endOfListElement.value) {
        intersectionObserver.value.unobserve(endOfListElement.value);
      }
      intersectionObserver.value.disconnect();
      intersectionObserver.value = null;
    }
  };

  watch(
    () => endOfListElement.value,
    (newElement) => {
      if (newElement && intersectionObserver.value) {
        intersectionObserver.value.observe(newElement);

        nextTick(() => {
          checkVisibilityAndLoad();
        });
      }
    },
  );

  onMounted(() => {
    setTimeout(() => {
      setupIntersectionObserver();
    }, 0);
  });

  onBeforeUnmount(() => {
    cleanup();
  });

  return {
    endOfListElement,
    isShowingEndOfList,
    checkVisibilityAndLoad,
  };
}
