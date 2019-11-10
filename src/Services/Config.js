import CryptoJS from "crypto-js";

let userPermissions = window.localStorage.getItem("permissions") ? JSON.parse(CryptoJS.enc.Base64.parse(window.localStorage.getItem("permissions")).toString(CryptoJS.enc.Utf8)) : [];
let IP_CONFIG = null;
let signautre = null;
export default class Config {

    static getPublicConfiguartion() {
        return IP_CONFIG;

    }

    static SetConfigObject(info) {
        IP_CONFIG = info;
    }
    static setSignature(sign) {
        signautre = sign;
    }
    static getSignature() {
       return  signautre ;
    }

    static getPermissions() {
        var permissions = userPermissions;
        userPermissions = permissions;
        return permissions;
    }

    static IsAllow(code) {
        let isCompany = this.getPayload().uty == "company" ? true : false;

        if (isCompany === false) {
            let isAllowed = userPermissions.indexOf(code);
            if (isAllowed > -1) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    static getPayload() {
        var payload = window.localStorage.getItem("claims") ? CryptoJS.enc.Base64.parse(window.localStorage.getItem("claims")).toString(CryptoJS.enc.Utf8) : "";
        return payload ? JSON.parse(payload) : {};
    }

    static IsAuthorized() {
        let authorize = false;
        if (localStorage.getItem("userToken")) {
            authorize = true;
        }
        return authorize;
    }
}
