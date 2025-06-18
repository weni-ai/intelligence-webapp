import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { formatFileSize, getFileExtension } from '@/utils/medias';
import PreviewDocument from '../PreviewDocument.vue';

vi.mock('@/utils/medias', () => ({
  formatFileSize: vi.fn(),
  getFileExtension: vi.fn(),
}));

describe('PreviewDocument.vue', () => {
  let wrapper;

  const createMockFile = (name, size = 1024, type = 'application/pdf') => {
    const file = new File(['test content'], name, { type });
    Object.defineProperty(file, 'size', {
      value: size,
      writable: false,
    });
    return file;
  };

  const createWrapper = (props = {}) => {
    return shallowMount(PreviewDocument, {
      props: {
        document: createMockFile('test.pdf'),
        ...props,
      },
      global: {
        stubs: {
          UnnnicIcon: true,
        },
      },
    });
  };

  const previewContainer = () =>
    wrapper.find('[data-testid="preview-document"]');
  const documentIcon = () =>
    wrapper.findComponent('[data-testid="document-icon"]');
  const documentName = () => wrapper.find('[data-testid="document-name"]');
  const documentExtension = () =>
    wrapper.find('[data-testid="document-extension"]');
  const documentSize = () => wrapper.find('[data-testid="document-size"]');
  const documentSeparator = () =>
    wrapper.find('[data-testid="document-separator"]');

  beforeEach(() => {
    vi.clearAllMocks();
    formatFileSize.mockReturnValue('1 KB');
    getFileExtension.mockReturnValue('.pdf');
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  describe('Component Rendering', () => {
    it('renders the component successfully', () => {
      wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    it('renders the main document container', () => {
      wrapper = createWrapper();
      expect(previewContainer().exists()).toBe(true);
      expect(previewContainer().classes()).toContain('preview-document');
    });

    it('renders document icon', () => {
      wrapper = createWrapper();
      expect(documentIcon().exists()).toBe(true);
    });

    it('renders document name', () => {
      wrapper = createWrapper();
      expect(documentName().exists()).toBe(true);
    });

    it('renders document extension', () => {
      wrapper = createWrapper();
      expect(documentExtension().exists()).toBe(true);
    });

    it('renders document size', () => {
      wrapper = createWrapper();
      expect(documentSize().exists()).toBe(true);
    });
  });

  describe('Props Handling', () => {
    it('accepts document prop as File object', () => {
      const mockFile = createMockFile('test-document.pdf');
      wrapper = createWrapper({ document: mockFile });
      expect(wrapper.props('document')).toBe(mockFile);
    });

    it('requires document prop', () => {
      const propDefinition = PreviewDocument.props.document;
      expect(propDefinition.type).toBe(File);
      expect(propDefinition.required).toBe(true);
    });
  });

  describe('Document Name Display', () => {
    it('displays document name correctly', () => {
      const mockFile = createMockFile('my-document.pdf');
      wrapper = createWrapper({ document: mockFile });

      expect(documentName().text()).toBe('my-document.pdf');
    });

    it('handles documents without name gracefully', () => {
      const mockFile = createMockFile('');
      wrapper = createWrapper({ document: mockFile });

      expect(documentName().text()).toBe('');
    });
  });

  describe('Document Extension Processing', () => {
    it('processes PDF extension correctly', () => {
      getFileExtension.mockReturnValue('.pdf');
      wrapper = createWrapper();

      expect(documentExtension().text()).toBe('pdf');
    });

    it('removes dot from extension', () => {
      getFileExtension.mockReturnValue('.xlsx');
      wrapper = createWrapper();

      expect(wrapper.vm.documentExtension).toBe('xlsx');
    });

    it('calls getFileExtension with document prop', () => {
      const mockFile = createMockFile('test.pdf');
      wrapper = createWrapper({ document: mockFile });

      expect(getFileExtension).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('Document Icon Mapping', () => {
    it('displays correct icon for PDF documents', () => {
      getFileExtension.mockReturnValue('.pdf');
      wrapper = createWrapper();

      expect(documentIcon().props('icon')).toBe('picture_as_pdf');
    });

    it('displays correct icon for DOC documents', () => {
      getFileExtension.mockReturnValue('.doc');
      wrapper = createWrapper();

      expect(documentIcon().props('icon')).toBe('article');
    });

    it('displays correct icon for XLS documents', () => {
      getFileExtension.mockReturnValue('.xls');
      wrapper = createWrapper();

      expect(documentIcon().props('icon')).toBe('table');
    });

    it('displays correct icon for TXT documents', () => {
      getFileExtension.mockReturnValue('.txt');
      wrapper = createWrapper();

      expect(documentIcon().props('icon')).toBe('text_snippet');
    });

    it('sets correct icon properties', () => {
      wrapper = createWrapper();

      expect(documentIcon().props('scheme')).toBe('neutral-white');
      expect(documentIcon().props('size')).toBe('md');
    });
  });

  describe('Document Size Formatting', () => {
    it('displays formatted file size', () => {
      formatFileSize.mockReturnValue('2.5 MB');
      const mockFile = createMockFile('large-file.pdf', 2621440);
      wrapper = createWrapper({ document: mockFile });

      expect(documentSize().text()).toBe('2.5 MB');
    });

    it('calls formatFileSize with document size', () => {
      const fileSize = 1024000;
      const mockFile = createMockFile('test.pdf', fileSize);
      wrapper = createWrapper({ document: mockFile });

      expect(formatFileSize).toHaveBeenCalledWith(fileSize);
    });
  });

  describe('Technical Information Layout', () => {
    it('displays extension and size with separator', () => {
      getFileExtension.mockReturnValue('.pdf');
      formatFileSize.mockReturnValue('1.2 MB');
      wrapper = createWrapper();

      expect(documentExtension().text()).toBe('pdf');
      expect(documentSeparator().text()).toBe('•');
      expect(documentSize().text()).toBe('1.2 MB');
    });
  });

  describe('Utility Function Integration', () => {
    it('integrates with getFileExtension utility', () => {
      const mockFile = createMockFile('document.xlsx');
      getFileExtension.mockReturnValue('.xlsx');
      wrapper = createWrapper({ document: mockFile });

      expect(getFileExtension).toHaveBeenCalledWith(mockFile);
      expect(wrapper.vm.documentExtension).toBe('xlsx');
    });

    it('integrates with formatFileSize utility', () => {
      const mockFile = createMockFile('document.pdf', 2048);
      formatFileSize.mockReturnValue('2 KB');
      wrapper = createWrapper({ document: mockFile });

      expect(formatFileSize).toHaveBeenCalledWith(2048);
      expect(wrapper.vm.documentSize).toBe('2 KB');
    });
  });

  describe('Edge Cases', () => {
    it('handles unknown file extensions gracefully', () => {
      getFileExtension.mockReturnValue('.unknown');
      wrapper = createWrapper();

      expect(documentIcon().props('icon')).toBeFalsy();
    });

    it('handles empty extension gracefully', () => {
      getFileExtension.mockReturnValue('');
      wrapper = createWrapper();

      expect(documentExtension().text()).toBe('');
    });

    it('handles zero file size', () => {
      formatFileSize.mockReturnValue('0 B');
      const mockFile = createMockFile('empty-file.txt', 0);
      wrapper = createWrapper({ document: mockFile });

      expect(documentSize().text()).toBe('0 B');
    });
  });
});
