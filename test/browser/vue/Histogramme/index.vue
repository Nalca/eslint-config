<template>
  <div class="histogramme-root col-flex" :data-id="id">
    <!-- Le titre de l'histogramme -->
    <div class="histogramme-title row-flex justify-content-center">
      <div
        v-for="s of series" :key="s.key"
        data-spec-serie-title
        class="row-flex align-items-center mr-3">
        <div class="histogramme-badge" :style="{ 'background-color': s.color }" />
        <span>{{ s.legend }}</span>
      </div>
    </div>
    <!-- Les histogrammes, alignés -->
    <div class="row-flex justify-content-between w-100">
      <!-- Chaque entrée de l'histogramme -->
      <div
        v-for="(v) of values" :key="v.key"
        data-spec-colonne
        class="histogramme-column col-flex flex-grow-1 cursor-pointer"
        :class="stacked ? 'stacked': 'unstacked'"
        @click.stop="expandedColumnId = (expandedColumnId === v.key ? '' : v.key)"
        :style="getColumnStyle(v.key)">
        <!-- L'histogramme empilé -->
        <div
          class="histogramme-item-container flex-shrink-0 flex-grow-0"
          v-if="stacked" :style="{ 'max-height': height, height }">
          <div
            v-for="(row, y) of v.data.slice(0).reverse()" :key="y"
            class="histogramme-item" :class="{'no-border': row.value === 0}"
            :style="{'background-color': row.color, height: `${row.value / v.sum * 100}%`}"
            :title="`${row.legend} : ${format(row.value)}`" />
        </div>
        <!-- L'histogramme sous forme de multiples colonnes -->
        <div
          v-if="!stacked && typeValues.anyPositive"
          class="histogramme-item-container row-flex flex-shrink-0 flex-grow-0 align-items-end"
          :style="{ 'max-height': height, height }">
          <div
            v-for="(col, y) of v.data" :key="y"
            class="histogramme-item"
            :class="{
              'no-border': col.value === 0 || calculateItemHeight(col.value, 1) === 0,
              positive: typeValues.anyPositive,
              negative: typeValues.anyNegative,
            }"
            :style="{
              height: `${calculateItemHeight(col.value, 1)}%`,
              'background-color': col.color, width: `${(1 / v.data.length * 100)}%`
            }"
            :title="`${col.legend} : ${format(col.value)}`" />
        </div>
        <!-- La légende de la colonne. -->
        <span
          class="histogramme-legende"
          data-spec-colonne-legende
          :class="{
            'selected': v.key === expandedColumnId,
            positive: typeValues.anyPositive,
            negative: typeValues.anyNegative,
          }" :title="v.label">
          {{ v.label.substr(0, seriesLabelMaxLength) }}
        </span>
        <!-- L'histogramme (négatif) sous forme de multiples colonnes -->
        <div
          v-if="!stacked && typeValues.anyNegative"
          class="histogramme-item-container row-flex flex-shrink-0 flex-grow-0 align-items-start"
          :style="{ 'max-height': height, height }">
          <div
            v-for="(col, y) of v.data" :key="y"
            class="histogramme-item"
            :class="{
              positive: typeValues.anyPositive,
              negative: typeValues.anyNegative,
              'no-border': col.value === 0 || calculateItemHeight(col.value, -1) === 0,
            }"
            :style="{
              height: `${calculateItemHeight(col.value, -1)}%`,
              'background-color': col.color, width: `${(1 / v.data.length * 100)}%`
            }"
            :title="`${col.legend} : ${format(col.value)}`" />
        </div>
      </div>
    </div>
    <!-- Le détail d'un histogramme -->
    <div class="col-flex" v-show="expandedColumnId">
      <div class="row-flex" v-for="(s, i) of expandedColumn.data" :key="`row-${i}`">
        <div
          class="histogramme-badge-large"
          :class="{'no-margin-top': !!i}"
          :style="{ 'background-color': s.color }" />
        <span class="font-weight-bold">{{ s.legend }}</span>
        <div class="flex-grow-1" />
        <span>{{ format(s.value) }}</span>
      </div>
      <div class="row-flex" v-if="showTotal">
        <span class="font-weight-bold">Total</span>
        <div class="flex-grow-1" />
        <span>{{ format(expandedColumn.sum) }} <span /></span>
      </div>
    </div>
    <!-- Les boutons pour passer à l'élément suivant -->
    <div
      class="row-flex justify-content-between align-items-center mx-4 mb-2 mt-1"
      v-if="!noExpandedLegend"
      v-show="expandedColumnId">
      <improved-button
        size="lg" :variant="disableExpandedColumnControls.left ? 'outline-secondary' : 'primary'"
        :class="{'cursor-not-allowed': disableExpandedColumnControls.left}"
        :disabled="disableExpandedColumnControls.left"
        @click="selectNextColumn('left')">
        <fa-icone icone="fa-2x fas fa-angle-left" />
      </improved-button>
      <span class="title">{{ expandedColumn.label }}</span>
      <improved-button
        size="lg" :variant="disableExpandedColumnControls.right ? 'outline-secondary' : 'primary'"
        :class="{'cursor-not-allowed': disableExpandedColumnControls.right}"
        :disabled="disableExpandedColumnControls.right"
        @click="selectNextColumn('right')">
        <fa-icone icone="fa-2x fas fa-angle-right" />
      </improved-button>
    </div>
  </div>
</template>

<script lang="ts">
import "../style.less";
import { Component, Prop, Watch } from "vue-property-decorator";
import Vue from "vue";
import { v4 as uuid } from "uuid";
import { FaIcone } from "../FaIcone";
import { ImprovedButton } from "../ImprovedButton";
import _round from "lodash/round";
import type { ComponentProps, HistogrammeSerie } from "./interface";

interface CalculatedValue {
  label: string;
  key: string;
  data: Array<{
    legend: string;
    color: string;
    value: number;
  }>;
  sum: number;
}

/** L'histogramme, un moyen d'afficher des données sous formes graphiques. */
@Component({
  name: "ma-histogramme",
  components: {
    "improved-button": ImprovedButton,
    "fa-icone": FaIcone,
  }
})
export default class Histogramme extends Vue implements ComponentProps {
  /** L'identifiant unique du composant */
  readonly id: string = uuid();

  beforeDestroy(): void {
    this.removeEventListener();
  }

  // #region Props
  @Prop({
    type: Array, required: true, validator: (val) => {
      if (!val || Array.isArray(val) === false) {
        return false;
      }
      return (val as Array<any>).every((v: Record<string, unknown>) => {
        return !!v && typeof v === "object"
          && typeof v.key === "string"
          && typeof v.legend === "string"
          && typeof v.color === "string"
          && Array.isArray(v.values);
      });
    }
  }) readonly series!: Array<HistogrammeSerie>;
  @Prop({
    type: Array, required: true,
  }) readonly seriesLabel!: Array<string>;
  @Prop({
    type: Number, default: 3
  }) readonly seriesLabelMaxLength!: number;
  @Prop({
    type: String, default: "101px",
  }) readonly height!: string;
  @Prop({
    type: Boolean, default: false,
  }) readonly stacked!: boolean;
  @Prop({
    type: Boolean, default: false
  }) readonly autoClose!: boolean;
  @Prop({
    type: Function,
    default: (value: number): string => _round(value, 2).toString()
  }) readonly formatter!: (value: number) => string;
  @Prop({
    type: Boolean, default: false
  }) readonly showTotal!: boolean;
  @Prop({
    type: Boolean, default: false
  }) readonly noExpandedLegend!: boolean;
  // #endregion

  /** Le nombre maximum d'éléments contenus dans les valeurs passées en paramètres.  */
  get maxLength(): number {
    return this.seriesLabel.length;
  }

  /** La plus grande valeur trouvée dans le jeu de données. Si il n'y a pas de jeu, retourne `NaN`. */
  get maxValue(): number {
    let max: number = Number.NaN;

    for (const val of this.values) {
      for (const entry of val.data) {
        max = Number.isNaN(max) ? Math.abs(entry.value) : Math.max(max, Math.abs(entry.value));
      }
    }
    return max;
  }

  /** Le jeu de données reformatées, dans un format plus facilement utilisable. */
  get values(): Array<CalculatedValue> {
    try {
      const result: Array<CalculatedValue> = [];

      for (let i = 0; i < this.maxLength; i++) {
        const label = this.seriesLabel[i];

        const newValue: CalculatedValue = {
          label,
          key: String(i),
          data: this.series.map(s => ({
            legend: s.legend,
            color: s.color,
            value: +(s.values[i] || 0),

          })),
          sum: Number.NaN,
        };

        newValue.sum = newValue.data.reduce((accumulator, current) => accumulator + current.value, 0);
        result.push(newValue);
      }

      return result;
    } catch (error: unknown) {
      console.error(error);
      return [];
    }
  }

  /** La méthode simple pour formatter les valeurs. */
  get format(): (v: number) => string {
    return this.formatter;
  }

  /** Le style d'une colonne. La colonne sélectionnée sera deux fois plus grande que les autres. */
  getColumnStyle(columnKey: string): Record<string, string> {
    let width = 1 / this.values.length * 100;
    if (this.expandedColumnId === columnKey) {
      width = width * 2;
    }

    return { width: `${width}%`, "max-width": `${width}%` };
  }

  /** Sélectionne la colonne à coté de la colonne actuellement sélectionnée. */
  selectNextColumn(direction: "left" | "right"): void {
    const keyToSearch = this.expandedColumn.key;
    let currentIndex = this.values.findIndex(val => keyToSearch === val.key);
    if (currentIndex === -1) {
      return;
    }

    if (direction === "left") {
      currentIndex -= 1;
    } else {
      currentIndex += 1;
    }
    const newId = this.values[currentIndex]?.key;
    if (newId !== undefined) {
      this.expandedColumnId = newId;
    }
  }

  /** L'id de la colonne étendue / ouverte. */
  expandedColumnId: string = "";

  /** Au changement de valeurs, on désélectionne la colonne. */
  @Watch("values")
  onValuesChange(): void {
    this.expandedColumnId = "";
  }

  /** Ajoute l'eventListener au changement de colonne sélectionnée. */
  @Watch("expandedColumnId")
  onExpandedColumnIdChange(newValue: any): void {
    if (this.autoClose) {
      this.removeEventListener();
      if (newValue) {
        document.addEventListener("click", this.onClickOutside);
      }
    }
  }

  /** L'eventHandler appelé lors d'un clic, pour désélectionner la colonne sélectionnée. */
  private onClickOutside(event: MouseEvent): void {
    let el = event.target as unknown as HTMLElement | null;
    while (el) {
      if (el.classList.contains("histogramme-root") && el.dataset.id === this.id) {
        return;
      }
      el = el.parentElement;
    }

    this.expandedColumnId = "";
    this.removeEventListener();
  }

  /** Supprime l'eventListener du composant.  */
  private removeEventListener(): void {
    document.removeEventListener("click", this.onClickOutside);
  }

  calculateItemHeight(value: number, type: 1 | -1): number {
    let absValue = value;
    if (type === 1) {
      absValue = Math.max(value, 0);
    } else if (type === -1) {
      absValue = Math.min(value, 0);
    }
    absValue = Math.abs(absValue);
    return Math.max(absValue / this.maxValue * 100, 0);
  }

  /** La colonne étendu. Ou une fausse colonne sinon. */
  get expandedColumn(): CalculatedValue {
    return this.values.find(val => this.expandedColumnId === val.key) ?? {
      label: "",
      key: "never",
      data: [],
      sum: Number.NaN
    };
  }

  /** Est-ce que les contrôles d'une colonne étendue sont désactivés ? */
  get disableExpandedColumnControls(): Record<"left" | "right", boolean> {
    return {
      left: this.expandedColumnId === "0",
      right: this.expandedColumnId === (this.values.at(-1) || {}).key
    };
  }

  get typeValues(): { anyNegative: boolean; anyPositive: boolean } {
    const anyNegative = this.values.some(val => val.data.some(r => r.value < 0));
    let anyPositive = this.values.some(val => val.data.some(r => r.value > 0));

    // Par défaut, on affiche la partie positive, même si elle est vide.
    if (!anyNegative && !anyPositive) {
      anyPositive = true;
    }
    return {
      anyNegative,
      anyPositive
    };
  }
}
</script>

<style lang="less" scoped>
// Le titre / légende du composant.
.histogramme-title {
  border-top: 1px solid steelblue;
  border-bottom: 1px solid steelblue;
  line-height: 1.2;
  margin-bottom: 0.25rem;
}
// Le badge de la légende du composant.
.histogramme-badge {
  border: 1px solid black;
  width: 0.5rem;
  height: 80%;
  margin-right: 0.25rem;
}
.histogramme-badge-large {
  border: 1px solid black;
  width: 1em;

  margin: 1px 0.25rem 1px 1px;
  &.no-margin-top {
    margin-top: 0;
  }
}

.histogramme-column {
  margin: 0 1px;
}

.histogramme-item {
  max-height: 100%;
}

// En dessous d'une certaine largeur, on fait sauter la bordure noire car chaque pixel commence à compter.
@media only screen and (min-width: 550px) {
  @item-border: 1px solid black;
  // Gestion des bordures.
  // Classe présente à la racine du composant, selon le type de représentation choisie.
  .unstacked {
    .histogramme-item {
      border: @item-border;
      flex-grow: 1;

      &.positive {
        border-bottom: 0;
      }
      &.negative {
        border-top: 0;
      }

      &.no-border {
        border: 0;
      }
    }

    .histogramme-item + .histogramme-item {
      margin-left: -1px;
      margin-right: -1px;
    }

    .histogramme-item:last-of-type {
      margin-right: 0;
    }
  }

  // Gestion des bordures.
  // Classe présente à la racine du composant, selon le type de représentation choisie.
  .stacked {
    .histogramme-item:first-child {
      border-top: @item-border;
    }

    .histogramme-item {
      border-left: @item-border;
      border-right: @item-border;
    }
  }
}

.histogramme-legende {
  text-align: center;
  background: steelblue;
  border: 1px solid black;
  height: calc(1.5em + 2px);
  overflow: hidden;

  &.selected {
    color: white;
    font-weight: bold;
    background-color: cornflowerblue;
  }
}
</style>