import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    documentFooter: {
      setDocumentFooter: () => ReturnType;
    };
  }
}

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
    };
  },
});
