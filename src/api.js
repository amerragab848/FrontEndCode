import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import Config from "./Services/Config";

let Authorization = localStorage.getItem("userToken");

export default class Api {

    static headers() {
        return {
            Accept: "application/json",
            "Content-Type": "application/json",
            dataType: "json",
            isNewVersion: "true",
            Lang: localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang"),
            Authorization: Authorization === null ? localStorage.getItem("userToken") : Authorization
        };
    }

    static get(route, params) {
        return this.xhr(route, params === null ? null : params, "GET");
    }
    static post(route, params) {
        return this.xhr(route, params, "POST");
    }

    static xhr(route, params, verb) {
        const host = Config.getPublicConfiguartion().static + "/api/Procoor/";
        const url = `${host}${route}`;
        let json = null;

        let options = Object.assign(
            {
                method: verb
            },
            params
                ? {
                    body: JSON.stringify(params)
                }
                : null
        );

        options.headers = Api.headers();

        return fetch(url, options)
            .then(resp => {
                if (resp.status === 200) {
                    json = resp.json();
                    if (json === undefined) return null;
                    return json;
                } else if (resp.status === 401) {
                    localStorage.removeItem("userToken");
                    json = "";
                    window.location.reload();
                    return json;
                } else if (resp.status === 500) {
                    json = null;
                    toast.error("Sorry. something went wrong .A team of highly trained developers has been dispatched to deal with this situation!");

                    return json;
                } else if (resp.status === 409) {
                    return resp;
                }

                return json.then(err => {
                    throw err;
                });
            })
            .then(json => (json.result ? json.result : json))
            .catch(reason => {
                return null;
            });
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
        let json = "";
        const host = Config.getPublicConfiguartion().static + "/api/Procoor/";
        const url = `${host}${route}`;
        let headers = {};
        headers.Authorization = Authorization;
        if (header) {
            headers.docid = header.docId;
            headers.doctypeid = header.docTypeId;
            headers.parentid = header.parentId;

            headers.docType = header.docType;
        }
        return fetch(url, {
            method: "POST",
            headers: {
                ...headers
            },
            body: params
        })
            .then(resp => {
                if (resp.status === 200) {
                    json = resp.json();
                    if (json === undefined) return null;
                    return json;
                } else if (resp.status === 500) {
                    json = null;
                    toast.error(
                        "Sorry. something went wrong .A team of highly trained developers has been dispatched to deal with this situation!"
                    );

                    return json;
                } else if (resp.status === 401) {
                    localStorage.removeItem("userToken");
                    json = "";
                    window.location.reload();
                    return json;
                } else if (resp.status === 409) {
                    return resp;
                }

                return json.then(err => {
                    throw err;
                });
            })
            .then(json => (json.result ? json.result : json))
            .catch(reason => {
                return null;
                // response is not a valid json string
            });
    }
    static getPassword(route, password) {
        const host = Config.getPublicConfiguartion().static + "/api/Procoor/";

        const url = `${host}${route}`;
        let headers = Api.headers();
        headers.password = password;
        return fetch(url, {
            method: "POST",
            headers: {
                ...headers
            },
            body: null
        }).then(response => response.json());
    }

    static getPublicIP() {
        const url = "https://ipapi.co/json/?callback=?";
        let json = null;
        return fetch(url)
            .then(resp => {
                if (resp.status === 200) {
                    json = resp.json();
                    return json;
                } else if (resp.status === 500) {
                    json = null;

                    return json;
                }

                return json.then(err => {
                    throw err;
                });
            })
            .then(json => (json.result ? json.result : json));
    }

    static Login(hostt, route, params) {
        const host = hostt;
        const url = `${host}${route}`;

        let json = null;
        let options = Object.assign(
            {
                method: "Post"
            },
            params
                ? {
                    body: params
                }
                : null
        );

        options.headers = {
            Accept: "*/*",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: Authorization
        };
        return fetch(url, options)
            .then(resp => {
                if (resp.status === 200) {
                    json = resp != null ? resp.json() : "";
                    return json;
                } else if (resp.status === 400) {
                    return resp;
                } else if (resp.status === 401) {
                    localStorage.removeItem("userToken");

                    window.location.reload();
                }
                return json.then(err => {
                    throw err;
                });
            })
            .then(json => (json.result ? json.result : json));
    } 

    static authorizationApi(route, params, method, isCheck) {
        const host = Config.getPublicConfiguartion().loginServer + "/api/";
        const url = `${host}${route}`;
        let json = null;

        let options = Object.assign({ method: method === null ? "PUT" : method },
            params ? { body: JSON.stringify(params) } : null
        );

        options.headers = Api.headers();
        var returnObject = {};
        return fetch(url, options).then(reponse => {
            if (reponse.status === 200) {
                returnObject.status = 200;
               
                if (isCheck) { 
                    returnObject.msg = "Email already exists.";
                } else {

                    returnObject.msg = "Successfuly created account.";
                }
                json = returnObject;
                return json;
            } else if (reponse.status === 500) {
                json = null;
                return json;
            } else if (reponse.status === 401) {
                returnObject.status = 401;
                returnObject.msg = "Email already exists.";
                json = returnObject;
                return json;
            }else if (reponse.status === 400) {
                returnObject.status = 400;
                returnObject.msg = "Email already Belonge to Another Company.";
                
                json = returnObject;
                return json;
            } else if (reponse.status === 404) {
                returnObject.status = 404;
                returnObject.msg = "This Email Not Belongs to This Company";
                json = returnObject;
                return json;
            }
        }).then(json => {
            if (json.result) {
                return json.result
            } else {
                return json
            }
        }
        );
    }

    static IsAuthorized() {
        let authorize = false;
        if (localStorage.getItem("userToken")) {
            authorize = true;
        }
        return authorize;
    }
}
