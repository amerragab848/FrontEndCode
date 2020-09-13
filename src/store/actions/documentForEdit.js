import Api from '../../api';
import { toast } from "react-toastify";
import Resources from "../../resources.json";
import { currentLanguage } from './communication';
export function documentForEdit(urlAction, docTypeId, docName) {
    return (dispatch, getState) => {
        return Api.get(urlAction).then(resp => {
            dispatch({
                type: types.Document_for_Edit,
                document: resp,
                docId: resp.id,
                docAlertId: resp.docAlertId,
                docTypeId: docTypeId,
                showLeftReportMenu: false,
                docName: docName
            });
        }).catch((ex) => {
            toast.error(Resources["failError"][currentLanguage]);
            dispatch({
                type: types.Document_for_Edit,
                document: [],
                docId: 0
            });
        });
    };
}
