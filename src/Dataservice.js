import Api from "./api.js";

export default class Dataservice {

    static GetDataList = (url, label, value) => {
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
    
    static GetDataListWithNewVersion = (url, label, value) => {
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
        });//.catch(ex => { });
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

    static GetRowById = (url) => {

        return Api.get(url).then(result => {

            return result;
        }).catch(ex => {});
    };
}