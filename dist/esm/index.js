import { registerPlugin } from '@capacitor/core';
import { GoogleAuthWeb } from './web';
const GoogleAuth = registerPlugin('GoogleAuth', {
    web: () => new GoogleAuthWeb(),
});
export * from './definitions';
export { GoogleAuth };
//# sourceMappingURL=index.js.map