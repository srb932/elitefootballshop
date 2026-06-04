const CLUBS_BY_LEAGUE = {
  "Ligue 1": [
    "Paris Saint-Germain", "Olympique Marseille", "AS Monaco", "Olympique Lyonnais",
    "Lille OSC", "OGC Nice", "RC Lens", "Stade Rennais", "RC Strasbourg", "Toulouse FC",
    "Stade Brestois", "FC Nantes", "Stade de Reims", "AJ Auxerre", "Angers SCO",
    "Le Havre AC", "AS Saint-Étienne", "Montpellier HSC",
  ],
  "Ligue 2": [
    "Paris FC", "FC Lorient", "FC Metz", "ESTAC Troyes", "Stade Lavallois", "AC Ajaccio",
    "Pau FC", "Rodez AF", "Amiens SC", "En Avant Guingamp", "SC Bastia", "USL Dunkerque",
    "Annecy FC", "Red Star FC", "FC Martigues", "Clermont Foot", "Grenoble Foot 38",
    "SM Caen", "US Boulogne", "Valenciennes FC",
  ],
  "Premier League": [
    "Arsenal", "Aston Villa", "AFC Bournemouth", "Brentford FC", "Brighton & Hove Albion",
    "Chelsea FC", "Crystal Palace", "Everton FC", "Fulham FC", "Ipswich Town",
    "Leicester City", "Liverpool FC", "Manchester City", "Manchester United",
    "Newcastle United", "Nottingham Forest", "Southampton FC", "Tottenham Hotspur",
    "West Ham United", "Wolverhampton Wanderers",
  ],
  "La Liga": [
    "Real Madrid", "FC Barcelona", "Atlético Madrid", "Sevilla FC", "Real Sociedad",
    "Villarreal CF", "Real Betis", "Valencia CF", "Athletic Club", "CA Osasuna",
    "Getafe CF", "Girona FC", "RCD Mallorca", "Rayo Vallecano", "RC Celta de Vigo",
    "UD Las Palmas", "Deportivo Alavés", "Real Valladolid", "RCD Espanyol", "CD Leganés",
  ],
  "Serie A": [
    "Inter Milan", "AC Milan", "Juventus FC", "SSC Napoli", "AS Roma", "SS Lazio",
    "Atalanta BC", "ACF Fiorentina", "Bologna FC", "Torino FC", "AC Monza", "Genoa CFC",
    "Udinese Calcio", "Hellas Verona", "US Lecce", "Cagliari Calcio", "Empoli FC",
    "Parma Calcio", "Venezia FC", "Como 1907",
  ],
}

const special = {
  "paris-saint-germain": ["psg.png", "psg1.png"],
  "olympique-marseille": ["om.png", "om1.png"],
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

let out = ""

for (const [league, clubs] of Object.entries(CLUBS_BY_LEAGUE)) {
  out += `  // ${league}\n`
  for (const club of clubs) {
    const slug = slugify(club)
    const [front, back] = special[slug] ?? [`${slug}-avant.png`, `${slug}-arriere.png`]
    out += `  "${slug}": {\n    imageFront: "/maillots/${front}",\n    imageBack: "/maillots/${back}",\n  },\n`
  }
}

console.log(out)
