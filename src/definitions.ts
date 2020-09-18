import { User, WebAuthentication, iOSAuthentication } from "./user";

declare module "@capacitor/core" {
  interface PluginRegistry {
    GoogleAuth: GoogleAuthPlugin;
  }
}

export interface GoogleAuthPlugin {
  signIn(): Promise<User>;
  /** Implemented on Web and iOS, not Android */
  refresh(): Promise<WebAuthentication | iOSAuthentication>;
  signOut(): Promise<void>;
}
