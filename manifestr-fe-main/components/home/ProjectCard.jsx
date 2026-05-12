import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export default function ProjectCard({
  title,
  date,
  status,
  imageSrc,
  onClick,
  index = 0
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-[12.763px] h-[130px] relative cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      {/* Project Image */}
      <div className="absolute left-[8px] top-[8px] w-[140px] h-[112px] rounded-lg overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          width={140}
          height={112}
          quality={100}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="absolute left-[156px] top-[16px] right-[16px] bottom-[16px] flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-[17.017px] font-semibold leading-[25.526px] text-[#18181b] pr-2 flex-1 min-w-0 truncate">
              {title}
            </h3>
            <div className="w-[25.526px] h-[26.897px] flex items-center justify-center flex-shrink-0">
              <ChevronRight className="w-[25.526px] h-[26.897px] text-[#18181b]" strokeWidth={2} />
            </div>
          </div>
          <p className="text-[12.763px] font-normal leading-[19.145px] text-[#71717a]">
            {date}
          </p>
        </div>

        {/* Status Badge */}
        <div className="bg-[#b9c0b5] rounded-2xl px-[8.509px] py-[2.127px] w-fit flex items-center justify-center min-h-[25px]">
          <p className="text-[12.76px] font-medium leading-[19.145px] text-white text-center whitespace-nowrap">
            {status}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

