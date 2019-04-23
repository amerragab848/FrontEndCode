
import ip_public from "../IP_Configrations.json";

import CryptoJS from 'crypto-js';
 
let userPermissions = window.localStorage.getItem("permissions") ? CryptoJS.enc.Base64.parse(window.localStorage.getItem("permissions")).toString(CryptoJS.enc.Utf8) : [];
 
export default class Config {

	static getPublicConfiguartion() {
		return ip_public;
	}

	static getPermissions() {
		var permissions = userPermissions;
		userPermissions = permissions;
		return permissions;
	}

	static IsAllow(code) {

		let isCompany = this.getPayload().uty == 'company' ? true : false;

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
}
