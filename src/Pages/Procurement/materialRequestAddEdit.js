import React, { Component, Fragment } from "react";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachment";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import Config from "../../Services/Config.js";
import CryptoJS from "crypto-js";
import moment from "moment";
import SkyLight from "react-skylight";
import Distribution from "../../Componants/OptionsPanels/DistributionList";
import SendToWorkflow from "../../Componants/OptionsPanels/SendWorkFlow";
import DocumentApproval from "../../Componants/OptionsPanels/wfApproval";
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import { toast } from "react-toastify";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import Api from "../../api";
import ReactTable from "react-table";
import XSLfile from '../../Componants/OptionsPanels/XSLfiel'
import 'react-table/react-table.css'
import IPConfig from '../../IP_Configrations'
import GridSetupWithFilter from "../Communication/GridSetupWithFilter";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
import Recycle from '../../Styles/images/attacheRecycle.png'
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
    arrange: Yup.string().required(Resources["arrangeRequired"][currentLanguage]),
    fromCompany: Yup.string().required(Resources["fromCompanyRequired"][currentLanguage]).nullable(true),
    discipline: Yup.string().required(Resources["disciplineRequired"][currentLanguage]).nullable(true),
});
const contractSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),

});
const materialSchema = Yup.object().shape({
    subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
    M_contact: Yup.string().required(Resources["fromContactRequired"][currentLanguage]).nullable(true),
    M_siteRequest: Yup.string().required(Resources["siteRequestSelection"][currentLanguage]).nullable(true),
    M_specsSection: Yup.string().required(Resources["specsSectionSelection"][currentLanguage]).nullable(true),
    M_releaseType: Yup.string().required(Resources["materialReleaseTypeSelection"][currentLanguage]).nullable(true),
    M_contractBoq: Yup.string().required(Resources["boqLog"][currentLanguage]).nullable(true),
});
let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
const _ = require("lodash");

class materialRequestAddEdit extends Component {
    constructor(props) {
        super(props);
        const query = new URLSearchParams(this.props.location.search);
        let index = 0;
        for (let param of query.entries()) {
            if (index == 0) {
                try {
                    let obj = JSON.parse(CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8));

                    docId = obj.docId;
                    projectId = obj.projectId;
                    projectName = obj.projectName;
                    isApproveMode = obj.isApproveMode;
                    docApprovalId = obj.docApprovalId;
                    arrange = obj.arrange;

                } catch {
                    this.props.history.goBack();
                }
            }
            index++;
        }
        let editQuantity = ({ value, row }) => {
            if (row) {
                return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer' }}>{row.quantity != null ? row.quantity : 0}</span></a>;
            }
            return null;
        };
        let editStock = ({ value, row }) => {
            if (row) {
                return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer' }}>{row.stock != null ? row.stock : 0}</span></a>;
            }
            return null;
        };
        let editRequestQty = ({ value, row }) => {
            if (row) {
                return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer' }}>{row.requestedQuantity != null ? row.requestedQuantity : 0}</span></a>;
            }
            return null;
        };
        this.itemsColumns = [
            {
                key: "arrange",
                name: Resources["arrange"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true

            }, {
                key: "details",
                name: Resources["details"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "quantity",
                name: Resources["quantity"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: editQuantity,
                editable: true
            }, {
                key: "stock",
                name: Resources["stock"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: editStock,
                editable: true
            }, {
                key: "unit",
                name: Resources["unit"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "days",
                name: Resources["days"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "resourceCode",
                name: Resources["resourceCode"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "itemCode",
                name: Resources["itemCode"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ];
        this.MRColumns = [
            {
                key: "resourceCode",
                name: Resources["resourceCode"][currentLanguage],
                width: 140,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true

            }, {
                key: "itemCode",
                name: Resources["itemCode"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "quantity",
                name: Resources["quantity"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "stock",
                name: Resources["stock"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "requestedVariance",
                name: Resources["requestedVariance"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "requestedQuantity",
                name: Resources["releasedQuantity"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: editRequestQty,
                editable: true
            }
        ];
        this.state = {
            updatedItems: [],
            updatedchilderns: [],
            selectedRows: [],
            childerns: [],
            MRItems: [],
            materialTypes: [
                { label: Resources.actions[currentLanguage], value: 0 },
                { label: Resources.newBoq[currentLanguage], value: 1 },
                { label: Resources.addContract[currentLanguage], value: 2 },
                { label: Resources.addPurchaseOrder[currentLanguage], value: 3 },
                { label: Resources.addMaterialRelease[currentLanguage], value: 4 }
            ],
            materialType: { label: Resources.actions[currentLanguage], value: 0 },
            _items: [],
            M_arrange: 0,
            isEdit: false,
            currentTitle: "sendToWorkFlow",
            showModal: false,
            showContractModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            isView: false,
            docId: docId,
            docTypeId: 88,
            docType: 51,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            contacts: [],
            discplines: [],
            items: [],
            siteRequests: [],
            releaseTypes: [],
            specsSections: [],
            contractBoqs: [],
            permission: [
                { name: "sendByEmail", code: 122 },
                { name: "sendByInbox", code: 121 },
                { name: "sendTask", code: 0 },
                { name: "distributionList", code: 973 },
                { name: "createTransmittal", code: 3059 },
                { name: "sendToWorkFlow", code: 721 },
                { name: "viewAttachments", code: 3282 },
                { name: "deleteAttachments", code: 852 }
            ],
            fromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            M_fromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            M_contact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            M_specsSection: { label: Resources.specsSectionSelection[currentLanguage], value: "0" },
            M_releaseType: { label: Resources.materialReleaseTypeSelection[currentLanguage], value: "0" },
            M_siteRequest: { label: Resources.siteRequestSelection[currentLanguage], value: "0" },
            M_contractBoq: { label: Resources.boqLog[currentLanguage], value: "0" },
            boqLog: { label: Resources.selectBoq[currentLanguage], value: "0" },
            area: { label: Resources.selectArea[currentLanguage], value: "0" },
            location: { label: Resources.locationRequired[currentLanguage], value: "0" },
            discipline: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            buildingNumber: { label: Resources.buildingNumberSelection[currentLanguage], value: "0" },
            apartmentNo: { label: Resources.apartmentNumberSelection[currentLanguage], value: "0" },
            CurrStep: 1,
            firstComplete: false,
            secondComplete: false,
            updatedItem: null,
            contractLoading: false,
            showPoModal: false
        };
        if (!Config.IsAllow(116) && !Config.IsAllow(117) && !Config.IsAllow(118)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/siteRequest/" + projectId
            });
        }
    }

    renderEditable = (cellInfo) => {
        if (cellInfo.original.childerns.length == 0) {
            return (
                <div
                    style={{ color: "#4382f9 ", padding: '0px 6px', margin: '5px 0px', border: '1px dashed', cursor: 'pointer' }}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => {
                        const items = [...this.state.items];
                        items[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                        const updatedItem = items[cellInfo.index]
                        const updatedItems = this.state.updatedItems
                        let index = updatedItems.findIndex(item => item.id == updatedItem.id)
                        if (index != -1)
                            updatedItems[index] = updatedItem
                        else
                            updatedItems.push(updatedItem)
                        this.setState({ items, updatedItem, updatedItems });

                    }}
                    dangerouslySetInnerHTML={{
                        __html: this.state.items[cellInfo.index][cellInfo.column.id]
                    }}
                />
            );
        }
        else {
            return (
                <div
                    dangerouslySetInnerHTML={{
                        __html: this.state.items[cellInfo.index][cellInfo.column.id]
                    }}
                />
            );
        }
    }

    editChildren = (cellInfo) => {
        return (
            <div
                style={{ color: "#4382f9 ", padding: '0px 6px', margin: '5px 0px', border: '1px dashed', cursor: 'pointer' }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const items = [...this.state.childerns];
                    items[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    const updatedItem = items[cellInfo.index]
                    const updatedchilderns = this.state.updatedchilderns
                    let index = updatedchilderns.findIndex(item => item.id == updatedItem.id)
                    if (index != -1)
                        updatedchilderns[index] = updatedItem
                    else
                        updatedchilderns.push(updatedItem)
                    this.setState({ childerns: items, updatedchilderns });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.childerns[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }
    componentDidMount() {
        var links = document.querySelectorAll(".noTabs__document .doc-container .linebylineInput");

        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) {
                links[i].classList.add("even");
            } else {
                links[i].classList.add("odd");
            }
        }
        this.checkDocumentIsView();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id != this.props.document.id) {
            let docDate = nextProps.document.docDate != null ? moment(nextProps.document.docDate).format("DD/MM/YYYY") : moment();
            let requiredDate = nextProps.document.requiredDate != null ? moment(nextProps.document.requiredDate).format("DD/MM/YYYY") : moment();
            this.setState({
                document: { ...nextProps.document, docDate, requiredDate },
                hasWorkflow: nextProps.hasWorkflow,
            });
            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }

        if (this.state.showModal != nextProps.showModal) {
            this.setState({ showModal: nextProps.showModal });
        }
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(119)) {
                this.setState({ isViewMode: true });
            }
            else if (this.state.isApproveMode != true && Config.IsAllow(119)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(119)) {
                    if (this.props.document.status != false && Config.IsAllow(119)) {
                        this.setState({ isViewMode: false });
                    } else {
                        this.setState({ isViewMode: true });
                    }
                } else {

                    this.setState({ isViewMode: true });
                }
            }
        }
        else {
            this.setState({ isViewMode: false });
        }
    }

    componentWillMount() {
        if (this.state.docId > 0) {
            let url = "GetContractsSiteRequestForEdit?id=" + this.state.docId;
            this.props.actions.documentForEdit(url, this.state.docTypeId, "procurement");
            Api.get('GetContractsSiteRequestItemsByRequestId?requestId=' + this.state.docId).then(res => {
                if (res) {
                    this.setState({ _items: res })
                }
            })
            this.setState({ isEdit: true });
            this.getMarterialArrange();
        } else {
            let materialRequest = {
                subject: "",
                id: 0,
                projectId: this.state.projectId,
                arrange: 1,
                fromCompany: "",
                discipline: '',
                docDate: moment(),
                requiredDate: moment(),
                showInDashboard: false,
                useQntyRevised: false,
                status: true
            };
            this.setState({ document: materialRequest });
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    }

    getNextArrange(companyId) {
        this.setState({ isLoading: true });
        Api.get('GetNextArrangeMainDoc?projectId=' + this.state.projectId + '&docType=' + this.state.docTypeId + '&companyId=' + companyId + '&&contactId=undefined').then(arrange => {
            this.setState({ document: { ...this.state.document, arrange }, isLoading: false })
        })


    }

    fillDropDowns(isEdit) {
        this.setState({ isLoading: true });
        dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, "companyName", "companyId").then(result => {
            if (isEdit) {
                let companyId = this.props.document.companyId;
                if (companyId) {
                    this.setState({
                        fromCompany: { label: this.props.document.companyName, value: companyId }
                    });
                }
            }
            this.setState({
                companies: [...result], isLoading: false
            });
        })
        this.setState({ isLoading: true });
        dataservice.GetDataList("GetContractsBoqShowInSiteRequest?projectId=" + this.state.projectId, "subject", "id").then(result => {
            if (isEdit) {
                let boqId = this.props.document.boqId;
                this.GetBoqItemsStracture(boqId)
                if (boqId) {
                    let boq = result.find(function (item) {
                        return item.value == boqId
                    })
                    this.setState({
                        boqLog: boq
                    });
                }
            }
            this.setState({
                boqLogs: [...result], isLoading: false
            });
        })
        this.setState({ isLoading: true });
        dataservice.GetDataList("GetAccountsDefaultList?listType=discipline&pageNumber=0&pageSize=10000", 'title', 'id').then(result => {
            if (isEdit) {
                let disciplineId = this.props.document.disciplineId;
                if (disciplineId) {
                    this.setState({
                        discipline: { label: this.props.document.disciplineName, value: disciplineId }
                    });
                }
            }
            this.setState({
                discplines: [...result], isLoading: false
            });
        });
        this.setState({ isLoading: true });
        dataservice.GetDataList("GetAccountsDefaultList?listType=buildingno&pageNumber=0&pageSize=10000", 'title', 'id').then(result => {
            if (isEdit) {
                let buildingNoId = this.props.document.buildingNoId;
                if (buildingNoId) {
                    this.setState({
                        buildingNumber: { label: this.props.document.buildingNo, value: buildingNoId }
                    });
                }
            }
            this.setState({
                buildings: [...result], isLoading: false
            });
        });
        this.setState({ isLoading: true });
        dataservice.GetDataList("GetAccountsDefaultList?listType=apartmentno&pageNumber=0&pageSize=10000", 'title', 'id').then(result => {
            if (isEdit) {
                let apartmentNoId = this.props.document.apartmentNoId;
                if (apartmentNoId) {
                    this.setState({
                        apartmentNo: { label: this.props.document.apartmentNo, value: apartmentNoId }
                    });
                }
            }
            this.setState({
                apartmentNumbers: [...result], isLoading: false
            });
        });
        this.setState({ isLoading: true });
        dataservice.GetDataList("GetAccountsDefaultList?listType=location&pageNumber=0&pageSize=10000", 'title', 'id').then(result => {
            if (isEdit) {
                let location = this.props.document.location;
                if (location) {
                    this.setState({
                        location: { label: this.props.document.location, value: 0 }
                    });
                }
            }
            this.setState({
                locations: [...result], isLoading: false
            });
        });
        this.setState({ isLoading: true });
        dataservice.GetDataList("GetAccountsDefaultList?listType=area&pageNumber=0&pageSize=10000", 'title', 'id').then(result => {
            if (isEdit) {
                let area = this.props.document.area;
                if (area) {
                    this.setState({
                        area: { label: this.props.document.area, value: 0 }
                    });
                }
            }
            this.setState({
                areas: [...result], isLoading: false
            });
        });
        this.setState({ isLoading: true });
        dataservice.GetDataList("GetAccountsDefaultList?listType=specsSection&pageNumber=0&pageSize=10000", "title", "id").then(result => {
            if (result)
                this.setState({
                    specsSections: [...result], isLoading: false
                });
        })
        this.setState({ isLoading: true });
        dataservice.GetDataList("GetAccountsDefaultList?listType=materialtitle&pageNumber=0&pageSize=10000", "title", "id").then(result => {
            if (result)
                this.setState({
                    releaseTypes: [...result], isLoading: false
                });
        })
        this.setState({ isLoading: true });
        Api.get("GetContractsBoq?projectId=" + this.state.projectId + "&pageNumber=0&pageSize=10000").then(result => {
            if (result.data) {
                let data = []
                let temp = result.data
                temp.forEach(element => {
                    data.push({ label: element.subject, value: element.id })
                })
                this.setState({
                    contractBoqs: [...data], isLoading: false
                });
            }
        })

        this.setState({ isLoading: true });
        Api.get("GetContractsSiteRequestByProjectId?projectId=" + this.state.projectId + "&pageNumber=0&pageSize=1000").then(result => {
            if (result.data) {
                let data = []
                let temp = result.data
                temp.forEach(element => {
                    data.push({ label: element.subject, value: element.id })
                })
                this.setState({
                    siteRequests: [...data], isLoading: false
                });
            }
        })

    }

    GetBoqItemsStracture(boqId) {
        this.setState({ isLoading: true });
        Api.get('GetBoqItemsStracture?boqId=' + boqId).then(res => {
            if (res)
                this.setState({ items: res, isLoading: false })
            else
                this.setState({ items: [], isLoading: false })
        }).catch(() => this.setState({ items: [], isLoading: false }))
    }

    handleChange(e, field) {
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            document: updated_document
        });
    }

    handleChangeDate(e, field) {
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = e;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            document: updated_document
        });
    }

    handleCheckBox(e) {
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document['useQntyRevised'] = !this.state.document.useQntyRevised;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            document: updated_document
        });
    }

    getMarterialArrange() {
        this.setState({ isLoading: true });
        Api.get('GetNextArrangeMainDoc?projectId=' + this.state.projectId + '&docType=' + this.state.docType + '&companyId=undefined&contactId=undefined').then(arrange => {
            this.setState({ M_arrange: arrange, isLoading: false })
        })
    }

    editMaterialRequest(event) {
        this.setState({ isLoading: true });
        let saveDocument = { ...this.state.document };
        saveDocument.docDate = moment(saveDocument.docDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        saveDocument.requiredDate = moment(saveDocument.requiredDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        saveDocument.boqId = this.state.boqLog.value;
        saveDocument.companyId = this.state.fromCompany.value;
        saveDocument.area = this.state.area.label;
        saveDocument.location = this.state.location.label;
        saveDocument.disciplineId = this.state.discipline.value;
        saveDocument.buildingNoId = this.state.buildingNumber.value;
        saveDocument.apartmentNoId = this.state.apartmentNo.value;
        saveDocument.companyName = this.state.fromCompany.value;
        saveDocument.id = this.state.docId;
        console.log('document=>', saveDocument)
        dataservice.addObject("EditContractsSiteRequest", saveDocument).then(result => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            let CurrStep = this.state.CurrStep + 1
            this.setState({ firstComplete: true, CurrStep, isLoading: false })
        }).catch(() => {
            this.setState({ isLoading: false });
            toast.success(Resources["operationCanceled"][currentLanguage]);
        })
    }

    saveMaterialReques(event) {
        if (this.state.items.length > 0) {
            this.setState({ isLoading: true });
            let saveDocument = { ...this.state.document };
            saveDocument.docDate = moment(saveDocument.docDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            saveDocument.requiredDate = moment(saveDocument.requiredDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            saveDocument.boqId = this.state.boqLog.value;
            saveDocument.companyId = this.state.fromCompany.value;
            saveDocument.companyName = this.state.fromCompany.value;
            saveDocument.area = this.state.area.label;
            saveDocument.location = this.state.location.label;
            saveDocument.disciplineId = this.state.discipline.value;
            saveDocument.disciplineName = this.state.discipline.label;
            saveDocument.buildingNoId = this.state.buildingNumber.value;
            saveDocument.apartmentNoId = this.state.apartmentNo.value;
            dataservice.addObject("AddContractsSiteRequest", saveDocument).then(result => {
                this.setState({ docId: result.id, isLoading: false });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }).catch(() => {
                this.setState({ isLoading: false });
                toast.success(Resources["operationCanceled"][currentLanguage]);
            })
        }
        else {
            toast.info('this boq not have items choice another boq')
        }
    }

    saveAndExit(event) {
        this.props.history.push({
            pathname: '/siteRequest/' + this.state.projectId
        });
    }

    showBtnsSaving() {
        let btn = null;
        if (this.state.docId === 0) {
            btn = (
                <button className="primaryBtn-1 btn meduimBtn" type="submit">
                    {Resources.save[currentLanguage]}
                </button>
            );
        } else if (this.state.docId > 0 && this.props.changeStatus === false) {
            btn = (
                <button className="primaryBtn-1 btn mediumBtn" type="submit">
                    {Resources.saveAndExit[currentLanguage]}
                </button>
            );
        }
        else
            btn = <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"}>
                {Resources.next[currentLanguage]}
            </button>
        return btn;
    }

    viewAttachments() {
        return this.state.docId > 0 ? (
            Config.IsAllow(3282) === true ? (
                <ViewAttachment
                    docTypeId={this.state.docTypeId}
                    docId={this.state.docId}
                    projectId={this.state.projectId}
                    deleteAttachments={852}
                />
            ) : null
        ) : null;
    }

    handleShowAction = item => {
        if (item.title == "sendToWorkFlow") {
            this.props.actions.SendingWorkFlow(true);
        }
        if (item.value != "0") {
            this.props.actions.showOptionPanel(false);
            this.setState({
                currentComponantDocument: item.value,
                currentTitle: item.title,
                showModal: true
            })
            this.simpleDialog.show()

        }
    };

    actionsChange(event) {
        switch (event.value) {
            case 1:
                Api.post('AddNewBoq?id=' + this.state.docId).then(() => {
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                    this.props.history.push({ pathname: '/siteRequest/' + this.state.projectId })
                }).catch(() => {
                    toast.error(Resources["operationCanceled"][currentLanguage]);
                });
                break;
            case 2:
                this.setState({ showContractModal: true })
                this.simpleDialog1.show();
                break;
            case 3:
                this.setState({ showPoModal: true })
                this.simpleDialog2.show();
                break;
            case 4:
                if (Config.IsAllow(3675)) {
                    this.setState({ isLoading: true })
                    Api.get('GetContractsSiteRequestItemsByRequestId?requestId=' + this.state.docId).then(res => {
                        if (res) {
                            this.setState({ showMRModal: true, MRItems: res, isLoading: false })
                            this.simpleDialog3.show();
                        }
                    })
                }
                break;
        }
    }

    PreviousStep = () => {
        window.scrollTo(0, 0)
        switch (this.state.CurrStep) {
            case 2:
                this.setState({ CurrStep: this.state.CurrStep - 1, secondComplete: false })
                break;
        }
    }

    NextStep = (next) => {
        window.scrollTo(0, 0)
        switch (this.state.CurrStep) {
            case 1:
                if (this.state.docId > 0) {
                    let CurrStep = this.state.CurrStep + 1
                    this.setState({ firstComplete: true, CurrStep })
                }
                break;
            case 2:
                this.props.history.push({ pathname: '/siteRequest/' + this.state.projectId })
                break;
        }
    }
    addItem = () => {
        let length = this.state.updatedItems.length
        this.state.updatedItems.forEach((item, index) => {
            if (item.quantity > 0) {
                this.setState({ isLoading: true })
                item.requestId = this.state.docId
                Api.post('AddContractsSiteRequestItems', item).then(() => {
                    const _items = this.state._items;
                    _items.push(item);
                    this.setState({ _items, isLoading: false, updatedItems: [], showChildren: false })
                    if (index == length - 1) {
                        let items = []
                        this.state.items.forEach(element => {
                            items.push({ ...element, quantity: 0, stock: 0 })
                        })
                        this.setState({ items })
                    }
                })
            }
        })

    }
    addChild = () => {
        let length = this.state.updatedchilderns.length
        this.state.updatedchilderns.forEach((item, index) => {
            if (item.quantity > 0) {
                this.setState({ isLoading: true })
                let updatedItem = { ...item };
                updatedItem.requestId = this.state.docId
                Api.post('AddContractsSiteRequestItems', updatedItem).then(() => {
                    const _items = this.state._items;
                    _items.push(updatedItem);
                    this.setState({ _items, isLoading: false })
                    if (index == length - 1) {
                        let items = this.state.items
                        for (var i = 0; i < items.length; i++)
                            if (items[i].id == this.state.updatedchilderns[0].parentId) {
                                items[i].childerns.forEach(child => {
                                    child.quantity = 0;
                                    child.stock = 0;
                                })
                                this.setState({ items, showChildren: false })
                                break;
                            }
                    }
                })
            }
        })

    }

    onCloseModal() {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    ConfirmDelete = () => {
        this.setState({ isLoading: true })
        Api.post('DeleteMultipleContractsSiteRequestItems', this.state.selectedRows).then((res) => {
            let _items = [...this.state._items]
            let length = _items.length
            this.state.selectedRows.forEach((element, index) => {
                _items = _items.filter(item => { return item.id != element });
            })
            this.setState({ _items, showDeleteModal: false, isLoading: false });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ showDeleteModal: false, isLoading: false });
        })
    }

    clickHandlerDeleteRowsMain = selectedRows => {
        this.setState({
            showDeleteModal: true,
            selectedRows: selectedRows
        });
    };

    _onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        let updateRow = this.state._items[fromRow];
        this.setState(state => {
            const _items = state._items.slice();
            for (let i = fromRow; i <= toRow; i++) {
                _items[i] = { ..._items[i], ...updated };
            }
            return { _items };
        }, function () {
            if (updateRow[Object.keys(updated)[0]] !== updated[Object.keys(updated)[0]] && Object.keys(updated)[0] == 'quantity') {
                updateRow[Object.keys(updated)[0]] = updated[Object.keys(updated)[0]];
                this.setState({ isLoading: true })
                Api.post('UpdateQuantitySiteRequestItems?id=' + this.state._items[fromRow].id + '&quantity=' + updated.quantity)
                    .then(() => {
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                        this.setState({ isLoading: false })
                    })
                    .catch(() => {
                        toast.error(Resources["operationCanceled"][currentLanguage]);
                        this.setState({ isLoading: false })
                    })
            }
            if (updateRow[Object.keys(updated)[0]] !== updated[Object.keys(updated)[0]] && Object.keys(updated)[0] == 'stock') {
                updateRow[Object.keys(updated)[0]] = updated[Object.keys(updated)[0]];
                this.setState({ isLoading: true })
                Api.post('UpdateQuantitySiteRequestItems?id=' + this.state._items[fromRow].id + '&stock=' + updated.stock)
                    .then(() => {
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                        this.setState({ isLoading: false })
                    })
                    .catch(() => {
                        toast.error(Resources["operationCanceled"][currentLanguage]);
                        this.setState({ isLoading: false })
                    })
            }
        });
    };

    _onMRGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        console.log(updated)
        console.log('this.state._items[fromRow]', this.state._items[fromRow])

        // let updateRow = this.state._items[fromRow];
        // if(updateRow.quantity<)
        // this.setState(state => {
        //     const _items = state._items.slice();
        //     for (let i = fromRow; i <= toRow; i++) {
        //         _items[i] = { ..._items[i], ...updated };
        //     }
        //     return { _items };
        // }, function () {
        //     if (updateRow[Object.keys(updated)[0]] !== updated[Object.keys(updated)[0]] && Object.keys(updated)[0] == 'quantity') {
        //         updateRow[Object.keys(updated)[0]] = updated[Object.keys(updated)[0]];
        //         this.setState({ isLoading: true })
        //         Api.post('UpdateQuantitySiteRequestItems?id=' + this.state._items[fromRow].id + '&quantity=' + updated.quantity)
        //             .then(() => {
        //                 toast.success(Resources["operationSuccess"][currentLanguage]);
        //                 this.setState({ isLoading: false })
        //             })
        //             .catch(() => {
        //                 toast.error(Resources["operationCanceled"][currentLanguage]);
        //                 this.setState({ isLoading: false })
        //             })
        //     }
        //     if (updateRow[Object.keys(updated)[0]] !== updated[Object.keys(updated)[0]] && Object.keys(updated)[0] == 'stock') {
        //         updateRow[Object.keys(updated)[0]] = updated[Object.keys(updated)[0]];
        //         this.setState({ isLoading: true })
        //         Api.post('UpdateQuantitySiteRequestItems?id=' + this.state._items[fromRow].id + '&stock=' + updated.stock)
        //             .then(() => {
        //                 toast.success(Resources["operationSuccess"][currentLanguage]);
        //                 this.setState({ isLoading: false })
        //             })
        //             .catch(() => {
        //                 toast.error(Resources["operationCanceled"][currentLanguage]);
        //                 this.setState({ isLoading: false })
        //             })
        //     }
        // });
    };

    onRowClick = (value, index, column) => {
        if (!Config.IsAllow(3751)) {
            toast.warning("you don't have permission");
        }
        else if (column.key == 'customBtn') {
            this.itemization(value)
        }

    }

    addContract(values) {
        this.setState({ contractLoading: true })
        let contract = {
            completionDate: moment(values.completionDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            docDate: moment(values.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            subject: values.subject,
            refDoc: values.reference,
            status: values.status,
            siteRequestId: this.state.docId,
        }
        Api.post('AddNewContract', contract).then(() => {
            this.setState({ contractLoading: false, showContractModal: false })
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.props.history.push({ pathname: '/siteRequest/' + this.state.projectId })
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    }

    addPurchaseOrder(values) {
        this.setState({ contractLoading: true })
        let contract = {
            completionDate: moment(values.completionDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            docDate: moment(values.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            subject: values.subject,
            refDoc: values.reference,
            advancePaymentPercent: values.advancePayment,
            status: values.status,
            siteRequestId: this.state.docId,
        }
        Api.post('AddNewPurchaseOrder', contract).then(() => {
            this.setState({ contractLoading: false, showContractModal: false })
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.props.history.push({ pathname: '/siteRequest/' + this.state.projectId })
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    }
    addMR(values) {
        let MR = {
            docDate: moment(values.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            subject: values.subject,
            status: values.status,
            siteRequestId: this.state.M_siteRequest.value,
            orderFromCompanyId: this.state.M_fromCompany.value,
            orderFromContactId: this.state.M_contact.value,
            specsSectionId: this.state.M_specsSection.value,
            materialReleaseId: this.state.M_releaseType.value,
            boqId: this.state.M_contractBoq.value,
            requestId: this.state.docId,
            projectId: this.state.projectId,
            arrange: this.state.M_arrange,
            docCloseDate: moment(values.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        }
        this.setState({ contractLoading: true })
        Api.post('AddLogsMaterialRelease', MR).then((res) => {
            if (res.id)
                Api.post('AddMaterialReleaseItemsFromSiteRequestItems?materialReleaseId=' + res.id, this.state.MRItems).then(() => {
                    this.setState({ contractLoading: false, showMRModalModal: false })
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                    this.getMarterialArrange();
                })
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });

    }
    handleChangeDropDown(event) {
        this.setState({ isLoading: true })
        dataservice.GetDataList('GetContactsByCompanyId?companyId=' + event.value, 'contactName', 'id').then(res => {
            if (res)
                this.setState({ isLoading: false, contacts: res, M_fromCompany: event })
        })
    }
    showChildern(childerns) {
        this.setState({ showChildren: true, childerns })
        this.simpleDialog4.show()
    }
    executeBeforeModalClose = (e) => {
        this.setState({ showModal: false });
    }

    _executeAfterModalOpen() {
        document.body.classList.add('noScrolling');
        window.scrollTo(0, 0)
    }

    _executeBeforeModalOpen() {
        document.body.classList.add('noScrolling');
        window.scrollTo(0, 0);
    }

    _executeAfterModalClose() {
        document.body.classList.remove('noScrolling');
    }

    render() {
        const childerns =
            this.state.isLoading == false ?
                <div >
                    <ReactTable
                        data={this.state.childerns}
                        columns={[

                            {
                                Header: Resources.numberAbb[currentLanguage],
                                accessor: 'arrange'
                            }, {
                                Header: Resources.description[currentLanguage],
                                accessor: 'details'
                            }, {
                                Header: Resources.unit[currentLanguage],
                                accessor: 'unit'
                            }, {
                                Header: Resources.quantity[currentLanguage],
                                accessor: 'quantity',
                                Cell: this.editChildren
                            }, {
                                Header: Resources.stock[currentLanguage],
                                accessor: 'stock',
                                Cell: this.editChildren
                            }, {
                                Header: Resources.resourceCode[currentLanguage],
                                accessor: 'resourceCode'
                            }, {
                                Header: Resources.itemCode[currentLanguage],
                                accessor: 'itemCode'
                            }
                        ]
                        }
                        defaultPageSize={5}
                        className="-striped -highlight"
                    />
                    <div className="slider-Btns">
                        {
                            this.state.isLoading ? (
                                <button className="primaryBtn-1 btn disabled">
                                    <div className="spinner">
                                        <div className="bounce1" />
                                        <div className="bounce2" />
                                        <div className="bounce3" />
                                    </div>
                                </button>
                            ) : (
                                    <button className="primaryBtn-1 btn meduimBtn" type="submit" onClick={() => this.addChild()}>{Resources.add[currentLanguage]}</button>
                                )}
                    </div>
                </div> : <LoadingSection />
        const ItemsGrid =
            this.state.isLoading == false ?
                <GridSetupWithFilter
                    rows={this.state._items}
                    pageSize={this.state.pageSize}
                    onRowClick={this.onRowClick}
                    columns={this.itemsColumns}
                    onGridRowsUpdated={this._onGridRowsUpdated}
                    clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                    key='items'
                /> : <LoadingSection />;
        const MRGrid =
            this.state.isLoading == false ?
                <GridSetupWithFilter
                    rows={this.state.MRItems}
                    pageSize={this.state.pageSize}
                    columns={this.MRColumns}
                    showCheckbox={false}
                    onGridRowsUpdated={this._onMRGridRowsUpdated}
                    key='MR'
                /> : <LoadingSection />;
        let actions = [
            { title: "distributionList", value: <Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
            {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={true}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }, {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={false}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }
        ];
        let Step_1 = <Fragment>
            <Formik
                initialValues={{
                    ...this.state.document, fromCompany: this.state.fromCompany.value > 0 ? this.state.fromCompany : '',
                    discipline: this.state.discipline.value > 0 ? this.state.discipline : ''
                }}
                validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={values => {
                    if (this.props.showModal) { return; }
                    if (this.props.showModal) { return; }
                    if (this.props.changeStatus === true && this.state.docId > 0) {
                        this.editMaterialRequest(values);
                    } else if (this.props.changeStatus === false && this.state.docId === 0) {
                        this.saveMaterialReques();
                    } else {
                        this.saveAndExit();
                    }
                }}>
                {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                    <Form id="ProposalForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                        <div className="proForm first-proform">
                            <div className="linebylineInput valid-input">
                                <label className="control-label">
                                    {Resources.subject[currentLanguage]}
                                </label>
                                <div className={"inputDev ui input" + (errors.subject && touched.subject ? " has-error" : !errors.subject && touched.subject ? " has-success" : " ")}>
                                    <input name="subject" className="form-control fsadfsadsa" id="subject"
                                        placeholder={Resources.subject[currentLanguage]}
                                        autoComplete="off"
                                        defaultValue={this.state.document.subject}
                                        onBlur={e => { handleBlur(e); handleChange(e); }}
                                        onChange={e =>
                                            this.handleChange(e, "subject")
                                        } />
                                    {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                </div>
                            </div>

                            <div className="linebylineInput valid-input">
                                <label className="control-label">
                                    {Resources.status[currentLanguage]}
                                </label>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="proposal-status" defaultChecked={this.state.document.status === false ? null : "checked"}
                                        value="true" onChange={e => this.handleChange(e, "status")} />
                                    <label>
                                        {Resources.oppened[currentLanguage]}
                                    </label>
                                </div>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="proposal-status" defaultChecked={this.state.document.status === false ? "checked" : null}
                                        value="false" onChange={e => this.handleChange(e, "status")} />
                                    <label>
                                        {Resources.closed[currentLanguage]}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="proForm datepickerContainer">
                            <div className="linebylineInput valid-input alternativeDate">
                                <DatePicker title="docDate" startDate={this.state.document.docDate}
                                    handleChange={e => this.handleChangeDate(e, "docDate")} />
                            </div>
                            <div className="linebylineInput valid-input alternativeDate">
                                <DatePicker title="requiredDate" startDate={this.state.document.requiredDate}
                                    handleChange={e => this.handleChangeDate(e, "requiredDate")} />
                            </div>
                            <div className="linebylineInput valid-input">
                                <label className="control-label">
                                    {Resources.arrange[currentLanguage]}
                                </label>
                                <div className={"inputDev ui input" + (errors.arrange && touched.arrange ? " has-error" : !errors.arrange && touched.arrange ? " has-success" : " ")}>
                                    <input name="arrange" className="form-control fsadfsadsa" id="arrange"
                                        placeholder={Resources.arrange[currentLanguage]}
                                        autoComplete="off"
                                        defaultValue={this.state.document.arrange}
                                        onBlur={e => { handleBlur(e); handleChange(e); }}
                                        onChange={e =>
                                            this.handleChange(e, "arrange")
                                        } />
                                    {touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                </div>
                            </div>
                            <div className="linebylineInput valid-input ">
                                <div id="allSelected">
                                    <div className={"ui checkbox checkBoxGray300 checked"} checked={this.state.document.useQntyRevised} onClick={e => this.handleCheckBox(e)}>
                                        <input name="CheckBox" type="checkbox" id="allPermissionInput" defaultChecked={this.state.document.useQntyRevised} />
                                        <label>{Resources.revQuantity[currentLanguage]}</label>
                                    </div>
                                </div>
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="fromCompany"
                                    data={this.state.companies}
                                    selectedValue={this.state.fromCompany}
                                    handleChange={event => {
                                        this.getNextArrange(event.value)
                                        this.setState({ fromCompany: event })
                                    }}
                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                    error={errors.fromCompany}
                                    touched={touched.fromCompany}
                                />
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="boqLog"
                                    isDisabled={this.props.changeStatus}
                                    data={this.state.boqLogs}
                                    selectedValue={this.state.boqLog}
                                    handleChange={event => {
                                        this.setState({ boqLog: event })
                                        this.GetBoqItemsStracture(event.value)
                                    }}
                                />
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="area"
                                    data={this.state.areas}
                                    selectedValue={this.state.area}
                                    handleChange={event => this.setState({ area: event })}

                                />
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="location"
                                    data={this.state.locations}
                                    selectedValue={this.state.location}
                                    handleChange={event => this.setState({ location: event })}

                                />
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="disciplineTitle"
                                    data={this.state.discplines}
                                    selectedValue={this.state.discipline}
                                    handleChange={event => this.setState({ discipline: event })}
                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                    error={errors.discipline}
                                    touched={touched.discipline}
                                />
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="buildingNumber"
                                    data={this.state.buildings}
                                    selectedValue={this.state.buildingNumber}
                                    handleChange={event => this.setState({ buildingNumber: event })}
                                />
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="apartmentNumber"
                                    data={this.state.apartmentNumbers}
                                    selectedValue={this.state.apartmentNo}
                                    handleChange={event => this.setState({ apartmentNo: event })}
                                />
                            </div>
                            <div className="linebylineInput valid-input">
                                <label className="control-label">
                                    {Resources.showInDashboard[currentLanguage]}
                                </label>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="proposal-showInDashboard" defaultChecked={this.state.document.showInDashboard === false ? null : "checked"}
                                        value={true} onChange={e => this.handleChange(e, "showInDashboard")} />
                                    <label>
                                        {Resources.show[currentLanguage]}
                                    </label>
                                </div>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="proposal-showInDashboard" defaultChecked={this.state.document.showInDashboard === false ? "checked" : null}
                                        value={false} onChange={e => this.handleChange(e, "showInDashboard")} />
                                    <label>
                                        {Resources.hide[currentLanguage]}
                                    </label>
                                </div>
                            </div>

                        </div>
                        <div className="slider-Btns">
                            {this.state.isLoading ? (
                                <button className="primaryBtn-1 btn disabled">
                                    <div className="spinner">
                                        <div className="bounce1" />
                                        <div className="bounce2" />
                                        <div className="bounce3" />
                                    </div>
                                </button>
                            ) : (
                                    this.showBtnsSaving()
                                )
                            }
                        </div>
                        {this.props.changeStatus === true ? (
                            <div className="approveDocument">
                                <div className="approveDocumentBTNS">
                                    {this.state.isApproveMode === true ? (
                                        <div>
                                            <button className="primaryBtn-1 btn " type="button"
                                                onClick={e => this.handleShowAction(actions[2])}>
                                                {Resources.approvalModalApprove[currentLanguage]}
                                            </button>
                                            <button className="primaryBtn-2 btn middle__btn" type="button"
                                                onClick={e => this.handleShowAction(actions[3])}>
                                                {Resources.approvalModalReject[currentLanguage]}
                                            </button>
                                        </div>
                                    ) : null}
                                    <button type="button" className="primaryBtn-2 btn middle__btn"
                                        onClick={e => this.handleShowAction(actions[1])}>
                                        {Resources.sendToWorkFlow[currentLanguage]}
                                    </button>
                                    <button type="button" className="primaryBtn-2 btn" onClick={e => this.handleShowAction(actions[0])}>
                                        {Resources.distributionList[currentLanguage]}
                                    </button>
                                    <span className="border" />
                                    <div className="document__action--menu">
                                        <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </Form>
                )}
            </Formik>
            <div className="doc-pre-cycle letterFullWidth">
                <div>
                    {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={851} EditAttachments={3241} ShowDropBox={3537} ShowGoogleDrive={3538} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                    {this.viewAttachments()}
                    {this.props.changeStatus === true ? (<ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                </div>
            </div>
        </Fragment>
        let Step_2 = <React.Fragment>
            <header><h2 className="zero">{Resources.items[currentLanguage]}</h2></header>
            <div >
                <ReactTable
                    data={this.state.items}
                    columns={[
                        {
                            Cell: props => {
                                if (props.original.childerns.length > 0)
                                    return (
                                        <i className='fa fa-plus-circle' onClick={e => this.showChildern(props.original.childerns, e)} />
                                    )
                                else
                                    return null
                            }, width: 30
                        },
                        {
                            Header: Resources.numberAbb[currentLanguage],
                            accessor: 'arrange'
                        }, {
                            Header: Resources.description[currentLanguage],
                            accessor: 'details'
                        }, {
                            Header: Resources.unit[currentLanguage],
                            accessor: 'unit'
                        }, {
                            Header: Resources.quantity[currentLanguage],
                            accessor: 'quantity',
                            Cell: this.renderEditable
                        }, {
                            Header: Resources.stock[currentLanguage],
                            accessor: 'stock',
                            Cell: this.renderEditable
                        }, {
                            Header: Resources.resourceCode[currentLanguage],
                            accessor: 'resourceCode'
                        }, {
                            Header: Resources.itemCode[currentLanguage],
                            accessor: 'itemCode'
                        }
                    ]
                    }
                    defaultPageSize={5}
                    className="-striped -highlight"
                />
                <div className="slider-Btns">
                    {
                        this.state.isLoading ? (
                            <button className="primaryBtn-1 btn disabled">
                                <div className="spinner">
                                    <div className="bounce1" />
                                    <div className="bounce2" />
                                    <div className="bounce3" />
                                </div>
                            </button>
                        ) : (
                                <button className="primaryBtn-1 btn meduimBtn" type="submit" onClick={() => this.addItem()}>{Resources.add[currentLanguage]}</button>
                            )}
                </div>
            </div>
            <XSLfile key='boqImport' docId={this.state.docId} docType='siteRequest' link={IPConfig.downloads + '/Downloads/Excel/SiteRequest.xlsx'} header='addManyItems'
                disabled={this.state.isViewMode} afterUpload={() => this.GetBoqItemsStracture()} />
            <div className="header__dropdown">
                <header><h2 className="zero">{Resources.AddedItems[currentLanguage]}</h2></header>
                {this.state.isViewMode == true ? null :
                    <div className="default__dropdown">
                        <Dropdown
                            title=""
                            data={this.state.materialTypes}
                            selectedValue={this.state.materialType}
                            handleChange={event => {
                                this.setState({ materialType: event })
                                this.actionsChange(event)
                            }}
                        />
                    </div>}
            </div>
            {ItemsGrid}
        </React.Fragment>
        const contractContent = <React.Fragment>
            <div className="dropWrapper">
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        subject: '',
                        reference: 0,
                        completionDate: moment(),
                        docDate: moment(),
                        status: true

                    }}
                    validationSchema={contractSchema}
                    onSubmit={(values) => {
                        if (this.props.showModal) { return; }
                        this.addContract(values)
                    }}
                >
                    {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange, values }) => (
                        <Form id="signupForm1" className="proForm customProform" noValidate="novalidate" >
                            <div className="fillter-item-c">
                                <label className="control-label">{Resources['subject'][currentLanguage]} </label>
                                <div className={"inputDev ui input " + (errors.subject ? 'has-error' : !errors.subject && touched.subject ? (" has-success") : " ")}>
                                    <input name='subject'
                                        className="form-control"
                                        id="subject" placeholder={Resources['subject'][currentLanguage]} autoComplete='off'
                                        onBlur={handleBlur} defaultValue={values.subject}
                                        onChange={e => handleChange(e)} />
                                    {errors.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                </div>
                            </div>
                            <div className="fillter-item-c">
                                <label className="control-label">{Resources.status[currentLanguage]}</label>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="status" defaultChecked={values.status === false ? null : 'checked'} value="true" onChange={e => setFieldValue('status', true)} />
                                    <label>{Resources.oppened[currentLanguage]}</label>
                                </div>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="status" defaultChecked={values.status === false ? 'checked' : null} value="false" onChange={e => setFieldValue('status', false)} />
                                    <label>{Resources.closed[currentLanguage]}</label>
                                </div>
                            </div>
                            <DatePicker title='docDate'
                                format={'DD/MM/YYYY'}
                                name="documentDate"
                                startDate={values.docDate}
                                handleChange={e => setFieldValue('docDate', e)}
                            />
                            <DatePicker title='completionDate'
                                format={'DD/MM/YYYY'}
                                name="completionDate"
                                startDate={values.completionDate}
                                handleChange={e => setFieldValue('completionDate', e)} />
                            <div className="fillter-item-c">
                                <label className="control-label">{Resources.reference[currentLanguage]}</label>
                                <div className="ui input inputDev"  >
                                    <input type="text" className="form-control" id="reference"
                                        defaultValue={values.reference}
                                        name="reference"
                                        onChange={e => handleChange(e)}
                                        placeholder={Resources.reference[currentLanguage]}
                                    />
                                </div>
                                <div className={"slider-Btns fullWidthWrapper textLeft "}>
                                    {this.state.contractLoading === false ? (
                                        <button className={"primaryBtn-1 btn "} type="submit"  >{Resources.save[currentLanguage]}</button>
                                    ) :
                                        (
                                            <button className="primaryBtn-1 btn  disabled" disabled="disabled">
                                                <div className="spinner">
                                                    <div className="bounce1" />
                                                    <div className="bounce2" />
                                                    <div className="bounce3" />
                                                </div>
                                            </button>
                                        )}
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </React.Fragment >
        const purchaseOrder = <React.Fragment>
            <div className="dropWrapper">
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        subject: '',
                        reference: 0,
                        advancePayment: 0,
                        completionDate: moment(),
                        docDate: moment(),
                        status: true
                    }}
                    validationSchema={contractSchema}
                    onSubmit={(values) => {
                        if (this.props.showModal) { return; }
                        this.addPurchaseOrder(values)
                    }}
                >
                    {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange, values }) => (
                        <Form id="signupForm1" className="proForm  customProform" noValidate="novalidate" >

                            <div className="fillter-item-c">
                                <label className="control-label">{Resources['subject'][currentLanguage]} </label>
                                <div className={"inputDev ui input " + (errors.subject ? 'has-error' : !errors.subject && touched.subject ? (" has-success") : " ")}>
                                    <input name='subject'
                                        className="form-control"
                                        id="subject" placeholder={Resources['subject'][currentLanguage]} autoComplete='off'
                                        onBlur={handleBlur} defaultValue={values.subject}
                                        onChange={e => handleChange(e)} />
                                    {errors.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                </div>
                            </div>

                            <div className="fillter-item-c">
                                <label className="control-label">{Resources.status[currentLanguage]}</label>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="status" defaultChecked={values.status === false ? null : 'checked'} value="true" onChange={e => setFieldValue('status', true)} />
                                    <label>{Resources.oppened[currentLanguage]}</label>
                                </div>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="status" defaultChecked={values.status === false ? 'checked' : null} value="false" onChange={e => setFieldValue('status', false)} />
                                    <label>{Resources.closed[currentLanguage]}</label>
                                </div>
                            </div>

                            <DatePicker title='completionDate'
                                format={'DD/MM/YYYY'}
                                name="completionDate"
                                startDate={values.completionDate}
                                handleChange={e => setFieldValue('completionDate', e)} />
                            <DatePicker title='docDate'
                                format={'DD/MM/YYYY'}
                                name="documentDate"
                                startDate={values.docDate}
                                handleChange={e => setFieldValue('docDate', e)}
                            />
                            <div className="fillter-item-c">
                                <label className="control-label">{Resources.reference[currentLanguage]}</label>
                                <div className="ui input inputDev"  >
                                    <input type="text" className="form-control" id="reference"
                                        defaultValue={values.reference}
                                        name="reference"
                                        onChange={e => handleChange(e)}
                                        placeholder={Resources.reference[currentLanguage]}
                                    />
                                </div>
                                <label className="control-label">{Resources.advancePayment[currentLanguage]}</label>
                                <div className="ui input inputDev"  >
                                    <input type="text" className="form-control" id="advancePayment"
                                        defaultValue={values.advancePayment}
                                        name="advancePayment"
                                        onChange={e => handleChange(e)}
                                        placeholder={Resources.advancePayment[currentLanguage]}
                                    />
                                </div>
                                <div className={"slider-Btns fullWidthWrapper textLeft "}>
                                    {this.state.contractLoading === false ? (
                                        <button className={"primaryBtn-1 btn "} type="submit"  >{Resources.save[currentLanguage]}</button>
                                    ) :
                                        (
                                            <button className="primaryBtn-1 btn  disabled" disabled="disabled">
                                                <div className="spinner">
                                                    <div className="bounce1" />
                                                    <div className="bounce2" />
                                                    <div className="bounce3" />
                                                </div>
                                            </button>
                                        )}
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </React.Fragment >
        const materialRelease = this.state.isLoading == false ? <React.Fragment>
            <div className="dropWrapper">
                <Formik
                    initialValues={{
                        subject: this.state.M_subject,
                        M_siteRequest: this.state.M_siteRequest.value != '0' ? this.state.M_siteRequest.label : '',
                        M_specsSection: this.state.M_specsSection.value != '0' ? this.state.M_specsSection.label : '',
                        M_releaseType: this.state.M_releaseType.value != '0' ? this.state.M_releaseType.label : '',
                        M_contractBoq: this.state.M_contractBoq.value != '0' ? this.state.M_contractBoq.label : '',
                        M_contact: this.state.M_contact.value != '0' ? this.state.M_contact.label : '',
                        docDate: moment(),
                        status: true
                    }}
                    validationSchema={materialSchema}
                    onSubmit={(values) => {
                        if (this.props.showModal) { return; }
                        this.addMR(values)
                    }}
                >
                    {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange, values }) => (
                        <Form id="signupForm1" className="proForm  customProform" noValidate="novalidate" >
                            <div className="fillter-item-c">
                                <label className="control-label">{Resources['subject'][currentLanguage]} </label>
                                <div className={"inputDev ui input " + (errors.subject ? 'has-error' : !errors.subject && touched.subject ? (" has-success") : " ")}>
                                    <input name='subject'
                                        className="form-control"
                                        id="subject" placeholder={Resources['subject'][currentLanguage]} autoComplete='off'
                                        onBlur={handleBlur} defaultValue={values.subject}
                                        onChange={e => { handleChange(e); this.setState({ M_subject: e.target.value }) }} />
                                    {errors.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                </div>
                            </div>
                            <div className="fillter-item-c">
                                <label className="control-label">{Resources.status[currentLanguage]}</label>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="status" defaultChecked={values.status === false ? null : 'checked'} value="true" onChange={e => setFieldValue('status', true)} />
                                    <label>{Resources.oppened[currentLanguage]}</label>
                                </div>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="status" defaultChecked={values.status === false ? 'checked' : null} value="false" onChange={e => setFieldValue('status', false)} />
                                    <label>{Resources.closed[currentLanguage]}</label>
                                </div>
                            </div>
                            <DatePicker title='docDate'
                                format={'DD/MM/YYYY'}
                                name="docDate"
                                startDate={values.docDate}
                                handleChange={e => setFieldValue('docDate', e)} />
                            <div className="mix_dropdown">
                                <label className="control-label">{Resources.fromCompany[currentLanguage]}</label>
                                <div className="supervisor__company">
                                    <div className="super_name">
                                        <Dropdown
                                            data={this.state.companies}
                                            selectedValue={this.state.M_fromCompany}
                                            handleChange={event => { this.handleChangeDropDown(event) }}
                                            name="M_fromCompanyId"
                                            id="M_fromCompanyId" />
                                    </div>
                                    <div className="super_company">
                                        <Dropdown
                                            data={this.state.contacts}
                                            selectedValue={this.state.M_contact}
                                            handleChange={event => this.setState({ M_contact: event })}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.M_contact}
                                            touched={touched.M_contact}
                                            name="M_contact"
                                            id="M_contact" />
                                    </div>
                                </div>
                            </div>
                            <Dropdown
                                title="siteRequest"
                                data={this.state.siteRequests}
                                selectedValue={this.state.M_siteRequest}
                                handleChange={event => this.setState({ M_siteRequest: event })}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.M_siteRequest}
                                touched={touched.M_siteRequest}
                                name="M_siteRequest"
                            />
                            <Dropdown
                                title="specsSection"
                                data={this.state.specsSections}
                                selectedValue={this.state.M_specsSection}
                                handleChange={event => this.setState({ M_specsSection: event })}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.M_specsSection}
                                touched={touched.M_specsSection}
                                name="M_specsSection"
                            />
                            <Dropdown
                                title="materialReleaseType"
                                data={this.state.releaseTypes}
                                selectedValue={this.state.M_releaseType}
                                handleChange={event => this.setState({ M_releaseType: event })}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.M_releaseType}
                                touched={touched.M_releaseType}
                                name="M_releaseType"
                            />
                            <Dropdown
                                title="boqLog"
                                data={this.state.contractBoqs}
                                selectedValue={this.state.M_contractBoq}
                                handleChange={event => this.setState({ M_contractBoq: event })}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.M_contractBoq}
                                touched={touched.M_contractBoq}
                                name="M_contractBoq"
                            />
                            <div className="letterFullWidth">
                                {MRGrid}
                            </div>
                            <div className={"slider-Btns fullWidthWrapper "}>
                                {this.state.contractLoading === false ? (
                                    <button className={"primaryBtn-1 btn "} type="submit"  >{Resources.save[currentLanguage]}</button>
                                ) :
                                    (
                                        <button className="primaryBtn-1 btn  disabled" disabled="disabled">
                                            <div className="spinner">
                                                <div className="bounce1" />
                                                <div className="bounce2" />
                                                <div className="bounce3" />
                                            </div>
                                        </button>
                                    )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </React.Fragment> : <LoadingSection />

        return (
            <div className="mainContainer" id={"mainContainer"}>
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs one__tab one_step" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} docTitle={Resources.siteRequest[currentLanguage]} moduleTitle={Resources["procurement"][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            <div id="step1" className="step-content-body">
                                <div className="subiTabsContent">
                                    {this.props.changeStatus == true ? (
                                        <header className="main__header">
                                            <div className="main__header--div">
                                                <h2 className="zero">{Resources.goEdit[currentLanguage]}</h2>
                                                <p className="doc-infohead">
                                                    <span> {this.state.document.refDoc}</span> -  <span> {this.state.document.arrange}</span> -   <span>
                                                        {moment(this.state.document.docDate).format("DD/MM/YYYY")}
                                                    </span>
                                                </p>
                                            </div>
                                        </header>
                                    ) : null}
                                    <div className="document-fields">
                                        <React.Fragment>
                                            {this.state.CurrStep == 1 ? Step_1 : Step_2}
                                            <div className="largePopup largeModal " style={{ display: this.state.showContractModal ? "block" : "none" }}>
                                                <SkyLight
                                                    afterClose={this._executeAfterModalClose}
                                                    afterOpen={this._executeAfterModalOpen}
                                                    hideOnOverlayClicked
                                                    beforeOpen={this._executeBeforeModalOpen}
                                                    ref={ref => (this.simpleDialog1 = ref)}
                                                    title={Resources.contract[currentLanguage]}>
                                                    {contractContent}
                                                </SkyLight>
                                            </div>
                                            <div className="largePopup largeModal " style={{ display: this.state.showPoModal ? "block" : "none" }}>
                                                <SkyLight
                                                    afterClose={this._executeAfterModalClose}
                                                    afterOpen={this._executeAfterModalOpen}
                                                    hideOnOverlayClicked
                                                    beforeOpen={this._executeBeforeModalOpen}
                                                    ref={ref => (this.simpleDialog2 = ref)}
                                                    title={Resources.po[currentLanguage]}>
                                                    {purchaseOrder}
                                                </SkyLight>
                                            </div>
                                            <div className="largePopup largeModal " style={{ display: this.state.showMRModal ? "block" : "none" }}>
                                                <SkyLight
                                                    afterClose={this._executeAfterModalClose}
                                                    afterOpen={this._executeAfterModalOpen}
                                                    hideOnOverlayClicked
                                                    beforeOpen={this._executeBeforeModalOpen}
                                                    ref={ref => (this.simpleDialog3 = ref)}
                                                    title={Resources.materialRelease[currentLanguage]}>
                                                    {materialRelease}
                                                </SkyLight>
                                            </div>
                                            <div className="largePopup largeModal " style={{ display: this.state.showChildren ? "block" : "none" }}>
                                                <SkyLight
                                                    afterClose={this._executeAfterModalClose}
                                                    afterOpen={this._executeAfterModalOpen}
                                                    hideOnOverlayClicked
                                                    beforeOpen={this._executeBeforeModalOpen}
                                                    ref={ref => (this.simpleDialog4 = ref)}
                                                    title={Resources.materialRelease[currentLanguage]}>
                                                    {childerns}
                                                </SkyLight>
                                            </div>
                                            {
                                                this.props.changeStatus === true ?
                                                    <div className="approveDocument">
                                                        <div className="approveDocumentBTNS">
                                                            {this.state.isApproveMode === true ?
                                                                <div >
                                                                    <button type='button' className="primaryBtn-1 btn " onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                                                    <button type='button' className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>
                                                                </div>
                                                                : null
                                                            }
                                                            <button type='button' className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                                                            <button type='button' className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
                                                            <span className="border"></span>
                                                            <div className="document__action--menu">
                                                                <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : null
                                            }
                                        </React.Fragment>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="docstepper-levels">
                            <div className="step-content-foot">
                                <span onClick={this.PreviousStep} className={(this.props.changeStatus == true && this.state.CurrStep > 1) ? "step-content-btn-prev " :
                                    "step-content-btn-prev disabled"}><i className="fa fa-caret-left" aria-hidden="true"></i>Previous</span>
                                <span onClick={this.NextStep} className={this.state.docId > 0 ? "step-content-btn-prev "
                                    : "step-content-btn-prev disabled"}>Next<i className="fa fa-caret-right" aria-hidden="true"></i>
                                </span>
                            </div>
                            <div className="workflow-sliderSteps">
                                <div className="step-slider">
                                    <div onClick={this.StepOneLink} data-id="step1" className={'step-slider-item ' + (this.state.CurrStep == 1 ? 'current__step' : this.state.firstComplete ? "active" : "")} >
                                        <div className="steps-timeline">
                                            <span>1</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>{Resources.siteRequest[currentLanguage]}</h6>
                                        </div>
                                    </div>
                                    <div onClick={this.StepTwoLink} data-id="step2 " className={'step-slider-item ' + (this.state.CurrStep == 2 ? 'current__step' : this.state.secondComplete ? "active" : "")} >
                                        <div className="steps-timeline">
                                            <span>2</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >{Resources.items[currentLanguage]}</h6>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                    />
                ) : null}
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? "block" : "none" }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}
                     beforeClose={() => { this.executeBeforeModalClose() }}  >
                        {this.state.currentComponent}
                    </SkyLight>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading,
        changeStatus: state.communication.changeStatus,
        hasWorkflow: state.communication.hasWorkflow,
        projectId: state.communication.projectId,
        showModal: state.communication.showModal
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(materialRequestAddEdit));
