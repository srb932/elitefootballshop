"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function ProductCard({ product }: { product: any }) {
  return (
    <motion.div
      className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer shadow-sm"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Container Image avec effet de transition */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        
        {/* Image Avant */}
        <Image
          src={product.imageFront}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-500 group-hover:opacity-0"
        />

        {/* Image Arrière (apparaît au survol) */}
        <Image
          src={product.imageBack}
          alt={`${product.name} arrière`}
          fill
          className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* Badge optionnel */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] px-2 py-1 font-black tracking-widest uppercase">
            {product.badge}
          </span>
        )}
      </div>

      {/* Informations produit */}
      <div className="p-4">
        <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-950 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-2">
          <p className="text-red-600 font-black text-lg">{product.price.toFixed(2)} €</p>
          {product.oldPrice && (
            <p className="text-gray-400 text-xs line-through">{product.oldPrice.toFixed(2)} €</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}