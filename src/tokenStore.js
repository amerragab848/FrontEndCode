
export default class tokenStore {
    static setItem(key,value) {
        localStorage.setItem(key, value)
    }
    static getItem(key) {
        return localStorage.getItem(key)
    }
    static removeItem() {
        return localStorage.removeItem('userToken')
    }
}