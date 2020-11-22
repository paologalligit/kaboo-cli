interface User {
    userName: string,
    password: string
}

interface AuthUser {
    userName: string,
    accessToken: string
}

export type {
    User, AuthUser
}