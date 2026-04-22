import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, LifeBuoy } from 'lucide-react'
import Logo from '../components/logo/Logo'

export default function Custom404() {
  return (
    <div className="min-h-screen bg-[#F4F4F5] flex flex-col items-center justify-center p-6 font-inter">
      {/* Background decoration - subtle gradient or shapes if needed, but keeping it clean like Figma */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Logo size="md" />
        </div>

        {/* 404 Text */}
        <p className="text-[16px] font-bold text-[#18181b] uppercase tracking-wider mb-3">
          404 Error
        </p>

        <h1 className="text-[48px] md:text-[60px] font-bold text-[#18181b] leading-tight mb-6">
          We can't find that page
        </h1>

        <p className="text-[18px] text-[#52525b] leading-relaxed mb-10 px-4">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/home">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#18181b] text-white px-8 py-4 rounded-xl font-semibold text-[16px] flex items-center justify-center gap-2 shadow-sm hover:bg-[#27272a] transition-colors w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5" />
              Go back home
            </motion.button>
          </Link>

          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-[#e4e4e7] text-[#18181b] px-8 py-4 rounded-xl font-semibold text-[16px] flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              <LifeBuoy className="w-5 h-5" />
              Contact support
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Footer / Extra info */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="fixed bottom-8 text-[#a1a1aa] text-[14px]"
      >
        © {new Date().getFullYear()} Manifestr. All rights reserved.
      </motion.p>
    </div>
  )
}
