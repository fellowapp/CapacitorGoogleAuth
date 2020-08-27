import { User, Authentication } from "./user";

declare module "@capacitor/core" {
  interface PluginRegistry {
    GoogleAuth: GoogleAuthPlugin;
  }
}

/** On iOS, refresh returns an extra field */
interface RefreshData extends Authentication {
  refreshToken?: string;
}

export interface GoogleAuthPlugin {
  signIn(): Promise<User>;
  refresh(): Promise<RefreshData>;
  signOut(): Promise<void>;
}
