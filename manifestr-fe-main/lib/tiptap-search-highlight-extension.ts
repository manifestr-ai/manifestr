import { Extension } from '@tiptap/core';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export interface SearchOptions {
  searchTerm: string;
  caseSensitive: boolean;
}

export const SearchHighlight = Extension.create<SearchOptions>({
  name: 'searchHighlight',

  addOptions() {
    return {
      searchTerm: '',
      caseSensitive: false,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('searchHighlight'),
        props: {
          decorations: ({ doc }) => {
            const { searchTerm, caseSensitive } = this.options;
            
            if (!searchTerm) {
              return DecorationSet.empty;
            }

            const decorations: Decoration[] = [];
            const regex = new RegExp(
              searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
              caseSensitive ? 'g' : 'gi'
            );

            doc.descendants((node, pos) => {
              if (!node.isText || !node.text) {
                return;
              }

              const matches = Array.from(node.text.matchAll(regex));
              
              matches.forEach((match) => {
                if (match.index !== undefined) {
                  const from = pos + match.index;
                  const to = from + match[0].length;
                  
                  decorations.push(
                    Decoration.inline(from, to, {
                      class: 'search-highlight',
                    })
                  );
                }
              });
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
