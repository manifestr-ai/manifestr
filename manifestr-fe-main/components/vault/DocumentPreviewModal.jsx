import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Tag,
  Clock,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function DocumentPreviewModal({ isOpen, onClose, document }) {
  const [activeTab, setActiveTab] = useState("details");

  if (!document) return null;

  // Mock data to fill in missing fields from the card
  const mockDetails = {
    createdBy: document.collaborators?.[0] || {
      name: "Umar Islam",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    lastModified: document.lastEdited || "2 hours ago",
    type: "PDF",
    size: "2.4 MB",
    created: "1 week ago",
    versions: "12 versions",
    tags: ["Deck", "Product Launch"],
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[9998] backdrop-blur-sm"
          />

          {/* Centered Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              className=" bg-white rounded-xl shadow-2xl w-full max-w-[900px] overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="h-[60px] border-b border-[#e4e4e7] flex items-center justify-between px-6 shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#18181b]" />
                  <h2 className="text-[16px] font-semibold text-[#18181b]">
                    {document.title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#18181b] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Left Column: Details */}
                  <div className="space-y-6">
                    {/* Tabs */}
                    <div className="flex p-1 bg-[#f4f4f5] rounded-lg">
                      {["Details", "Version history", "Sharing"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab.toLowerCase())}
                          className={`flex-1 py-1.5 text-[13px] font-medium rounded-md transition-all ${
                            activeTab === tab.toLowerCase()
                              ? "bg-white text-[#18181b] shadow-sm"
                              : "text-[#71717a] hover:text-[#18181b]"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#18181b]">
                          Project / Job
                        </label>
                        <div className="px-3 py-2.5 rounded-md border border-[#e4e4e7] text-[14px] text-[#71717a] bg-white">
                          {document.project || "Assign to a project or job"}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#18181b]">
                          Status
                        </label>
                        <div className="px-3 py-2.5 rounded-md border border-[#e4e4e7] text-[14px] text-[#18181b] bg-white">
                          {document.status || "Draft"}
                        </div>
                      </div>
                    </div>

                    {/* File Details Table */}
                    <div className="pt-2 border-t border-dashed border-[#e4e4e7]">
                      <h3 className="text-[14px] font-semibold text-[#18181b] mb-4">
                        File details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-[#71717a]">Created by</span>
                          <div className="flex items-center gap-2">
                            {mockDetails.createdBy.avatar && (
                              <img
                                src={mockDetails.createdBy.avatar}
                                alt=""
                                className="w-5 h-5 rounded-full"
                              />
                            )}
                            <span className="font-medium text-[#18181b]">
                              {mockDetails.createdBy.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-[#71717a]">Last modified</span>
                          <span className="font-medium text-[#18181b]">
                            {mockDetails.lastModified}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-[#71717a]">Type</span>
                          <span className="font-medium text-[#18181b]">
                            {mockDetails.type}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-[#71717a]">Size</span>
                          <span className="font-medium text-[#18181b]">
                            {mockDetails.size}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-[#71717a]">Created</span>
                          <span className="font-medium text-[#18181b]">
                            {mockDetails.created}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-[#71717a]">Versions</span>
                          <span className="font-medium text-[#18181b]">
                            {mockDetails.versions}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="pt-2 border-t border-[#e4e4e7]">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-[#18181b]" />
                        <h3 className="text-[14px] font-semibold text-[#18181b]">
                          Tags
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {mockDetails.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full bg-[#f4f4f5] text-[12px] font-medium text-[#52525b] border border-[#e4e4e7]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Preview */}
                  <div className="bg-[#f4f4f5] rounded-lg overflow-hidden relative aspect-[4/5] md:aspect-auto">
                    {document.thumbnail ? (
                      // Use regular img if not in next.config.js, fallback gracefully
                      <img
                        src={document.thumbnail}
                        alt={document.title}
                        className="object-cover w-full h-full absolute inset-0"
                        style={{ objectFit: "cover" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[#a1a1aa]">
                        <FileText className="w-16 h-16 opacity-20" />
                      </div>
                    )}

                    {/* {document.thumbnail ? (
                                            <Image
                                                src={document.thumbnail}
                                                alt={document.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-[#a1a1aa]">
                                                <FileText className="w-16 h-16 opacity-20" />
                                            </div>
                                        )} */}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="h-[72px] border-t border-[#e4e4e7] flex items-center justify-between px-8 bg-white shrink-0">
                <button className="flex items-center gap-2 text-[14px] font-medium text-[#52525b] hover:text-[#18181b] transition-colors">
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>

                <div className="flex items-center gap-3">
                  <button className="h-10 px-4 rounded-lg border border-[#e4e4e7] flex items-center gap-2 text-[14px] font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="h-10 px-4 rounded-lg bg-[#18181b] flex items-center gap-2 text-[14px] font-medium text-white hover:bg-black transition-colors shadow-sm">
                    <ExternalLink className="w-4 h-4" />
                    Open in Editor
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
