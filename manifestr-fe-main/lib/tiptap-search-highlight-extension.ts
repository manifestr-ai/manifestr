import { Extension } from '@tiptap/core';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export interface SearchOptions {
  searchTerm: string;
  caseSensitive: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    searchHighlight: {
      setSearchTerm: (searchTerm: string, caseSensitive?: boolean) => ReturnType;
      clearSearchTerm: () => ReturnType;
    };
  }
}

export const SearchHighlight = Extension.create<SearchOptions>({
  name: 'searchHighlight',

  addOptions() {
    return {
      searchTerm: '',
      caseSensitive: false,
    };
  },

  addCommands() {
    return {
      setSearchTerm:
        (searchTerm: string, caseSensitive?: boolean) =>
        ({ editor }) => {
          this.options.searchTerm = searchTerm || '';
          if (typeof caseSensitive === 'boolean') {
            this.options.caseSensitive = caseSensitive;
          }
          try {
            editor.view.dispatch(editor.state.tr.setMeta('searchHighlight', { searchTerm: this.options.searchTerm }));
          } catch {}
          return true;
        },
      clearSearchTerm:
        () =>
        ({ editor }) => {
          this.options.searchTerm = '';
          try {
            editor.view.dispatch(editor.state.tr.setMeta('searchHighlight', { searchTerm: '' }));
          } catch {}
          return true;
        },
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
