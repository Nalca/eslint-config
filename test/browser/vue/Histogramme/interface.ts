export interface HistogrammeSerie {
  /** La clé unique utilisé pour identifier le jeu de données. */
  key: string;
  /** La légende du jeu de données. */
  legend: string;
  /** La couleur du jeu de données. */
  color: string;
  /** Les valeurs du jeu de données. */
  values: (number | string)[];
}

export interface ComponentProps {
  /** La liste des données du composant.
   *  L'ordre d'insertion dans cette array détermine l'ordre dans la légende, et dans l'histogramme.
  */
  readonly series: Array<HistogrammeSerie>;
  /** Les libellés du jeu de données. Et détermine aussi le nombre maximum d'éléments affichés. */
  readonly seriesLabel: Array<string>;
  /** La taille maximale des labels */
  readonly seriesLabelMaxLength: number;
  /** **Style(height):** La hauteur des colonnes de l'histogramme.
   *  La plus grande valeur (absolue) aura cette taille.
   *  Note: En mode empilé, la bordure prend un pixel de haut.
   */
  readonly height: string;
  /** Le type d'histogramme.
   *  - En mode **stacké**, les éléments formeront une seule colonne atteignant la hauteur maximale.
   *  Cette colonne sera formée d'éléments dont la taille dépend du rapport à la somme totale.
   *  - En mode **non stacké**, les éléments formeront plusieurs colonnes,
   *  dont la taille maximale est déterminée par la valeur la plus grande trouvée dans le jeu de donénes
   */
  readonly stacked: boolean;
  /** Permet la fermeture automatique du composant si on clique sur un élément situé en dehors de ce composant. */
  readonly autoClose: boolean;
  /** Un formatter permettant de formater les valeurs pour leurs affichages.
   *  C'est le boulot du formatter d'ajouter l'unité.
   */
  readonly formatter: (value: number) => string;
  /** Est-ce que la partie totale, lorsqu'on sélectionne une colonne, est montrée ? */
  readonly showTotal: boolean;
  /** Si `true`, les boutons de contrôles des colonnes ciblés (et le libellé qui va avec) ne seront pas visibles. */
  readonly noExpandedLegend: boolean;
}