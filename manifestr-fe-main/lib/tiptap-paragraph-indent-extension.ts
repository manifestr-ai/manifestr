import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

export type ParagraphIndentOptions = {
  types: string[];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    paragraphIndent: {
      setIndentLeft: (indent: string) => ReturnType;
      setIndentRight: (indent: string) => ReturnType;
      unsetIndent: () => ReturnType;
    };
  }
}

export const ParagraphIndent = Extension.create<ParagraphIndentOptions>({
  name: 'paragraphIndent',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indentLeft: {
            default: null,
            parseHTML: element => element.style.marginLeft || null,
            renderHTML: attributes => {
              if (!attributes.indentLeft) {
                return {};
              }
              return {
                style: `margin-left: ${attributes.indentLeft}`,
              };
            },
          },
          indentRight: {
            default: null,
            parseHTML: element => element.style.marginRight || null,
            renderHTML: attributes => {
              if (!attributes.indentRight) {
                return {};
              }
              return {
                style: `margin-right: ${attributes.indentRight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setIndentLeft: (indent: string) => ({ commands }) => {
        return this.options.types.every(type => commands.updateAttributes(type, { indentLeft: indent }));
      },
      setIndentRight: (indent: string) => ({ commands }) => {
        return this.options.types.every(type => commands.updateAttributes(type, { indentRight: indent }));
      },
      unsetIndent: () => ({ commands }) => {
        return this.options.types.every(type => 
          commands.updateAttributes(type, { indentLeft: null, indentRight: null })
        );
      },
    };
  },
});
