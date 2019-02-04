
export default class tokenStore {
    static setItem(key,value) {
        localStorage.setItem(key, value)
    }
    static getToken() {
        return localStorage.getItem('userToken')
    }
    static removeItem() {
        return localStorage.removeItem('userToken')
    }
}