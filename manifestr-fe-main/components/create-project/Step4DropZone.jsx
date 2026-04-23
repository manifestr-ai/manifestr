import FileUploadZone from './FileUploadZone'
import Logo from '../logo/Logo'

export default function Step4DropZone({ onFilesChange }) {
  return (
    <div className="flex flex-col gap-[40px] items-center w-full max-w-[888px] mx-auto py-10">
      {/* Heading Section */}
      <div className="flex flex-col gap-6 items-center justify-center w-full relative">
        {/* Manifestr Logo - At the top */}
        <div className="flex items-center justify-center shrink-0">
          <Logo size="md" />
        </div>
        
        <div className="flex flex-col gap-[8px] items-center text-center w-full">
          <h1 className="font-hero font-semibold text-[30px] leading-[38px] text-black">
            Dropzone
          </h1>
          <p className="font-normal text-[16px] leading-[24px] text-base-muted-foreground+">
            Your thinking partner
          </p>
        </div>
      </div>

      {/* File Upload Zone */}
      <div className="w-full">
        <FileUploadZone 
          maxFiles={5} 
          onFilesChange={onFilesChange}
        />
      </div>
    </div>
  )
}

