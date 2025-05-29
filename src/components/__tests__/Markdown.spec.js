import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

import Markdown from '../Markdown.vue';

vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((content) => content)
  }
}));

vi.mock('marked', () => ({
  marked: {
    use: vi.fn(),
    parse: vi.fn((content) => content)
  }
}));

describe('Markdown.vue', () => {
  let wrapper;

  const content = () => wrapper.find('[data-testid="content"]');
  const setWrapperContent = (content) => {
    wrapper.setProps({ content });
    return wrapper.vm.$nextTick();
  }

  beforeEach(() => {
    vi.clearAllMocks();
    DOMPurify.sanitize.mockImplementation((content) => content);
    marked.parse.mockImplementation((content) => `<p>${content}</p>`);

    wrapper = mount(Markdown, {
      props: { content: 'test' }
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe('Component rendering', () => {
    it('renders correctly with default props', () => {      
      expect(content().exists()).toBe(true);
    });

    it('renders with provided content prop', async () => {
      const content = 'Test markdown content';
      await setWrapperContent(content);
      
      expect(wrapper.props('content')).toBe(content);
    });
  });

  describe('Content processing', () => {
    it('sanitizes content using DOMPurify', async () => {
      const content = '<script>alert("xss")</script>Safe content';
      await setWrapperContent(content);

      expect(DOMPurify.sanitize).toHaveBeenCalledWith(content);
    });

    it('configures marked with correct options', async () => {
      await setWrapperContent('test');

      expect(marked.use).toHaveBeenCalledWith({
        breaks: true,
        useNewRenderer: true,
        renderer: expect.objectContaining({
          link: expect.any(Function)
        })
      });
    });

    it('converts bullet points at the beginning of content', async () => {
      const content = '• First item\n• Second item';
      await setWrapperContent(content);

      const expectedProcessed = '* First item\n* Second item';
      expect(marked.parse).toHaveBeenCalledWith(expectedProcessed);
    });

    it('converts bullet points in the middle of content', async () => {
      const content = 'Some text\n• First item\n• Second item';
      await setWrapperContent(content);

      const expectedProcessed = 'Some text\n* First item\n* Second item';
      expect(marked.parse).toHaveBeenCalledWith(expectedProcessed);
    });

    it('handles mixed bullet points and regular content', async () => {
      const content = '• Start item\nRegular text\n• Another item';
      await setWrapperContent(content);

      const expectedProcessed = '* Start item\nRegular text\n* Another item';
      expect(marked.parse).toHaveBeenCalledWith(expectedProcessed);
    });

    it('parses processed content with marked', async () => {
      const content = 'Test content';
      await setWrapperContent(content);

      expect(marked.parse).toHaveBeenCalledWith(content);
    });
  });

  describe('Link renderer functionality', () => {
    it('creates links with target="_blank" attribute', () => {

      const linkRenderer = marked.use.mock.calls[0][0].renderer.link;
      const token = { href: 'https://example.com', text: 'Example' };
      const result = linkRenderer(token);

      expect(result).toBe('<a target="_blank" href="https://example.com">Example</a>');
    });

    it('handles token as string for href', () => {

      const linkRenderer = marked.use.mock.calls[0][0].renderer.link;
      const token = 'https://example.com';
      const result = linkRenderer(token);

      expect(result).toBe('<a target="_blank" href="https://example.com">https://example.com</a>');
    });

    it('handles token as string for text', () => {

      const linkRenderer = marked.use.mock.calls[0][0].renderer.link;
      const token = 'https://example.com';
      const result = linkRenderer(token);

      expect(result).toBe('<a target="_blank" href="https://example.com">https://example.com</a>');
    });
  });

  describe('HTML output', () => {
    it('renders processed HTML content', () => {
      const mockContent = '**Bold text**';
      const expectedHtml = '<p><strong>Bold text</strong></p>';
      marked.parse.mockReturnValue(expectedHtml);

      wrapper = mount(Markdown, {
        props: { content: mockContent }
      });

      expect(content().html()).toContain(expectedHtml);
    });

    it('updates HTML when content prop changes', async () => {
      wrapper = mount(Markdown, {
        props: { content: 'Initial content' }
      });

      const newContent = 'Updated content';
      const newHtml = '<p>Updated content</p>';
      marked.parse.mockReturnValue(newHtml);

      await wrapper.setProps({ content: newContent });

      expect(marked.parse).toHaveBeenCalledWith(newContent);
    });
  });

  describe('Edge cases', () => {
    it('handles empty content', async () => {
      await setWrapperContent('');

      expect(DOMPurify.sanitize).toHaveBeenCalledWith('');
      expect(marked.parse).toHaveBeenCalledWith('');
    });

    it('handles content with only whitespace', async () => {
      const content = '   \n   \t   ';
      await setWrapperContent(content);

      expect(DOMPurify.sanitize).toHaveBeenCalledWith(content);
      expect(marked.parse).toHaveBeenCalledWith(content);
    });

    it('handles content with multiple consecutive bullet points', async () => {
      const content = '• Item 1\n• Item 2\n• Item 3\n• Item 4';
      await setWrapperContent(content);

      const expectedProcessed = '* Item 1\n* Item 2\n* Item 3\n* Item 4';
      expect(marked.parse).toHaveBeenCalledWith(expectedProcessed);
    });

    it('handles bullet points with varying whitespace', async () => {
      const content = '•Item1\n•  Item2\n•   Item3';
      await setWrapperContent(content);

      const expectedProcessed = '* Item1\n* Item2\n* Item3';
      expect(marked.parse).toHaveBeenCalledWith(expectedProcessed);
    });
  });

  describe('Component styling', () => {
    it('applies correct CSS classes', async () => {
      await setWrapperContent('test');

      expect(content().classes()).toContain('content-section');
    });
  });
});
