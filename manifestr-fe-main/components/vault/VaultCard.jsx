import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Pencil,
  Share2,
  Download,
  MoreVertical,
  Pin,
} from "lucide-react";
import DocumentActionsModal from "./DocumentActionsModal";

// Collaborator badge colors based on name
const getCollaboratorBadgeColor = (name) => {
  const colors = {
    Jess: "bg-[#d1fae5]", // light green
    Leah: "bg-[#dbeafe]", // light blue
    Tom: "bg-[#fed7aa]", // light orange
    Sarah: "bg-[#e9d5ff]", // light purple
    "M.": "bg-[#18181b]", // dark gray/black
  };
  return colors[name] || "bg-[#dbeafe]";
};

const getCollaboratorTextColor = (name) => {
  const colors = {
    Jess: "text-[#065f46]", // dark green
    Leah: "text-[#1e40af]", // dark blue
    Tom: "text-[#9a3412]", // dark orange
    Sarah: "text-[#6b21a8]", // dark purple
    "M.": "text-white", // white for dark background
  };
  return colors[name] || "text-[#1e40af]";
};

export default function VaultCard({
  card,
  index,
  viewMode = "grid",
  onClick,
  onPin,
  onUpdate,
  onMemberCountClick,
}) {
  const [imageError, setImageError] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [isPinning, setIsPinning] = useState(false);

  // Handle pin button click
  const handlePinClick = async (e) => {
    e.stopPropagation();
    if (isPinning || !onPin) return;

    setIsPinning(true);
    try {
      await onPin(card);
    } finally {
      setIsPinning(false);
    }
  };

  // Handle updates from modal
  const handleModalUpdate = (updatedCard, action) => {
    if (action === "delete") {
      // Document was deleted, notify parent
      if (onUpdate) onUpdate(card.id, "delete");
    } else if (updatedCard) {
      // Document was updated (pin/archive)
      if (onUpdate) onUpdate(updatedCard);
    }
    setShowActionsModal(false);
  };

  const statusBgColors = {
    "In Progress": "bg-[#dbeafe]",
    "In Review": "bg-[#fef3c7]",
    Final: "bg-[#d1fae5]",
    Draft: "bg-[#f4f4f5]",
  };

  const statusTextColors = {
    "In Progress": "text-[#1e40af]",
    "In Review": "text-[#92400e]",
    Final: "text-[#065f46]",
    Draft: "text-[#71717a]",
  };

  // Default image from the description - woman working on laptop
  const defaultImage =
    "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop";
  const cardImage = card.thumbnail || defaultImage;
  const ActionBtn = ({ icon, onClick }) => (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-xl bg-white border border-[#e4e4e7] flex items-center justify-center shadow-sm hover:bg-[#f4f4f5] transition"
    >
      {icon}
    </button>
  );
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.04 }}
        onClick={onClick}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 rounded-2xl bg-[#ffffff] transition-all cursor-pointer mb-4 hover:shadow-lg w-full"
      >
        {/* IMAGE */}
        <div className="relative w-full sm:w-[240px] h-[180px] sm:h-[120px] rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none overflow-hidden shrink-0">
          {!imageError ? (
            <img
              src={cardImage}
              alt={card.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#f4f4f5] to-[#e4e4e7]" />
          )}

          {/* STATUS BADGE */}
          {card.status && (
            <div className="absolute bottom-3 left-3">
              <span
                className={`px-3 py-1 rounded-full text-[12px] font-medium shadow-sm ${
                  card.status === "Final"
                    ? "bg-[#dcfce7] text-[#166534]"
                    : "bg-[#e4e4e7] text-[#52525b]"
                }`}
              >
                {card.status}
              </span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0 flex flex-col justify-center px-3 py-2">
          <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#18181b] leading-[22px] sm:leading-[24px] mb-1 line-clamp-2 break-words mb-2">
            {card.title}
          </h3>

          <p className="text-[13px] sm:text-[14px] text-[#3f3f46] mb-2 line-clamp-1 break-words mb-2">
            Project: {card.project}
          </p>

          {card.lastEdited && (
            <p className="text-[12px] sm:text-[13px] text-[#a1a1aa] italic">
              Last edited: {card.lastEdited}
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 px-3 sm:pr-2 mt-2 mb-2 sm:mt-4 sm:mr-2 self-end sm:self-start">
          <ActionBtn icon={<FileText className="w-4 h-4" />} />
          <ActionBtn icon={<Pencil className="w-4 h-4" />} />
          <ActionBtn icon={<Share2 className="w-4 h-4" />} />
          <ActionBtn icon={<Download className="w-4 h-4" />} />
          <ActionBtn
            icon={<MoreVertical className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              setShowActionsModal(true);
            }}
          />
        </div>

        <DocumentActionsModal
          isOpen={showActionsModal}
          onClose={() => setShowActionsModal(false)}
          document={card}
          onUpdate={handleModalUpdate}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      className="w-full max-w-[300px] flex flex-col bg-white rounded-xl overflow-hidden shadow-[0_8px_16px_0_rgba(22,34,51,0.08)] border border-[#e4e4e7] group cursor-pointer transition-shadow hover:shadow-[0_8px_16px_0_rgba(22,34,51,0.12)]"
    >
      {/* Header Section with Image */}
      <div className="relative w-full h-[180px] overflow-hidden">
        {/* Background Image */}
        <div className="w-full h-full relative">
          {!imageError ? (
            <img
              src={cardImage}
              alt={card.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#f4f4f5] to-[#e4e4e7]" />
          )}
          {/* Blur overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
        </div>

        {/* Action Icons - Top Right */}
        <div className="absolute top-2 px-2 w-full justify-between flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 bg-white/95 backdrop-blur-sm rounded-md flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-[#18181b]" />
          </motion.button>
          <div className="flex gap-1">
            <motion.button
              onClick={handlePinClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 bg-white/95 backdrop-blur-sm rounded-md flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              title={card.isPinned ? "Unpin document" : "Pin document"}
              disabled={isPinning}
            >
              <Pin
                className={`w-3.5 h-3.5 transition-all ${
                  card.isPinned
                    ? "text-blue-600 fill-blue-600"
                    : "text-[#18181b]"
                } ${isPinning ? "opacity-50" : ""}`}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 bg-white/95 backdrop-blur-sm rounded-md flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-[#18181b]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 bg-white/95 backdrop-blur-sm rounded-md flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#18181b]" />
            </motion.button>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowActionsModal(true);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 bg-white/95 backdrop-blur-sm rounded-md flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            >
              <MoreVertical className="w-3.5 h-3.5 text-[#18181b]" />
            </motion.button>
          </div>
        </div>

        {/* Status Badge - Bottom Left */}
        {(card.status || card.collaboratorName) && (
          <div className="absolute bottom-2 left-2">
            <span
              className={`px-2 py-1 rounded-xl text-[12px] font-medium leading-[18px] ${
                card.collaboratorName
                  ? getCollaboratorBadgeColor(card.collaboratorName)
                  : statusBgColors[card.status] || "bg-[#dbeafe]"
              } ${
                card.collaboratorName
                  ? getCollaboratorTextColor(card.collaboratorName)
                  : statusTextColors[card.status] || "text-[#1e40af]"
              }`}
            >
              {card.collaboratorName || card.status}
            </span>
          </div>
        )}

        {/* Shared Badge - Top Left */}
        {/* {card.isShared && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 rounded-md text-[12px] font-medium leading-[18px] bg-blue-500 text-white shadow-lg">
              Shared with you
            </span>
          </div>
        )} */}
      </div>

      {/* Content Section */}
      <div className="w-full bg-white p-5 flex flex-col min-h-[180px]">
        {/* Project Title */}
        <h3 className="text-[15px] font-bold leading-[22.5px] text-[#09090B] mb-1 line-clamp-2 tracking-[-0.234px] font-inter not-italic">
          {card.title}
        </h3>

        {/* Project Subtitle */}
        <p
          className="text-[12px] font-normal leading-[18px] text-[#18181B] mb-3 font-inter not-italic"
          style={{ fontFamily: "Inter", fontStyle: "normal", fontWeight: 400 }}
        >
          Project: {card.project}
        </p>

        {/* Collaborators */}
        {card.collaborators && card.collaborators.length > 0 && (
          <div className="flex items-center mb-3">
            {card.collaborators.slice(0, 6).map((collab, idx) => (
              <div
                key={idx}
                className={`w-[25px] h-[25px] rounded-full bg-[#f4f4f5] border-2 border-white flex items-center justify-center overflow-hidden shrink-0 ${
                  idx > 0 ? "-ml-3" : ""
                }`}
                style={{ zIndex: 10 - idx }}
              >
                {collab.avatar ? (
                  <img
                    src={collab.avatar}
                    alt={collab.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[13px] font-medium text-[#18181b]">
                    {collab.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            ))}
            {card.collaborators.length > 6 && (
              <div
                className="w-[25px] h-[25px] rounded-full bg-[#e4e4e7] border-2 border-white flex items-center justify-center shrink-0 -ml-2.5"
                style={{ zIndex: 4 }}
              >
                <span className="text-[13px] font-medium text-[#52525b]">
                  +{card.collaborators.length - 6}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Last Edited */}
        {card.lastEdited && (
          <p
            className="italic text-[10px] leading-[18px] font-normal tracking-[-0.076px] text-[#71717B] mt-auto font-inter"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Last edited: {card.lastEdited}
          </p>
        )}
      </div>

      {/* Document Actions Modal */}
      <DocumentActionsModal
        isOpen={showActionsModal}
        onClose={() => setShowActionsModal(false)}
        document={card}
        onUpdate={handleModalUpdate}
      />
    </motion.div>
  );
}
