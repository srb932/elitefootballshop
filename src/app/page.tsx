import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative h-screen bg-elite-dark overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-white"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="font-display text-7xl md:text-9xl tracking-wider">
          ELITE
        </h1>

        <p className="text-gold-400 text-xl tracking-widest mt-2">
          FOOTBALL SHOP
        </p>

        <div className="flex gap-4 mt-8">
          <button className="bg-white text-black px-8 py-3 font-medium hover:bg-gold-400 transition-colors">
            Explorer
          </button>
        </div>
      </motion.div>
    </section>
  )
}

export default function Page() {
  return <HeroSection />
}