import { Node, mergeAttributes } from '@tiptap/core';

export const DocumentHeader = Node.create({
  name: 'documentHeader',

  group: 'block',

  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'div[data-type="doc-header"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 
      'data-type': 'doc-header',
      class: 'doc-header' 
    }), 0];
  },

  addCommands() {
    return {
      setDocumentHeader: () => ({ commands }) => {
        return commands.insertContent({ 
          type: this.name,
          content: [{ type: 'text', text: 'Header text here...' }]
        });
      },
    } as any;
  },
});
