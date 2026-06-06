export function PromoBanner() {
  return (
    <div className="bg-[#0a1628] text-gray-100 border-b border-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-6 text-[13px] font-normal tracking-normal">
        <span>Livraison gratuite dès 3 maillots</span>
        <span className="hidden sm:inline text-blue-400/60">|</span>
        <span>Expédition sous 2 semaines</span>
        <span className="hidden sm:inline text-blue-400/60">|</span>
        <span>
          <span className="text-gray-300">-10% sur votre 1ère commande</span>
          {" — code "}
          <span className="font-medium text-white">BIENVENUE10</span>
        </span>
      </div>
    </div>
  )
}
