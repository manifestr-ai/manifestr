import React, { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";
import TopHeader from "../components/spreadsheet/TopHeader";
import TiptapEditor from "../components/docs/TiptapEditor";
import DocumentOutline from "../components/docs/DocumentOutline";
import RightSidebar from "../components/spreadsheet/RightSidebar";
import BottomToolbar from "../components/spreadsheet/BottomToolbar";
import { FloatingFAB } from "../components/spreadsheet/FloatingElements";

// Dynamically import collaborative editor (uses Y.js)
const CollaborativeTiptapEditor = dynamic(
  () => import("../components/docs/CollaborativeTiptapEditor"),
  { ssr: false },
);
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
} from "docx";
import { saveAs } from "file-saver";

import docsContent from "../assets/dummy/docs-content.json";
import useGenerationLoader from "../hooks/useGenerationLoader";
import GenerationLoaderUI from "../components/shared/GenerationLoaderUI";

export default function DocsEditor() {
  const router = useRouter();
  const { id: documentId } = router.query; // Get document ID from URL
  const [headings, setHeadings] = useState([]);
  const [editorHTML, setEditorHTML] = useState("");
  const { loading, error, status, content, id } = useGenerationLoader();

  const extractHeadings = (html) => {
    // Store HTML for download
    setEditorHTML(html);

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const headingElements = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    const extractedHeadings = Array.from(headingElements).map((el, index) => ({
      id: `heading-${index}`,
      level: parseInt(el.tagName.substring(1)),
      text: el.textContent || "",
    }));

    setHeadings(extractedHeadings);
  };

  const handleDownload = async () => {
    try {
      if (!editorHTML || editorHTML.trim() === "") {
        alert("No content to download. Please wait for the editor to load.");
        console.log("No HTML content available");
        return;
      }

      console.log("Converting HTML to DOCX...");

      // Parse HTML and convert to DOCX
      const parser = new DOMParser();
      const doc = parser.parseFromString(editorHTML, "text/html");
      const children: any[] = [];

      // Recursively process DOM nodes
      const processNode = (node: any): any => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          if (text) {
            return new TextRun({ text });
          }
          return null;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return null;

        const tagName = node.tagName?.toLowerCase() || "";

        // Handle headings
        if (tagName.match(/^h[1-6]$/)) {
          const level = parseInt(tagName[1]);
          const text = node.textContent || "";
          const headingLevels = [
            HeadingLevel.HEADING_1,
            HeadingLevel.HEADING_2,
            HeadingLevel.HEADING_3,
            HeadingLevel.HEADING_4,
            HeadingLevel.HEADING_5,
            HeadingLevel.HEADING_6,
          ];
          return new Paragraph({
            text: text,
            heading: headingLevels[level - 1],
            spacing: { before: 240, after: 120 },
          });
        }

        // Handle paragraphs
        if (tagName === "p") {
          const textRuns = [];
          node.childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
              const text = child.textContent;
              if (text) textRuns.push(new TextRun({ text }));
            } else if (child.tagName === "STRONG" || child.tagName === "B") {
              textRuns.push(
                new TextRun({ text: child.textContent || "", bold: true }),
              );
            } else if (child.tagName === "EM" || child.tagName === "I") {
              textRuns.push(
                new TextRun({ text: child.textContent || "", italics: true }),
              );
            } else {
              textRuns.push(new TextRun({ text: child.textContent || "" }));
            }
          });
          return new Paragraph({ children: textRuns, spacing: { after: 120 } });
        }

        // Handle tables
        if (tagName === "table") {
          const rows = Array.from(
            node.querySelectorAll("tr"),
          ) as HTMLTableRowElement[];
          const tableRows = rows.map((tr) => {
            const cells = Array.from(
              tr.querySelectorAll("th, td"),
            ) as HTMLTableCellElement[];
            const tableCells = cells.map((cell) => {
              return new TableCell({
                children: [new Paragraph({ text: cell.textContent || "" })],
                width: { size: 100 / cells.length, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              });
            });
            return new TableRow({ children: tableCells });
          });
          return new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          });
        }

        // Handle horizontal rules
        if (tagName === "hr") {
          return new Paragraph({
            children: [new TextRun({ text: "" })],
            spacing: { before: 120, after: 120 },
          });
        }

        // Handle blockquotes
        if (tagName === "blockquote") {
          return new Paragraph({
            children: [
              new TextRun({ text: node.textContent || "", italics: true }),
            ],
            spacing: { before: 120, after: 120 },
            indent: { left: 720 },
          });
        }

        return null;
      };

      // Process all top-level elements
      doc.body.childNodes.forEach((node) => {
        const element = processNode(node);
        if (element) children.push(element);
      });

      // Create DOCX document
      const docx = new Document({
        sections: [
          {
            properties: {},
            children:
              children.length > 0
                ? children
                : [new Paragraph({ text: "Document content" })],
          },
        ],
      });

      // Generate and download
      const blob = await Packer.toBlob(docx);
      saveAs(blob, "document.docx");
      console.log("DOCX download complete!");
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Failed to download document. Please try again.");
    }
  };

  // Use generated content if available, otherwise fall back to dummy
  // Note: TiptapEditor expects 'content' prop.
  // If 'content' from hook is JSON/HTML, we pass it.
  const editorContent = content || docsContent;

  // Ensure documentId is string (router.query returns string | string[])
  const actualDocumentId =
    typeof (documentId || id) === "string"
      ? documentId || id
      : Array.isArray(documentId || id)
        ? (documentId || id)[0]
        : undefined;

  const useCollaboration = !!actualDocumentId; // Enable collaboration if we have a document ID

  return (
    <GenerationLoaderUI loading={loading} status={status} error={error}>
      <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
        <Head>
          <title>Docs Editor | Manifestr</title>
        </Head>

        {/* Top Section */}
        <div className="flex-none z-30">
          <TopHeader
            editorType="document"
            onDownload={handleDownload}
            documentId={actualDocumentId}
            documentTitle={content?.title || "Untitled document"}
            enableCollaboration={useCollaboration}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-grow flex relative overflow-hidden">
          {/* Left Sidebar - Document Outline */}
          <div className="hidden md:block h-full">
            <DocumentOutline headings={headings} />
          </div>

          {/* Editor Container */}
          <div className="flex-grow relative">
            {useCollaboration && actualDocumentId ? (
              <CollaborativeTiptapEditor
                documentId={actualDocumentId}
                initialContent={editorContent}
                onUpdate={extractHeadings}
              />
            ) : (
              <TiptapEditor
                onUpdate={extractHeadings}
                content={editorContent}
              />
            )}
          </div>

          {/* Right Sidebar (Floating over editor on the right) */}
          <div className="hidden md:flex absolute right-[-12px] top-0 bottom-0 items-center z-20 pointer-events-none">
            <div className="pointer-events-auto">
              <RightSidebar />
            </div>
          </div>

          {/* Floating FAB */}
          <FloatingFAB />
        </div>

        {/* Bottom Section */}
        <div className="flex-none z-30">
          <BottomToolbar />
        </div>
      </div>
    </GenerationLoaderUI>
  );
}
