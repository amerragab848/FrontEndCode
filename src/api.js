import config from "./IP_Configrations.json";
import CryptoJS from 'crypto-js';
import { toast } from "react-toastify";
 
let Authorization = localStorage.getItem('userToken');

const Domain =  config.static

export default class Api {

    static headers() {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'dataType': 'json',
            'isNewVersion': 'true',
            'Lang': localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang'),
            'Authorization': localStorage.getItem('userToken')
        }
    }

    static get(route, params) {
        return this.xhr(route, params === null ? null : params, 'GET');
    }
    static post(route, params) {
        return this.xhr(route, params, 'POST');
    }

    static xhr(route, params, verb) {
         
        const host = Domain + '/api/Procoor/';
        const url = `${host}${route}`;
        let json = null;

        let options = Object.assign({
            method: verb
        }, params ? {
            body: JSON.stringify(params)
        } : null);

        options.headers = Api.headers();

        return fetch(url, options).then(resp => {
            if (resp.status === 200) {

                json = resp.json();
                if (json === undefined)
                    return null;
                return json;
            }
            else if (resp.status === 500) {
                json = null;
                toast.error('Sorry. something went wrong .A team of highly trained developers has been dispatched to deal with this situation!');

                return json;
            }
            else if (resp.status === 401) {
                localStorage.removeItem('userToken')
                json = "";
                window.location.reload();
                return json;
            }
            else if (resp.status === 409) {
                return resp;
            }

            return json.then(err => {
                throw err
            });

        }).then(json => (json.result ? json.result : json)).catch(reason => {
            return null;
            // response is not a valid json string
        });
    }

    static ConvertNumbers(number, decPlaces) {
        var orig = number;
        var dec = decPlaces;
        // 2 decimal places => 100, 3 => 1000, etc
        decPlaces = Math.pow(10, decPlaces);

        // Enumerate number abbreviations
        var abbrev = ["k", "m", "b", "t"];

        // Go through the array backwards, so we do the largest first
        for (var i = abbrev.length - 1; i >= 0; i--) {

            // Convert array index to "1000", "1000000", etc
            var size = Math.pow(10, (i + 1) * 3);

            // If the number is bigger or equal do the abbreviation
            if (size <= number) {
                // Here, we multiply by decPlaces, round, and then divide by decPlaces.
                // This gives us nice rounding to a particular decimal place.
                var number = Math.round(number * decPlaces / size) / decPlaces;

                // Handle special case where we round up to the next abbreviation
                if ((number === 1000) && (i < abbrev.length - 1)) {
                    number = 1;
                    i++;
                }

                // console.log(number);
                // Add the letter for the abbreviation
                number += abbrev[i];

                // We are done... stop
                break;
            }
        }
    }

    static GetPayload() {
        var payload = [];

        return JSON.parse(payload);
    }

    static IsAllow(code) {
        let userPermissions = [];
        let isCompany = true;
        if (localStorage.getItem("permissions")) {
            let perms = JSON.parse(CryptoJS.enc.Base64.parse(localStorage.getItem("permissions")).toString(CryptoJS.enc.Utf8));
            userPermissions = perms;
        }

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

    static postFile(route, params, header) {
        let json = ''
        const host = Domain + '/api/Procoor/';
        const url = `${host}${route}`;
        let headers = {}
        headers.Authorization = localStorage.getItem('userToken')
        if (header) {
            headers.docid = header.docId
            headers.doctypeid = header.docTypeId
            headers.parentid = header.parentId

            headers.docType = header.docType
        }
        return fetch(url, {

            method: 'POST',
            headers: {

                ...headers
            },
            body: params
        }).then(resp => {
            if (resp.status === 200) {

                json = resp.json();
                if (json === undefined)
                    return null;
                return json;
            }
            else if (resp.status === 500) {
                json = null;
                toast.error('Sorry. something went wrong .A team of highly trained developers has been dispatched to deal with this situation!');

                return json;
            }
            else if (resp.status === 401) {
                localStorage.removeItem('userToken')
                json = "";
                window.location.reload();
                return json;
            }
            else if (resp.status === 409) {
                return resp;
            }

            return json.then(err => {
                throw err
            });

        }).then(json => (json.result ? json.result : json)).catch(reason => {
            return null;
            // response is not a valid json string
        });


    }
    static getPassword(route, password) {

        const host = Domain + '/api/Procoor/';

        const url = `${host}${route}`;
        let headers = Api.headers();
        headers.password = password
        return fetch(url, {
            method: 'POST',
            headers: {

                ...headers
            },
            body: null
        }).then(
            response => response.json()

        )
    }

    static getPublicIP() {
        const url = 'https://ipapi.co/json/?callback=?';
        let json = null;
        return fetch(url).then(resp => {
            if (resp.status === 200) {

                json = resp.json();
                return json;
            }
            else if (resp.status === 500) {
                json = null;

                return json;
            }

            return json.then(err => {
                throw err
            });

        }).then(json => (json.result ? json.result : json));
    }
    static Login(hostt, route, params) {
        const host = hostt;
        const url = `${host}${route}`;


        let json = null;
        let options = Object.assign({
            method: 'Post'
        }, params ? {
            body: (params)
        } : null);

        options.headers = {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': Authorization,

        };
        return fetch(url, options).then(resp => {
            if (resp.status === 200) {
                json = resp != null ? resp.json() : "";
                return json;
            }
            else if (resp.status === 400) {
                return resp;
            }
            else if (resp.status === 401) {

                localStorage.removeItem('userToken')

                window.location.reload();
            }
            return json.then(err => {
                throw err
            });
        }).then(json => (json.result ? json.result : json));
    }

    static authorizationApi(route, params, method) {
        const host = config.loginServer + '/api/'
        const url = `${host}${route}`;
        let json = null;

        let options = Object.assign({
            method: method === null ? 'PUT' : method
        }, params ? {
            body: JSON.stringify(params)
        } : null);

        options.headers = Api.headers();

        return fetch(url, options).then(resp => {
            if (resp.status === 200) {
                json = resp.json();

                return json;
            }
            else if (resp.status === 500) {
                json = null;

                return json;
            }
            else if (resp.status === 401) {

                localStorage.removeItem('userToken')
            }
            return json.then(err => {
                throw err
            });

        }).then(json => (json.result ? json.result : json));
    }
    static IsAuthorized() {
        let authorize = false;
        if (localStorage.getItem('userToken')) {
            authorize = true;
        }

        return authorize;
    }
   
}