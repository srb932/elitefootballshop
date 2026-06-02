"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export function ZoomableImage({
  src,
  alt,
  className = "",
}: {
  src: string
  alt: string
  className?: string
}) {
  const [zoomed, setZoomed] = useState(false)

  return (
    <>
      <div
        className={`relative cursor-zoom-in overflow-hidden ${className}`}
        onClick={() => setZoomed(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>

      <AnimatePresence>
        {zoomed && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
          >
            <motion.div
              className="relative w-[90vw] h-[90vh]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}