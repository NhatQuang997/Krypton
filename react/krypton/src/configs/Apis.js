import axios from 'axios'

export let host = 'http://127.0.0.1:8000/'

export let endpoints = {
    'oauth2': 'oauth2-info/',
    'login': 'o/token/',
    'current-user': 'users/current-user/',
    'register': 'users/',
    'favorite-coins': 'favorite-coins/',
    'link-account': 'users/link-account/',
    'accounts': 'users/accounts/',
    'delete-account': (id) => `account/${id}/`,
    'balance': (id,type) => `balance?pk=${id}&type=${type}`,
    'transfer': 'balance',
}

export default axios.create({
    baseURL: host
})