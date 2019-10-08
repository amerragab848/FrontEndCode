import Api from "./api.js";
import lf from 'lovefield';
import IndexedDb from "./IndexedDb";
let db = null; 
const cachedData = lf.schema.create('cachedAPI', 1);

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

    static async GetDataListCached(url, label, value, tableName, condition) {

        if (tableName) {

            db = await cachedData.connect();
            db.getSchema().table(tableName);

            let rows = await db.select().from(tableName).exec();
            if (rows.length === 0) {
                return this.callAPIGetDataList(url, label, value);
            } else {
                return rows;
            }
        }
        else {
            return this.callAPIGetDataList(url, label, value);
        }
    };

    callAPIGetDataList = (url, label, value) => {
        let Data = []
        return Api.get(url).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                Data.push(obj);

                IndexedDb.seedTypes(result);
            });
            return Data;
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