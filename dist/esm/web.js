import { WebPlugin } from '@capacitor/core';
export class GoogleAuthWeb extends WebPlugin {
    constructor() {
        super();
    }
    loadScript() {
        if (typeof document === 'undefined') {
            return;
        }
        const scriptId = 'gapi';
        const scriptEl = document === null || document === void 0 ? void 0 : document.getElementById(scriptId);
        if (scriptEl) {
            return;
        }
        const head = document.getElementsByTagName('head')[0];
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.defer = true;
        script.async = true;
        script.id = scriptId;
        script.onload = this.platformJsLoaded.bind(this);
        script.src = 'https://apis.google.com/js/platform.js';
        head.appendChild(script);
    }
    initialize(_options = {
        clientId: '',
        scopes: [],
        grantOfflineAccess: false,
    }) {
        var _a, _b;
        if (typeof window === 'undefined') {
            return;
        }
        const metaClientId = (_a = document.getElementsByName('google-signin-client_id')[0]) === null || _a === void 0 ? void 0 : _a.content;
        const clientId = _options.clientId || metaClientId || '';
        if (!clientId) {
            console.warn('GoogleAuthPlugin - clientId is empty');
        }
        this.options = {
            clientId,
            grantOfflineAccess: (_b = _options.grantOfflineAccess) !== null && _b !== void 0 ? _b : false,
            scopes: _options.scopes || [],
        };
        this.gapiLoaded = new Promise((resolve) => {
            // HACK: Relying on window object, can't get property in gapi.load callback
            window.gapiResolve = resolve;
            this.loadScript();
        });
        this.addUserChangeListener();
    }
    platformJsLoaded() {
        gapi.load('auth2', () => {
            // https://github.com/CodetrixStudio/CapacitorGoogleAuth/issues/202#issuecomment-1147393785
            const clientConfig = {
                client_id: document.getElementsByName('google-signin-client_id')[0].content,
                plugin_name: 'CodetrixStudioCapacitorGoogleAuth',
            };
            clientConfig.scope = [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/calendar.readonly',
                'https://www.googleapis.com/auth/calendar.events',
            ].join(' ');
            gapi.auth2.init(clientConfig);
            window.gapiResolve();
        });
    }
    async signIn() {
        return new Promise(async (resolve, reject) => {
            try {
                let serverAuthCode;
                var needsOfflineAccess = false;
                try {
                    // needsOfflineAccess = config.plugins.GoogleAuth.serverClientId != null;
                    needsOfflineAccess = true;
                }
                catch (_a) { }
                if (needsOfflineAccess) {
                    const offlineAccessResponse = await gapi.auth2.getAuthInstance().grantOfflineAccess();
                    serverAuthCode = offlineAccessResponse.code;
                }
                else {
                    await gapi.auth2.getAuthInstance().signIn();
                }
                const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
                if (needsOfflineAccess) {
                    // HACK: AuthResponse is null if we don't do this when using grantOfflineAccess
                    await googleUser.reloadAuthResponse();
                }
                const user = Object.assign(Object.assign({}, this.getUserFrom(googleUser)), { serverAuthCode: serverAuthCode });
                resolve(user);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async refresh() {
        const authResponse = await gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse();
        return {
            accessToken: authResponse.access_token,
            idToken: authResponse.id_token,
            refreshToken: '',
        };
    }
    async signOut() {
        return gapi.auth2.getAuthInstance().signOut();
    }
    async addUserChangeListener() {
        await this.gapiLoaded;
        gapi.auth2.getAuthInstance().currentUser.listen((googleUser) => {
            this.notifyListeners('userChange', googleUser.isSignedIn() ? this.getUserFrom(googleUser) : null);
        });
    }
    getUserFrom(googleUser) {
        const profile = googleUser.getBasicProfile();
        const authResponse = googleUser.getAuthResponse(true);
        const user = {
            email: profile.getEmail(),
            familyName: profile.getFamilyName(),
            givenName: profile.getGivenName(),
            id: profile.getId(),
            imageUrl: profile.getImageUrl(),
            name: profile.getName(),
            authentication: {
                accessToken: authResponse.access_token,
                idToken: authResponse.id_token,
                refreshToken: '',
            },
        };
        return user;
    }
}
//# sourceMappingURL=web.js.map