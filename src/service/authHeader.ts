import { AuthUser } from '../Entity/User'

const authHeader = () => {
    const user: AuthUser = JSON.parse(localStorage.getItem('user') || '')

    if (user.accessToken) {
        return {
            'x-access-token': user.accessToken
        }
    } else {
        console.error('No user in local storage!')
        return {}
    }
}

export default authHeader