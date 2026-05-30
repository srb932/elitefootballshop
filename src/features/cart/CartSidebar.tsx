import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet"
import { useCartStore } from "@/store/cartStore"
import { motion, AnimatePresence } from "framer-motion"

export function CartSidebar() {
  const { items, isOpen, toggleCart, removeItem, total } = useCartStore()

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <h2>Mon Panier ({items.length})</h2>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id + item.size}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-4 py-4 border-b"
              >
                {/* Image + détails + bouton supprimer */}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{total().toFixed(2)} €</span>
          </div>

          <button className="w-full bg-black text-white py-4 mt-4">
            Passer commande
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}