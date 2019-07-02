
import * as types from '../../store/actions/types';

import initialState from '../initialState';
import { parse } from 'url';

export default function (state = initialState.app.communication, action) {

    switch (action.type) {

        case types.ViewDocsAttachment:
            state.attachDocuments = action.attachDocuments
            return {
                ...state
            } 

        case types.Export_Document:
            console.log('Export_Document....',action.items)
            let _items=state.items.length>0? state.items:action.items.length>0?action.items:[]
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
                documentTitle:action.docName
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
                projectId: state.projectId == 0 ? localStorage.getItem('lastSelectedProject') : state.projectId,
                projectName: state.projectName == "" ? localStorage.getItem('lastSelectedprojectName') : state.projectName
            };

        case types.File_Upload:
            return {
                ...state,
                files: [...state.files, action.file],
                isLoadingFiles: true
            };

        case types.add_item:
            let docId = state.docId == 0 ? action.docId : state.docId;
            console.log('add_item reducer',state.items, action.item)
            return {
                ...state,
                docId,
                items: [...state.items, ...action.item]
            };

            case types.reset_items: 
                return {
                    ...state, 
                    items: action.data
                };

        case types.edit_item:
            let updateRow = action.item;
            let items = []
            state.items.forEach(item => {
                if (item.id == updateRow.id)
                    item = updateRow
                items.push(item)
            })
            return {
                ...state,
                items
            };

        case types.delete_item:
            let originalData = state.items;
            action.data.forEach(item => {
                let getIndex = originalData.findIndex(x => x.id === item.id);

                originalData.splice(getIndex, 1);

            });

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

        case types.SendByEmail:
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

        default:
            return {
                ...state
            };
    }
}
