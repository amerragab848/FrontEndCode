
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
            return {
                ...state,
                items: action.items ? action.items : []
            }

        case types.Document_for_Edit:
            console.log('Document_for_Edit...' , state.files, state.docId, state.changeStatus)
            return {
                ...state, 
                document: action.document,
                docId: action.docId,
                docTypeId: action.docTypeId,
                changeStatus: true,
                showLeftMenu: true,
                showSelectProject: false,
                showLeftReportMenu: false
            }; 

        case types.Clear_Cash_Document: 
            console.log('Clear_Cash_Document...' , state.files, state.docId, state.changeStatus)

            return {
                ...state,
                files: [],
                items: [],
                workFlowCycles:[]
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
            return {
                ...state,
                docId,
                items: [...state.items, ...action.item]
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
                hasWorkflow: action.hasWorkflow
            };


        case types.Send_WorkFlow:
            return {
                ...state,
                cycles: action.cycles
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

        default:
            return {
                ...state
            };
    }
}
