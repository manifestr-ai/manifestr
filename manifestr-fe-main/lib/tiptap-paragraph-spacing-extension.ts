import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

export type ParagraphSpacingOptions = {
  types: string[];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    paragraphSpacing: {
      setSpacingBefore: (spacing: string) => ReturnType;
      setSpacingAfter: (spacing: string) => ReturnType;
      unsetSpacing: () => ReturnType;
    };
  }
}

export const ParagraphSpacing = Extension.create<ParagraphSpacingOptions>({
  name: 'paragraphSpacing',

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
          spacingBefore: {
            default: null,
            parseHTML: element => element.style.marginTop || null,
            renderHTML: attributes => {
              if (!attributes.spacingBefore) {
                return {};
              }
              return {
                style: `margin-top: ${attributes.spacingBefore}`,
              };
            },
          },
          spacingAfter: {
            default: null,
            parseHTML: element => element.style.marginBottom || null,
            renderHTML: attributes => {
              if (!attributes.spacingAfter) {
                return {};
              }
              return {
                style: `margin-bottom: ${attributes.spacingAfter}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setSpacingBefore: (spacing: string) => ({ commands }) => {
        return this.options.types.every(type => commands.updateAttributes(type, { spacingBefore: spacing }));
      },
      setSpacingAfter: (spacing: string) => ({ commands }) => {
        return this.options.types.every(type => commands.updateAttributes(type, { spacingAfter: spacing }));
      },
      unsetSpacing: () => ({ commands }) => {
        return this.options.types.every(type => 
          commands.updateAttributes(type, { spacingBefore: null, spacingAfter: null })
        );
      },
    };
  },
});
