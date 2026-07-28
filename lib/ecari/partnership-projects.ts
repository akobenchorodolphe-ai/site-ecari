export const partnershipProjects = [
  {
    title: "Fonds d'appui aux etudiants",
    category: "Aide etudiante",
    support: "Aide financiere totale ou partielle",
    objective:
      "Soutenir des etudiants identifies par le Rectorat afin de reduire les ruptures de parcours liees aux contraintes financieres.",
    impact:
      "Maintien dans les etudes, accompagnement social et meilleure continuite academique.",
  },
  {
    title: "Programme de recherche appliquee",
    category: "Recherche",
    support: "Subvention ou cofinancement",
    objective:
      "Financer des travaux de recherche utiles aux besoins institutionnels, sociaux, pastoraux et economiques de la sous-region.",
    impact:
      "Production de connaissances exploitables, aide a la decision et valorisation scientifique.",
  },
  {
    title: "Incubation innovation universitaire",
    category: "Innovation",
    support: "Adhesion, mentorat ou dotation",
    objective:
      "Accompagner des idees issues des unites universitaires vers des prototypes, projets pilotes ou solutions deployables.",
    impact:
      "Acceleration de projets et creation de passerelles entre formation, recherche et terrain.",
  },
] as const;

export const partnershipProjectOptions = [
  ...partnershipProjects.map((project) => project.title),
  "Projet a definir avec ECARI",
] as const;
