/**
 * Collaborative TipTap Editor
 *
 * Real-time collaboration with Y.js + Supabase Realtime
 * Shows colored cursors, active users, syncs changes
 *
 * SAFE: NEW component, existing editor unchanged
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useEditor, EditorContent } from "@tiptap/react";
import { Extension, Node, mergeAttributes } from "@tiptap/core";
import { NodeSelection, Plugin, PluginKey } from "@tiptap/pm/state";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Link } from "@tiptap/extension-link";
import { FontFamily } from "../../lib/tiptap-font-family-extension";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { SupabaseProvider } from "../../lib/supabase-yjs-provider";
import { supabase } from "../../lib/supabase";
import api from "../../lib/api";
import { FontSize } from "../../lib/tiptap-font-size-extension";
import { PageBreak } from "../../lib/tiptap-page-break-extension";
import { DocumentHeader } from "../../lib/tiptap-document-header-extension";
import { DocumentFooter } from "../../lib/tiptap-document-footer-extension";
import { ParagraphIndent } from "../../lib/tiptap-paragraph-indent-extension";
import { ParagraphSpacing } from "../../lib/tiptap-paragraph-spacing-extension";
import { SearchHighlight } from "../../lib/tiptap-search-highlight-extension";
import { HeadingWithId, resetHeadingCounter } from "../../lib/tiptap-heading-with-id-extension";

interface CollaborativeTiptapEditorProps {
  documentId: string;
  initialContent?: any;
  onUpdate?: (html: string) => void;
  onEditorReady?: (editor: any) => void;
}

// Generate consistent color for user
const getUserColor = (userId: string): string => {
  const colors = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#ec4899", // Pink
  ];
  const hash = userId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const CommentHighlight = Highlight.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      comment: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-comment"),
        renderHTML: (attributes) =>
          attributes.comment
            ? { "data-comment": attributes.comment, class: "comment-highlight" }
            : {},
      },
    };
  },
});

const TableDeleteOnBackspace = Extension.create({
  name: "tableDeleteOnBackspace",
  addKeyboardShortcuts() {
    const deleteTableIfSelected = () => {
      const { selection } = this.editor.state;
      if (selection instanceof NodeSelection && selection.node.type.name === "table") {
        return this.editor.commands.deleteSelection();
      }
      return false;
    };

    const deleteNodeBeforeIfTable = () => {
      return this.editor.commands.command(({ state, dispatch }) => {
        const { selection } = state;
        if (!selection.empty) return false;
        const $from = selection.$from;
        const before = $from.nodeBefore;
        if (!before || before.type.name !== "table") return false;
        const tr = state.tr.delete($from.pos - before.nodeSize, $from.pos);
        if (dispatch) dispatch(tr);
        return true;
      });
    };

    const deleteNodeAfterIfTable = () => {
      return this.editor.commands.command(({ state, dispatch }) => {
        const { selection } = state;
        if (!selection.empty) return false;
        const $from = selection.$from;
        const after = $from.nodeAfter;
        if (!after || after.type.name !== "table") return false;
        const tr = state.tr.delete($from.pos, $from.pos + after.nodeSize);
        if (dispatch) dispatch(tr);
        return true;
      });
    };

    return {
      Backspace: () =>
        deleteTableIfSelected() ||
        deleteNodeBeforeIfTable() ||
        false,
      Delete: () =>
        deleteTableIfSelected() ||
        deleteNodeAfterIfTable() ||
        false,
    };
  },
});

const PageNumberConfig = Node.create({
  name: "pageNumberConfig",
  group: "block",
  atom: true,
  selectable: false,
  draggable: false,
  addAttributes() {
    return {
      position: {
        default: "bottom-center",
      },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-type="page-number-config"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "page-number-config",
        class: "page-number-config",
      }),
    ];
  },
});

const PageNumber = Node.create({
  name: "pageNumber",
  group: "block",
  atom: true,
  selectable: false,
  draggable: false,
  addAttributes() {
    return {
      number: {
        default: 1,
      },
      position: {
        default: "bottom-center",
      },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-type="page-number"]' }];
  },
  renderHTML({ node, HTMLAttributes }) {
    const position = typeof node.attrs.position === "string" ? node.attrs.position : "bottom-center";
    const number = typeof node.attrs.number === "number" ? node.attrs.number : 1;
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "page-number",
        "data-position": position,
        class: `page-number page-number--${position}`,
      }),
      `Page ${number}`,
    ];
  },
});

const PAGE_NUMBER_META_KEY = "pageNumberUpdate";

const PageNumberManager = Extension.create({
  name: "pageNumberManager",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("pageNumberManager"),
        appendTransaction: (transactions, _oldState, newState) => {
          if (!transactions.some((tr) => tr.docChanged)) return null;
          if (transactions.some((tr) => tr.getMeta(PAGE_NUMBER_META_KEY))) return null;

          const configType = newState.schema.nodes.pageNumberConfig;
          const pageNumberType = newState.schema.nodes.pageNumber;
          const pageBreakType = newState.schema.nodes.pageBreak;
          if (!configType || !pageNumberType || !pageBreakType) return null;

          let configPos: number | null = null;
          let position: string | null = null;

          newState.doc.descendants((node, pos) => {
            if (node.type === configType) {
              configPos = pos;
              position = typeof node.attrs.position === "string" ? node.attrs.position : "bottom-center";
              return false;
            }
            return true;
          });

          if (!position) return null;

          const tr = newState.tr.setMeta(PAGE_NUMBER_META_KEY, true);

          const existingNumbers: Array<{ from: number; to: number }> = [];
          tr.doc.descendants((node, pos) => {
            if (node.type === pageNumberType) {
              existingNumbers.push({ from: pos, to: pos + node.nodeSize });
            }
            return true;
          });
          existingNumbers
            .sort((a, b) => b.from - a.from)
            .forEach(({ from, to }) => tr.delete(from, to));

          let configNodeSize = 0;
          let resolvedConfigPos = configPos;
          if (resolvedConfigPos != null) {
            const node = tr.doc.nodeAt(resolvedConfigPos);
            configNodeSize = node?.nodeSize ?? 0;
          }

          const breaks: Array<{ pos: number; size: number }> = [];
          tr.doc.descendants((node, pos) => {
            if (node.type === pageBreakType) breaks.push({ pos, size: node.nodeSize });
            return true;
          });

          const pageCount = breaks.length + 1;
          const insertAtStart = position.startsWith("top") || position.startsWith("middle");

          const insertions: Array<{ pos: number; number: number }> = [];
          for (let i = 0; i < pageCount; i++) {
            const start = i === 0 ? 0 : breaks[i - 1].pos + breaks[i - 1].size;
            const end = i < breaks.length ? breaks[i].pos : tr.doc.content.size;
            let insertPos = insertAtStart ? start : end;

            if (i === 0 && resolvedConfigPos === 0 && insertPos === 0) {
              insertPos = configNodeSize;
            }

            insertions.push({ pos: insertPos, number: i + 1 });
          }

          insertions
            .sort((a, b) => b.pos - a.pos)
            .forEach(({ pos, number }) => {
              tr.insert(pos, pageNumberType.create({ number, position }));
            });

          return tr.docChanged ? tr : null;
        },
      }),
    ];
  },
});

export default function CollaborativeTiptapEditor({
  documentId,
  initialContent,
  onUpdate,
  onEditorReady,
}: CollaborativeTiptapEditorProps) {
  const router = useRouter();
  const [ydoc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState<SupabaseProvider | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [lastSavedContent, setLastSavedContent] = useState<string>(""); // Track last saved state
  const [isTyping, setIsTyping] = useState(false); // Track if user is actively typing

  // Handle auth errors - redirect to login
  const handleAuthError = (error: any) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      router.push("/login");
      return true;
    }
    return false;
  };

  // Get current user info
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUser(user);
  }, []);

  // Initialize collaboration provider
  useEffect(() => {
    if (!documentId || !currentUser?.id) return;

    // Add Y.Doc change observer for debugging
    // Y.Doc syncs automatically

    const newProvider = new SupabaseProvider(ydoc, documentId, supabase);
    setProvider(newProvider);

    // Start collaboration session
    const startSession = async () => {
      try {
        await api.post("/collaborations/session/start", {
          documentId,
          sessionId: ydoc.clientID.toString(),
          userColor: getUserColor(currentUser.id),
        });
      } catch (error: any) {
        if (handleAuthError(error)) return; // Redirect to login
        // Silent fail
      }
    };

    startSession();

    // Cleanup on unmount
    return () => {
      newProvider.destroy();
      api.post("/collaborations/session/end", { documentId }).catch(() => {});
    };
  }, [documentId, currentUser, ydoc]);

  // Fetch active users periodically
  useEffect(() => {
    if (!documentId) return;

    const fetchActiveUsers = async () => {
      try {
        const response = await api.get(
          `/collaborations/${documentId}/active-users`,
        );
        if (response.data.status === "success") {
          setActiveUsers(response.data.data);
        }
      } catch (error: any) {
        if (handleAuthError(error)) return; // Redirect to login
        // Silent fail for other errors
      }
    };

    fetchActiveUsers();
    const interval = setInterval(fetchActiveUsers, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, [documentId]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false, // Disable default heading, we'll use our custom one with IDs
      }),
      HeadingWithId.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CommentHighlight.configure({ multicolor: true }),
      Image,
      Typography,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize.configure({
        types: ['textStyle'],
      }),
      Underline,
      Superscript,
      Subscript,
      PageBreak,
      DocumentHeader,
      DocumentFooter,
      ParagraphIndent.configure({
        types: ['paragraph', 'heading'],
      }),
      ParagraphSpacing.configure({
        types: ['paragraph', 'heading'],
      }),
      SearchHighlight.configure({
        searchTerm: '',
        caseSensitive: false,
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TableDeleteOnBackspace,
      PageNumberConfig,
      PageNumber,
      PageNumberManager,
      Collaboration.configure({
        document: ydoc,
        fragment: ydoc.getXmlFragment("prosemirror"),
      }),
    ],
    onCreate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
      if (onEditorReady) {
        onEditorReady(editor);
      }
    },
    onUpdate: ({ editor }) => {
      setIsTyping(true);

      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
    },
  });

  // Initialize lastSavedContent when editor loads
  useEffect(() => {
    if (editor && !lastSavedContent) {
      setLastSavedContent(JSON.stringify(editor.getJSON()));
    }
  }, [editor]);

  // AUTO-SAVE to database every 5 seconds
  useEffect(() => {
    if (!editor || !documentId) return;

    const saveToDatabase = async () => {
      try {
        const currentContent = JSON.stringify(editor.getJSON());

        // SMART SAVE: Only save if content actually changed
        if (currentContent === lastSavedContent) {
          return; // No changes, skip save
        }

        const json = editor.getJSON();
        await api.patch(`/ai/generation/${documentId}`, {
          content: json,
        });

        // Update last saved state
        setLastSavedContent(currentContent);
      } catch (error: any) {
        if (handleAuthError(error)) return; // Redirect to login
        // Silent save, will retry
      }
    };

    // Save every 5 seconds
    const interval = setInterval(saveToDatabase, 5000);

    // Also save when user stops typing (debounced)
    let debounceTimer: NodeJS.Timeout;
    let typingTimer: NodeJS.Timeout;

    const debouncedSave = () => {
      // Mark as typing
      setIsTyping(true);

      // Reset typing flag 3 seconds after last keystroke
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        setIsTyping(false);
      }, 3000);

      // Save 2 seconds after typing stops
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(saveToDatabase, 2000);
    };

    editor.on("update", debouncedSave);

    return () => {
      clearInterval(interval);
      clearTimeout(debounceTimer);
      clearTimeout(typingTimer);
      editor.off("update", debouncedSave);
      // Final save on unmount
      saveToDatabase();
    };
  }, [editor, documentId]);

  // Load initial content ONLY if Y.Doc is empty (first user)
  useEffect(() => {
    if (editor && initialContent && ydoc) {
      // Check if Y.Doc has any content
      const isEmpty =
        ydoc.share.size === 0 ||
        (editor.getText().length === 0 && editor.state.doc.childCount === 1);

      if (isEmpty) {
        editor.commands.setContent(initialContent);
      }
    }
  }, [editor, initialContent, ydoc]);

  // AUTO-REFRESH content from database every 10 seconds
  useEffect(() => {
    if (!documentId || !editor) return;

    const refreshFromDatabase = async () => {
      // Don't refresh while user is typing!
      if (isTyping) return;
      try {
        const response = await api.get(`/ai/generation/${documentId}`);

        if (response.data?.status === "success") {
          const latestContent = response.data.data?.result?.editorState;

          if (latestContent) {
            const currentContent = editor.getJSON();
            const latestJSON =
              typeof latestContent === "string"
                ? JSON.parse(latestContent)
                : latestContent;

            // Update if content changed
            if (JSON.stringify(currentContent) !== JSON.stringify(latestJSON)) {
              // Save cursor position
              const cursorPos = editor.state.selection.anchor;

              // Update content
              editor.commands.setContent(latestJSON);

              // Restore cursor (only if not typing)
              if (!isTyping) {
                setTimeout(() => {
                  try {
                    if (cursorPos <= editor.state.doc.content.size) {
                      editor.commands.setTextSelection(cursorPos);
                    }
                  } catch (e) {
                    // Invalid position
                  }
                }, 0);
              }
            }
          }
        }
      } catch (error: any) {
        if (handleAuthError(error)) return;
      }
    };

    // Run on mount and every 10 seconds
    refreshFromDatabase();
    const interval = setInterval(refreshFromDatabase, 10000);

    return () => clearInterval(interval);
  }, [documentId, editor, isTyping]);

  return (
    <div className="simple-editor-wrapper">
      {/* Active Users Bar */}
      {activeUsers.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-900">
              {activeUsers.length} editing now:
            </span>
            <div className="flex -space-x-2">
              {activeUsers.map((user) => (
                <div
                  key={user.user_id}
                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white shadow-sm"
                  style={{ backgroundColor: user.user_color || "#3b82f6" }}
                  title={
                    user.users
                      ? `${user.users.first_name || ""} ${user.users.last_name || ""}`.trim() ||
                        user.users.email
                      : "User"
                  }
                >
                  {(user.users
                    ? `${user.users.first_name || ""} ${user.users.last_name || ""}`.trim() ||
                      user.users.email
                    : user.users?.email || "U")[0].toUpperCase()}
                </div>
              ))}
            </div>
          </div>
          <span className="text-xs text-blue-700">
            Changes sync automatically
          </span>
        </div>
      )}

      <EditorContent editor={editor} className="simple-editor-content" />
    </div>
  );
}
