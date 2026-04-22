import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Share2,
  Download,
  Folder,
  Copy,
  Check,
  ChevronDown,
  Users,
  FileText,
  Shield,
  Plus,
  Pin,
  Archive,
  Trash2,
} from "lucide-react";
import ToggleSwitch from "../forms/ToggleSwitch";
import ToggleCheckBoxTwo from "../forms/ToggleCheckBoxTwo";

import api from "../../lib/api";

export default function DocumentActionsModal({
  isOpen,
  onClose,
  document,
  onUpdate,
}) {
  const modalRef = useRef(null);
  const [primaryTab, setPrimaryTab] = useState("Share"); // Share, Export, Save & Organize, Manage
  const [shareSubTab, setShareSubTab] = useState("Share Link"); // Share Link, Invite & Review, Manage Access
  const [linkExpiry, setLinkExpiry] = useState("7 days");
  const [defaultRole, setDefaultRole] = useState("Viewer");
  const [allowComments, setAllowComments] = useState(false);
  const [allowDownloads, setAllowDownloads] = useState(false);
  const [requireAuth, setRequireAuth] = useState(true);
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [sendForReview, setSendForReview] = useState(false);
  const [personalMessage, setPersonalMessage] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("PDF");
  const [includeComments, setIncludeComments] = useState(false);
  const [addWatermark, setAddWatermark] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(
    "Marketing Pitch 2025 - Q4 Strategy",
  );

  const [selectedBulkAction, setSelectedBulkAction] = useState(null);
  const [notes, setNotes] = useState("");
  const [saveLocation, setSaveLocation] = useState("Vault Root");
  const [versionControl, setVersionControl] = useState("new-version");
  const [tags, setTags] = useState(["Strategy", "Executive", "PitchDeck"]);
  const [tagInput, setTagInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [showLinkExpiryDropdown, setShowLinkExpiryDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showBulkActionsDropdown, setShowBulkActionsDropdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Toast notification helper
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const linkExpiryOptions = ["7 days", "30 days", "90 days", "Never"];
  const roleOptions = ["Viewer", "Editor", "Admin", "Owner"];
  const locationOptions = ["Vault Root", "Collabs", "Projects", "Archived"];
  const bulkActionsOptions = ["Change Role", "Remove Access", "Export List"];

  // Mapping of role to their corresponding SVG icon as a React component
  const roleOptionSVGs = {
    Viewer: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M1.66406 10.0001C1.66406 10.0001 4.16406 4.16675 9.9974 4.16675C15.8307 4.16675 18.3307 10.0001 18.3307 10.0001C18.3307 10.0001 15.8307 15.8334 9.9974 15.8334C4.16406 15.8334 1.66406 10.0001 1.66406 10.0001Z"
          stroke="#71717A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.9974 12.5001C11.3781 12.5001 12.4974 11.3808 12.4974 10.0001C12.4974 8.61937 11.3781 7.50008 9.9974 7.50008C8.61668 7.50008 7.4974 8.61937 7.4974 10.0001C7.4974 11.3808 8.61668 12.5001 9.9974 12.5001Z"
          stroke="#71717A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    Editor: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <g clip-path="url(#clip0_13674_32175)">
          <path
            d="M12.4974 4.16667L15.8307 7.5M17.6423 5.67658C18.0829 5.2361 18.3305 4.63863 18.3306 4.01562C18.3307 3.39261 18.0832 2.79508 17.6428 2.35449C17.2023 1.9139 16.6048 1.66634 15.9818 1.66626C15.3588 1.66618 14.7613 1.9136 14.3207 2.35408L3.19901 13.4782C3.00552 13.6712 2.86244 13.9087 2.78234 14.1699L1.68151 17.7966C1.65997 17.8686 1.65834 17.9452 1.6768 18.0181C1.69526 18.091 1.73311 18.1576 1.78634 18.2107C1.83957 18.2639 1.90619 18.3016 1.97914 18.32C2.05209 18.3383 2.12864 18.3366 2.20067 18.3149L5.82817 17.2149C6.08915 17.1355 6.32665 16.9933 6.51984 16.8007L17.6423 5.67658Z"
            stroke="#71717A"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_13674_32175">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ), // TODO: Add appropriate SVG for Editor role
    Admin: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="17"
        viewBox="0 0 19 17"
        fill="none"
      >
        <path
          d="M7.66667 11H4.33333C3.44928 11 2.60143 11.3512 1.97631 11.9763C1.35119 12.6014 1 13.4493 1 14.3333V16M17.4167 12.1667L16.6667 11.9167M12 10.0834L11.25 9.83341M13.1667 14.0834L13.4167 13.3334M15.2501 8.66671L15.5001 7.91671M15.6666 14.0833L15.3333 13.25M13.3333 8.75004L12.9999 7.91671M11.25 12.3333L12.0834 12M16.5833 9.99992L17.4166 9.66659M16.8333 11C16.8333 12.3807 15.714 13.5 14.3333 13.5C12.9526 13.5 11.8333 12.3807 11.8333 11C11.8333 9.61929 12.9526 8.5 14.3333 8.5C15.714 8.5 16.8333 9.61929 16.8333 11ZM10.1667 4.33333C10.1667 6.17428 8.67428 7.66667 6.83333 7.66667C4.99238 7.66667 3.5 6.17428 3.5 4.33333C3.5 2.49238 4.99238 1 6.83333 1C8.67428 1 10.1667 2.49238 10.1667 4.33333Z"
          stroke="#71717A"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ), // TODO: Add appropriate SVG for Admin role
    Owner: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M4.16984 17.5H15.8365M9.63812 2.72156C9.67409 2.65623 9.72693 2.60176 9.79113 2.56382C9.85534 2.52587 9.92855 2.50586 10.0031 2.50586C10.0777 2.50586 10.1509 2.52587 10.2151 2.56382C10.2793 2.60176 10.3322 2.65623 10.3681 2.72156L12.8281 7.39156C12.8868 7.4997 12.9687 7.5935 13.0679 7.66625C13.1671 7.73899 13.2812 7.78886 13.402 7.81228C13.5227 7.8357 13.6472 7.83209 13.7664 7.80171C13.8856 7.77133 13.9966 7.71493 14.0915 7.63656L17.6556 4.58323C17.724 4.52758 17.8084 4.49508 17.8964 4.4904C17.9845 4.48572 18.0718 4.5091 18.1457 4.55718C18.2196 4.60527 18.2764 4.67557 18.3078 4.75797C18.3393 4.84037 18.3437 4.93062 18.3206 5.01573L15.959 13.5541C15.9107 13.7288 15.8069 13.883 15.6631 13.9934C15.5194 14.1038 15.3435 14.1643 15.1623 14.1657H4.84479C4.6634 14.1645 4.48738 14.104 4.34345 13.9937C4.19951 13.8833 4.09553 13.7289 4.04729 13.5541L1.68645 5.01656C1.66333 4.93146 1.6678 4.84121 1.69924 4.75881C1.73067 4.6764 1.78744 4.6061 1.86137 4.55802C1.9353 4.50993 2.02259 4.48655 2.11065 4.49123C2.19872 4.49591 2.28303 4.52841 2.35145 4.58406L5.91479 7.6374C6.00962 7.71576 6.12063 7.77216 6.23984 7.80254C6.35905 7.83292 6.48351 7.83653 6.60429 7.81311C6.72506 7.78969 6.83915 7.73982 6.93836 7.66708C7.03758 7.59434 7.11946 7.50053 7.17812 7.3924L9.63812 2.72156Z"
          stroke="#71717A"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ), // TODO: Add appropriate SVG for Owner role
  };

  // Sample team members data
  const internalMembers = [
    {
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      role: "Can edit",
      avatar: "SC",
    },
    {
      name: "Michael Roberts",
      email: "michael.r@company.com",
      role: "Can view",
      avatar: "MR",
    },
  ];

  const externalCollaborators = [
    {
      name: "Jessica Wong",
      email: "jessica@partner.com",
      role: "Can view",
      avatar: "JW",
      expires: "11/23/25",
    },
    {
      name: "David Kim",
      email: "david@client.com",
      role: "Can view",
      avatar: "DK",
      expires: "12/01/25",
      status: "Pending",
    },
  ];

  let pdficon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10 9H8" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 13H8" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 17H8" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  let powerpointicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M2 3H22" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M21 3V14C21 14.5304 20.7893 15.0391 20.4142 15.4142C20.0391 15.7893 19.5304 16 19 16H5C4.46957 16 3.96086 15.7893 3.58579 15.4142C3.21071 15.0391 3 14.5304 3 14V3" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7 21L12 16L17 21" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  let wordicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10 9H8" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 13H8" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 17H8" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  let googledocsicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 2C9.43223 4.69615 8 8.27674 8 12C8 15.7233 9.43223 19.3038 12 22C14.5678 19.3038 16 15.7233 16 12C16 8.27674 14.5678 4.69615 12 2Z" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2 12H22" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  let htmlicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 2C9.43223 4.69615 8 8.27674 8 12C8 15.7233 9.43223 19.3038 12 22C14.5678 19.3038 16 15.7233 16 12C16 8.27674 14.5678 4.69615 12 2Z" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2 12H22" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  let notionicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  let csvicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8 13H10" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14 13H16" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8 17H10" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14 17H16" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  let printicon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M6 9V3C6 2.73478 6.10536 2.48043 6.29289 2.29289C6.48043 2.10536 6.73478 2 7 2H17C17.2652 2 17.5196 2.10536 17.7071 2.29289C17.8946 2.48043 18 2.73478 18 3V9" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17 14H7C6.44772 14 6 14.4477 6 15V21C6 21.5523 6.44772 22 7 22H17C17.5523 22 18 21.5523 18 21V15C18 14.4477 17.5523 14 17 14Z" stroke="#0F172B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const formatOptions = [
    { id: "pdf", name: "PDF", description: "Best for sharing", icon: pdficon },
    {
      id: "powerpoint",
      name: "PowerPoint",
      description: "Editable slides",
      icon: powerpointicon,
    },
    { id: "word", name: "Word", description: "Editable document", icon: wordicon },
    {
      id: "google-docs",
      name: "Google Docs",
      description: "Cloud format",
      icon: googledocsicon,
    },
    { id: "html", name: "HTML", description: "Web version", icon: htmlicon },
    {
      id: "notion",
      name: "Notion",
      description: "Export to Notion",
      icon: notionicon,
    },
    { id: "csv", name: "CSV", description: "Data export", icon: csvicon },
    { id: "print", name: "Print", description: "High quality", icon: printicon },
  ];

  const suggestedTags = ["Q4", "2025", "Client", "Internal", "Draft", "Final"];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowLinkExpiryDropdown(false);
        setShowRoleDropdown(false);
        setShowLocationDropdown(false);
        setShowBulkActionsDropdown(false);
      }
    };

    if (isOpen) {
      window.addEventListener("mousedown", handleClickOutside);
      return () => window.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setPrimaryTab("Share");
      setShareSubTab("Share Link");
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://manifestr.app/share/abc123def");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddEmail = () => {
    if (emailInput.trim()) {
      // Handle adding email
      setEmailInput("");
    }
  };

  // Handle Pin/Unpin
  const handleTogglePin = async () => {
    if (!document?.id) return;
    setIsProcessing(true);
    try {
      if (document.isPinned) {
        await api.delete(`/ai/pin/${document.id}`);
        console.log(`📌 Unpinned: ${document.title}`);
        showToast("Document unpinned successfully", "success");
      } else {
        const response = await api.post(`/ai/pin/${document.id}`);
        if (response.data.status === "error") {
          showToast(response.data.message, "error");
          setIsProcessing(false);
          return;
        }
        console.log(`📌 Pinned: ${document.title}`);
        showToast("Document pinned successfully", "success");
      }

      // Notify parent to update the document
      if (onUpdate) {
        onUpdate({ ...document, isPinned: !document.isPinned });
      }

      onClose();
    } catch (err) {
      console.error("Failed to toggle pin:", err);
      showToast(
        err.response?.data?.message || "Failed to pin/unpin document",
        "error",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Archive/Unarchive
  const handleArchive = async () => {
    if (!document?.id) return;
    setIsProcessing(true);

    const isCurrentlyArchived = document?.isArchived;

    try {
      if (isCurrentlyArchived) {
        // Unarchive
        await api.post(`/ai/unarchive/${document.id}`);
        console.log(`📤 Unarchived: ${document.title}`);
        showToast("Document unarchived successfully!", "success");

        if (onUpdate) {
          onUpdate({ ...document, isArchived: false });
        }
      } else {
        // Archive
        await api.post(`/ai/archive/${document.id}`);
        console.log(`📦 Archived: ${document.title}`);
        showToast("Document archived successfully!", "success");

        if (onUpdate) {
          onUpdate({ ...document, isArchived: true });
        }
      }

      onClose();
    } catch (err) {
      console.error("Failed to archive/unarchive:", err);
      showToast(
        err.response?.data?.message ||
        `Failed to ${isCurrentlyArchived ? "unarchive" : "archive"} document`,
        "error",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Delete (SOFT DELETE)
  const handleDelete = async () => {
    if (!document?.id) return;
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsProcessing(true);
    try {
      await api.delete(`/ai/generation/${document.id}`);
      console.log(`🗑️ Soft deleted: ${document.title}`);

      // Notify parent to remove the document
      if (onUpdate) {
        onUpdate(null, "delete"); // Signal deletion
      }

      showToast("Document deleted successfully!", "success");
      onClose();
    } catch (err) {
      console.error("Failed to delete:", err);
      showToast(
        err.response?.data?.message || "Failed to delete document",
        "error",
      );
    } finally {
      setIsProcessing(false);
      setShowDeleteConfirm(false);
    }
  };

  const shareLink = "https://manifestr.app/share/abc123def";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] w-full max-w-[530px] max-h-[90vh] overflow-hidden flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 pb-0 relative">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-6 top-6 w-5 h-5 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-[#4f5857]" />
              </motion.button>

              <div className="flex flex-col gap-3 items-center text-center mb-5">
                <h2 style={{ color: '#18181B', fontFamily: '"HK Grotesk", sans-serif', fontSize: '30px', fontWeight: 600, lineHeight: '120%', letterSpacing: '-0.6px', textAlign: 'center' }}>
                  Document Actions
                </h2>
                <p className="font-['Inter'] font-normal text-[16px] leading-[1.5] text-zinc-500 tracking-[-0.16px]">
                  Share, export, or save your document
                </p>
              </div>

              {/* Primary Tabs */}
              <div className="bg-gray-200 rounded-[18px] p-[3.5px] grid grid-cols-4 gap-0 mb-5">
                <motion.button
                  onClick={() => setPrimaryTab("Share")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`h-[29px] rounded-[18px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] tracking-[-0.1504px] transition-all ${primaryTab === "Share"
                    ? "bg-white text-zinc-900"
                    : "bg-transparent text-zinc-900"
                    }`}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </motion.button>
                <motion.button
                  onClick={() => setPrimaryTab("Export")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`h-[29px] rounded-[18px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] tracking-[-0.1504px] transition-all ${primaryTab === "Export"
                    ? "bg-white text-zinc-900"
                    : "bg-transparent text-zinc-900"
                    }`}
                >
                  <Download className="w-4 h-4" />
                  Export
                </motion.button>
                <motion.button
                  onClick={() => setPrimaryTab("Save & Organize")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`h-[29px] rounded-[18px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] tracking-[-0.1504px] transition-all ${primaryTab === "Save & Organize"
                    ? "bg-white text-zinc-900"
                    : "bg-transparent text-zinc-900"
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4.00065 9.3334L5.00065 7.40006C5.10937 7.18416 5.27473 7.00187 5.47906 6.8727C5.68338 6.74352 5.91898 6.67233 6.16065 6.66673H13.334M13.334 6.66673C13.5377 6.66637 13.7387 6.71269 13.9217 6.80212C14.1047 6.89155 14.2648 7.02172 14.3897 7.18264C14.5146 7.34356 14.6009 7.53095 14.6421 7.73043C14.6833 7.92991 14.6782 8.13618 14.6273 8.3334L13.6007 12.3334C13.5264 12.6211 13.3581 12.8758 13.1226 13.0569C12.8871 13.2381 12.5978 13.3354 12.3007 13.3334H2.66732C2.3137 13.3334 1.97456 13.1929 1.72451 12.9429C1.47446 12.6928 1.33398 12.3537 1.33398 12.0001V3.3334C1.33398 2.97978 1.47446 2.64064 1.72451 2.39059C1.97456 2.14054 2.3137 2.00006 2.66732 2.00006H5.26732C5.49031 1.99788 5.71029 2.05166 5.90712 2.15648C6.10395 2.2613 6.27134 2.41381 6.39398 2.60006L6.93398 3.40006C7.05539 3.58442 7.22067 3.73574 7.41499 3.84047C7.6093 3.94519 7.82658 4.00003 8.04732 4.00006H12.0007C12.3543 4.00006 12.6934 4.14054 12.9435 4.39059C13.1935 4.64064 13.334 4.97978 13.334 5.3334V6.66673Z" stroke="#0A0E1A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  Save
                </motion.button>
                <motion.button
                  onClick={() => setPrimaryTab("Manage")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`h-[29px] rounded-[18px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] tracking-[-0.1504px] transition-all ${primaryTab === "Manage"
                    ? "bg-white text-zinc-900"
                    : "bg-transparent text-zinc-900"
                    }`}
                >
                  <Shield className="w-4 h-4" />
                  Manage
                </motion.button>
              </div>

              {/* Secondary Tabs (for Share) */}
              {primaryTab === "Share" && (
                <div className="bg-gray-200 rounded-[18px] p-[3.5px] grid grid-cols-3 gap-0 mb-6">
                  <motion.button
                    onClick={() => setShareSubTab("Share Link")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`h-[29px] rounded-[18px] flex items-center justify-center text-[14px] font-medium leading-[20px] tracking-[-0.1504px] transition-all ${shareSubTab === "Share Link"
                      ? "bg-white text-zinc-900"
                      : "bg-transparent text-zinc-900"
                      }`}
                  >
                    Share Link
                  </motion.button>
                  <motion.button
                    onClick={() => setShareSubTab("Invite & Review")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`h-[29px] rounded-[18px] flex items-center justify-center text-[14px] font-medium leading-[20px] tracking-[-0.1504px] transition-all ${shareSubTab === "Invite & Review"
                      ? "bg-white text-zinc-900"
                      : "bg-transparent text-zinc-900"
                      }`}
                  >
                    Invite & Review
                  </motion.button>
                  <motion.button
                    onClick={() => setShareSubTab("Manage Access")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`h-[29px] rounded-[18px] flex items-center justify-center text-[14px] font-medium leading-[20px] tracking-[-0.1504px] transition-all ${shareSubTab === "Manage Access"
                      ? "bg-white text-zinc-900"
                      : "bg-transparent text-zinc-900"
                      }`}
                  >
                    Manage Access
                  </motion.button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {/* Share Link Tab */}
              {primaryTab === "Share" && shareSubTab === "Share Link" && (
                <div className="space-y-6">
                  {/* Share Link Input */}
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium leading-[14px] text-zinc-900 tracking-[-0.1504px]">
                      Share link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={shareLink}
                        readOnly
                        className="flex-1 h-[36px] px-3 bg-white border border-transparent rounded-[12px] text-[14px] font-normal leading-[20px] text-[#0a0e1a] tracking-[-0.1504px]"
                      />
                      <motion.button
                        onClick={handleCopyLink}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#f8f9fb] border border-[rgba(15,23,42,0.06)] rounded-[6px] w-9 h-9 flex items-center justify-center"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-zinc-900" />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Link Expiry & Default Role */}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[14px] font-medium leading-[20px] text-zinc-900">
                        Link expiry
                      </label>
                      <div className="relative">
                        <motion.button
                          onClick={() => {
                            setShowLinkExpiryDropdown(!showLinkExpiryDropdown);
                            setShowRoleDropdown(false);
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full bg-white border border-[#e4e4e7] rounded-[6px] px-3 py-2 h-[36px] flex items-center justify-between"
                        >
                          <span className="text-[16px] font-normal leading-[24px] text-[#71717a]">
                            {linkExpiry}
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#71717a]" />
                        </motion.button>
                        <AnimatePresence>
                          {showLinkExpiryDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden"
                            >
                              {linkExpiryOptions.map((option) => (
                                <motion.button
                                  key={option}
                                  onClick={() => {
                                    setLinkExpiry(option);
                                    setShowLinkExpiryDropdown(false);
                                  }}
                                  whileHover={{ backgroundColor: "#f4f4f5" }}
                                  className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                                >
                                  {option}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[14px] font-medium leading-[20px] text-zinc-900">
                        Default role
                      </label>
                      <div className="relative">
                        <motion.button
                          onClick={() => {
                            setShowRoleDropdown(!showRoleDropdown);
                            setShowLinkExpiryDropdown(false);
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full bg-white border border-[#e4e4e7] rounded-[6px] px-3 py-2 h-[36px] flex items-center justify-between"
                        >
                          <span className="text-[16px] font-normal leading-[24px] text-[#71717a]">
                            {defaultRole}
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#71717a]" />
                        </motion.button>
                        <AnimatePresence>
                          {showRoleDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden"
                            >
                              {roleOptions.map((role) => (
                                <motion.button
                                  key={role}
                                  onClick={() => {
                                    setDefaultRole(role);
                                    setShowRoleDropdown(false);
                                  }}
                                  whileHover={{ backgroundColor: "#f4f4f5" }}
                                  className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                                >
                                  <span className="flex items-center gap-2">
                                    {roleOptionSVGs[role] ?? null}
                                    {role}
                                  </span>
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Allowances */}
                  <div className="space-y-3">
                    <label className="text-[14px] font-medium leading-[14px] text-zinc-900 tracking-[-0.1504px]">
                      Allowances
                    </label>
                    <div className="space-y-3">
                      <ToggleCheckBoxTwo
                        checked={allowComments}
                        onChange={({ target }) =>
                          setAllowComments(target.checked)
                        }
                        label="Allow comments"
                        className="w-full"
                      />
                      <ToggleCheckBoxTwo
                        checked={allowDownloads}
                        onChange={({ target }) =>
                          setAllowDownloads(target.checked)
                        }
                        label="Allow downloads"
                        className="w-full"
                      />
                      <ToggleCheckBoxTwo
                        checked={requireAuth}
                        onChange={({ target }) =>
                          setRequireAuth(target.checked)
                        }
                        label="Require authentication"
                        className="w-full"
                      />
                      <ToggleCheckBoxTwo
                        checked={passwordProtect}
                        onChange={({ target }) =>
                          setPasswordProtect(target.checked)
                        }
                        label={
                          <span>
                            Password protect{" "}
                            <span className="text-zinc-500">
                              (optional future enhancement)
                            </span>
                          </span>
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="flex items-center gap-2 h-[58px] pl-4 self-stretch rounded-[14px] border border-[#E2E8F0] bg-[#F1F5F9]">
                    <Shield className="w-5 h-5 text-zinc-900" />
                    <p
                      className="text-[16px] font-normal leading-[24px] text-[#0F172B] tracking-[-0.312px]"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontStyle: "normal",
                        fontWeight: 400,
                        letterSpacing: "-0.312px",
                      }}
                    >
                      Secure sharing with enterprise-grade encryption.
                    </p>
                  </div>
                </div>
              )}

              {/* Invite & Review Tab */}
              {primaryTab === "Share" && shareSubTab === "Invite & Review" && (
                <div className="space-y-6">
                  {/* Add Users */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[14px] font-medium leading-[14px] text-zinc-900 tracking-[-0.1504px]">
                        Add users
                      </label>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="h-[32px] px-3 rounded-[12px] flex items-center gap-2 text-[14px] font-medium leading-[20px] text-zinc-900 tracking-[-0.1504px] hover:bg-gray-100"
                      >
                        <Users className="w-4 h-4" />
                        Add from Team
                      </motion.button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="email@domain.com"
                        className="flex-1 h-[36px] px-3 bg-white border border-[#e4e4e7] rounded-[6px] text-[14px] font-normal leading-[normal] text-zinc-500 tracking-[-0.1504px] focus:outline-none focus:ring-2 focus:ring-[#18181b]"
                      />
                      <motion.button
                        onClick={handleAddEmail}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-zinc-900 text-white rounded-[6px] h-[36px] px-4 text-[14px] font-medium leading-[20px] tracking-[-0.1504px] hover:opacity-90"
                      >
                        Add
                      </motion.button>
                    </div>
                  </div>

                  {/* Link Expiry & Default Role */}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[14px] font-medium leading-[20px] text-zinc-900">
                        Link expiry
                      </label>
                      <div className="relative">
                        <motion.button
                          onClick={() => {
                            setShowLinkExpiryDropdown(!showLinkExpiryDropdown);
                            setShowRoleDropdown(false);
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full bg-white border border-[#e4e4e7] rounded-[6px] px-3 py-2 h-[36px] flex items-center justify-between"
                        >
                          <span className="text-[16px] font-normal leading-[24px] text-[#71717a]">
                            {linkExpiry}
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#71717a]" />
                        </motion.button>
                        <AnimatePresence>
                          {showLinkExpiryDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden"
                            >
                              {linkExpiryOptions.map((option) => (
                                <motion.button
                                  key={option}
                                  onClick={() => {
                                    setLinkExpiry(option);
                                    setShowLinkExpiryDropdown(false);
                                  }}
                                  whileHover={{ backgroundColor: "#f4f4f5" }}
                                  className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                                >
                                  {option}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[14px] font-medium leading-[20px] text-zinc-900">
                        Default role
                      </label>
                      <div className="relative">
                        <motion.button
                          onClick={() => {
                            setShowRoleDropdown(!showRoleDropdown);
                            setShowLinkExpiryDropdown(false);
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full bg-white border border-[#e4e4e7] rounded-[6px] px-3 py-2 h-[36px] flex items-center justify-between"
                        >
                          <span className="text-[16px] font-normal leading-[24px] text-[#71717a]">
                            {defaultRole}
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#71717a]" />
                        </motion.button>
                        <AnimatePresence>
                          {showRoleDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden"
                            >
                              {roleOptions.map((role) => (
                                <motion.button
                                  key={role}
                                  onClick={() => {
                                    setDefaultRole(role);
                                    setShowRoleDropdown(false);
                                  }}
                                  whileHover={{ backgroundColor: "#f4f4f5" }}
                                  className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                                >
                                  {role}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <label className="text-[14px] font-medium leading-[14px] text-zinc-900 tracking-[-0.1504px]">
                      Options
                    </label>
                    <div className="flex items-center gap-2">
                      <ToggleCheckBoxTwo
                        checked={sendForReview}
                        onChange={({ target }) =>
                          setSendForReview(target.checked)
                        }
                        className=""
                      />
                      <FileText className="w-4 h-4 text-zinc-900" />
                      <label className="text-[15px] font-normal leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                        Send for review
                      </label>
                    </div>
                  </div>

                  {/* Personal Message */}
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium leading-[20px] text-zinc-900">
                      Personal message (optional)
                    </label>
                    <textarea
                      value={personalMessage}
                      onChange={(e) => setPersonalMessage(e.target.value)}
                      placeholder="Add a message to your invitation..."
                      rows={3}
                      className="w-full px-3 py-2 bg-white border border-[#e4e4e7] rounded-[6px] text-[16px] font-normal leading-[24px] text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#18181b] resize-none"
                    />
                  </div>

                  {/* Note */}
                  <div className="bg-gray-200 rounded-[12px] p-4">
                    <p className="text-[14px] leading-[20px] text-zinc-900 tracking-[-0.1504px]">
                      <span className="font-bold">Note:</span> Team selection
                      triggers user avatar & role fetch. Non-team emails prompt:
                      "Invite this user to your workspace?"
                    </p>
                  </div>
                </div>
              )}

              {/* Manage Access Tab */}
              {primaryTab === "Share" && shareSubTab === "Manage Access" && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-normal leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                      Team Members
                    </h3>
                    <div className="relative">
                      <motion.button
                        onClick={() => {
                          setShowBulkActionsDropdown(!showBulkActionsDropdown);
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="bg-white border border-[#e4e4e7] rounded-md px-3 py-2 h-[36px] w-[216px] flex items-center justify-between"
                      >
                        <span className="text-[16px] font-normal leading-[24px] text-[#71717a]">
                          {selectedBulkAction || "Bulk Actions"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-[#71717a]" />
                      </motion.button>
                      <AnimatePresence>
                        {showBulkActionsDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden min-w-[216px]"
                          >
                            {bulkActionsOptions.map((action) => (
                              <motion.button
                                key={action}
                                onClick={() => {
                                  setSelectedBulkAction(action);
                                  setShowBulkActionsDropdown(false);
                                }}
                                whileHover={{ backgroundColor: "#f4f4f5" }}
                                className={`w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b] ${selectedBulkAction === action
                                  ? "bg-zinc-100 font-medium"
                                  : ""
                                  }`}
                              >
                                {action}
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Internal Members */}
                  <div className="space-y-4">
                    <h4 className="text-[16px] font-normal leading-[24px]  text-[#314158]">
                      Internal Members
                    </h4>
                    <div className="space-y-3">
                      {internalMembers.map((member, index) => (
                        <div
                          key={index}
                          className="bg-zinc-100 rounded-[12px] p-3 flex items-center gap-4"
                        >
                          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                            <span className="text-[16px] font-normal leading-[24px] text-white tracking-[-0.3125px]">
                              {member.avatar}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[16px] font-normal leading-[24px] text-zinc-900 tracking-[-0.3125px] truncate">
                              {member.name}
                            </p>
                            <p className="text-[16px] font-normal leading-[24px] text-zinc-500 tracking-[-0.3125px] truncate">
                              {member.email}
                            </p>
                          </div>
                          <div className="relative">
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              className="bg-white border border-[#e4e4e7] rounded-[6px] px-3 py-2 h-[36px] w-[115px] flex items-center justify-between"
                            >
                              <span className="text-[14px] font-normal leading-[20px] text-zinc-900 tracking-[-0.1504px]">
                                {member.role}
                              </span>
                              <ChevronDown className="w-4 h-4 text-[#71717a]" />
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[rgba(15,23,42,0.06)]" />

                  {/* External Collaborators */}
                  <div className="space-y-4">
                    <h4 className="text-[16px] font-normal leading-[24px] text-[#314158] tracking-[-0.3125px] ">
                      External Collaborators
                    </h4>

                    <div className="space-y-3">
                      {externalCollaborators.map((member, index) => (
                        <div
                          key={index}
                          className="bg-zinc-100 rounded-[12px] p-3 flex items-center gap-4"
                        >
                          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                            <span className="text-[16px] font-normal leading-[24px] text-white tracking-[-0.3125px]">
                              {member.avatar}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[16px] font-normal leading-[24px] text-[#0f172b] tracking-[-0.3125px] truncate">
                              {member.name}
                            </p>
                            <p className="text-[16px] font-normal leading-[24px] text-zinc-500 tracking-[-0.3125px] truncate">
                              {member.email}
                            </p>
                            {member.expires && (
                              <p className="text-[14px] font-normal leading-[20px] text-zinc-500 tracking-[-0.1504px]">
                                Expires {member.expires}
                              </p>
                            )}
                          </div>
                          {member.status && (
                            <div className="flex justify-center items-center w-[60.375px] h-[22px] px-2 py-0.5 rounded-[12px] border border-[rgba(15,23,42,0.06)] ">
                              <span className="text-[12px] font-medium leading-[16px] text-[#0A0E1A]">
                                {member.status}
                              </span>
                            </div>
                          )}
                          <div className="relative">
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              className="bg-white border border-[#e4e4e7] rounded-[6px] px-3 py-2 h-[36px] w-[115px] flex items-center justify-between"
                            >
                              <span className="text-[14px] font-normal leading-[20px] text-zinc-900 tracking-[-0.1504px]">
                                {member.role}
                              </span>
                              <ChevronDown className="w-4 h-4 text-[#71717a]" />
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="flex items-center gap-2 h-[58px] pl-4 self-stretch rounded-[14px] border border-[#E2E8F0] bg-[#F1F5F9]">
                    <Shield className="w-5 h-5 text-zinc-900" />
                    <p
                      className="text-[16px] font-normal leading-[24px] text-[#0F172B] tracking-[-0.312px]"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontStyle: "normal",
                        fontWeight: 400,
                        letterSpacing: "-0.312px",
                      }}
                    >
                      Secure sharing with enterprise-grade encryption.
                    </p>
                  </div>
                </div>
              )}

              {/* Export Tab */}
              {primaryTab === "Export" && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="space-y-1">
                    <h3 className="text-[16px] font-medium leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                      Export Document
                    </h3>
                    <p className="text-[14px] font-normal leading-[20px] text-[#62748e] tracking-[-0.1504px]">
                      Download your document in your preferred format
                    </p>
                  </div>

                  {/* Format Selection */}
                  <div className="space-y-4">
                    <h4 className="text-[16px] font-medium leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                      Select format
                    </h4>
                    <div className="grid grid-cols-4 gap-3">
                      {formatOptions.map((format) => (
                        <motion.button
                          key={format.id}
                          onClick={() => setSelectedFormat(format.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`py-3 rounded-[12px] border-2 flex flex-col items-center gap-2 ${selectedFormat === format.id
                            ? "bg-zinc-900 border-[#0f172b] text-white"
                            : "bg-white border-gray-200 text-zinc-900"
                            }`}
                        >
                          <span
                            className="text-2xl"
                            style={{
                              color:
                                selectedFormat === format.id
                                  ? "#FFFFFF"
                                  : "#0F172B",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: format.icon.replace(
                                /stroke="#0F172B"/g,
                                `stroke="${selectedFormat === format.id
                                  ? "#FFFFFF"
                                  : "#0F172B"
                                }"`
                              ),
                            }}
                          />


                          <div className="text-center">
                            <p
                              className={`text-[12px] font-normal leading-[16px] ${selectedFormat === format.id
                                ? "text-white"
                                : "text-zinc-900"
                                }`}
                            >
                              {format.name}
                            </p>
                            <p
                              className={`text-[12px] font-normal leading-[16px] ${selectedFormat === format.id
                                ? "text-[#cad5e2]"
                                : "text-[#62748e]"
                                }`}
                            >
                              {format.description}
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    <h4 className="text-[16px] font-medium leading-[24px] text-[#0f172b] tracking-[-0.3125px]">
                      Options
                    </h4>
                    <div className="bg-zinc-100 rounded-[12px] p-4 space-y-3">
                      <ToggleCheckBoxTwo
                        checked={includeComments}
                        onChange={({ target }) => setIncludeComments(target.checked)}
                        label="Include comments and annotations"
                        labelPosition="right"
                      />
                      <ToggleCheckBoxTwo
                        checked={addWatermark}
                        onChange={({ target }) => setAddWatermark(target.checked)}
                        label="Add watermark (Draft)"
                        labelPosition="right"
                      />


                    </div>
                  </div>

                  {/* Note */}
                  <div className="bg-gray-200 rounded-[12px] p-4">
                    <p className="text-[14px] leading-[20px] text-zinc-900 tracking-[-0.1504px]">
                      <span className="font-bold">Note:</span> Exported files
                      are downloaded directly to your device. Use "Save to
                      Vault" to store documents in your workspace.
                    </p>
                  </div>
                </div>
              )}

              {/* Save & Organize Tab */}
              {primaryTab === "Save & Organize" && (
                <div className="space-y-6">
                  {/* Auto-saved Info */}
                  <div className="bg-gray-200 border border-slate-200 rounded-[14px] p-4 flex gap-3 items-start">
                    <Check className="w-5 h-5 text-zinc-900 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[14px] font-bold leading-[20px] text-zinc-900 tracking-[-0.1504px]">
                        Auto-saved:
                      </p>
                      <p className="text-[14px] font-normal leading-[20px] text-zinc-900 tracking-[-0.1504px]">
                        Documents are automatically saved. Use this to organize
                        into folders, collab spaces, or projects.
                      </p>
                    </div>
                  </div>

                  {/* Document Information */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-[16px] font-medium leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                        Document Information
                      </h3>
                      <p className="text-[14px] font-normal leading-[20px] text-zinc-500 tracking-[-0.1504px]">
                        Update title and add notes
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] font-medium leading-[20px] text-zinc-900">
                        Document title
                      </label>
                      <input
                        type="text"
                        value={documentTitle}
                        onChange={(e) => setDocumentTitle(e.target.value)}
                        className="w-full h-[36px] px-3 py-2 bg-white border border-[#e4e4e7] rounded-[6px] text-[16px] font-normal leading-[24px] text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#18181b]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] font-medium leading-[20px] text-zinc-900">
                        Notes (optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add internal notes about this document..."
                        rows={3}
                        className="w-full px-3 py-2 bg-white border border-[#e4e4e7] rounded-[6px] text-[16px] font-normal leading-[24px] text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#18181b] resize-none"
                      />
                    </div>
                  </div>

                  {/* Save Location */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-[16px] font-medium leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                        Save Location
                      </h3>
                      <p className="text-[14px] font-normal leading-[20px] text-zinc-500 tracking-[-0.1504px]">
                        Choose vault folder, collab space, or project
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[14px] font-medium leading-[20px] text-zinc-900">
                        Location
                      </label>
                      <div className="relative">
                        <motion.button
                          onClick={() => {
                            setShowLocationDropdown(!showLocationDropdown);
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full bg-white border border-[#e4e4e7] rounded-[6px] px-3 py-2 h-[36px] flex items-center justify-between"
                        >
                          <span className="text-[16px] font-normal leading-[24px] text-[#71717a]">
                            {saveLocation}
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#71717a]" />
                        </motion.button>
                        <AnimatePresence>
                          {showLocationDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e4e7] rounded-md shadow-lg z-20 overflow-hidden"
                            >
                              {locationOptions.map((location) => (
                                <motion.button
                                  key={location}
                                  onClick={() => {
                                    setSaveLocation(location);
                                    setShowLocationDropdown(false);
                                  }}
                                  whileHover={{ backgroundColor: "#f4f4f5" }}
                                  className="w-full px-3 py-2 text-left text-[14px] leading-[21px] text-[#18181b]"
                                >
                                  {location}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="bg-zinc-100 rounded-[6px] p-3 flex gap-2 items-center">
                        <span className="text-[14px] font-medium leading-[20px] text-zinc-900 tracking-[-0.1504px]">
                          Path:
                        </span>
                        <span className="text-[14px] font-normal leading-[20px] text-zinc-900 tracking-[-0.1504px]">
                          {saveLocation}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Version Control */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-[16px] font-medium leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                        Version Control
                      </h3>
                      <p className="text-[14px] font-normal leading-[20px] text-[#62748e] tracking-[-0.1504px]">
                        Choose how to handle existing files
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="versionControl"
                          value="new-version"
                          checked={versionControl === "new-version"}
                          onChange={(e) => setVersionControl(e.target.value)}
                          className="w-4 h-4"
                        />
                        <label className="text-[16px] font-normal leading-[24px] text-[#0a0e1a] tracking-[-0.3125px]">
                          Save as new version (v2.1)
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="versionControl"
                          value="replace"
                          checked={versionControl === "replace"}
                          onChange={(e) => setVersionControl(e.target.value)}
                          className="w-4 h-4"
                        />
                        <label className="text-[16px] font-normal leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                          Replace existing file
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Tags & Organization */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-[16px] font-medium leading-[24px] text-zinc-900 tracking-[-0.3125px]">
                        Tags & Organization
                      </h3>
                      <p className="text-[14px] font-normal leading-[20px] text-zinc-500 tracking-[-0.1504px]">
                        Add tags to help find this document
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleAddTag();
                          }
                        }}
                        placeholder="Add tag (e.g., Strategy, Q4)"
                        className="flex-1 h-[36px] px-3 bg-white border border-[#e4e4e7] rounded-[6px] text-[14px] font-normal leading-[normal] text-zinc-500 tracking-[-0.1504px] focus:outline-none focus:ring-2 focus:ring-[#18181b]"
                      />
                      <motion.button
                        onClick={handleAddTag}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#f8f9fb] border border-[rgba(15,23,42,0.06)] rounded-[12px] w-[42px] h-[36px] flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 text-zinc-900" />
                      </motion.button>
                    </div>

                    {/* Active Tags */}
                    {tags.length > 0 && (
                      <div className="bg-slate-50 rounded-[14px] p-3 flex flex-wrap gap-2 min-h-[46px]">
                        {tags.map((tag, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-zinc-900 rounded-[12px] px-2 py-1 flex items-center gap-1.5 h-[22px]"
                          >
                            <span className="text-[12px] font-medium leading-[16px] text-white">
                              #{tag}
                            </span>
                            <motion.button
                              onClick={() => handleRemoveTag(tag)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-4 h-4 flex items-center justify-center"
                            >
                              <X className="w-3 h-3 text-white" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Suggested Tags */}
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.map((tag, index) => (
                        <motion.button
                          key={index}
                          onClick={() => {
                            if (!tags.includes(tag)) {
                              setTags([...tags, tag]);
                            }
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="border border-[rgba(15,23,42,0.06)] rounded-[12px] px-2 py-1 h-[22px] flex items-center"
                        >
                          <span className="text-[12px] font-medium leading-[16px] text-[#0a0e1a]">
                            #{tag}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Manage Tab */}
              {primaryTab === "Manage" && (
                <div className="space-y-6">
                  {/* Info Banner */}
                  <div className="bg-blue-50 border border-blue-200 rounded-[14px] p-4 flex gap-3 items-start">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[14px] font-bold leading-[20px] text-blue-900 tracking-[-0.1504px]">
                        Document Management
                      </p>
                      <p className="text-[14px] font-normal leading-[20px] text-blue-700 tracking-[-0.1504px]">
                        Pin for quick access, archive to hide from main vault,
                        or permanently delete this document.
                      </p>
                    </div>
                  </div>

                  {/* Document Info */}
                  <div className="bg-gray-50 rounded-[12px] p-4">
                    <h4 className="text-[14px] font-semibold leading-[20px] text-zinc-900 mb-2">
                      {document?.title || "Untitled Document"}
                    </h4>
                    <p className="text-[13px] leading-[18px] text-zinc-600">
                      {document?.project || "Document"}
                    </p>
                  </div>

                  {/* Action Cards */}
                  <div className="space-y-3">
                    {/* Pin Document */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="bg-white border border-gray-200 rounded-[12px] p-4 cursor-pointer hover:border-blue-400 transition-all"
                      onClick={handleTogglePin}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${document?.isPinned ? "bg-blue-100" : "bg-gray-100"
                            }`}
                        >
                          <Pin
                            className={`w-5 h-5 ${document?.isPinned
                              ? "text-blue-600 fill-blue-600"
                              : "text-gray-600"
                              }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[16px] font-semibold leading-[24px] text-zinc-900 mb-1">
                            {document?.isPinned
                              ? "Unpin Document"
                              : "Pin Document"}
                          </h4>
                          <p className="text-[14px] leading-[20px] text-zinc-600">
                            {document?.isPinned
                              ? "Remove from pinned documents"
                              : "Pin to top of vault for quick access (max 10 pins)"}
                          </p>
                        </div>
                        {document?.isPinned && (
                          <div className="px-2 py-1 bg-blue-100 rounded-md">
                            <span className="text-[12px] font-medium text-blue-700">
                              Pinned
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Archive/Unarchive Document */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`bg-white border border-gray-200 rounded-[12px] p-4 cursor-pointer transition-all ${document?.isArchived
                        ? "hover:border-green-400"
                        : "hover:border-yellow-400"
                        }`}
                      onClick={handleArchive}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${document?.isArchived
                            ? "bg-green-100"
                            : "bg-yellow-100"
                            }`}
                        >
                          <Archive
                            className={`w-5 h-5 ${document?.isArchived
                              ? "text-green-600"
                              : "text-yellow-600"
                              }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[16px] font-semibold leading-[24px] text-zinc-900 mb-1">
                            {document?.isArchived
                              ? "Unarchive Document"
                              : "Archive Document"}
                          </h4>
                          <p className="text-[14px] leading-[20px] text-zinc-600">
                            {document?.isArchived
                              ? "Restore this document back to the main vault."
                              : "Hide from main vault but keep accessible in archived section. Can be restored anytime."}
                          </p>
                        </div>
                        {document?.isArchived && (
                          <div className="px-2 py-1 bg-yellow-100 rounded-md">
                            <span className="text-[12px] font-medium text-yellow-700">
                              Archived
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Delete Document */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`bg-white border rounded-[12px] p-4 cursor-pointer transition-all ${showDeleteConfirm
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-red-400"
                        }`}
                      onClick={handleDelete}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${showDeleteConfirm ? "bg-red-200" : "bg-red-100"
                            }`}
                        >
                          <Trash2
                            className={`w-5 h-5 ${showDeleteConfirm
                              ? "text-red-700"
                              : "text-red-600"
                              }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`text-[16px] font-semibold leading-[24px] mb-1 ${showDeleteConfirm
                              ? "text-red-700"
                              : "text-zinc-900"
                              }`}
                          >
                            {showDeleteConfirm
                              ? "Click Again to Confirm Delete"
                              : "Delete Document"}
                          </h4>
                          <p
                            className={`text-[14px] leading-[20px] ${showDeleteConfirm
                              ? "text-red-600 font-medium"
                              : "text-zinc-600"
                              }`}
                          >
                            {showDeleteConfirm
                              ? "This action cannot be undone! All data will be permanently deleted."
                              : "Permanently delete this document. This action cannot be undone."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Warning */}
                  {!showDeleteConfirm && (
                    <div className="bg-red-50 border border-red-200 rounded-[12px] p-4">
                      <p className="text-[13px] leading-[18px] text-red-700">
                        <span className="font-bold">Warning:</span> Deleting a
                        document is permanent and cannot be undone. Consider
                        archiving instead if you may need it later.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#e4e4e7] p-6 flex items-center justify-end gap-3">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border border-[#e4e4e7] rounded-[6px] h-[40px] px-4 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
              >
                Cancel
              </motion.button>
              {primaryTab !== "Manage" && (
                <motion.button
                  onClick={() => {
                    // Handle action based on current tab
                    onClose();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#18181b] text-white rounded-[6px] h-[40px] px-4 flex items-center gap-2 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity"
                >
                  {primaryTab === "Share" &&
                    shareSubTab === "Share Link" &&
                    "Share"}
                  {primaryTab === "Share" &&
                    shareSubTab === "Invite & Review" &&
                    "Send Invite"}
                  {primaryTab === "Share" &&
                    shareSubTab === "Manage Access" &&
                    "Save Changes"}
                  {primaryTab === "Export" && (
                    <>
                      <Download className="w-4 h-4" />
                      Export as {selectedFormat.toUpperCase()}
                    </>
                  )}
                  {primaryTab === "Save & Organize" && (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10.1333 2C10.485 2.00501 10.8205 2.14878 11.0667 2.4L13.6 4.93333C13.8512 5.17951 13.995 5.51497 14 5.86667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H10.1333Z" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M11.3327 13.9974V9.33073C11.3327 9.15392 11.2624 8.98435 11.1374 8.85932C11.0124 8.7343 10.8428 8.66406 10.666 8.66406H5.33268C5.15587 8.66406 4.9863 8.7343 4.86128 8.85932C4.73625 8.98435 4.66602 9.15392 4.66602 9.33073V13.9974" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4.66602 2V4.66667C4.66602 4.84348 4.73625 5.01305 4.86128 5.13807C4.9863 5.2631 5.15587 5.33333 5.33268 5.33333H9.99935" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      Save & Organize
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-[10000] flex items-center gap-3 bg-white rounded-lg shadow-[0px_4px_12px_rgba(0,0,0,0.15)] border border-gray-200 px-4 py-3 min-w-[320px]"
          >
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${toast.type === "success"
                ? "bg-green-500"
                : toast.type === "error"
                  ? "bg-red-500"
                  : "bg-blue-500"
                }`}
            />
            <p className="text-[14px] font-medium text-gray-900 flex-1">
              {toast.message}
            </p>
            <button
              onClick={() =>
                setToast({ show: false, message: "", type: "success" })
              }
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
