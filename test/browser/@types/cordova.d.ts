import "types/cordova";

declare global {
  interface Cordova {
    /** Des informations sur l'application, peut être définies ailleurs. */
    application: {
      /** L'identifiant de l'application. */
      id: string;
      deviceIdOverride?: string;
    };
  }

  declare const cordova: Cordova;
}


namespace NodeJS.Global {
  interface Cordova {
    /** Des informations sur l'application, peut être définies ailleurs. */
    application: {
      deviceIdOverride?: string;
    };
  }

  declare const cordova: Cordova;
}