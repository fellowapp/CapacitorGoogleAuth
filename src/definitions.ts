import { WebAuthentication, iOSAuthentication, User } from "./user";

export interface GoogleAuthPlugin {
  signIn(): Promise<User>;
  refresh(): Promise<WebAuthentication | iOSAuthentication>;
  signOut(): Promise<void>;

  /** Init hook for load gapi and init plugin */
  init(): void;
}
