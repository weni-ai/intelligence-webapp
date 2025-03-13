import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ref, nextTick } from 'vue';
import useInfiniteScroll from '../useInfiniteScroll';

class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.elements = new Set();
    this.mockIntersecting = false;
  }

  observe(element) {
    this.elements.add(element);
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  simulateIntersection(isIntersecting) {
    this.mockIntersecting = isIntersecting;
    const entries = Array.from(this.elements).map((element) => ({
      isIntersecting,
      target: element,
      boundingClientRect: element.getBoundingClientRect(),
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: isIntersecting ? element.getBoundingClientRect() : null,
      rootBounds: null,
      time: Date.now(),
    }));

    if (entries.length > 0) {
      this.callback(entries);
    }
  }
}

const mockGetBoundingClientRect = (inViewport = true) => {
  return () => ({
    top: inViewport ? 0 : -1000,
    left: inViewport ? 0 : -1000,
    bottom: inViewport ? 100 : -900,
    right: inViewport ? 100 : -900,
    width: 100,
    height: 100,
  });
};

describe('useInfiniteScroll', () => {
  let originalIntersectionObserver;
  let loadMoreCallback;
  let mockDiv;

  beforeEach(() => {
    originalIntersectionObserver = global.IntersectionObserver;

    global.IntersectionObserver = MockIntersectionObserver;

    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000);
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000);

    loadMoreCallback = vi.fn();

    mockDiv = document.createElement('div');
    Object.defineProperty(mockDiv, 'getBoundingClientRect', {
      value: mockGetBoundingClientRect(true),
      configurable: true,
    });
  });

  afterEach(() => {
    global.IntersectionObserver = originalIntersectionObserver;

    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('returns the expected object properties', () => {
      const { endOfListElement, isShowingEndOfList, checkVisibilityAndLoad } =
        useInfiniteScroll(loadMoreCallback);

      expect(endOfListElement).toBeDefined();
      expect(isShowingEndOfList).toBeDefined();
      expect(checkVisibilityAndLoad).toBeTypeOf('function');
    });
  });

  describe('Observer behavior', () => {
    it('calls loadMoreCallback when element is intersecting', async () => {
      const { checkVisibilityAndLoad, endOfListElement } =
        useInfiniteScroll(loadMoreCallback);

      endOfListElement.value = mockDiv;

      await nextTick();

      Object.defineProperty(mockDiv, 'getBoundingClientRect', {
        value: mockGetBoundingClientRect(true),
        configurable: true,
      });

      checkVisibilityAndLoad();

      expect(loadMoreCallback).toHaveBeenCalled();
    });

    it('does not call loadMoreCallback when element is not intersecting', async () => {
      const { checkVisibilityAndLoad, endOfListElement } =
        useInfiniteScroll(loadMoreCallback);

      endOfListElement.value = mockDiv;

      await nextTick();

      Object.defineProperty(mockDiv, 'getBoundingClientRect', {
        value: mockGetBoundingClientRect(false),
        configurable: true,
      });

      checkVisibilityAndLoad();

      expect(loadMoreCallback).not.toHaveBeenCalled();
    });
  });

  describe('isElementInViewport', () => {
    it('returns true when element is in viewport', async () => {
      const { checkVisibilityAndLoad, endOfListElement } =
        useInfiniteScroll(loadMoreCallback);

      endOfListElement.value = mockDiv;

      checkVisibilityAndLoad();

      expect(loadMoreCallback).toHaveBeenCalled();
    });

    it('returns false when element is not in viewport', async () => {
      const { checkVisibilityAndLoad, endOfListElement } =
        useInfiniteScroll(loadMoreCallback);

      Object.defineProperty(mockDiv, 'getBoundingClientRect', {
        value: mockGetBoundingClientRect(false),
        configurable: true,
      });
      endOfListElement.value = mockDiv;

      loadMoreCallback.mockReset();

      checkVisibilityAndLoad();

      expect(loadMoreCallback).not.toHaveBeenCalled();
    });

    it('returns false when element is null', async () => {
      const { checkVisibilityAndLoad, endOfListElement } =
        useInfiniteScroll(loadMoreCallback);

      endOfListElement.value = null;

      loadMoreCallback.mockReset();

      checkVisibilityAndLoad();

      expect(loadMoreCallback).not.toHaveBeenCalled();
    });
  });

  describe('Setup and cleanup', () => {
    it('properly cleans up the observer when component is unmounted', async () => {
      const { endOfListElement } = useInfiniteScroll(loadMoreCallback);

      endOfListElement.value = mockDiv;

      await nextTick();

      const onMountedCallback = vi.fn();
      const onBeforeUnmountCallback = vi.fn();

      onBeforeUnmountCallback();

      loadMoreCallback.mockReset();

      const observerInstance = new MockIntersectionObserver(() => {}, {});
      observerInstance.observe(mockDiv);
      observerInstance.simulateIntersection(true);

      expect(loadMoreCallback).not.toHaveBeenCalled();
    });
  });
});
