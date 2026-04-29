import { motion } from "framer-motion";
import { Plus, Upload, Trash2 } from "lucide-react";

export default function VaultHeader({
  title = "THE vault",
  description = (
    <>
      Your secure workspace for every <br></br>project, deck & document.
    </>
  ),
  isBlack = false,
  backgroundImage = null,
  customActionButton = null,
  showActionButtons = true,
  onNewCollabClick = null,
  onUploadClick = null,
}) {
  const headerHeight =
    (title?.toLowerCase() === "the vault" || title?.toLowerCase().includes("deleted"))
      ? "min-h-[199px]"
      : "min-h-[140px]";
  const paddingY = isBlack
    ? "pt-[40px] md:pt-[55px] pb-2"
    : "pt-[40px] md:pt-[55px] pb-2";

  return (
    <div
      className={`relative w-full ${headerHeight} overflow-hidden ${isBlack ? "bg-black" : ""}`}
    >
      {/* Background with texture/image */}
      {backgroundImage ? (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          {isBlack ? (
            <>
              {/* Horizontal gradient from solid black to transparent (matches Figma) */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#18181b] from-[32%] via-[rgba(96,96,94,0)] via-[56%] to-[rgba(96,96,94,0)] to-[70%]" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 lg:hidden" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-[#f4f4f5]/80 to-[#ffffff]/80 lg:hidden" />
          )}
        </div>
      ) : !isBlack ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#f4f4f5] to-[#ffffff]" />
      ) : null}

      <div className={`relative z-10  px-4 md:px-[30px] ${paddingY}`}>
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-0">
            {/* Left Section */}
            <div className="flex flex-col gap-2 flex-1">
              {typeof title === "string" ? (
                <h1
                  className={`tracking-[0.4063px] ${isBlack ? "text-white" : "text-[#18181b]"}`}
                >
                  {(() => {
                    const words = title.split(" ");
                    const first = words[0];
                    const second = words[1];
                    const rest = words.slice(2).join(" ");
                    return (
                      <>
                        {first && (
                          <span
                            className="text-[34px] leading-[48px] font-bold"
                            style={{
                              color: isBlack ? "#fff" : "#181818",
                         
                              fontFamily: "Inter",
                              fontStyle: "normal",
                              fontWeight: 700,
                              letterSpacing: "0.406px",
                            }}
                          >
                            {first}
                          </span>
                        )}
                        {second && (
                          <span
                            className="italic font-semibold leading-[48px] text-[44px] tracking-[0.406px]"
                            style={{
                             color: isBlack ? "#fff" : "#181818",
                              fontFamily: '"IvyPresto Headline"',
                              fontStyle: "italic",
                              fontWeight: 600,
                              letterSpacing: "0.406px",
                            }}
                          >
                            {" "}
                            {second}
                          </span>
                        )}
                        {rest && (
                          <span
                            className="text-[30px] leading-[48px] font-light tracking-[0.406px] font-inter not-italic" style={{color: isBlack ? "#fff" : "#181818" }}                           
                          >
                            {" "}
                            {rest}
                          </span>
                     
                     
                        )}
                      </>
                    );
                  })()}
                </h1>
              ) : (
                <h1
                  className={`text-[48px] leading-[48px] tracking-tight ${isBlack ? "text-white" : "text-[#18181b]"}`}
                >
                  {title}
                </h1>
              )}
              {description && (
                <p
                  className={`font-normal leading-6 tracking-[-0.312px] font-sans text-base ${isBlack ? "text-[#a1a1aa]" : "text-[#181818]"}`}
                >
                  {description}
                </p>
              )}
            </div>

            {/* Right Section - Action Buttons */}
            {showActionButtons &&
              (customActionButton ? (
                customActionButton
              ) : (
                <div className="flex flex-col md:flex-row items-center self-end gap-3 w-full md:w-auto">
                  <motion.button
                    onClick={onNewCollabClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white text-[#18181b] rounded-md h-[40px] px-4 flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] hover:opacity-90 transition-opacity w-full md:w-auto"
                  >
                    <Plus className="w-4 h-4" />
                    New Collab
                  </motion.button>

                  <motion.button
                    onClick={onUploadClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white border border-[#e4e4e7] rounded-md h-[40px] px-4 flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] text-[#18181b] hover:bg-[#f4f4f5] transition-colors w-full md:w-auto"
                  >
                    <Upload className="w-4 h-4" />
                    Upload new
                  </motion.button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
