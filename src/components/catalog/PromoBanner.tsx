export function PromoBanner() {
  return (
    <div className="border-b border-blue-400/30 bg-gradient-to-r from-[#082f8f] via-[#0b4fc4] to-[#071d5a] text-white shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-3 py-2 text-center text-[10px] leading-4 font-normal tracking-normal sm:gap-x-6 sm:px-4 sm:py-2.5 sm:text-[13px]">
        <span className="font-semibold text-white">Livraison offerte pour le lancement de la boutique</span>
        <span className="text-blue-400/60">|</span>
        <span>Expédition sous 2 semaines</span>
        <span className="text-blue-400/60">|</span>
        <span>
          <span className="text-gray-300">-10% sur votre 1ère commande</span>
          {" — code "}
          <span className="font-medium text-white">BIENVENUE10</span>
        </span>
      </div>
    </div>
  )
}
