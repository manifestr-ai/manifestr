import { useState, useRef } from 'react'
import { X, Loader2, CloudUpload, Plus } from 'lucide-react'
import Image from 'next/image'

export default function FileUploadZone({
  maxFiles = 10,
  onFilesChange,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4']
}) {
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(new Set())
  const fileInputRef = useRef(null)

  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).slice(0, maxFiles - files.length)

    newFiles.forEach((file) => {
      const fileId = `${Date.now()}-${Math.random()}`
      const fileObj = {
        id: fileId,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        status: 'uploading'
      }

      setFiles((prev) => [...prev, fileObj])
      setUploadingFiles((prev) => new Set(prev).add(fileId))

      // Simulate file upload
      setTimeout(() => {
        setUploadingFiles((prev) => {
          const next = new Set(prev)
          next.delete(fileId)
          return next
        })
        setFiles((prev) => {
          const updated = prev.map((f) =>
            f.id === fileId ? { ...f, status: 'completed' } : f
          )
          if (onFilesChange) {
            onFilesChange(updated)
          }
          return updated
        })
      }, 2000)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = e.dataTransfer.files
    handleFileSelect(droppedFiles)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files)
  }

  const removeFile = (fileId) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      const updated = prev.filter((f) => f.id !== fileId)
      if (onFilesChange) {
        onFilesChange(updated)
      }
      return updated
    })
  }

  const canAddMore = files.length < maxFiles

  return (
    <div className="w-full flex flex-col gap-8 items-start">
      {/* Import from Vault Button - positioned above upload card */}


      {/* Upload Zone - Always visible */}
      <div className="w-full flex flex-col gap-3 items-start">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`bg-[#f4f4f4] box-border flex flex-col h-[315px] items-start pb-[20px] pt-[10px] px-[50px] rounded-xl w-full transition-colors relative overflow-hidden ${isDragging ? 'border-2 border-dashed border-base-secondary' : ''
            } ${!canAddMore ? 'opacity-60' : ''}`}
        >
          {/* Background Text */}
          <p className="absolute italic text-[155px] leading-none text-black opacity-[0.03] whitespace-nowrap left-1/2 -translate-x-1/2 top-[175px]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: '600', letterSpacing: '-0.05em' }}>
            MOMENTUM
          </p>

          {/* Upload Content */}
          <div className="relative z-10 flex flex-col gap-3 items-center w-full">
            <div className="relative h-[78.896px] w-[56.522px] flex items-center justify-center">
              <div className="relative w-[80px] h-[120px]">
                <Image
                  src="/assets/icons/upload-logo.svg"
                  alt="Upload"
                  width={80}
                  height={120}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Instructions */}
            <p className="text-center text-[14px] leading-[20px] text-base-muted-foreground+">
              Upload your media, drag and drop up to 5 images / videos to create a multi shot.{' '}
              <br />
            </p>

            <p className="text-center text-[14px] leading-[20px] text-base-muted-foreground+">
              Videos must be less than 30 MB and photos
              must be less than 2 MB in size.
              <br />
              (JPG, PNG, MP4 accepted)
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 items-center mt-4">
              <button
                onClick={() => canAddMore && fileInputRef.current?.click()}
                disabled={!canAddMore}
                className="bg-[rgb(24,24,27)] text-white flex gap-2 items-center justify-center h-10 px-3 py-2 rounded-xl hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <CloudUpload className="size-4 text-white" strokeWidth={2} />
                <span className="text-[14px] leading-[20px] font-medium">Click to upload</span>
              </button>
              <button
                disabled={!canAddMore}
                className="bg-white text-black border border-zinc-200 flex gap-2 items-center justify-center h-10 px-3 py-2 rounded-xl hover:bg-zinc-50 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-sm"
              >
                <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4">
                  <path d="M1.99567 8.59495C1.50036 8.0889 1.12671 7.47676 0.903025 6.80491C0.679336 6.13306 0.611473 5.41912 0.704576 4.71715C0.797679 4.01519 1.04931 3.34362 1.4404 2.75331C1.83149 2.163 2.35179 1.66943 2.96189 1.30999C3.57199 0.950544 4.25589 0.734654 4.96178 0.678671C5.66767 0.622687 6.37705 0.728077 7.03618 0.986859C7.69531 1.24564 8.2869 1.65103 8.76616 2.17231C9.24541 2.69359 9.59975 3.31711 9.80233 3.99562H10.9957C11.6393 3.99555 12.266 4.2025 12.783 4.58591C13.3 4.96932 13.68 5.50886 13.8668 6.12482C14.0537 6.74078 14.0375 7.40051 13.8206 8.00654C13.6037 8.61256 13.1976 9.13276 12.6623 9.49029M7.3291 6.66227V12.6623M7.3291 12.6623L4.66243 9.99561M7.3291 12.6623L9.99577 9.99561" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[14px] leading-[20px] font-medium">Browse Drive</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Uploaded Files Row - Below upload card with horizontal scroll */}
      {files.length > 0 && (
        <div className="w-full flex flex-col gap-3">
          <div className="overflow-x-auto w-full scroll-smooth" style={{ scrollbarWidth: 'thin', scrollbarColor: '#71717a transparent' }}>
            <div className="flex gap-3 items-start pb-2" style={{ minWidth: 'min-content' }}>
              {files.map((fileObj) => (
                <div
                  key={fileObj.id}
                  className="relative border border-base-border rounded-xl h-[100px] w-[150px] shrink-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {fileObj.preview ? (
                    <>
                      <Image
                        src={fileObj.preview}
                        alt={fileObj.name}
                        fill
                        className="object-cover"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-base-muted">
                      <span className="text-xs text-base-muted-foreground">Video</span>
                    </div>
                  )}

                  {/* Loading Overlay */}
                  {uploadingFiles.has(fileObj.id) && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(fileObj.id)}
                    className="absolute top-2 right-2 p-1 flex items-center justify-center transition-opacity hover:opacity-80"
                  >
                    <X className="w-6 h-6 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

