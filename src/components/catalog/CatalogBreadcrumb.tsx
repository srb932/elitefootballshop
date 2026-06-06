"use client"

export function CatalogBreadcrumb({
  league,
  clubName,
  onLeagueClick,
  onHomeClick,
}: {
  league: string
  clubName?: string
  onLeagueClick?: () => void
  onHomeClick: () => void
}) {
  if (league === "Accueil") return null

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-5 flex-wrap">
      <button type="button" onClick={onHomeClick} className="hover:text-blue-950 transition-colors">
        Accueil
      </button>
      <span className="text-gray-300">/</span>
      {clubName ? (
        <>
          <button type="button" onClick={onLeagueClick} className="hover:text-blue-950 transition-colors">
            {league}
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">{clubName}</span>
        </>
      ) : (
        <span className="text-gray-900 font-medium">{league}</span>
      )}
    </nav>
  )
}
