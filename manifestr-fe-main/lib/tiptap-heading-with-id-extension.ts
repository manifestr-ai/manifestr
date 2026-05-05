import { Heading } from "@tiptap/extension-heading";
import { mergeAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

/**
 * Custom Heading extension that adds unique IDs to each heading
 * for document outline navigation
 */

// Global counter for heading IDs
let headingCounter = 0;
const generatedIds = new WeakMap();

export const resetHeadingCounter = () => {
  headingCounter = 0;
};

export const HeadingWithId = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      level: {
        default: 1,
        rendered: false,
      },
      id: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute("id") || element.getAttribute("data-id");
        },
        renderHTML: (attributes) => {
          // Use existing ID or generate a new one
          const id = attributes.id || `heading-${headingCounter++}`;
          return {
            id: id,
            "data-id": id,
          };
        },
      },
    };
  },
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("headingIds"),
        appendTransaction: (transactions, oldState, newState) => {
          // Skip if no doc changes
          if (!transactions.some(tr => tr.docChanged)) {
            return null;
          }

          const tr = newState.tr;
          let modified = false;
          let currentIndex = 0;

          newState.doc.descendants((node, pos) => {
            if (node.type.name === 'heading' && !node.attrs.id) {
              const id = `heading-${currentIndex}`;
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                id,
              });
              modified = true;
              currentIndex++;
            } else if (node.type.name === 'heading') {
              currentIndex++;
            }
          });

          return modified ? tr : null;
        },
      }),
    ];
  },
  
  addKeyboardShortcuts() {
    return this.parent?.() || {};
  },
});
