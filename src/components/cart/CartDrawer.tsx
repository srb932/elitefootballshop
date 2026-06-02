"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useCartStore } from "@/store/cartStore"

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQty, total } = useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-black text-blue-950">
                Mon Panier ({items.length})
              </h2>
              <button
                onClick={toggleCart}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="font-bold">Votre panier est vide</p>
                  <p className="text-sm mt-1">Ajoutez des maillots pour commencer</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="relative w-20 h-24 shrink-0 rounded-md overflow-hidden bg-white">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Taille: {item.size}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button
                            onClick={() => updateQty(item.id, item.size, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.size, item.quantity + 1)}
                            className="px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-red-600">{(item.price * item.quantity).toFixed(2)} EUR</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Total</span>
                  <span className="text-2xl font-black text-blue-950">{total().toFixed(2)} EUR</span>
                </div>
                <button className="w-full py-3 bg-blue-950 text-white font-bold rounded-full hover:bg-blue-900 transition-colors">
                  Commander
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Livraison offerte a partir de 80 EUR
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}