import React, { Component, Fragment } from 'react';
import Dropdown from '../../Componants/OptionsPanels/DropdownMelcous';
import Api from '../../api'
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import moment from 'moment'
import Resources from '../../resources.json';
import _ from "lodash";
import * as Yup from 'yup';
import { withRouter } from "react-router-dom";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import DataService from '../../Dataservice'
import CryptoJS from 'crypto-js';
import { toast } from "react-toastify";
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import Config from "../../Services/Config.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
//import Recycle from '../../Styles/images/attacheRecycle.png'
import AddItemDescription from '../../Componants/OptionsPanels/addItemDescription'

import 'react-table/react-table.css'
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
import GridSetup from "../Communication/GridSetup";
import XSLfile from '../../Componants/OptionsPanels/XSLfiel'
import IPConfig from '../../IP_Configrations'
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');




let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;


class Itemize extends Component {
    constructor(props) {
        super(props)
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
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }

        let editUnitPrice = ({ value, row }) => {
            let subject = "";
            if (row) {
                return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer' }}>{row.unitPrice}</span></a>;
            }
            return null;
        };

        this.itemsColumns = [
            {
                key: "arrange",
                name: Resources["no"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "boqType",
                name: Resources["boqType"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "boqTypeChild",
                name: Resources["boqTypeChild"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "boqSubType",
                name: Resources["boqSubType"][currentLanguage],
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
            }, {
                key: "description",
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
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "revisedQuntitty",
                name: Resources["receivedQuantity"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
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
                key: "unitPrice",
                name: Resources["unitPrice"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                editable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: editUnitPrice
            }, {
                key: "total",
                name: Resources["total"][currentLanguage],
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
            }
        ];

        this.state = {
            boqId:9509,
            parentId:0,
            activeTab: '',
            isCompany: Config.getPayload().uty == 'company' ? true : false,
            LoadingPage: false,
            docTypeId: 64,
            selectedRow: '',
            pageSize: 50,
            docId: docId,
            arrange: arrange,
            items: [],
            item: {},
            isLoading: true,
            document: {},
        }

    }

    componentWillUnmount() {
    }

    componentDidMount() {

    }
    componentWillMount() {
        this.getTabelData()
    }
    getTabelData() {
        let Table = []
        this.setState({ isLoading: true, LoadingPage: true })
        Api.get('GetBoqItem?id=8399').then(item => {
     

            this.setState({ item,parentId:item.id })
            // this.props.actions.setItemDescriptions(Table);

            setTimeout(() => { this.setState({ isLoading: false, LoadingPage: false }) }, 500)
        })

        let subTable = []
        this.setState({ isLoading: true, LoadingPage: true })
        Api.get('GetBoqItemChildren?id=8399').then(items => {
            items.forEach(item => {
                subTable.push({
                    id: item.id,
                    boqId: item.boqId,
                    unitPrice: this.state.items.unitPrice,
                    itemType: item.itemType,
                    itemTypeLabel: '',
                    days: item.days,
                    equipmentType: item.equipmentType,
                    equipmentTypeLabel: '',
                    editable: true,
                    boqSubTypeId: item.boqSubTypeId,
                    boqTypeId: item.boqTypeId,
                    boqChildTypeId: item.boqChildTypeId,
                    arrange: item.arrange,
                    boqType: item.boqType,
                    boqTypeChild: item.boqTypeChild,
                    boqSubType: item.boqSubType,
                    itemCode: item.itemCode,
                    description: item.description,
                    quantity: item.quantity,
                    revisedQuntitty: item.revisedQuantity,
                    unit: item.unit,
                    unitPrice: item.unitPrice,
                    total: item.total,
                    resourceCode: item.resourceCode
                })

            })
            this.setState({ items: subTable })
            this.props.actions.setItemDescriptions(subTable);
            setTimeout(() => { this.setState({ isLoading: false, LoadingPage: false }) }, 500)
        })

    }

    componentDidUpdate(prevProps) {

    }

    componentWillReceiveProps(props, state) {
        if (props.document && props.document.id > 0) {
            let docDate = moment(props.document.documentDate)
            let document = Object.assign(props.document, { documentDate: docDate })
            this.setState({ document });
            this.fillDropDowns(true);
            this.checkDocumentIsView();
        }

    }


    addEditItems = () => {
        this.setState({ isLoading: true })
        let item = {
            id: this.state.items.id,
            boqId: this.state.docId,
            parentId: '',
            description: this.state.items.description,
            quantity: this.state.items.quantity,
            arrange: this.state.items.arrange,
            unit: this.state.selectedUnit.value,
            unitLabel: this.state.selectedUnit.label,
            unitPrice: this.state.items.unitPrice,
            revisedQuantity: 0,
            resourceCode: this.state.items.resourceCode,
            itemCode: this.state.items.itemCode,
            itemType: this.state.selectedItemType.value == '0' ? null : this.state.selectedItemType.value,
            itemTypeLabel: this.state.selectedItemType.label,
            days: this.state.items.days,
            equipmentType: this.state.selectedequipmentType.value > 0 ? this.state.selectedequipmentType.value : '',
            equipmentTypeLabel: this.state.selectedequipmentType.value > 0 ? this.state.selectedequipmentType.label : '',
            editable: true,
            boqSubTypeId: this.state.selectedBoqSubType.value == '0' ? null : this.state.selectedBoqSubType.value,
            boqSubType: this.state.selectedBoqSubType.label,
            boqTypeId: this.state.selectedBoqType.value == '0' ? null : this.state.selectedBoqType.value,
            boqType: this.state.selectedBoqType.label,
            boqChildTypeId: this.state.selectedBoqTypeChild.value == '0' ? null : this.state.selectedBoqTypeChild.value,
            boqTypeChild: this.state.selectedBoqTypeChild.label,
        }
        let url = this.state.showPopUp ? 'EditBoqItem' : 'AddBoqItem'
        Api.post(url, item).then((res) => {
            if (this.state.showPopUp) {
                let items = Object.assign(this.state.rows)
                this.state.rows.forEach((element, index) => {
                    if (element.id == this.state.items.id) {
                        item.id = this.state.items.id;
                        items[index] = item
                        this.setState({ rows: items, isLoading: false }, function () {
                            toast.success(Resources["operationSuccess"][currentLanguage]);
                        })
                    }
                })
            }
            else {
                if (this.state.items.itemCode != null) {
                    let data = [...this.state.rows];
                    item.id = res.id;
                    data.push({
                        ...item
                    })
                    this.setState({
                        rows: data,
                        items: { ...this.state.items, arrange: res.arrange + 1, description: '', quantity: '', itemCode: '', resourceCode: '', unitPrice: '', days: 1 }
                    }, function () {
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    })
                }
            }
            this.setState({
                selectedUnit: { label: Resources.unitSelection[currentLanguage], value: "0" },
                selectedBoqType: { label: Resources.boqType[currentLanguage], value: "0" },
                selectedBoqTypeChild: { label: Resources.boqTypeChild[currentLanguage], value: "0" },
                selectedBoqSubType: { label: Resources.boqSubType[currentLanguage], value: "0" },
                selectedItemType: { label: Resources.itemTypeSelection[currentLanguage], value: "0" },
                selectedequipmentType: { label: Resources.equipmentTypeSelection[currentLanguage], value: "0" },
                BoqTypeChilds: [],
                BoqSubTypes: [],
                isLoading: false,
                showPopUp: false,
                btnText: 'add'

            });
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ isLoading: false })
        })
    }
    checkItemCode = (code) => {
        Api.get('GetItemCode?itemCode=' + code + '&projectId=' + this.state.projectId).then(res => {
            if (res == true) {
                toast.error(Resources["itemCodeExist"][currentLanguage])
                this.setState({ items: { ...this.state.items, itemCode: '' } })
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
        if (this.state.CurrStep == 2) {
            Api.post('ContractsBoqItemsMultipleDelete?', this.state.selectedRow).then((res) => {
                let data = [...this.state.rows]
                let length = data.length
                data.forEach((element, index) => {
                    data = data.filter(item => { return item.id != element.id });
                    if (index == length - 1) {
                        this.setState({ rows: data, showDeleteModal: false, isLoading: false });
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }
                })
            }).catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ showDeleteModal: false, isLoading: false });
            })
        }
    }

    onRowClick = (value, index, column) => {
        console.log('column.key', column.key)
        if (!Config.IsAllow(11)) {
            toast.warning("you don't have permission");
        }

        else if (column.key != 'select-row' && column.key != 'unitPrice') {
            this.setState({ showPopUp: true, btnText: 'save' })
            DataService.GetDataList('GetAccountsDefaultList?listType=estimationitemtype&pageNumber=0&pageSize=10000', 'title', 'id').then(result => {

                this.setState({
                    itemTypes: result
                })
            })

            DataService.GetDataList('GetAccountsDefaultList?listType=equipmentType&pageNumber=0&pageSize=10000', 'title', 'id').then(res => {
                this.setState({ equipmentTypes: [...res] })
            })

            this.simpleDialog1.show()

            if (this.state.CurrStep == 2) {
                this.setState({ isLoading: true })
                DataService.GetDataList('GetAllBoqChild?parentId=' + value.boqTypeId, 'title', 'id').then(res => {
                    this.setState({
                        BoqSubTypes: res,
                        BoqTypeChilds: res,
                        items: { id: value.id, description: value.description, arrange: value.arrange, quantity: value.quantity, unitPrice: value.unitPrice, itemCode: value.itemCode, resourceCode: value.resourceCode, days: value.days },
                        selectedUnit: value.unit ? { label: value.unit, value: value.unit } : { label: Resources.unitSelection[currentLanguage], value: "0" },
                        selectedBoqType: value.boqTypeId > 0 ? { label: value.boqType, value: value.boqTypeId } : { label: Resources.boqType[currentLanguage], value: "0" },
                        selectedBoqTypeChild: value.boqChildTypeId > 0 ? { label: value.boqTypeChild, value: value.boqTypeChildId } : { label: Resources.boqTypeChild[currentLanguage], value: "0" },
                        selectedBoqSubType: value.boqSubTypeId > 0 ? { label: value.boqSubType, value: value.boqSubTypeId } : { label: Resources.boqSubType[currentLanguage], value: "0" },
                        selectedequipmentType: value.equipmentType > 0 ? { label: value.equipmentTypeLabel, value: value.equipmentType } : { label: Resources.equipmentTypeSelection[currentLanguage], value: "0" },
                        selectedItemType: { label: Resources.itemTypeSelection[currentLanguage], value: "0" },
                        isLoading: false
                    })
                    if (value.itemType > 0) {
                        let itemType = _.find(this.state.itemTypes, function (e) { return e.value == value.itemType })
                        this.setState({ selectedItemType: itemType })
                    }
                })
            }

        }
    }
    clickHandlerDeleteRowsMain = selectedRows => {
        this.setState({
            showDeleteModal: true,
            selectedRow: selectedRows
        });
    };
    onRowsSelected = selectedRows => {
        this.setState({
            selectedRow: selectedRows
        });
    }
    onRowsDeselected = () => {
        this.setState({
            selectedRow: []
        });
    }


    _executeBeforeModalClose = () => {
        this.setState({
            showPopUp: false, btnText: 'add'
        })
    }
    _executeBeforeModalOpen = () => {
        this.setState({
            btnText: 'save'
        })
    }

    _onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        this.setState({ isLoading: true })

        let updateRow = this.state.rows[fromRow];

        this.setState(state => {
            const rows = state.rows.slice();
            for (let i = fromRow; i <= toRow; i++) {
                rows[i] = { ...rows[i], ...updated };
            }
            return { rows };
        }, function () {
            if (updateRow[Object.keys(updated)[0]] !== updated[Object.keys(updated)[0]]) {

                updateRow[Object.keys(updated)[0]] = updated[Object.keys(updated)[0]];
                Api.post('EditBoqItemUnitPrice?id=' + this.state.rows[fromRow].id + '&unitPrice=' + updated.unitPrice)
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


    changeTab = (activeTab) => {
        if (activeTab === 'one') {

        }
        else if (activeTab === 'many') {

        }
        this.setState({ activeTab })
    }

    render() {

        const subItemsGrid = this.state.isLoading === false ? (
            <GridSetup
                rows={this.props.items}
                showCheckbox={true}
                pageSize={this.state.pageSize}
                onRowClick={this.onRowClick}
                columns={this.itemsColumns}
                clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                onRowsSelected={this.onRowsSelected}
                onRowsDeselected={this.onRowsDeselected}
                onGridRowsUpdated={this._onGridRowsUpdated}
                key='sub-items'
            />) : <LoadingSection />;
        const itemTable =
        this.state.isLoading ? null :
            <table className="taskAdminTable">
                <thead>
                    <tr>
                        <th>{Resources['no'][currentLanguage]}</th>
                        <th>{Resources['itemCode'][currentLanguage]}</th>
                        <th>{Resources['details'][currentLanguage]}</th>
                        <th>{Resources['quantity'][currentLanguage]}</th>
                        <th>{Resources['revQuantity'][currentLanguage]}</th>
                        <th>{Resources['unit'][currentLanguage]}</th>
                        <th>{Resources['unitPrice'][currentLanguage]}</th>
                        <th>{Resources['total'][currentLanguage]}</th>
                        <th>{Resources['resourceCode'][currentLanguage]}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={'table'}>
                        <td >{this.state.item.arrange} </td>
                        <td >{this.state.item.itemCode} </td>
                        <td >{this.state.item.description} </td>
                        <td >{this.state.item.quantity} </td>
                        <td >{this.state.item.revisedQuantity} </td>
                        <td >{this.state.item.unit} </td>
                        <td >{this.state.item.unitPrice} </td>
                        <td >{this.state.item.total} </td>
                        <td >{this.state.item.resourceCode} </td>
                    </tr>
                </tbody>
            </table>


        const addItemContent = <React.Fragment>
            <div className="document-fields">
                {this.state.isLoading ? <LoadingSection /> : null}
                <AddItemDescription docLink="/Downloads/Excel/BOQ.xlsx"
                    showImportExcel={false} docType="boq"
                    isViewMode={this.state.isViewMode}
                    mainColumn="boqId" addItemApi="AddBoqItemChild"
                    parentId={this.state.parentId}
                    showItemType={true} />

            </div>
        </React.Fragment >
        const addManyItems = <Fragment>
            <Fragment>
                <XSLfile key='boqImport' docId={this.state.docId} docType='boq' link={IPConfig.downloads + '/Downloads/Excel/BOQ.xlsx'} header='addManyItems'
                    disabled={this.props.changeStatus ? (this.props.document.contractId > 0 ? true : false) : false} afterUpload={() => this.getTabelData()} />
            </Fragment>
            {
                this.state.isCompany ?
                    <Fragment>
                        <XSLfile key='boqStructure' docId={this.state.docId} docType='boq2' link={IPConfig.downloads + '/Downloads/Excel/BOQ2.xlsx'} header='addManyItems'
                            disabled={this.props.changeStatus ? (this.props.document.contractId > 0 ? true : false) : false} afterUpload={() => this.getTabelData()} />
                    </Fragment> : null
            }
        </Fragment>
        let Step_2 = <React.Fragment>
            <div className="company__total proForm">
                <div className="form-group ">
                    <label className="control-label">{Resources.company[currentLanguage]}</label>
                    <div className="ui right labeled input">
                        <input autoComplete="off" type="text" value={this.props.document.subject} readOnly data-toggle="tooltip" title="procoor Company" />
                        <span className="total_money">{Resources.total[currentLanguage]}</span>
                        <div className="ui basic label greyLabel"> {this.props.document.total}</div>
                    </div>
                </div>
                <ul id="stepper__tabs" className="data__tabs">
                    <li className={" data__tabs--list " + (this.state.activeTab == 'one' ? "active" : '')} onClick={() => this.changeTab('one')}>{Resources.addOneItem[currentLanguage]}</li>
                    <li className={"data__tabs--list " + (this.state.activeTab == 'many' ? "active" : '')} onClick={() => this.changeTab('many')}>{Resources.addManyItems[currentLanguage]}</li>
                </ul>
            </div>
            <div className='document-fields'>
                {this.state.isLoading ? null : itemTable}
            </div>
            {this.state.activeTab == 'one' ? addItemContent : (this.state.activeTab == 'many' ? addManyItems : null)}
            {this.state.items.length > 0 ? subItemsGrid : null}

        </React.Fragment>

        return (
            <React.Fragment>
                <div className="mainContainer">
                    <div className={this.state.isViewMode === true && this.state.CurrStep != 3 ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                        <div className="submittalHead">
                            <h2 className="zero">{Resources.boq[currentLanguage]}
                                <span>{projectName.replace(/_/gi, ' ')} {Resources.contracts[currentLanguage]}</span>
                            </h2>
                            <div className="SubmittalHeadClose">
                                <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                        <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                            <g id="Group-2">
                                                <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                    <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                        <g id="Group">
                                                            <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                            <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" id="Combined-Shape" fill="#858D9E" fillRule="nonzero"></path>
                                                        </g>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <div className="doc-container">
                            <div className="step-content">
                                {this.state.LoadingPage ? <LoadingSection /> :
                                    <Fragment>
                                        {Step_2}
                                    </Fragment>
                                }
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
                </div>
            </React.Fragment>
        )
    }
}
function mapStateToProps(state, ownProps) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading,
        changeStatus: state.communication.changeStatus,
        file: state.communication.file,
        files: state.communication.files,
        hasWorkflow: state.communication.hasWorkflow,
        items: state.communication.items,
        projectId: state.communication.projectId, showModal: state.communication.showModal
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Itemize))