import axios from 'axios'
import config from '../env'

import { User } from '../Entity/User'

const API_URL = config.API_URL

const register = ({ userName, password }: User) => {
    return axios.post(API_URL + '/auth/signup', {
        userName, password
    })
}

const login = ({ userName, password }: User) => {
    return axios
        .post(API_URL + '/auth/login', {
            userName, password
        })
        .then(res => {
            console.log('the res ', res)
            if (res.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(res.data))
            } else {
                console.log(res.data.error)
            }
        })
        .catch(err => {
            throw err
        })
}

const verifyToken = async (token: string) => {
    const result = await axios.post(API_URL + '/auth/verifyToken', { token })
    return result.data.veified
}

const verifyFromLocalStorage = (key: string) => {
    const token = window.localStorage.getItem(key)
    return token
}

const logout = () => {
    localStorage.removeItem('user')
    window.location.replace('/')
}

export {
    register, login, logout, verifyToken, verifyFromLocalStorage
}