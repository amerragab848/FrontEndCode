import Api from "./api.js";
import IndexedDb from "./IndexedDb";
//import { object } from "prop-types";
//let db = null; 
//const cachedData = lf.schema.create('cachedAPI', 1);

export default class Dataservice {

    static GetDataList(url, label, value) {
        let Data = []
        return Api.get(url).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                Data.push(obj);
            });
            return Data;
        }).catch(ex => Data);
    };
    static GetDataListWithAdditionalParam(url, label, value, param) {
        let Data = []
        return Api.get(url).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                obj.param = item[param]
                Data.push(obj);
            });
            return Data;
        }).catch(ex => Data);
    };

    static async GetDataListCached(url, label, value, tableName, params, mainColumn) {
        let rows = await IndexedDb.GetCachedData(params, tableName, mainColumn);
        let Data = [];
        if (rows.length == 0) {
            rows = await this.callAPIGetDataList(url, label, value, params);
            IndexedDb.setData(mainColumn, value, label, tableName, rows, params);

            rows.forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                obj[mainColumn] = item[mainColumn];
                Data.push(obj);
            });
            rows = Data;
        }
        return rows;
    };

    static async callAPIGetDataList(url) {
        let Data = []
        return Api.get(url).then(result => {
            return result;
        }).catch(ex => Data);
    }
    static async getGoMeetingAPIs(url) {
        let Data = []
        return Api.getGoMeetingAPIs(url).then(result => {
            return result;
        }).catch(ex => Data);
    }
    static async postGoMeetingAPIs(url, params) {
        let Data = []
        return Api.postGoMeetingAPIs(url, params).then(result => {
            return result;
        }).catch(ex => Data);
    }
    static async postGoMeetingToken(url, params) {
        let Data = []
        return Api.postGoMeetingToken(url, params).then(result => {
            return result;
        }).catch(ex => Data);
    }
    static GetDataListWithNewVersion = (url, label, value, tableName) => {
        let Data = []
        return Api.get(url).then(result => {
            (result.data).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                Data.push(obj);
            });
            return Data;
        }).catch(ex => Data);
    };

    static addObject = (url, docObj) => {

        return Api.post(url, docObj).then(result => {
            return result;
        });
    };

    static addObjectCore = (url, docObj, verb) => {

        return Api.getDataAPIsByCore(url, docObj, verb).then(result => {
            return result;
        });
    };

    static GetNextArrangeMainDocument = (url) => {
        let Data = 0
        return Api.get(url).then(result => {

            return result;
        }).catch(ex => Data);
    };

    static GetRefCodeArrangeMainDoc = (url) => {
        let Data = 0
        return Api.get(url).then(result => {

            return result;
        }).catch(ex => Data);
    };

    static GetDataGrid = (url) => {

        return Api.get(url).then(result => {

            return result;
        }).catch(ex => []);
    };
    static GetDataGridPost = (url) => {

        return Api.post(url).then(result => {

            return result;
        }).catch(ex => []);
    };
    static GetAttachesPost = (params, searchOptions) => {

        return Api.PostForGetAttaches(params, searchOptions).then(result => {

            return result;
        }).catch(ex => []);
    };

    static GetRowById = (url) => {

        return Api.get(url).then(result => {

            return result;
        }).catch(ex => { });
    };

}