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
import Config from "../../Services/Config.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
//import Recycle from '../../Styles/images/attacheRecycle.png'
import AddItemDescription from '../../Componants/OptionsPanels/addItemDescription'
import EditItemDescription from '../../Componants/OptionsPanels/editItemDescription'

import 'react-table/react-table.css'
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
import GridSetup from "../Communication/GridSetup";
import XSLfile from '../../Componants/OptionsPanels/XSLfiel'
import IPConfig from '../../IP_Configrations'
import SkyLight from 'react-skylight';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');


let boqId = 0;
let projectId = 0;
let id = 0;
let projectName = "";

class Itemize extends Component {
    constructor(props) {
        super(props)
        this.extractDataFromURL(this.props.location.search);
        let editUnitPrice = ({ value, row }) => {
            let subject = "";
            if (row) {
                return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer' }}>{row.unitPrice}</span></a>;
            }
            return null;
        };

        this.itemsColumns = [
            {
                formatter: this.customButton,
                key: 'customBtn'

            },
            {
                key: "arrange",
                name: Resources["no"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }

            , {
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
            currentMode: '',
            boqId: boqId,
            parentId: id,
            showPopUp: false,
            activeTab: '',
            isCompany: Config.getPayload().uty == 'company' ? true : false,
            LoadingPage: false,
            docTypeId: 64,
            selectedRow: '',
            selectedItem: {},
            projectName: projectName,
            pageSize: 50,
            arrange: 0,
            items: [],
            item: {},
            isLoading: true,
            document: {},
        }

    }

    customButton = () => {
        return <button className="companies_icon" style={{ cursor: 'pointer' }} ><i class="fa fa-folder-open"></i></button>;
    };

    componentWillUnmount() {
    }

    componentDidMount() {

    }
    componentWillMount() {
        this.getTabelData(this.state.parentId)
    }

    getTabelData(id) {

        this.setState({ isLoading: true, LoadingPage: true })
        Api.get('GetBoqItem?id=' + id).then(item => {
            this.setState({ item, parentId: item != null ? item.id : 0 })
            setTimeout(() => { this.setState({ isLoading: false, LoadingPage: false }) }, 500)
        })

        let subTable = []
        this.setState({ isLoading: true, LoadingPage: true })
        Api.get('GetBoqItemChildren?id=' + id).then(items => {
            if (items) {
                items.forEach(item => {
                    subTable.push({
                        id: item.id,
                        parentId: item.parentId,
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
                this.props.actions.setItemDescriptions(subTable, 9509);
                setTimeout(() => { this.setState({ isLoading: false, LoadingPage: false }) }, 500)
            }

        })

    }

    componentDidUpdate(prevProps) {

    }
    extractDataFromURL(url) {
        const query = new URLSearchParams(url);
        let index = 0;
        for (let param of query.entries()) {
            if (index == 0) {
                try {
                    let obj = JSON.parse(CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8));
                    boqId = obj.boqId;
                    projectId = obj.projectId;
                    id = obj.id;
                    projectName = obj.projectName;
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }
    }
    componentWillUnmount() {
        this.props.actions.deleteItemsDescription()
    }
    componentWillReceiveProps(props, state) {
        if (props.location.search !== this.props.location.search) {
            this.extractDataFromURL(props.location.search);
            this.props.actions.deleteItemsDescription()
            this.setState({
                parentId: id,
                isLoading: true,
                currentMode: ''
            });
            this.getTabelData(id)

        }
        if (props.items) {
            this.setState({ isLoading: true })
            let items = props.items
            this.setState({ items, activeTab: '' }, function () { this.setState({ isLoading: false }) })
        }

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
        Api.post('ContractsBoqItemsMultipleDelete?', this.state.selectedRow).then((res) => {
            let originalData = [...this.state.items]
            this.state.selectedRow.forEach(item => {
                let getIndex = originalData.findIndex(x => x.id === item.id);
                originalData.splice(getIndex, 1);
            });
            this.setState({ items: originalData, showDeleteModal: false, isLoading: false });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ showDeleteModal: false, isLoading: false });
        })

    }
    itemization = (value) => {
        let obj = {
            id: value.id,
            boqId: value.boqId,
            projectId: this.state.projectId,
            projectName: this.state.projectName
        };
        let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
        let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
        this.props.history.push({
            pathname: "/Itemize",
            search: "?id=" + encodedPaylod
        });
    }

    onRowClick = (value, index, column) => {
        if (!Config.IsAllow(11)) {
            toast.warning("you don't have permission");
        }
        else if (column.key == 'customBtn') {
            this.itemization(value)

        }
        else if (column.key != 'select-row' && column.key != 'unitPrice') {
            this.setState({ showPopUp: true, currentMode: 'edit' })
            this.simpleDialog.show()
            this.setState({ selectedItem: value })
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

        let updateRow = this.state.items[fromRow];

        this.setState(state => {
            const items = state.items.slice();
            for (let i = fromRow; i <= toRow; i++) {
                items[i] = { ...items[i], ...updated };
            }
            return { items };
        }, function () {
            if (updateRow[Object.keys(updated)[0]] !== updated[Object.keys(updated)[0]]) {

                updateRow[Object.keys(updated)[0]] = updated[Object.keys(updated)[0]];
                Api.post('EditBoqItemChildUnitPrice?id=' + this.state.items[fromRow].id + '&parentId=' + this.state.parentId + '&unitPrice=' + updated.unitPrice)
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
    closePopUp = () => {
        this.setState({ showPopUp: false, currentMode: '' })
    }
    render() {

        const subItemsGrid = this.state.isLoading === false ? (
            <GridSetup
                rows={this.state.items}
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
            this.state.isLoading ? null : (this.state.item != null ?
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
                : null)

        const editItemContent = <React.Fragment>
            {this.state.currentMode == 'edit' ?
                <div className="document-fields" key='editItem'>
                    <EditItemDescription
                        showImportExcel={false} docType="boq"
                        isViewMode={this.state.isViewMode}
                        mainColumn="boqId" editItemApi="EditBoqItemChild"
                        parentId={this.state.parentId}
                        projectId={this.state.projectId}
                        showItemType={true}
                        item={this.state.selectedItem}
                        onSave={e => this.closePopUp()} />

                </div>
                : null}</React.Fragment >
        const addItemContent = <React.Fragment>
            <div className="document-fields">
                {this.state.isLoading ? <LoadingSection /> : null}
                <AddItemDescription docLink="/Downloads/Excel/BOQ.xlsx"
                    showImportExcel={false} docType="boq"
                    isViewMode={this.state.isViewMode}
                    mainColumn="boqId" addItemApi="AddBoqItemChild"
                    parentId={this.state.parentId}
                    projectId={this.state.projectId}
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
            <div className="largePopup largeModal " style={{ display: this.state.showPopUp ? 'block' : 'none' }}>
                <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources.boqType[currentLanguage]}>
                    {editItemContent}
                </SkyLight>
            </div>
        </React.Fragment>

        return (
            <React.Fragment>
                <div className="mainContainer">
                    <div className={this.state.isViewMode === true && this.state.CurrStep != 3 ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                        <div className="submittalHead">
                            <h2 className="zero">{Resources.contract[currentLanguage]}
                                <span>{this.state.projectName ? this.state.projectName.replace(/_/gi, ' ') : ''} {Resources.contracts[currentLanguage]} {Resources.itemize[currentLanguage]} </span>
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