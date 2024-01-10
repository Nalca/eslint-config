// So typescript don't whine when importing .vue files
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
declare module "*.png" {
  export default "data64:/";
}
declare module "*.svg" {
  export default "data64:/";
}