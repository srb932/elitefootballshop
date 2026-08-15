import React from 'react';

export default function Hero() {
  return (
    <div className="relative h-[70vh] w-full overflow-hidden bg-black">
      {/* 1. Arrière-plan : Image ou Vidéo immersive */}
      {/* Tu pourras remplacer l'image Unsplash par une vidéo ou ta propre bannière plus tard */}
      <img
        src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1920&auto=format&fit=crop"
        alt="L'Âme du Maillot Banner"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-60 transition-transform duration-700 hover:scale-105"
      />

      {/* Overlay dégradé sombre (Style Premium comme sur la capture image_3fa7e8.jpg) */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/40 to-black/60" />

      {/* 2. Contenu textuel centré */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <span className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-500/30">
          Collection Officielle 2026
        </span>
        
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-tight">
  PORTEZ{" "}
  <span className="inline-block px-3 py-1 -mx-3 -my-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 overflow-visible">
    L'ÂME
  </span>{" "}
  DE VOTRE CLUB
</h1>
        
        <p className="mt-6 max-w-xl text-base text-zinc-300 sm:text-lg">
          Découvrez notre sélection de maillots premium. Conçus pour les passionnés, les collectionneurs et l'amour du beau jeu.
        </p>

        {/* Boutons d'action (Style épuré avec bordures) */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#catalogue"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-black bg-white rounded-md transition-all duration-200 hover:bg-zinc-200 w-full sm:w-auto"
          >
            Découvrir la collection
          </a>
          <a
            href="#nouveautes"
            className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-white border border-zinc-700 bg-zinc-900/40 backdrop-blur-sm rounded-md transition-all duration-200 hover:bg-zinc-800 hover:border-zinc-500 w-full sm:w-auto"
          >
            Les Vedettes 🔥
          </a>
        </div>
      </div>

      {/* Petit indicateur de défilement discret en bas */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden sm:block">
        <div className="w-5 h-8 border-2 border-zinc-500 rounded-full flex justify-center pt-1">
          <div className="w-1 h-2 bg-zinc-400 rounded-full" />
        </div>
      </div>
    </div>
  );
}