import Vue from "vue";
import { mergeData } from "vue-functional-data-merge";
import "./style.less";

export interface ComponentProps {
  /** Est-ce que le bouton est désactivé ? */
  readonly disabled: boolean;
  /** La taille du bouton. */
  readonly size: string;
  /** La variante (bootstrap) du bouton. */
  readonly variant: string;
  /** **1**, Est-ce que le bouton est arrondi ? */
  readonly pill: boolean;
  /** **2**, Est-ce que les bords du boutons sont droits (AUCUNE courbure de la bordure du bouton) ? */
  readonly squared: boolean;
  /** Si `true`, aucun effet d'outline ne sera visible quand l'élément à le focus. */
  readonly noOutline: boolean;
}

/** Un bouton amélioré utilisant les styles `bootstrap v4` et `bootstrap-vue`  */
export const ImprovedButton = Vue.extend<ComponentProps>({
  name: "ma-improved-button",
  functional: true,
  props: {
    disabled: { type: Boolean, default: false },
    size: {
      type: String,
      default: "",
      validator: val => val === "" || val === "lg" || val === "sm"
    },
    variant: { type: String, default: "" },
    pill: { type: Boolean, default: false },
    squared: { type: Boolean, default: false },
    noOutline: { type: Boolean, default: false },
  },
  render(ce, context) {
    const props = context.props;

    let staticClass = "btn";
    const staticStyle: Record<string, string> = {};

    if (props.size === "sm" || props.size === "lg") {
      staticClass += " btn-" + props.size;
    }
    if (props.variant) {
      staticClass += " btn-" + props.variant;
    }
    if (props.disabled) {
      staticClass += " disabled cursor-not-allowed";
    }
    if (props.squared) {
      staticClass += " rounded-0";
    } else if (props.pill) {
      staticClass += " rounded-pill";
    }
    if (props.noOutline) {
      staticStyle.outline = "initial";
      staticStyle["box-shadow"] = "initial";
    }

    return ce("button", mergeData(context.data, {
      staticClass,
      staticStyle,
      attrs: { role: "button", disabled: props.disabled },
    }), context.children);
  }
});
