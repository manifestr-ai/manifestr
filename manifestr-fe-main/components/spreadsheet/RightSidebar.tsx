import { useState } from "react";
import dynamic from "next/dynamic";
import {
  MessageSquare,
  Share2,
  Sparkles,
  RotateCcw,
  Search,
  Plus,
  Minus,
  X,
  CheckSquare,
  Clock,
  AlertCircle,
  Hash,
  ChevronRight,
  MapPin,
  Calendar,
  User,
  MoreHorizontal,
  MessageCircle,
  ThumbsUp,
  Heart,
  Smile,
  ListFilter,
  ZoomIn,
  ZoomOut,
  ExternalLink,
} from "lucide-react";

const ShareModal = dynamic(() => import("../collaboration/ShareModal"), {
  ssr: false,
});

// --- Types ---

interface ThreadStat {
  label: string;
  count: number;
  icon: any;
}

interface ThreadItem {
  id: string;
  author: {
    name: string;
    avatar: string;
    online: boolean;
  };
  time: string;
  location: string[];
  due?: string;
  assigned: string[];
  content: string;
  reactions: {
    like: number;
    heart: number;
    emoji: number;
  };
}

// --- Mock Data ---

const MOCK_STATS = [
  {
    label: "TOTAL",
    count: 16,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <g clip-path="url(#clip0_9278_13162)">
    <path d="M11 8.5C11 8.76522 10.8946 9.01957 10.7071 9.20711C10.5196 9.39464 10.2652 9.5 10 9.5H3.414C3.14881 9.50006 2.89449 9.60545 2.707 9.793L1.606 10.894C1.55635 10.9436 1.4931 10.9774 1.42424 10.9911C1.35539 11.0048 1.28402 10.9978 1.21915 10.9709C1.15429 10.9441 1.09885 10.8986 1.05984 10.8402C1.02083 10.7818 1.00001 10.7132 1 10.643V2.5C1 2.23478 1.10536 1.98043 1.29289 1.79289C1.48043 1.60536 1.73478 1.5 2 1.5H10C10.2652 1.5 10.5196 1.60536 10.7071 1.79289C10.8946 1.98043 11 2.23478 11 2.5V8.5Z" stroke="#030213" stroke-opacity="0.7" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_9278_13162">
      <rect width="12" height="12" fill="white"/>
    </clipPath>
  </defs>
</svg>`,
    bg: "bg-[linear-gradient(135deg,_rgba(3,2,19,0.08)_0%,_rgba(3,2,19,0.05)_100%)]",
    border: "border-[#0302131A]",
    text: "text-slate-600",
  },
  {
    label: "DONE",
    count: 4,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <g clip-path="url(#clip0_9278_13171)">
    <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#00A63E" stroke-opacity="0.7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4.5 6L5.5 7L7.5 5" stroke="#00A63E" stroke-opacity="0.7" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_9278_13171">
      <rect width="12" height="12" fill="white"/>
    </clipPath>
  </defs>
</svg>`,
    bg: "bg-[linear-gradient(135deg,_rgba(0,201,80,0.08)_0%,_rgba(0,201,80,0.05)_100%)]",
    border: "border-[#00C95026]",
    text: "text-emerald-600",
  },
  {
    label: "OPEN",
    count: 6,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <g clip-path="url(#clip0_9278_13181)">
    <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#F54900" stroke-opacity="0.7" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_9278_13181">
      <rect width="12" height="12" fill="white"/>
    </clipPath>
  </defs>
</svg>`,
    bg: "bg-[linear-gradient(135deg,_rgba(255,105,0,0.08)_0%,_rgba(255,105,0,0.05)_100%)]",
    border: "border-[#FF690026]",
    text: "text-orange-600",
  },
  {
    label: "ALERT",
    count: 0,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <g clip-path="url(#clip0_9278_13190)">
    <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" fill="#E7000B" fill-opacity="0.4" stroke="#E7000B" stroke-opacity="0.7" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_9278_13190">
      <rect width="12" height="12" fill="white"/>
    </clipPath>
  </defs>
</svg>`,
    bg: "bg-[linear-gradient(135deg,_rgba(251,44,54,0.08)_0%,_rgba(251,44,54,0.05)_100%)]",
    border: "border-[rgba(251,44,54,0.15)]",
    text: "text-rose-600",
  },
];

const MOCK_THREADS: ThreadItem[] = [
  {
    id: "1",
    author: {
      name: "Zaibi Ali",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      online: true,
    },
    time: "5m",
    location: ["Product Page", "Gallery", "Primary Image"],
    due: "Due: Jul 17",
    assigned: ["Sarah", "Mike"],
    content:
      "The heading looks way too small for this design. Consider increasing it for better visual hierarchy. what do you think?",
    reactions: { like: 5, heart: 2, emoji: 1 },
  },
  {
    id: "2",
    author: {
      name: "Alex Martinez",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      online: true,
    },
    time: "18m",
    location: ["Landing", "Above Fold", "Call to Action"],
    assigned: ["Lawn"],
    content:
      "The color contrast here isn't meeting WCAG AA standards. We should increase the contrast ratio.",
    reactions: { like: 4, heart: 1, emoji: 0 },
  },
];

const Sidebar = ({
  onToggle,
  isOpen,
  onShare,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: {
  onToggle: () => void;
  isOpen: boolean;
  onShare?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
}) => (
  <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40">
    <div className="bg-[#3A3A3A] rounded-[16px] w-[50px] py-4 flex flex-col items-center gap-3 border border-[rgba(0,0,0,0.30)] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)]">
      <button
        type="button"
        onClick={onToggle}
        className="relative flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-all active:scale-90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path
            d="M9.66178 5.13266H4.22449M13.2867 8.75754H4.22449M16.9116 11.4762C16.9116 11.9569 16.7206 12.4179 16.3807 12.7578C16.0408 13.0977 15.5798 13.2887 15.0991 13.2887H4.22449L0.599609 16.9135V2.41401C0.599609 1.93332 0.790566 1.47231 1.13046 1.13241C1.47036 0.792519 1.93136 0.601562 2.41205 0.601562H15.0991C15.5798 0.601562 16.0408 0.792519 16.3807 1.13241C16.7206 1.47231 16.9116 1.93332 16.9116 2.41401V11.4762Z"
            stroke="#99A1AF"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span className="absolute top-1 right-1 bg-[#EB4D4B] text-white text-[9px] w-[15px] h-[15px] rounded-full flex items-center justify-center font-bold border-[2px] border-[#2D2D2D]">
          1
        </span>
      </button>

      <div
        className="w-8 h-px  mx-auto"
        style={{ background: "rgba(74, 85, 101, 0.50)" }}
      />

      <button
        type="button"
        onClick={onShare}
        className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-all active:scale-90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
        >
          <path
            d="M23.4229 7.9541C24.4238 7.9541 25.3283 8.36727 25.9834 9.0332C26.6384 9.69913 27.0448 10.618 27.0449 11.6348C27.0449 12.6516 26.6385 13.5713 25.9834 14.2373C25.3283 14.9031 24.4237 15.3164 23.4229 15.3164C22.422 15.3163 21.5174 14.9032 20.8623 14.2373C20.7595 14.1328 20.6625 14.0184 20.5723 13.9004L14.9785 16.2666C15.1156 16.652 15.1924 17.0695 15.1924 17.502C15.1924 17.7668 15.1639 18.0221 15.1133 18.2725L20.71 20.9395C20.759 20.882 20.8118 20.8239 20.8682 20.7666C21.5232 20.1009 22.4271 19.6876 23.4277 19.6875C24.4285 19.6875 25.3332 20.1008 25.9883 20.7666C26.6434 21.4326 27.0498 22.3523 27.0498 23.3691C27.0497 24.3859 26.6433 25.3048 25.9883 25.9707C25.3332 26.6366 24.4286 27.0498 23.4277 27.0498C22.427 27.0497 21.5232 26.6365 20.8682 25.9707C20.2131 25.3048 19.8067 24.3859 19.8066 23.3691C19.8066 22.8093 19.9305 22.2732 20.1553 21.7988L14.7715 19.2324C14.6021 19.5559 14.3888 19.8522 14.1357 20.1045L14.1348 20.1035C13.4798 20.7691 12.5767 21.1835 11.5762 21.1836C10.5752 21.1836 9.67074 20.7695 9.01562 20.1035C8.36052 19.4375 7.9541 18.5188 7.9541 17.502C7.95411 16.4851 8.36053 15.5664 9.01562 14.9004C9.67074 14.2344 10.5752 13.8213 11.5762 13.8213C12.573 13.8242 13.4732 14.2367 14.126 14.9004C14.2636 15.0403 14.3911 15.1947 14.5068 15.3574L20.0625 13.0078C19.8919 12.5814 19.8018 12.1175 19.8018 11.6348C19.8018 10.6181 20.2074 9.69912 20.8623 9.0332C21.5174 8.36727 22.422 7.95419 23.4229 7.9541ZM23.418 20.7041C22.6958 20.7042 22.0423 21.0045 21.5703 21.4844C21.0983 21.9643 20.8027 22.6293 20.8027 23.3643C20.8029 24.099 21.0985 24.7634 21.5703 25.2432C22.0423 25.723 22.6958 26.0234 23.418 26.0234C24.1402 26.0234 24.7936 25.7231 25.2656 25.2432C25.7376 24.7634 26.0331 24.0991 26.0332 23.3643C26.0332 22.6292 25.7377 21.9643 25.2656 21.4844C24.7936 21.0045 24.1402 20.7041 23.418 20.7041ZM11.5654 14.8379C10.8433 14.838 10.1898 15.1373 9.71777 15.6172C9.24574 16.0971 8.9502 16.7621 8.9502 17.4971C8.95025 18.232 9.24575 18.8971 9.71777 19.377C10.1898 19.8567 10.8433 20.1562 11.5654 20.1562C12.2877 20.1562 12.942 19.8569 13.4141 19.377C13.886 18.8971 14.1806 18.232 14.1807 17.4971C14.1807 16.7622 13.8859 16.0971 13.4141 15.6172C12.942 15.1373 12.2877 14.8379 11.5654 14.8379ZM23.418 8.97559C22.6959 8.97564 22.0423 9.27516 21.5703 9.75488C21.0983 10.2347 20.8028 10.8999 20.8027 11.6348C20.8027 12.3698 21.0983 13.0347 21.5703 13.5146C22.0423 13.9945 22.6958 14.2949 23.418 14.2949C24.1402 14.2949 24.7936 13.9945 25.2656 13.5146C25.7377 13.0347 26.0332 12.3698 26.0332 11.6348C26.0331 10.8999 25.7376 10.2347 25.2656 9.75488C24.7936 9.27522 24.14 8.97559 23.418 8.97559Z"
            fill="#99A1AF"
            stroke="#99A1AF"
            stroke-width="0.1"
          />
        </svg>
      </button>

      {/* <button className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-all active:scale-90">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="23"
          viewBox="0 0 20 23"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.2418 3.39844L9.35579 9.12016L14.658 10.3702L9.94991 13.2794L10.4836 19.096L6.45941 15.173L1.48877 17.5186L3.70984 12.1838L0.1019 7.81622L5.49914 8.44308L8.2418 3.39844ZM11.266 17.7214L15.8705 22.766C15.981 22.8869 16.1641 22.8869 16.2763 22.7679L18.0656 20.8575C18.1779 20.7385 18.1779 20.5413 18.0674 20.4204L11.7737 13.5472C11.6632 13.4263 11.3713 13.3761 11.3679 13.5454L11.266 17.7214ZM13.9845 19.5852L16.0846 21.8973C16.1485 21.968 16.2556 21.968 16.3212 21.8973L17.3644 20.785C17.4301 20.7143 17.4301 20.6008 17.3644 20.5301L15.2159 18.1808L13.9845 19.5852ZM2.78756 6.15141H2.69948C2.69948 5.37388 2.43005 4.69494 1.89119 4.11458C1.3506 3.53609 0.720207 3.24591 0 3.24591V3.15104C0.720207 3.15104 1.3506 2.86086 1.88946 2.28051C2.42832 1.69829 2.69775 1.01935 2.69775 0.245536H2.78584C2.78584 1.02121 3.05527 1.70015 3.59413 2.28051C4.13299 2.86086 4.76338 3.15104 5.48359 3.15104V3.24591C4.76338 3.24591 4.13299 3.53609 3.59413 4.11644C3.05699 4.6968 2.78756 5.37388 2.78756 6.15141ZM15.8446 9.09784H15.7081C15.7081 7.90179 15.2936 6.8564 14.4629 5.96354C13.6321 5.07069 12.6632 4.62426 11.5527 4.62426V4.47731C12.6632 4.47731 13.6339 4.03088 14.4629 3.1343C15.2936 2.23586 15.7081 1.19234 15.7081 0H15.8446C15.8446 1.19606 16.2591 2.24144 17.0898 3.1343C17.9206 4.02716 18.8895 4.47545 20 4.47545V4.6224C18.8895 4.6224 17.9206 5.06882 17.0898 5.96168C16.2591 6.8564 15.8446 7.90179 15.8446 9.09784Z"
            fill="#99A1AF"
          />
        </svg>
      </button> */}

      <button
        type="button"
        onClick={onZoomReset}
        className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-all active:scale-90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="20"
          viewBox="0 0 19 20"
          fill="none"
        >
          <path
            d="M5.94411 18.1137C1.57016 16.3466 -0.54334 11.3683 1.22374 6.99435C2.23591 4.48919 4.30152 2.72541 6.70364 2.00781"
            stroke="#99A1AF"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M3.98828 19.2365L6.37257 18.3687L5.50472 15.9844"
            stroke="#99A1AF"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10.7637 1.72656C15.3658 2.7635 18.2557 7.3346 17.2191 11.9364C16.6253 14.5723 14.8718 16.6465 12.6173 17.7432"
            stroke="#99A1AF"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12.851 0.601562L10.4258 1.34723L11.1711 3.77247"
            stroke="#99A1AF"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8.88195 13.7912C10.9396 13.7912 12.6076 12.1232 12.6076 10.0655C12.6076 8.0079 10.9396 6.33984 8.88195 6.33984C6.8243 6.33984 5.15625 8.0079 5.15625 10.0655C5.15625 12.1232 6.8243 13.7912 8.88195 13.7912Z"
            stroke="#99A1AF"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9.3369 18.1116L9.06445 13.9883"
            stroke="#99A1AF"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <div
        className="w-8 h-px  mx-auto"
        style={{ background: "rgba(74, 85, 101, 0.50)" }}
      />

      <button
        type="button"
        onClick={onZoomIn}
        className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-all active:scale-90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
        >
          <path
            d="M18.7472 18.7492L14.8637 14.8657M9.8198 7.14346V12.5M7.14151 9.82175H12.4981M16.9618 9.82175C16.9618 13.7662 13.7642 16.9637 9.8198 16.9637C5.87533 16.9637 2.67773 13.7662 2.67773 9.82175C2.67773 5.87728 5.87533 2.67969 9.8198 2.67969C13.7642 2.67969 16.9618 5.87728 16.9618 9.82175Z"
            stroke="#99A1AF"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={onZoomOut}
        className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-all active:scale-90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
        >
          <path
            d="M18.7472 18.7492L14.8637 14.8657M7.14151 9.82175H12.4981M16.9618 9.82175C16.9618 13.7662 13.7642 16.9637 9.8198 16.9637C5.87533 16.9637 2.67773 13.7662 2.67773 9.82175C2.67773 5.87728 5.87533 2.67969 9.8198 2.67969C13.7642 2.67969 16.9618 5.87728 16.9618 9.82175Z"
            stroke="#99A1AF"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
);

const ThreadsPopup = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => (
  <div>
    {isOpen && (
      <div className="fixed right-[96px] top-[80px] w-[420px] h-[780px] flex flex-col rounded-[10px] border border-[#E5E7EB] bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08),0_4px_6px_-4px_rgba(0,0,0,0.08)] z-50 overflow-hidden">
        {/* HEADER */}
        <div className="px-6 pt-6 pb-4 flex items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {/* ICON */}
              <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                <path
                  d="M5.10926 5.84627L7.12055 5.82086C7.21758 5.81951 7.30793 5.84593 7.38457 5.89199C7.80117 6.12435 8.19457 6.38889 8.56055 6.6873C8.76656 6.85564 8.9659 7.0355 9.15785 7.22789C9.84937 6.19277 10.671 5.14207 11.5316 4.15302C12.6531 2.86453 13.8488 1.6736 14.9143 0.753308C15.0075 0.673032 15.1242 0.63374 15.2399 0.63374L16.7945 0.631369C17.0652 0.631369 17.2849 0.843068 17.2849 1.10388C17.2849 1.23463 17.2301 1.3525 17.1411 1.43819C15.7145 2.96649 14.2513 4.7163 12.9252 6.50947C11.6975 8.16987 10.5855 9.86854 9.72844 11.4636C9.60469 11.6949 9.30937 11.7857 9.06926 11.6664C8.97275 11.6187 8.89563 11.5412 8.85023 11.4463C8.38055 10.4786 7.82086 9.59011 7.15465 8.79751C6.48914 8.00593 5.71324 7.3041 4.81008 6.70695C4.58684 6.56028 4.52953 6.26661 4.68176 6.05153C4.7809 5.9113 4.94508 5.83915 5.10926 5.84627Z"
                  fill="black"
                />
              </svg>

              <span className="text-[#0A0A0A] font-inter text-[16px] font-medium leading-6 tracking-[-0.312px] not-italic">
                Threads
              </span>
            </div>

            <p className="text-[12px] text-[#717182] font-inter not-italic font-normal leading-4">
              Design feedback & comments
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 opacity-60 hover:opacity-100"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* STATS */}
        <div className="px-6 py-3 grid grid-cols-4 gap-2">
          {MOCK_STATS.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-[12px] px-3 py-2.5 border  ${stat.bg} ${stat.border}`}
            >
              <div className="text-[9px] font-normal leading-[13.5px] tracking-[0.617px] uppercase text-[rgba(113,113,130,0.80)] font-inter not-italic">
                <span
                  className="inline-block align-middle"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: stat.icon }}
                />{" "}
                {stat.label}
              </div>
              <div
                style={{
                  color: "#0A0A0A",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "20px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "28px",
                  letterSpacing: "-0.449px",
                }}
              >
                {stat.count}
              </div>
            </div>
          ))}
        </div>

        <div className="h-px bg-[#F3F4F6] mx-6" />

        {/* TABS + FILTER */}
        <div className="px-6 py-4 space-y-3">
          {/* TABS */}
          <div className="flex p-1   rounded-full w-full">
            <button
              className="flex-1 py-2 px-4 text-[13px] leading-none bg-black text-white rounded-full transition-colors duration-150 font-normal"
              style={{ boxShadow: "0px 1.5px 4px 0px rgba(0,0,0,0.01)" }}
            >
              My Threads
            </button>
            <button
              className="flex-1 py-2 px-4 text-[13px] leading-none bg-white text-black rounded-full border border-[#F1F5F9] ml-2 font-normal"
              style={{ boxShadow: "0px 1.5px 4px 0px rgba(0,0,0,0.01)" }}
            >
              All Project
            </button>
          </div>

          {/* FILTERS */}
          <div className="flex gap-2 flex-wrap justify-center items-center">
            {["Status", "Priority", "Due", "Assignee"].map((f) => (
              <button
                key={f}
                className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg flex items-center justify-center"
                style={{
                  color: "#0A0A0A",
                  fontFamily: "Arial",
                  fontSize: "12px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "16px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="mr-2"
                >
                  <path
                    d="M4.99982 10C4.99978 10.0929 5.02562 10.184 5.07446 10.2631C5.1233 10.3421 5.1932 10.406 5.27632 10.4475L6.27632 10.9475C6.35257 10.9856 6.43729 11.0036 6.52244 10.9997C6.60759 10.9959 6.69034 10.9703 6.76284 10.9255C6.83533 10.8806 6.89515 10.818 6.93663 10.7435C6.97811 10.6691 6.99986 10.5852 6.99982 10.5V7C6.99993 6.75219 7.09205 6.51325 7.25832 6.3295L10.8698 2.335C10.9345 2.26328 10.9771 2.17434 10.9924 2.07894C11.0076 1.98354 10.9949 1.88577 10.9558 1.79744C10.9166 1.70911 10.8527 1.63401 10.7718 1.58123C10.6909 1.52844 10.5964 1.50023 10.4998 1.5H1.49982C1.40312 1.50003 1.30851 1.52811 1.22744 1.58082C1.14638 1.63353 1.08233 1.70861 1.04307 1.79698C1.00381 1.88535 0.991013 1.9832 1.00623 2.0787C1.02145 2.17419 1.06403 2.26322 1.12882 2.335L4.74132 6.3295C4.90759 6.51325 4.99971 6.75219 4.99982 7V10Z"
                    stroke="#0A0A0A"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-[#F3F4F6] mx-6" />

        {/* SEARCH */}
        <div className="px-6 py-4">
          <div
            className="relative"
            style={{
              width: "366px",
              height: "36px",
            }}
          >
            <Search
              size={18}
              className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#979CAD]"
              strokeWidth={2}
            />
            <input
              placeholder="Search threads..."
              className="w-full text-[16px] leading-[22px] font-normal text-[#757B8A]  rounded-[12px] border border-[#EFF1F4] focus:border-[#C9CEDA] outline-none transition-[border-color] placeholder-[#979CAD]"
              style={{
                boxShadow:
                  "0px 0.5px 2.5px 0px rgba(16, 24, 40, 0.03), 0px 0.5px 1.5px 0px rgba(16, 24, 40, 0.01)",
                width: "366px",
                height: "36px",
                padding: "4px 40px 4px 36px",
              }}
            />

            <svg
              className="absolute right-[12px] top-1/2 -translate-y-1/2 "
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M6.66667 3.33594H2"
                stroke="#0A0A0A"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 12.6641H2"
                stroke="#0A0A0A"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.33301 2V4.66667"
                stroke="#0A0A0A"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.667 11.3359V14.0026"
                stroke="#0A0A0A"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14 8H8"
                stroke="#0A0A0A"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.0003 12.6641H10.667"
                stroke="#0A0A0A"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.9997 3.33594H9.33301"
                stroke="#0A0A0A"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.33301 6.66406V9.33073"
                stroke="#0A0A0A"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.33333 8H2"
                stroke="#0A0A0A"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* THREAD LIST */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {MOCK_THREADS.map((thread) => (
            <div key={thread.id}>
              <div className="flex gap-3">
                {/* AVATAR */}
                <div className="relative">
                  <img
                    src={thread.author.avatar}
                    className="w-[44px] h-[44px] rounded-xl object-cover"
                  />
                  {thread.author.online && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  {/* NAME */}
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold">
                        {thread.author.name}
                      </span>
                      <span className="text-[12px] text-[#9CA3AF]">
                        {thread.time}
                      </span>
                    </div>

                    <ExternalLink size={16} className="text-gray-400" />
                  </div>

                  {/* LOCATION */}
                  <div className="text-[11px] text-[#9CA3AF] mt-1">
                    {thread.location.join(" → ")}
                  </div>

                  {/* ASSIGNED */}
                  <div className="flex gap-2 mt-2 flex-wrap text-[11px] text-gray-500">
                    <span>Assigned to</span>
                    {thread.assigned.map((a, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-100 rounded-md"
                      >
                        {a}
                      </span>
                    ))}
                  </div>

                  {/* MESSAGE */}
                  <p className="text-[13px] text-[#4B5563] mt-2 leading-[20px]">
                    {thread.content}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex gap-4 text-[12px] text-gray-500">
                      <button className="flex items-center gap-1">
                        Reply{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M11 8.5C11 8.76522 10.8946 9.01957 10.7071 9.20711C10.5196 9.39464 10.2652 9.5 10 9.5H3.414C3.14881 9.50006 2.89449 9.60545 2.707 9.793L1.606 10.894C1.55635 10.9436 1.4931 10.9774 1.42424 10.9911C1.35539 11.0048 1.28402 10.9978 1.21915 10.9709C1.15429 10.9441 1.09885 10.8986 1.05984 10.8402C1.02083 10.7818 1.00001 10.7132 1 10.643V2.5C1 2.23478 1.10536 1.98043 1.29289 1.79289C1.48043 1.60536 1.73478 1.5 2 1.5H10C10.2652 1.5 10.5196 1.60536 10.7071 1.79289C10.8946 1.98043 11 2.23478 11 2.5V8.5Z"
                            stroke="#6A7282"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        style={{
                          color: "#155DFC",
                          fontFamily: "Inter",
                          fontSize: "12px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "16px",
                        }}
                      >
                        More Details
                      </button>
                    </div>

                    {/* REACTIONS */}
                    <div className="flex gap-2">
                      <button className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[12px]  flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_9278_13273)">
                            <path
                              d="M3.5 5V11"
                              stroke="#155DFC"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M7.5 2.94L7 5H9.915C10.0702 5 10.2234 5.03614 10.3622 5.10557C10.5011 5.175 10.6219 5.2758 10.715 5.4C10.8081 5.5242 10.8711 5.66837 10.8989 5.82111C10.9266 5.97386 10.9185 6.13096 10.875 6.28L9.71 10.28C9.64942 10.4877 9.5231 10.6702 9.35 10.8C9.1769 10.9298 8.96637 11 8.75 11H2C1.73478 11 1.48043 10.8946 1.29289 10.7071C1.10536 10.5196 1 10.2652 1 10V6C1 5.73478 1.10536 5.48043 1.29289 5.29289C1.48043 5.10536 1.73478 5 2 5H3.38C3.56604 4.9999 3.74837 4.94791 3.90648 4.84986C4.06459 4.75181 4.19221 4.61161 4.275 4.445L6 1C6.23579 1.00292 6.46787 1.05908 6.6789 1.1643C6.88994 1.26951 7.07446 1.42105 7.2187 1.6076C7.36294 1.79415 7.46316 2.01088 7.51187 2.2416C7.56058 2.47232 7.55652 2.71107 7.5 2.94Z"
                              stroke="#155DFC"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_9278_13273">
                              <rect width="12" height="12" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        <span>{thread.reactions.like}</span>
                      </button>
                      <button className="px-2  bg-rose-50 text-rose-600 rounded-lg text-[12px]  flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_9278_13279)">
                            <path
                              d="M1 4.75026C1.00001 4.19386 1.1688 3.65056 1.48407 3.1921C1.79934 2.73364 2.24626 2.38159 2.7658 2.18246C3.28535 1.98333 3.85308 1.94649 4.39401 2.07679C4.93493 2.20709 5.42361 2.4984 5.7955 2.91226C5.82169 2.94027 5.85336 2.9626 5.88854 2.97786C5.92372 2.99313 5.96165 3.00101 6 3.00101C6.03835 3.00101 6.07628 2.99313 6.11146 2.97786C6.14664 2.9626 6.17831 2.94027 6.2045 2.91226C6.57522 2.49571 7.06401 2.20195 7.60582 2.07006C8.14762 1.93818 8.71675 1.97444 9.23744 2.17401C9.75813 2.37357 10.2057 2.72699 10.5206 3.18722C10.8354 3.64744 11.0027 4.19264 11 4.75026C11 5.89526 10.25 6.75026 9.5 7.50026L6.754 10.1568C6.66083 10.2638 6.54596 10.3497 6.41702 10.4089C6.28808 10.4681 6.14802 10.4992 6.00614 10.5001C5.86427 10.501 5.72382 10.4717 5.59414 10.4141C5.46446 10.3566 5.34851 10.2721 5.254 10.1663L2.5 7.50026C1.75 6.75026 1 5.90026 1 4.75026Z"
                              fill="#E7000B"
                              stroke="#E7000B"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_9278_13279">
                              <rect width="12" height="12" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        <span>{thread.reactions.heart}</span>
                      </button>
                      <button className="px-2 bg-amber-50 text-amber-600 rounded-lg text-[12px] flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_9278_13284)">
                            <path
                              d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
                              stroke="#D08700"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4 7C4 7 4.75 8 6 8C7.25 8 8 7 8 7"
                              stroke="#D08700"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4.5 4.5H4.505"
                              stroke="#D08700"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7.5 4.5H7.505"
                              stroke="#D08700"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_9278_13284">
                              <rect width="12" height="12" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        <span>{thread.reactions.emoji}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#F3F4F6] mt-6" />
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// --- Main Unified Component ---

export const RightSidebar = ({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  documentId,
  documentTitle = "Untitled document",
}: {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  documentId?: string;
  documentTitle?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShare = () => {
    if (!documentId) return;
    setIsShareModalOpen(true);
  };

  const handleZoomIn = () => {
    onZoomIn?.();
  };

  const handleZoomOut = () => {
    onZoomOut?.();
  };

  const handleZoomReset = () => {
    onZoomReset?.();
  };

  return (
    <>
      <Sidebar
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        onShare={handleShare}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
      />
      <ThreadsPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
      {documentId && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          documentId={documentId}
          documentTitle={documentTitle}
        />
      )}
    </>
  );
};
