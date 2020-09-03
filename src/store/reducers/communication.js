
import * as types from '../../store/actions/types';

import initialState from '../initialState';
import { parse } from 'url';


export default function (state = initialState.app.communication, action) {

    let totalCost = 0;

    switch (action.type) {

        case types.Export_Document:
            let _items = state.items.length > 0 ? state.items : action.items.length > 0 ? action.items : []
            return {
                ...state, items: _items
            }

        case types.Document_for_Edit:
            return {
                ...state,
                document: action.document,
                docId: action.docId,
                docTypeId: action.docTypeId,
                changeStatus: true,
                showLeftMenu: true,
                showSelectProject: false,
                showLeftReportMenu: false,
                //docsAttachData: [],
                documentTitle: action.docName
            };

        case types.Clear_Cash_Document:

            return {
                ...state,
                document: {},
                changeStatus: false,
                hasWorkflow: false,
                files: [],
                items: [],
                workFlowCycles: []
            };

        case types.Show_OptionPanel:

            return {
                ...state,
                showModal: action.showModal
            };

        case types.Document_Adding:
            return {
                ...state,
                document: {},
                showLeftMenu: true,
                showSelectProject: false,
                changeStatus: false,
                items: [],
                docsAttachData: [],
                projectId: state.projectId == 0 ? localStorage.getItem('lastSelectedProject') : state.projectId,
                projectName: state.projectName == "" ? localStorage.getItem('lastSelectedprojectName') : state.projectName
            };

        case types.File_Upload:
            return {
                ...state,
                files: [...state.files, action.file],
                isLoadingFilesUpload: false
            };

        case types.add_item:
            let docId = state.docId == 0 ? action.docId : state.docId;
            const originalItemData = [...state.items, ...action.item];

            totalCost = 0;

            originalItemData.forEach(item => {
                return totalCost += item.total;
            })
            return {
                ...state,
                docId,
                items: originalItemData,
                totalCost,
                isLoading: false
            };

        case types.reset_items:
            return {
                ...state,
                items: action.data
            };

        case types.edit_item:
            //let updateRow = action.item;
            //let items = [];
            totalCost = 0;

            let originalItemDataForEdit = state.items.filter(x => x.id !== action.item[0].id);

            originalItemDataForEdit.push(action.item[0]);

            originalItemDataForEdit.forEach(item => {
                // if (item.id == updateRow.id)
                //     item = updateRow
                // items.push(item)

                totalCost += item.total;
            })

            return {
                ...state,
                items: originalItemDataForEdit,
                totalCost,
                isLoading: false
            };

        case types.delete_item:
            let originalData = state.items;

            totalCost = 0;

            action.data.forEach(item => {
                let getIndex = originalData.findIndex(x => x.id === item);
                originalData.splice(getIndex, 1);
            });

            originalData.forEach(item => {
                totalCost += item.total;
            });

            return {
                ...state,
                items: originalData,
                totalCost,
                isLoading: false
            };

        case types.delete_items:
            return {
                ...state,
                items: []
            };

        case types.Delete_File:
            let files = [...state.files];
            let index = files.indexOf(action.file);
            if (index !== -1) {
                files.splice(index, 1);
            }
            return {
                ...state,
                files: files
            };

        case types.Get_Files:
            return {
                ...state,
                files: [...action.files],
                isLoadingFiles: true
            };

        case types.Cycles_WorkFlow:
            return {
                ...state,
                workFlowCycles: action.workFlowCycles,
                hasWorkflow: action.hasWorkflow,
                showModal: action.showModal
            };


        case types.Send_WorkFlow:
            return {
                ...state,
                cycles: action.cycles
            };

        case types.Sending_WorkFlow:
            return {
                ...state,
                showModal: action.showModal
            };

        case types.SendByEmail_Inbox:
            return {
                ...state,
                showModal: action.showModal
            };
        case types.CopyTo:
            return {
                ...state,
                showModal: action.showModal
            };


        case types.Update_Field:
            return {
                ...state,
                document: action.document
            };

        case types.NextArrange:
            return {
                ...state,
                document: { ...state.document, ...action.arrange }
            };
        case types.RouteToDashboardProject:

            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showSelectProject: action.showSelectProject,
                showLeftReportMenu: action.showLeftReportMenu,
                projectId: action.projectId == 0 ? localStorage.getItem('lastSelectedProject') : action.projectId,
                projectName: action.projectName == "" ? localStorage.getItem('lastSelectedprojectName') : action.projectName
            };
        case types.RouteToTemplate:

            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showLeftReportMenu: action.showLeftReportMenu,
                showSelectProject: action.showSelectProject
            };
        case types.RouteToMainDashboard:

            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showSelectProject: action.showSelectProject,
                showLeftReportMenu: action.showLeftReportMenu,
                projectId: action.projectId,
                projectName: action.projectName
            };

        case types.AboveSelectProject:

            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showSelectProject: action.showSelectProject,
                projectId: action.projectId,
                showLeftReportMenu: action.showLeftReportMenu,
                projectName: action.projectName
            };

        case types.LeftMenuClick:

            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showSelectProject: action.showSelectProject,
                showLeftReportMenu: action.showLeftReportMenu,
                projectId: action.projectId,
                projectName: action.projectName,
                moduleName: action.moduleName
            };

        case types.ReportCenterMenu:

            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showSelectProject: action.showSelectProject,
                showLeftReportMenu: action.showLeftReportMenu,
                projectId: action.projectId,
                projectName: action.projectName,
                moduleName: action.moduleName
            };

        case types.FillGridLeftMenu:

            return {
                ...state,
                showLeftMenu: action.showLeftMenu,
                showSelectProject: action.showSelectProject,
                showLeftReportMenu: action.showLeftReportMenu,
                projectId: localStorage.getItem('lastSelectedProject'),
                projectName: localStorage.getItem('lastSelectedprojectName'),
                moduleName: localStorage.getItem('moduleName')
            };

        case types.Get_Attendees_Table:
            let table = []
            action.data.forEach(element => {
                table.push({
                    companyId: element.companyId,
                    Id: element.id,
                    companyName: element.companyName,
                    contactId: element.contactId,
                    contactName: element.contactName

                })
            });

            state.attendees = table
            return {
                ...state
            };

        case types.Get_Topics_Table:
            let table1 = []
            action.data.forEach(element => {
                table1.push({
                    description: element.itemDescription,
                    calledByCompanyId: element.byWhomCompanyId,
                    calledByCompany: element.byWhomCompanyName,
                    calledByContactId: element.byWhomContactId,
                    calledByContact: element.byWhomContactName,
                    decisions: element.decisions,
                    action: element.action,
                    comment: element.comment,
                    Id: element.id,
                    arrange: element.arrange,
                    requiredDate: element.requiredDate

                })
            });
            state.topics = table1
            return {
                ...state
            };

        case types.GetDocumentCycle:

            state.documentCycle = action.data
            return {
                ...state
            };

        case types.Set_DocId:
            state.docId = action.docId
            return {
                ...state
            };

        case types.GET_DOCS_ATTACH:
            return { ...state, docsAttachData: action.data }

        case types.ViewDocsAttachment:
            state.docsAttachData = action.data
            return {
                ...state
            }

        case types.GET_RELATED_LINK:
            return { ...state, relatedLinkData: action.data || [] }

        case types.DELETE_DOCS_ATTACH:
            let newData = state.docsAttachData.filter(s => s.id !== action.id)
            return { ...state, docsAttachData: newData }

        case types.GET_DOCUMNET_DATA:
            let updateData = []
            action.data.filter(function (item) {
                let filterData = state.docsAttachData.filter(s => s.docId === item.docId && s.docType === item.docType)
                if (!filterData.length) {
                    updateData.push(item)
                }
                return filterData
            });
            return { ...state, documentData: updateData }

        case types.ADD_DOCS_ATTACH:
            return { ...state, docsAttachData: action.resp || [], documentData: [] }

        case types.SET_ISREJECT:
            return { ...state, isReject: action.data }

        case types.FILL_PROJECTS_DROPDOWN:
            return { ...state, projectDropdown: action.projectDropdown }

        case types.FILL_TASKS_DROPDOWN:
            return { ...state, taskDropdown: action.taskDropdown }

        case types.FILL_LOCATIONS_DROPDOWN:
            return { ...state, locationDropdown: action.locationDropdown }

        case types.FILL_COUNTRIES_DROPDOWN:
            return { ...state, countryDropdown: action.countryDropdown }

        case types.Export_REPORT_Document:
            return { ...state, items: action.items }
        
        case types.REPORT_FILTERS:
            return {...state,document:action.document}

        case types.SET_LOADING:
            return { ...state, isLoading: true, isLoadingFilesUpload: true }

        case types.GET_ITEMS:
            return { ...state, items: action.document }
        case types.Attachments_WF_Cycles:
            return { ...state, files: action.files, workFlowCycles: action.workFlowCycles }

        default:
            return {
                ...state
            };
    }
}
