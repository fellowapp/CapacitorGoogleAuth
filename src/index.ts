import { registerPlugin } from '@capacitor/core';
import type { GoogleAuthPlugin } from './definitions';
import { GoogleAuthWeb } from './web';

const GoogleAuth = registerPlugin<GoogleAuthPlugin>('GoogleAuth', {
  web: () => new GoogleAuthWeb(),
});

export * from './definitions';
export { GoogleAuth };
