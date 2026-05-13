import { Extension } from "@tiptap/core";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export interface SearchOptions {
  searchTerm: string;
  caseSensitive: boolean;
}

export type SearchHighlightPluginState = {
  searchTerm: string;
  caseSensitive: boolean;
  /** Index of the “current” match in document order; -1 = none highlighted as active */
  activeMatchIndex: number;
};

export const searchHighlightPluginKey =
  new PluginKey<SearchHighlightPluginState>("searchHighlight");

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    searchHighlight: {
      setSearchTerm: (
        searchTerm: string,
        caseSensitive?: boolean,
      ) => ReturnType;
      setSearchActiveIndex: (activeMatchIndex: number) => ReturnType;
      clearSearchTerm: () => ReturnType;
    };
  }
}

type SearchHighlightMeta = Partial<{
  searchTerm: string;
  caseSensitive: boolean;
  activeMatchIndex: number;
}>;

export const SearchHighlight = Extension.create<SearchOptions>({
  name: "searchHighlight",

  addOptions() {
    return {
      searchTerm: "",
      caseSensitive: false,
    };
  },

  addCommands() {
    return {
      setSearchTerm:
        (searchTerm: string, caseSensitive?: boolean) =>
        ({ editor }) => {
          this.options.searchTerm = searchTerm || "";
          if (typeof caseSensitive === "boolean") {
            this.options.caseSensitive = caseSensitive;
          }
          try {
            editor.view.dispatch(
              editor.state.tr.setMeta("searchHighlight", {
                searchTerm: this.options.searchTerm,
                caseSensitive: this.options.caseSensitive,
                activeMatchIndex: 0,
              } satisfies SearchHighlightMeta),
            );
          } catch {}
          return true;
        },
      setSearchActiveIndex:
        (activeMatchIndex: number) =>
        ({ editor }) => {
          try {
            editor.view.dispatch(
              editor.state.tr.setMeta("searchHighlight", {
                activeMatchIndex,
              } satisfies SearchHighlightMeta),
            );
          } catch {}
          return true;
        },
      clearSearchTerm:
        () =>
        ({ editor }) => {
          this.options.searchTerm = "";
          try {
            editor.view.dispatch(
              editor.state.tr.setMeta("searchHighlight", {
                searchTerm: "",
                activeMatchIndex: -1,
              } satisfies SearchHighlightMeta),
            );
          } catch {}
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    const extension = this;
    return [
      new Plugin<SearchHighlightPluginState>({
        key: searchHighlightPluginKey,
        state: {
          init: () => ({
            searchTerm: extension.options.searchTerm || "",
            caseSensitive: extension.options.caseSensitive ?? false,
            activeMatchIndex: -1,
          }),
          apply(tr, prev) {
            const m = tr.getMeta("searchHighlight") as
              | SearchHighlightMeta
              | undefined;
            if (!m) return prev;
            return {
              searchTerm:
                m.searchTerm !== undefined ? m.searchTerm : prev.searchTerm,
              caseSensitive:
                m.caseSensitive !== undefined
                  ? m.caseSensitive
                  : prev.caseSensitive,
              activeMatchIndex:
                m.activeMatchIndex !== undefined
                  ? m.activeMatchIndex
                  : prev.activeMatchIndex,
            };
          },
        },
        props: {
          decorations(state) {
            const ps = searchHighlightPluginKey.getState(state);
            if (!ps?.searchTerm) {
              return DecorationSet.empty;
            }

            const { searchTerm, caseSensitive, activeMatchIndex } = ps;
            const decorations: Decoration[] = [];
            const regex = new RegExp(
              searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
              caseSensitive ? "g" : "gi",
            );

            let globalMatchIndex = 0;
            state.doc.descendants((node, pos) => {
              if (!node.isText || !node.text) {
                return;
              }

              const matches = Array.from(node.text.matchAll(regex));

              matches.forEach((match) => {
                if (match.index === undefined) {
                  return;
                }
                const from = pos + match.index;
                const to = from + match[0].length;
                const isActive =
                  activeMatchIndex >= 0 &&
                  globalMatchIndex === activeMatchIndex;
                globalMatchIndex += 1;

                decorations.push(
                  Decoration.inline(from, to, {
                    class: isActive
                      ? "search-highlight search-highlight--active"
                      : "search-highlight",
                  }),
                );
              });
            });

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});
