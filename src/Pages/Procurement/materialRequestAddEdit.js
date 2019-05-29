import React, { Component } from "react";
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

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
    arrange: Yup.string().required(Resources["arrangeRequired"][currentLanguage]),
    fromCompany: Yup.string().required(Resources["fromCompanyRequired"][currentLanguage]).nullable(true),
    discipline: Yup.string().required(Resources["disciplineRequired"][currentLanguage]).nullable(true),
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
                return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer' }}>{row.quantity}</span></a>;
            }
            return null;
        };
        let editStock = ({ value, row }) => {
            if (row) {
                return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer' }}>{row.stock}</span></a>;
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

        this.state = {
            materialTypes: [
                { label: Resources.newBoq[currentLanguage], value: 0 },
                { label: Resources.addContract[currentLanguage], value: 1 },
                { label: Resources.addPurchaseOrder[currentLanguage], value: 2 },
            ],
            materialType: { label: Resources.newBoq[currentLanguage], value: 0 },
            _items: [],
            isEdit: false,
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            isView: false,
            docId: docId,
            docTypeId: 88, //21,
            projectId: 2,//projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            fromContacts: [],
            discplines: [],
            items: [],
            permission: [
                { name: "sendByEmail", code: 72 },
                { name: "sendByInbox", code: 71 },
                { name: "sendTask", code: 0 },
                { name: "distributionList", code: 962 },
                { name: "createTransmittal", code: 3048 },
                { name: "sendToWorkFlow", code: 712 },
                { name: "viewAttachments", code: 3287 },
                { name: "deleteAttachments", code: 832 }
            ],
            fromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            boqLog: { label: Resources.selectBoq[currentLanguage], value: "0" },
            area: { label: Resources.selectArea[currentLanguage], value: "0" },
            location: { label: Resources.locationRequired[currentLanguage], value: "0" },
            discipline: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            buildingNumber: { label: Resources.buildingNumberSelection[currentLanguage], value: "0" },
            apartmentNo: { label: Resources.apartmentNumberSelection[currentLanguage], value: "0" },
            CurrStep: 1,
            firstComplete: false,
            secondComplete: false,
            updatedItem: null
        };

        if (!Config.IsAllow(66) && !Config.IsAllow(67) && !Config.IsAllow(69)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/Proposal/" + projectId
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
                        this.setState({ items, updatedItem });
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
        if (nextProps.document.id) {

            nextProps.document.docDate = nextProps.document.docDate != null ? moment(nextProps.document.docDate).format("DD/MM/YYYY") : moment();

            this.setState({
                document: nextProps.document,
                hasWorkflow: nextProps.hasWorkflow,
                message: nextProps.document.message
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

        if (this.state.showModal != this.props.showModal) {
            this.setState({ showModal: this.props.showModal });
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(67)) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(67)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(67)) {
                    if (this.props.document.status !== false && Config.IsAllow(67)) {
                        this.setState({ isViewMode: false });
                    } else {
                        this.setState({ isViewMode: true });
                    }
                } else {
                    this.setState({ isViewMode: true });
                }
            }
        } else {
            this.setState({ isViewMode: false });
        }
    }

    componentWillMount() {
        if (this.state.docId > 0) {

            let url = "GetCommunicationProposalForEdit?id=" + this.state.docId;
            this.props.actions.documentForEdit(url, this.state.docTypeId, "procurement");
            this.setState({
                isEdit: true
            });
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

    //+ this.state.projectId
    fillDropDowns(isEdit) {
        this.setState({ isLoading: true });
        dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, "companyName", "companyId").then(result => {
            if (isEdit) {
                let companyId = this.props.document.fromCompanyId;
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
                        building: { label: this.props.document.buildingNo, value: buildingNoId }
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

    editProposal(event) {
        this.setState({
            isLoading: true
        });

        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(saveDocument.docDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

        dataservice.addObject("EditCommunicationProposal", saveDocument).then(result => {

            this.setState({
                isLoading: false
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);

            this.props.history.push({
                pathname: "/Proposal/" + this.state.projectId
            });
        });
    }

    saveMaterialReques(event) {
        if (this.state.items.length > 0) {

            this.setState({
                isLoading: true
            });
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
            console.log('document=>', saveDocument)
            dataservice.addObject("AddContractsSiteRequest", saveDocument).then(result => {
                this.setState({
                    docId: result.id,
                    isLoading: false
                });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }).catch(() => {
                this.setState({
                    isLoading: false
                });
                toast.success(Resources["operationCanceled"][currentLanguage]);
            })
        }
        else {
            toast.info('this boq not have items choice another boq')
        }

    }

    saveAndExit(event) {
        this.props.history.push({
            pathname: "/Proposal/" + this.state.projectId
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
        return btn;
    }

    viewAttachments() {
        return this.state.docId > 0 ? (
            Config.IsAllow(3287) === true ? (
                <ViewAttachment
                    docTypeId={this.state.docTypeId}
                    docId={this.state.docId}
                    projectId={this.state.projectId}
                    deleteAttachments={832}
                />
            ) : null
        ) : null;
    }

    handleShowAction = item => {
        if (item.title == "sendToWorkFlow") {
            this.props.actions.SendingWorkFlow(true);
        }
        if (item.value != "0") { this.props.actions.showOptionPanel(false); 
            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            });
            this.simpleDialog.show();
        }
    };

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
                if (next == true) {
                    this.editMeeting();
                }
                else if (this.state.docId > 0) {
                    let CurrStep = this.state.CurrStep + 1
                    this.setState({ firstComplete: true, CurrStep })
                }
                this.setState({

                })
                break;
            case 2:
                this.setState({
                    CurrStep: this.state.CurrStep + 1, secondComplete: true,

                })
                break;

        }
    }
    addItem = () => {
        this.state.items.forEach(item => {
            if (item.quantity > 0) {
                this.setState({ isLoading: true })
                item.requestId = this.state.docId
                Api.post('AddContractsSiteRequestItems', item).then(() => {
                    const _items = this.state._items;
                    _items.push(item);
                    this.setState({ _items, isLoading: false })
                })
            }

        })
    }
    _onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        let updateRow = this.state.items[fromRow];
        this.setState(state => {
            const items = state.items.slice();
            for (let i = fromRow; i <= toRow; i++) {
                items[i] = { ...items[i], ...updated };
            }
            return { items };
        }, function () {
            if (updateRow[Object.keys(updated)[0]]['quantity'] !== updated[Object.keys(updated)[0]]['quantity']) {
                updateRow[Object.keys(updated)[0]]['quantity'] = updated[Object.keys(updated)[0]]['quantity'];
                this.setState({ isLoading: true })
                Api.post('UpdateQuantitySiteRequestItems?id=' + this.state.items[fromRow].id + '&quantity=' + updated.quantity)
                    .then(() => {
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                        this.setState({ isLoading: false })
                    })
                    .catch(() => {
                        toast.error(Resources["operationCanceled"][currentLanguage]);
                        this.setState({ isLoading: false })
                    })
            }
            if (updateRow[Object.keys(updated)[0]]['stock'] !== updated[Object.keys(updated)[0]]['stock']) {
                updateRow[Object.keys(updated)[0]]['stock'] = updated[Object.keys(updated)[0]]['stock'];
                this.setState({ isLoading: true })
                Api.post('UpdateQuantitySiteRequestItems?id=' + this.state.items[fromRow].id + '&stock=' + updated.stock)
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

    onRowClick = (value, index, column) => {
        if (!Config.IsAllow(11)) {
            toast.warning("you don't have permission");
        }
        else if (column.key == 'customBtn') {
            this.itemization(value)
        }
        else if (column.key != 'select-row' && column.key != 'quantity' && column.key != 'stock') {

            if (this.state.CurrStep == 2) {
                this.setState({ showPopUp: true, btnText: 'save', selectedRow: value })
                this.simpleDialog1.show()
            }

        }
    }
    render() {
        const ItemsGrid = this.state.isLoading === false ? (
            <GridSetupWithFilter
                rows={this.state._items}
                pageSize={this.state.pageSize}
                onRowClick={this.onRowClick}
                columns={this.itemsColumns}
                onGridRowsUpdated={this._onGridRowsUpdated}
                key='items'
            />) : <LoadingSection />;
        let actions = [
            {
                title: "distributionList",
                value: (<Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />),
                label: Resources["distributionList"][currentLanguage]
            },
            {
                title: "sendToWorkFlow",
                value: (<SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />),
                label: Resources["sendToWorkFlow"][currentLanguage]
            },
            {
                title: "documentApproval",
                value: (<DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={true} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />),
                label: Resources["documentApproval"][currentLanguage]
            },
            {
                title: "documentApproval",
                value: (<DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={false} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />),
                label: Resources["documentApproval"][currentLanguage]
            }
        ];

        let Step_1 =
            <div id="step1" className="step-content-body">
                <div className="subiTabsContent">
                    <div className="document-fields">
                        <Formik
                            initialValues={{
                                ...this.state.document, fromCompany: this.state.fromCompany.value > 0 ? this.state.fromCompany : '',
                                discipline: this.state.discipline.value > 0 ? this.state.discipline : ''
                            }}
                            validationSchema={validationSchema}
                            enableReinitialize={true}
                            onSubmit={values => {
                                if (this.props.changeStatus === true && this.state.docId > 0) {
                                    this.editProposal();
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
                                                    value={this.state.document.subject}
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
                                                    value={this.state.document.arrange}
                                                    onBlur={e => { handleBlur(e); handleChange(e); }}
                                                    onChange={e =>
                                                        this.handleChange(e, "arrange")
                                                    } />
                                                {touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">

                                            <div id="allSelected" className={"ui checkbox checkBoxGray300 checked"} checked={this.state.document.useQntyRevised} onClick={e => this.handleCheckBox(e)}>
                                                <input name="CheckBox" type="checkbox" id="allPermissionInput" checked={this.state.document.useQntyRevised} />
                                                <label>{Resources.revQuantity[currentLanguage]}</label>
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
                                        {
                                            this.state.isEdit === true ? null :
                                                this.state.isLoading ? (
                                                    <button className="primaryBtn-1 btn disabled">
                                                        <div className="spinner">
                                                            <div className="bounce1" />
                                                            <div className="bounce2" />
                                                            <div className="bounce3" />
                                                        </div>
                                                    </button>
                                                ) : (
                                                        this.showBtnsSaving()
                                                    )}
                                    </div>
                                    {this.props.changeStatus === true ? (
                                        <div className="approveDocument">
                                            <div className="approveDocumentBTNS">
                                                {this.state.isLoading ? (
                                                    <button className="primaryBtn-1 btn disabled">
                                                        <div className="spinner">
                                                            <div className="bounce1" />
                                                            <div className="bounce2" />
                                                            <div className="bounce3" />
                                                        </div>
                                                    </button>
                                                ) : (
                                                        <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"}>
                                                            {Resources.save[currentLanguage]}
                                                        </button>
                                                    )}
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
                    </div>
                    <div className="doc-pre-cycle letterFullWidth">
                        <div>
                            {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={831} EditAttachments={3246} ShowDropBox={3549} ShowGoogleDrive={3550} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                            {this.viewAttachments()}
                            {this.props.changeStatus === true ? (<ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                        </div>
                    </div>
                </div>
            </div>

        let Step_2 = <React.Fragment>
            <header><h2 className="zero">{Resources.items[currentLanguage]}</h2></header>
            <div >
                <ReactTable
                    data={this.state.items}
                    columns={[
                        {
                            Header: Resources.actions[currentLanguage],
                            accessor: 'arrange'
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
                    ]}
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
                disabled={false} afterUpload={() => this.GetBoqItemsStracture()} />
            <div className="header__dropdown">
                <header><h2 className="zero">{Resources.AddedItems[currentLanguage]}</h2></header>
                <div className="linebylineInput valid-input custom__dropDown">
                    <Dropdown
                        title=""
                        data={this.state.materialTypes}
                        selectedValue={this.state.materialType}
                        handleChange={event => {
                            this.setState({ materialType: event })
                        }}
                    />
                </div>
            </div>
            {ItemsGrid}
        </React.Fragment>

        return (
            <div className="mainContainer" id={"mainContainer"}>
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs one__tab one_step" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} docTitle={Resources.siteRequest[currentLanguage]} moduleTitle={Resources["procurement"][currentLanguage]} />
                    <div className="doc-container">
                        {this.props.changeStatus == true ? (
                            <header className="main__header">
                                <div className="main__header--div">
                                    <h2 className="zero">{Resources.goEdit[currentLanguage]}</h2>
                                    <p className="doc-infohead">
                                        <span> {this.state.document.refDoc}</span> -
                    <span> {this.state.document.arrange}</span> -
                    <span>
                                            {moment(this.state.document.docDate).format("DD/MM/YYYY")}
                                        </span>
                                    </p>
                                </div>
                            </header>
                        ) : null}
                        <div className="step-content">
                            <React.Fragment>
                                {this.state.CurrStep == 1 ? Step_1 : Step_2}
                                {/* <div className="largePopup largeModal " style={{ display: this.state.showPopUp ? 'block' : 'none' }}>
                                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog1 = ref}
                                        title={Resources.editTitle[currentLanguage] + ' - ' + Resources.meetingAgendaLog[currentLanguage]}
                                        beforeClose={this._executeBeforeModalClose}>
                                        {this.state.CurrStep == 2 ? attendeesContent : topicContent}
                                    </SkyLight>
                                </div> */}
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
                        <div>
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
                </div>
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? "block" : "none" }}>
                    <SkyLight hideOnOverlayClicked ref={ref => (this.simpleDialog = ref)} title={Resources[this.state.currentTitle][currentLanguage]}>
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
