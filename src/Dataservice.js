import Api from "./api.js";
import IndexedDb from "./IndexedDb";
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

    static async GetDataListCached(url, label, value, tableName, params, mainColumn) {
        console.log("test "+ url, label, value, tableName, params, mainColumn);
        let rows = await IndexedDb.GetCachedData(params, tableName, mainColumn);
        let Data = []; 
        if (rows.length == 0) {
            console.log('do calling....');
            rows = await this.callAPIGetDataList(url, label, value, params);
            IndexedDb.setData(mainColumn, value, label, tableName, rows,params);

            rows.forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                obj[mainColumn]= item[mainColumn];
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

    static GetRowById = (url) => {

        return Api.get(url).then(result => {

            return result;
        }).catch(ex => { });
    };

}