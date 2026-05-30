"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function ProductCard({ product }) {
  return (
    <motion.div
      className="group relative bg-white rounded-none overflow-hidden cursor-pointer"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {product.isNew && (
          <span className="absolute top-3 left-3 bg-gold-500 text-white text-xs px-2 py-1 font-medium tracking-wider">
            NOUVEAU
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-sm">{product.name}</h3>
        <p className="text-gold-500 font-bold mt-1">{product.price} €</p>
      </div>
    </motion.div>
  )
}