import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { getFileType } from '@/utils/medias';
import PreviewMedia from '../PreviewMedia.vue';

vi.mock('@/utils/medias', () => ({
  getFileType: vi.fn(),
}));

global.URL.createObjectURL = vi.fn(() => 'mocked-url');

describe('PreviewMedia.vue', () => {
  let wrapper;

  const createMockFile = (name, type) => {
    return new File(['test content'], name, { type });
  };

  const createWrapper = (props = {}) => {
    return shallowMount(PreviewMedia, {
      props: {
        media: null,
        ...props,
      },
      global: {
        stubs: {
          UnnnicIntelligenceVideo: true,
          PreviewDocument: true,
          MapViewport: true,
          UnnnicAudioRecorder: true,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  describe('Component Rendering', () => {
    it('renders the component successfully', () => {
      getFileType.mockReturnValue(null);
      wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    it('renders nothing when no media type is determined', () => {
      getFileType.mockReturnValue(null);
      wrapper = createWrapper({ media: 'unknown-file' });
      expect(wrapper.html()).toBe('<!--v-if-->');
    });
  });

  describe('Image Media Type', () => {
    it('renders img element for image media', () => {
      getFileType.mockReturnValue('image');
      const mockFile = createMockFile('test.jpg', 'image/jpeg');
      wrapper = createWrapper({ media: mockFile });

      const img = wrapper.find('img');
      expect(img.exists()).toBe(true);
      expect(img.classes()).toContain('preview-media');
      expect(img.attributes('src')).toBe('mocked-url');
    });
  });

  describe('Video Media Type', () => {
    it('renders UnnnicIntelligenceVideo for video media', () => {
      getFileType.mockReturnValue('video');
      const mockFile = createMockFile('test.mp4', 'video/mp4');
      wrapper = createWrapper({ media: mockFile });

      const video = wrapper.findComponent({ name: 'UnnnicIntelligenceVideo' });
      expect(video.exists()).toBe(true);
      expect(video.classes()).toContain('preview-media');
      expect(video.props('src')).toBe('mocked-url');
    });
  });

  describe('Document Media Type', () => {
    it('renders PreviewDocument for document media', () => {
      getFileType.mockReturnValue('document');
      const mockFile = createMockFile('test.pdf', 'application/pdf');
      wrapper = createWrapper({ media: mockFile });

      const document = wrapper.findComponent({ name: 'PreviewDocument' });
      expect(document.exists()).toBe(true);
      expect(document.props('document')).toBe(mockFile);
    });
  });

  describe('Geolocation Media Type', () => {
    it('renders MapViewport for geolocation media', () => {
      getFileType.mockReturnValue('geolocation');
      const geoString = '40.7128,-74.0060';
      wrapper = createWrapper({ media: geoString });

      const map = wrapper.findComponent(
        '[data-testid="preview-media-geolocation"]',
      );
      expect(map.exists()).toBe(true);
      expect(map.props('geolocation')).toBe(geoString);
    });
  });

  describe('Audio Media Type', () => {
    it('renders UnnnicAudioRecorder for audio media', () => {
      getFileType.mockReturnValue('audio');
      const mockFile = createMockFile('test.mp3', 'audio/mp3');
      wrapper = createWrapper({ media: mockFile });

      const audio = wrapper.findComponent(
        '[data-testid="preview-media-audio"]',
      );
      expect(audio.exists()).toBe(true);
      expect(audio.classes()).toContain('preview-media--audio');
      expect(audio.props('src')).toBe('mocked-url');
      expect(audio.props('canDiscard')).toBe(false);
    });
  });

  describe('Props Handling', () => {
    it('accepts media prop with default null', () => {
      getFileType.mockReturnValue(null);
      wrapper = createWrapper();
      expect(wrapper.props('media')).toBeNull();
    });

    it('accepts File object as media prop', () => {
      getFileType.mockReturnValue('image');
      const mockFile = createMockFile('test.jpg', 'image/jpeg');
      wrapper = createWrapper({ media: mockFile });
      expect(wrapper.props('media')).toBe(mockFile);
    });

    it('accepts String as media prop', () => {
      getFileType.mockReturnValue('geolocation');
      const geoString = '40.7128,-74.0060';
      wrapper = createWrapper({ media: geoString });
      expect(wrapper.props('media')).toBe(geoString);
    });
  });

  describe('Media URL Generation', () => {
    it('generates URL for File objects', () => {
      getFileType.mockReturnValue('image');
      const mockFile = createMockFile('test.jpg', 'image/jpeg');
      wrapper = createWrapper({ media: mockFile });

      expect(URL.createObjectURL).toHaveBeenCalledWith(mockFile);
      expect(wrapper.vm.mediaUrl).toBe('mocked-url');
    });

    it('returns empty string when media is null', () => {
      getFileType.mockReturnValue(null);
      wrapper = createWrapper({ media: null });

      expect(wrapper.vm.mediaUrl).toBe('');
      expect(URL.createObjectURL).not.toHaveBeenCalled();
    });
  });

  describe('Media Type Detection', () => {
    it('calls getFileType with media prop', () => {
      const mockFile = createMockFile('test.jpg', 'image/jpeg');
      getFileType.mockReturnValue('image');
      wrapper = createWrapper({ media: mockFile });

      expect(getFileType).toHaveBeenCalledWith(mockFile);
    });

    it('handles different media types correctly', () => {
      const testCases = [
        { type: 'image', element: 'img' },
        { type: 'video', component: 'UnnnicIntelligenceVideo' },
        { type: 'document', component: 'PreviewDocument' },
        { type: 'geolocation', component: 'MapViewport' },
        { type: 'audio', component: 'UnnnicAudioRecorder' },
      ];

      testCases.forEach(({ type, element }) => {
        getFileType.mockReturnValue(type);
        const testWrapper = createWrapper({ media: 'test-media' });

        if (element) {
          expect(testWrapper.find(element).exists()).toBe(true);
        } else {
          expect(
            testWrapper.find(`[data-testid="preview-media-${type}"]`).exists(),
          ).toBe(true);
        }

        testWrapper.unmount();
      });
    });
  });
});
