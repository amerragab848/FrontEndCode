
let currentLanguage = localStorage.getItem('lang');
export default class Api {
    static headers() {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'dataType': 'json',
            'Lang':currentLanguage,
            'Authorization': 'Bearer 9JkBsJK5cKPJSKWnTbnVL6X9JgCFAg03Vcufd84BLppnormpEcCwWAmOOarecFs8_Pd_ggljMAgJbOOdBUAAmCp6ekCl_WucTNUxM7ncGF4eOWtO2VnpGf7pVg9e9C-W3YU_gZIuXNawspCLpdY1eZQM4TmQdOs8UhHPmjohrLNseGKjaHYdEtSe7GBI6WC1cbEGTf-mTMoxNLtXtewE1EI-0-3ixF6qwDxF1EQjte1Dg8MGIAgGR2mniDt_mshe5KX_reXnN0W07BL31YwIesYycyJGWr_ds-ym0F6n5gAvgpwaLYHf9Be1KnD9io6Y445eMJm3AfP-vOGicgrdVggKDSl9ec5oKMQRcctO1I24rRinTpf0QwlC4lX9_s4FRLv7pKL4Cw9AoDnmUBIx5gGvIjWtwWLi8vnG_fEaW6YseVAF'
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
