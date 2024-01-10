import Vue from "vue";
import { mergeData } from "vue-functional-data-merge";

export interface ComponentProps {
  /** L'icone à afficher. */
  readonly icone: string;
  /** La valeur de rotation à appliquer sur l'image elle-même via une transformation: `transform: rotate(**rotate**)` */
  readonly rotation: string;
  /** La couleur de l'icone. A noter que l'icone doit supporter le changement de couleur. */
  readonly color: string;
  /** Réduit l'opacité de l'icone pour montrer un état désactivé. */
  readonly transparent: boolean;
}

/** Un composant pour afficher des icones `font-awesome`. Il ne sert à rien dans les autres cas. */
export const FaIcone = Vue.extend<ComponentProps>({
  name: "ma-fa-icone",
  functional: true,
  props: {
    icone: {
      type: String,
      required: true
    },
    rotation: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: ""
    },
    transparent: {
      type: Boolean,
      default: false
    }
  },
  render (createEl, context) {
    const props = context.props;
    return createEl("div", mergeData(context.data), [
      createEl("i", {
        staticClass: props.icone,
        style: {
          color: props.color,
          opacity: props.transparent ? 0.3 : undefined,
          transform: props.rotation ? `rotate(${props.rotation})` : undefined
        }
      })
    ]);
  }
});
