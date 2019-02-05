import config from "./IP_Configrations.json";
let currentLanguage = localStorage.getItem('lang');
let Authorization = localStorage.getItem('userToken');

const Domain = config.static
export default class Api {

    static headers() {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            'dataType': 'json',
            'Lang': localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang'),
            'Authorization': Authorization
        }
    } 

    static get(route) {
        return this.xhr(route, null, 'GET');
    }
    static post(route, params) {
        return this.xhr(route, params, 'POST');
    }


    static xhr(route, params, verb) {
        const host = Domain + '/PM/api/Procoor/';
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
        var payload = []; //CryptoJS.enc.Base64.parse(storage.getItem("claims")).toString(CryptoJS.enc.Utf8);

        return JSON.parse(payload);
    }

    static IsAllow(code) {
        let userPermissions = [];
        let isCompany = true;
        if (localStorage.getItem("permissions")) {
            let perms = [3198, 3515, 3514];// JSON.parse( CryptoJS.enc.Base64.parse(localStorage.getItem("permissions")).toString(CryptoJS.enc.Utf8));
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

        const host = Domain + '/PM/api/Procoor/';
        const url = `${host}${route}`;
        let headers = {}
        headers.Authorization = Authorization
        headers.docid = header.docId
        headers.doctypeid = header.docTypeId
        headers.parentid = header.parentId
        fetch(url, {
            method: 'POST',
            headers: {

                ...headers
            },
            body: params
        }).then(
            response => response.json()
        )
    } 

    static getPassword(route, password) { 
        const host = Domain+'/PM/api/Procoor/'; 
  
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

                return resp.status;
            }
            return json.then(err => {
                throw err
            });
        }).then(json => (json.result ? json.result : json));
    }

    static authorizationApi(route, params) {
        const host = 'https://procoorauthorization.procoor.com/api/';
        const url = `${host}${route}`;
        let json = null;

        let options = Object.assign({
            method: 'Put'
        }, params ? {
            body: JSON.stringify(params)
        } : null);

        options.headers = Api.headers();

        return fetch(url, options).then(resp => {
            if (resp.status === 200) {
                json =  resp.json();

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

}