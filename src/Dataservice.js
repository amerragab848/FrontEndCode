import Api from "./api.js";
//import IndexedDb from "./IndexedDb";
 
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
    static GetDataListForUserAlert(url, label, value) {
        let primaveraList = [];
        let scheduleList = []; 
        let Data = []; 
        return Api.get(url).then(result => {
            (result.primaveraList).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                primaveraList.push(obj);
            });
            (result.scheduleList).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                scheduleList.push(obj);
            });
            Data.push(primaveraList);
            Data.push(scheduleList);

            return Data;
        }).catch(ex => Data);
    };
    static GetDataListForMaterialReturned(url, label, value, contractId) {
        let Data = []
        return Api.get(url).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                obj.contractId = item[contractId];
                Data.push(obj);
            });
            return Data;
        }).catch(ex => Data);
    };
    static GetDataListSiteRequestNewVersion = (url, label, value, contractId, contractName) => {
        let Data = []
        return Api.get(url).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                obj.contractId = item[contractId];
                obj.contractName = item[contractName];
                Data.push(obj);
            });
            return Data;
        }).catch(ex => Data);
    };
    static GetDataListForContract(url, label, value, boqId) {
        let Data = []
        return Api.get(url).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                obj.boqId = item[boqId];
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

    // static async GetDataListCached(url, label, value, tableName, params, mainColumn) {
    //     let rows = await IndexedDb.GetCachedData(params, tableName, mainColumn);
    //     let Data = [];
    //     if (rows.length == 0) {
    //         rows = await this.callAPIGetDataList(url, label, value, params);
    //         IndexedDb.setData(mainColumn, value, label, tableName, rows, params);
    //         if (rows !=null) {
    //             rows.forEach(item => {
    //                 var obj = {};
    //                 obj.label = item[label];
    //                 obj.value = item[value];
    //                 obj[mainColumn] = item[mainColumn];
    //                 Data.push(obj);
    //             });
    //         }
    //         rows = Data;
    //     }
    //     return rows;
    // };

    static async GetDataListCached(url, label, value, tableName, params, mainColumn) {

        let rows = await this.callAPIGetDataList(url, label, value, params);
        let Data = [];
        if (rows.length > 0) {
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
        }).catch(ex => "");
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


    static checkSubmittalRefCode = (projectId,code) => {

        return Api.get("checkSubmittalRefCode?projectId="+projectId+"&code="+code).then(result => {
            return result;
        }).catch(ex => { });
    };

    static checkContractROAId = (ROAId,docId) => {
        return Api.get("CheckROAIdExist?ROAId="+ROAId+"&docId="+docId).then(result => {
            return result;
        }).catch(ex => { });
    };
}