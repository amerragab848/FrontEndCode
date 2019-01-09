
let currentLanguage = localStorage.getItem('lang');
export default class Api {
    static headers() {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'dataType': 'json',
            'Lang':localStorage.getItem('lang')==null? 'en' : localStorage.getItem('lang'),
            'Authorization': 'Bearer RBYirnnWQC_tsVjWYP5lCinxtue2dgZAoOJcSr3AS6BGUsb92bIGGu6eNzreiUfwNZsfSnedKGML1CHOLju4Nax5S-UX3JelXMSIL6Qw9ZQZ7KcWBF2nL2SOO9fap5Kem-CsiN-kRRR_TLG6wzg3mjkEuoBcJXrSQV1eE1JazXzhf0rKH7ymUBdoipHBVyyu3EX_AQ58k-XPEhaqeutkpuSinI3n1YmljKwgP7AV3nb9K4QbNz32OnON-2FgBMmJnTsIdiizfPYtcyDUuH0BpuosVByk6bC5yzcYPeh9AlvCTOWpFGCcV3GlZt9efj3sOE83s_4sY9TIEX9eUSF5uohWhyLw7oEqnsZK88qNHCanzBWdtaPkgprcdVlN1WT85INokJc6fCQg801M_nFbeWhDRxPne9StOQcyN9k2pMwLhsl-'
        }
    }

    static get(route) {
        return this.xhr(route, null, 'GET');
    }

  

    static xhr(route, params, verb) {
        const host = 'https://demov4services.procoor.com/PM/api/Procoor/';
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

            return json.then(err => {
                throw err
            });
        }).then(json => (json.result ? json.result : json));
    }
}
