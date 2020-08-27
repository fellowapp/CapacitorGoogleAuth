interface CommonUser {
    id: string;
    email: string;
    
    name: string;
    familyName: string;
    givenName: string;
    imageUrl?: string;

    serverAuthCode: string;
}

export interface WebUser extends CommonUser {
    authentication: WebAuthentication;
}

interface iOSUser extends CommonUser {
    authentication: iOSAuthentication;
}

interface AndroidUser extends CommonUser {
    idToken: string;
    authentication: Authentication;
}

export type User = WebUser | iOSUser | AndroidUser;

export interface Authentication {
    idToken: string;
}

export interface WebAuthentication extends Authentication {
    accessToken: string;
}

export interface iOSAuthentication extends Authentication {
    accessToken: string;
    refreshToken: string;
}