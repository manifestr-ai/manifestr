import { Node, mergeAttributes } from '@tiptap/core';

export const DocumentFooter = Node.create({
  name: 'documentFooter',

  group: 'block',

  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'div[data-type="doc-footer"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 
      'data-type': 'doc-footer',
      class: 'doc-footer' 
    }), 0];
  },

  addCommands() {
    return {
      setDocumentFooter: () => ({ commands }) => {
        return commands.insertContent({ 
          type: this.name,
          content: [{ type: 'text', text: 'Footer text here...' }]
        });
      },
    } as any;
  },
});
