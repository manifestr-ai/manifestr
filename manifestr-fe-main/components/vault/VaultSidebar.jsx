import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Star,
  Sparkles,
  Share2,
  Archive,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { useSidebar } from "../../contexts/SidebarContext";

export default function VaultSidebar() {
  const router = useRouter();
  const currentPath = router.pathname;
  // const collabsHref = currentPath.startsWith('/collab-hub') ? '/collab-hub' : '/vault/collabs'
  const { openSidebar } = useSidebar();

  const sidebarItems = [
    {
      id: "the-vault",
      label: "the vault",
      icon: null,
      hasDropdown: true,
      badge: null,
      href: "/vault",
    },
    {
      id: "recents",
      label: "Recents",
      icon: FileText,
      hasDropdown: false,
      badge: null,
      href: "/vault/recents",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M12.5007 1.66406H5.00065C4.55862 1.66406 4.1347 1.83966 3.82214 2.15222C3.50958 2.46478 3.33398 2.8887 3.33398 3.33073V16.6641C3.33398 17.1061 3.50958 17.53 3.82214 17.8426C4.1347 18.1551 4.55862 18.3307 5.00065 18.3307H15.0007C15.4427 18.3307 15.8666 18.1551 16.1792 17.8426C16.4917 17.53 16.6673 17.1061 16.6673 16.6641V5.83073L12.5007 1.66406Z" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11.666 1.66406V4.9974C11.666 5.43942 11.8416 5.86335 12.1542 6.17591C12.4667 6.48847 12.8907 6.66406 13.3327 6.66406H16.666" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8.33268 7.5H6.66602" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M13.3327 10.8359H6.66602" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M13.3327 14.1641H6.66602" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    },
    {
      id: "pinned",
      label: "Pinned",
      icon: Star,
      hasDropdown: false,
      badge: null,
      href: "/vault/pinned",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M9.60502 1.90981C9.64153 1.83602 9.69795 1.77392 9.76789 1.73049C9.83784 1.68707 9.91852 1.66406 10.0008 1.66406C10.0832 1.66406 10.1639 1.68707 10.2338 1.73049C10.3037 1.77392 10.3602 1.83602 10.3967 1.90981L12.3217 5.80897C12.4485 6.06561 12.6357 6.28765 12.8672 6.45602C13.0987 6.62439 13.3676 6.73407 13.6508 6.77564L17.9558 7.40564C18.0374 7.41746 18.1141 7.45187 18.1771 7.50497C18.2401 7.55808 18.287 7.62776 18.3125 7.70615C18.338 7.78453 18.3411 7.86848 18.3213 7.9485C18.3016 8.02853 18.2599 8.10143 18.2009 8.15897L15.0875 11.1906C14.8822 11.3907 14.7286 11.6377 14.6399 11.9103C14.5512 12.183 14.5301 12.473 14.5783 12.7556L15.3134 17.039C15.3277 17.1205 15.3189 17.2044 15.2879 17.2812C15.2569 17.358 15.205 17.4245 15.138 17.4731C15.071 17.5218 14.9917 17.5506 14.9091 17.5564C14.8265 17.5621 14.7439 17.5445 14.6708 17.5056L10.8225 15.4823C10.5689 15.3492 10.2868 15.2796 10.0004 15.2796C9.71403 15.2796 9.43192 15.3492 9.17835 15.4823L5.33085 17.5056C5.25779 17.5443 5.17535 17.5617 5.09289 17.5559C5.01044 17.55 4.93128 17.5211 4.86443 17.4725C4.79758 17.4239 4.74571 17.3575 4.71473 17.2808C4.68375 17.2042 4.6749 17.1204 4.68918 17.039L5.42335 12.7565C5.47185 12.4737 5.45084 12.1835 5.36213 11.9107C5.27343 11.6379 5.11969 11.3908 4.91418 11.1906L1.80085 8.15981C1.74134 8.10233 1.69918 8.0293 1.67915 7.94904C1.65913 7.86877 1.66205 7.78449 1.68758 7.7058C1.71312 7.62711 1.76024 7.55717 1.82358 7.50396C1.88692 7.45074 1.96393 7.41639 2.04585 7.40481L6.35002 6.77564C6.63356 6.73439 6.90284 6.62485 7.13467 6.45646C7.3665 6.28807 7.55394 6.06587 7.68085 5.80897L9.60502 1.90981Z" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    },
    {
      id: "prompts",
      label: "Prompts in progress",
      icon: Sparkles,
      hasDropdown: false,
      badge: "31",
      href: "/vault/prompts",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_12925_20072)">
    <path d="M7.34496 1.87239C7.37353 1.71946 7.45468 1.58133 7.57436 1.48193C7.69404 1.38254 7.84472 1.32812 8.00029 1.32812C8.15587 1.32812 8.30655 1.38254 8.42623 1.48193C8.54591 1.58133 8.62706 1.71946 8.65563 1.87239L9.35629 5.57772C9.40606 5.84115 9.53408 6.08347 9.72365 6.27304C9.91322 6.4626 10.1555 6.59062 10.419 6.64039L14.1243 7.34106C14.2772 7.36962 14.4154 7.45077 14.5147 7.57045C14.6141 7.69014 14.6686 7.84081 14.6686 7.99639C14.6686 8.15196 14.6141 8.30264 14.5147 8.42232C14.4154 8.54201 14.2772 8.62316 14.1243 8.65172L10.419 9.35239C10.1555 9.40215 9.91322 9.53017 9.72365 9.71974C9.53408 9.90931 9.40606 10.1516 9.35629 10.4151L8.65563 14.1204C8.62706 14.2733 8.54591 14.4114 8.42623 14.5108C8.30655 14.6102 8.15587 14.6647 8.00029 14.6647C7.84472 14.6647 7.69404 14.6102 7.57436 14.5108C7.45468 14.4114 7.37353 14.2733 7.34496 14.1204L6.64429 10.4151C6.59453 10.1516 6.46651 9.90931 6.27694 9.71974C6.08737 9.53017 5.84506 9.40215 5.58163 9.35239L1.87629 8.65172C1.72336 8.62316 1.58524 8.54201 1.48584 8.42232C1.38644 8.30264 1.33203 8.15196 1.33203 7.99639C1.33203 7.84081 1.38644 7.69014 1.48584 7.57045C1.58524 7.45077 1.72336 7.36962 1.87629 7.34106L5.58163 6.64039C5.84506 6.59062 6.08737 6.4626 6.27694 6.27304C6.46651 6.08347 6.59453 5.84115 6.64429 5.57772L7.34496 1.87239Z" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13.334 1.33594V4.0026" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14.6667 2.66406H12" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2.66732 14.6667C3.4037 14.6667 4.00065 14.0697 4.00065 13.3333C4.00065 12.597 3.4037 12 2.66732 12C1.93094 12 1.33398 12.597 1.33398 13.3333C1.33398 14.0697 1.93094 14.6667 2.66732 14.6667Z" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_12925_20072">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>`,
    },
    {
      id: "collabs",
      label: "Collabs",
      icon: Share2,
      hasDropdown: false,
      badge: null,
      href: "/vault/collabs",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M12 5.33594C13.1046 5.33594 14 4.44051 14 3.33594C14 2.23137 13.1046 1.33594 12 1.33594C10.8954 1.33594 10 2.23137 10 3.33594C10 4.44051 10.8954 5.33594 12 5.33594Z" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4 10C5.10457 10 6 9.10457 6 8C6 6.89543 5.10457 6 4 6C2.89543 6 2 6.89543 2 8C2 9.10457 2.89543 10 4 10Z" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 14.6641C13.1046 14.6641 14 13.7686 14 12.6641C14 11.5595 13.1046 10.6641 12 10.6641C10.8954 10.6641 10 11.5595 10 12.6641C10 13.7686 10.8954 14.6641 12 14.6641Z" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5.72656 9.00781L10.2799 11.6611" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10.2732 4.34375L5.72656 6.99708" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    },
    {
      id: "archived",
      label: "Archived / Completed",
      icon: Archive,
      hasDropdown: false,
      badge: null,
      href: "/vault/archived",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M17.4993 2.5H2.49935C2.03911 2.5 1.66602 2.8731 1.66602 3.33333V5.83333C1.66602 6.29357 2.03911 6.66667 2.49935 6.66667H17.4993C17.9596 6.66667 18.3327 6.29357 18.3327 5.83333V3.33333C18.3327 2.8731 17.9596 2.5 17.4993 2.5Z" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M3.33398 6.66406V15.8307C3.33398 16.2728 3.50958 16.6967 3.82214 17.0092C4.1347 17.3218 4.55862 17.4974 5.00065 17.4974H15.0007C15.4427 17.4974 15.8666 17.3218 16.1792 17.0092C16.4917 16.6967 16.6673 16.2728 16.6673 15.8307V6.66406" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8.33398 10H11.6673" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    },
    {
      id: "deleted",
      label: "DELETED.",
      icon: Trash2,
      hasDropdown: false,
      badge: null,
      href: "/vault/deleted",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M6.66602 7.33594V11.3359" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9.33398 7.33594V11.3359" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12.6673 4V13.3333C12.6673 13.687 12.5268 14.0261 12.2768 14.2761C12.0267 14.5262 11.6876 14.6667 11.334 14.6667H4.66732C4.3137 14.6667 3.97456 14.5262 3.72451 14.2761C3.47446 14.0261 3.33398 13.687 3.33398 13.3333V4" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2 4H14" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5.33398 4.0026V2.66927C5.33398 2.31565 5.47446 1.97651 5.72451 1.72646C5.97456 1.47641 6.3137 1.33594 6.66732 1.33594H9.33398C9.68761 1.33594 10.0267 1.47641 10.2768 1.72646C10.5268 1.97651 10.6673 2.31565 10.6673 2.66927V4.0026" stroke="#71717B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    },
  ];

  const isActive = (href) => {
    if (href === "/vault") return currentPath === "/vault";
    return currentPath === href || currentPath.startsWith(href + "/");
  };

  return (
    <div className="w-[273px] bg-white border-r border-[#e4e4e7] h-full flex flex-col">
      <div className="p-3">
        {/* The Vault Dropdown */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2"
        >
          <div className="relative">
            <Link href="/vault">
              <div
                onClick={() => openSidebar("collabsFolder")}
                className="bg-[#f4f4f5] border border-[#e4e4e7] rounded-md px-3 py-2.5 h-[48px] flex items-center justify-between cursor-pointer hover:bg-[#ededf0] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: "2px",
                      height: "22px",
                      background: "#8E51FF",
                      borderRadius: "1px",
                    }}
                  ></div>

                  <ChevronDown className="w-4 h-4 text-[#18181b]" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2.8431 6.63546L3.55404 5.26098C3.63133 5.10749 3.74889 4.97789 3.89415 4.88606C4.03942 4.79422 4.20691 4.74361 4.37872 4.73963H9.47852M9.47852 4.73963C9.62333 4.73937 9.76627 4.7723 9.89637 4.83588C10.0265 4.89946 10.1403 4.99201 10.2291 5.10641C10.3178 5.22081 10.3792 5.35404 10.4085 5.49585C10.4378 5.63767 10.4342 5.78431 10.398 5.92452L9.6681 8.76827C9.61529 8.97282 9.49567 9.15386 9.32823 9.28266C9.16079 9.41146 8.95512 9.48064 8.74388 9.47921H1.89518C1.64378 9.47921 1.40267 9.37934 1.2249 9.20157C1.04714 9.0238 0.947266 8.7827 0.947266 8.5313V2.36984C0.947266 2.11843 1.04714 1.87733 1.2249 1.69956C1.40267 1.52179 1.64378 1.42192 1.89518 1.42192H3.74362C3.90215 1.42037 4.05854 1.4586 4.19848 1.53312C4.33841 1.60764 4.45742 1.71607 4.54461 1.84848L4.92852 2.41723C5.01483 2.5483 5.13233 2.65588 5.27048 2.73033C5.40862 2.80478 5.56309 2.84377 5.72003 2.8438H8.5306C8.782 2.8438 9.02311 2.94367 9.20088 3.12143C9.37865 3.2992 9.47852 3.54031 9.47852 3.79171V4.73963Z"
                      stroke="#71717B"
                      stroke-width="0.947917"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span className="uppercase font-inter font-bold text-[12px] leading-[18px] tracking-[0.6px] text-[#0D0D0E]">
                    THE VAULT
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Navigation Items */}
        <div className="space-y-0">
          {sidebarItems.slice(1).map((item, index) => {
            const Icon = item.icon;
            const itemIsActive = isActive(item.href);
            const isDeleted = item.id === "deleted";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <Link href={item.href}>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={`w-full h-[48px] px-3 py-2.5 rounded-md flex items-center justify-between transition-colors cursor-pointer ${
                      isDeleted && itemIsActive
                        ? "bg-[#191919] hover:bg-[#191919]"
                        : itemIsActive
                          ? "bg-[#f4f4f5] hover:bg-[#f4f4f5]"
                          : "hover:bg-[#f4f4f5]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.svg ? (
                        <span
                          className={`w-4 h-4 flex items-center justify-center ${
                            isDeleted && itemIsActive
                              ? "text-white"
                              : "text-[#18181b]"
                          }`}
                          // eslint-disable-next-line react/no-danger
                          dangerouslySetInnerHTML={{ __html: item.svg }}
                        />
                      ) : (
                        Icon && (
                          <Icon
                            className={`w-4 h-4 ${
                              isDeleted && itemIsActive
                                ? "text-white"
                                : "text-[#18181b]"
                            }`}
                          />
                        )
                      )}
            
                      <span
                        className={`
                          font-inter
                          text-[#3F3F46]
                          text-[14px]
                          leading-[21px]
                          font-normal
                          tracking-[-0.15px]
                          ${isDeleted && itemIsActive
                            ? "font-bold text-white"
                            : itemIsActive
                              ? "font-medium text-[#18181b]"
                              : isDeleted
                                ? "font-bold text-[#18181b]"
                                : ""
                          }
                        `}
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontStyle: "normal",
                          fontSize: "14px",
                          fontWeight: isDeleted && itemIsActive
                            ? 700
                            : itemIsActive
                              ? 500
                              : isDeleted
                                ? 700
                                : 400,
                          lineHeight: "21px",
                          letterSpacing: "-0.15px",
                          color:
                            isDeleted && itemIsActive
                              ? "#fff"
                              : itemIsActive
                                ? "#18181b"
                                : "#3F3F46",
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
               
                    {item.badge && (
                      <span className="px-2 py-0.5 border border-[#e4e4e7] rounded-[1234px] bg-[#EDEDED] text-[12px] font-medium leading-[20px] text-[#6B6B73]">
                        {item.badge}
                      </span>
                 
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
