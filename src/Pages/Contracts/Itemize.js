import React, { Component, Fragment } from "react";
import Api from "../../api";
import Resources from "../../resources.json";
//import _ from "lodash"; 
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import Config from "../../Services/Config.js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import AddItemDescription from "../../Componants/OptionsPanels/addItemDescription";
import EditItemDescription from "../../Componants/OptionsPanels/editItemDescription";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import "react-table/react-table.css";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import XSLfile from "../../Componants/OptionsPanels/XSLfiel";
import SkyLight from "react-skylight";
import GridCustom from "../../Componants/Templates/Grid/CustomCommonLogGrid";

let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

let boqId = 0;
let projectId = 0;
let id = 0;
let projectName = "";

class Itemize extends Component {
    constructor(props) {
        super(props);
        this.extractDataFromURL(this.props.location.search);
        this.itemsColumns = [
            {
                field: "id",
                title: "",
                width: 10,
                type: "check-box",
                fixed: true,
                showTip: true
            },
            {
                field: 'arrange',
                title: Resources['no'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "number",
                sortable: true,
            },
            {
                field: 'itemCode',
                title: Resources['itemCode'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'description',
                title: Resources['details'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'quantity',
                title: Resources['quantity'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "number",
                sortable: true,
            },
            {
                field: 'revisedQuntitty',
                title: Resources['receivedQuantity'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "number",
                sortable: true,
            },
            {
                field: 'unit',
                title: Resources['unit'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'unitPrice',
                title: Resources['unitPrice'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "input",
                sortable: true,
                handleChange: (e, cell) => {
                    cell.unitPrice = e.target.value;

                },
                handleBlur: (e, cell) => {
                    this._onGridRowsUpdated(cell);
                }
            },
            {
                field: 'total',
                title: Resources['total'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "number",
                sortable: true,
            },
            {
                field: 'resourceCode',
                title: Resources['resourceCode'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }
        ];

        this.state = {
            currentMode: "",
            boqId: boqId,
            parentId: id,
            showPopUp: false,
            activeTab: "",
            isCompany: Config.getPayload().uty == "company" ? true : false,
            LoadingPage: false,
            docTypeId: 64,
            selectedRow: "",
            selectedItem: {},
            projectName: projectName,
            pageSize: 50,
            arrange: 0,
            subItemsGrid: [],
            item: {},
            isLoading: true,
            document: {}
        };
        this.actions = [{
            title: 'Delete',
            handleClick: values => {
                this.clickHandlerDeleteRowsMain(values)
            }
        }]
        this.rowActions = [{
            title: 'Folder',
            handleClick: value => {
                this.itemization(value);
            }
        }]
    }

    customButton = () => {
        return (
            <button className="companies_icon" style={{ cursor: "pointer" }}>
                <i class="fa fa-folder-open" />
            </button>
        );
    };

    componentWillMount() {
        this.getTabelData(this.state.parentId);
    }
    getTabelData(id) {
        this.setState({ isLoading: true, LoadingPage: true });
        Api.get("GetBoqItem?id=" + id).then(item => {
            this.setState({ item, parentId: item != null ? item.id : 0 });
            setTimeout(() => {
                this.setState({ isLoading: false, LoadingPage: false });
            }, 500);
        });

        let subTable = [];
        this.setState({ isLoading: true, LoadingPage: true });
        Api.get("GetBoqItemChildren?id=" + id).then(items => {
            if (items) {
                items.forEach(item => {
                    subTable.push({
                        id: item.id,
                        parentId: item.parentId,
                        boqId: item.boqId,
                        unitPrice: this.state.item.unitPrice,
                        itemType: item.itemType,
                        itemTypeLabel: "",
                        days: item.days,
                        equipmentType: item.equipmentType,
                        equipmentTypeLabel: "",
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
                    });
                });
                this.setState({ items: subTable });
                this.props.actions.setItemDescriptions(subTable, 9509);
                setTimeout(() => {
                    this.setState({ isLoading: false, LoadingPage: false });
                }, 500);
            }
        });
    }

    componentDidUpdate(prevProps) { }
    extractDataFromURL(url) {
        const query = new URLSearchParams(url);
        let index = 0;
        for (let param of query.entries()) {
            if (index == 0) {
                try {
                    let obj = JSON.parse(
                        CryptoJS.enc.Base64.parse(param[1]).toString(
                            CryptoJS.enc.Utf8
                        )
                    );
                    boqId = obj.boqId;
                    projectId = obj.projectId;
                    id = obj.id;
                    projectName = obj.projectName;
                } catch {
                    this.props.history.goBack();
                }
            }
            index++;
        }
    }
    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.props.actions.deleteItemsDescription();
    }
    componentWillReceiveProps(props, state) {
        if (props.location.search !== this.props.location.search) {
            this.extractDataFromURL(props.location.search);
            this.props.actions.deleteItemsDescription();
            this.setState({
                parentId: id,
                isLoading: true,
                currentMode: ""
            });
            this.getTabelData(id);
        }
        if (props.items) {
            this.setState({ isLoading: true });
            let items = props.items;
            this.setState({ items, activeTab: "" }, function () {
                this.setState({ isLoading: false });
            });
        }
    }

    checkItemCode = code => {
        Api.get(
            "GetItemCode?itemCode=" +
            code +
            "&projectId=" +
            this.state.projectId
        ).then(res => {
            if (res == true) {
                toast.error(Resources["itemCodeExist"][currentLanguage]);
                this.setState({ items: { ...this.state.items, itemCode: "" } });
            }
        });
    };
    onCloseModal() {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    ConfirmDelete = () => {
        this.setState({ isLoading: true });
        Api.post("ContractsBoqItemsMultipleDelete?", this.state.selectedRow)
            .then(res => {
                let originalData = [...this.state.items];
                this.state.selectedRow.forEach(item => {
                    let getIndex = originalData.findIndex(
                        x => x.id === item.id
                    );
                    originalData.splice(getIndex, 1);
                });
                this.setState({
                    items: originalData,
                    showDeleteModal: false,
                    isLoading: false
                });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            })
            .catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ showDeleteModal: false, isLoading: false });
            });
    };
    itemization = value => {
        let obj = {
            id: value.id,
            boqId: value.boqId,
            projectId: this.state.projectId,
            projectName: this.state.projectName
        };
        let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
        let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
        this.props.history.push({
            pathname: "/Itemize",
            search: "?id=" + encodedPaylod
        });
    };
    onRowClick = (value) => {
        if (!Config.IsAllow(11)) {
            toast.warning("you don't have permission");
        } else {
            this.setState({ selectedItem: value });
            this.setState({ showPopUp: true, currentMode: "edit" });
            this.simpleDialog.show();

        }
    };
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
    };
    onRowsDeselected = () => {
        this.setState({
            selectedRow: []
        });
    };

    _executeBeforeModalClose = () => {
        this.setState({
            showPopUp: false,
            btnText: "add"
        });
    };
    _executeBeforeModalOpen = () => {
        this.setState({
            btnText: "save"
        });
    };
    _onGridRowsUpdated = (cell, value) => {
        this.setState({ isLoading: true });
        if (cell) {
            Api.post(
                "EditBoqItemChildUnitPrice?id=" +
                cell.id +
                "&parentId=" +
                this.state.parentId +
                "&unitPrice=" +
                cell.unitPrice
            )
                .then(() => {
                    toast.success(
                        Resources["operationSuccess"][currentLanguage]
                    );
                    this.setState({ isLoading: false });
                })
                .catch(() => {
                    toast.error(
                        Resources["operationCanceled"][currentLanguage]
                    );
                    this.setState({ isLoading: false });
                });
        }

    };
    changeTab = activeTab => {
        if (activeTab === "one") {
        } else if (activeTab === "many") {
        }
        this.setState({ activeTab });
    };
    closePopUp = () => {
        this.setState({ showPopUp: false, currentMode: "" });
    };
    render() {
        const subItemsGrid =
            this.state.isLoading === false ? (
                <GridCustom
                    ref='custom-data-grid'
                    gridKey='sub-items'
                    data={this.state.items}
                    pageSize={this.state.pageSize}
                    groups={[]}
                    actions={this.actions}
                    rowActions={this.rowActions}
                    cells={this.itemsColumns}
                    rowClick={cell => this.onRowClick(cell)}
                />
            ) : (
                    <LoadingSection />
                );
        const itemTable = this.state.isLoading ? null : this.state.item !=
            null ? (
                <table className="taskAdminTable">
                    <thead>
                        <tr>
                            <th>{Resources["no"][currentLanguage]}</th>
                            <th>{Resources["itemCode"][currentLanguage]}</th>
                            <th>{Resources["details"][currentLanguage]}</th>
                            <th>{Resources["quantity"][currentLanguage]}</th>
                            <th>{Resources["revQuantity"][currentLanguage]}</th>
                            <th>{Resources["unit"][currentLanguage]}</th>
                            <th>{Resources["unitPrice"][currentLanguage]}</th>
                            <th>{Resources["total"][currentLanguage]}</th>
                            <th>{Resources["resourceCode"][currentLanguage]}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={"table"}>
                            <td>{this.state.item.arrange} </td>
                            <td>{this.state.item.itemCode} </td>
                            <td>{this.state.item.description} </td>
                            <td>{this.state.item.quantity} </td>
                            <td>{this.state.item.revisedQuantity} </td>
                            <td>{this.state.item.unit} </td>
                            <td>{this.state.item.unitPrice} </td>
                            <td>{this.state.item.total} </td>
                            <td>{this.state.item.resourceCode} </td>
                        </tr>
                    </tbody>
                </table>
            ) : null;

        const editItemContent = (
            <React.Fragment>
                {this.state.currentMode == "edit" ? (
                    <div className="document-fields" key="editItem">
                        <EditItemDescription
                            showImportExcel={false}
                            docType="boq"
                            isViewMode={this.state.isViewMode}
                            mainColumn="boqId"
                            editItemApi="EditBoqItemChild"
                            parentId={this.state.parentId}
                            projectId={this.state.projectId}
                            showItemType={true}
                            item={this.state.selectedItem}
                            onSave={e => this.closePopUp()}
                        />
                    </div>
                ) : null}
            </React.Fragment>
        );
        const addItemContent = (
            <React.Fragment>
                <div className="document-fields">
                    {this.state.isLoading ? <LoadingSection /> : null}
                    <AddItemDescription
                        docLink="/Downloads/Excel/BOQ.xlsx"
                        showImportExcel={false}
                        docType="boq"
                        isViewMode={this.state.isViewMode}
                        mainColumn="boqId"
                        addItemApi="AddBoqItemChild"
                        parentId={this.state.parentId}
                        projectId={this.state.projectId}
                        showItemType={true}
                    />
                </div>
            </React.Fragment>
        );
        const addManyItems = (
            <Fragment>
                <Fragment>
                    <XSLfile
                        key="boqImport"
                        docId={this.state.docId}
                        docType="boq"
                        link={Config.getPublicConfiguartion().downloads + "/Downloads/Excel/BOQ.xlsx"}
                        header="addManyItems"
                        disabled={
                            this.props.changeStatus
                                ? this.props.document.contractId > 0
                                    ? true
                                    : false
                                : false
                        }
                        afterUpload={() => this.getTabelData()}
                    />
                </Fragment>
                {this.state.isCompany ? (
                    <Fragment>
                        <XSLfile
                            key="boqStructure"
                            docId={this.state.docId}
                            docType="boq2"
                            link={
                                Config.getPublicConfiguartion().downloads +
                                "/Downloads/Excel/BOQ2.xlsx"
                            }
                            header="addManyItems"
                            disabled={
                                this.props.changeStatus
                                    ? this.props.document.contractId > 0
                                        ? true
                                        : false
                                    : false
                            }
                            afterUpload={() => this.getTabelData()}
                        />
                    </Fragment>
                ) : null}
            </Fragment>
        );
        let Step_2 = (
            <React.Fragment>
                <div className="company__total proForm">
                    <ul id="stepper__tabs" className="data__tabs">
                        <li
                            className={
                                " data__tabs--list " +
                                (this.state.activeTab == "one" ? "active" : "")
                            }
                            onClick={() => this.changeTab("one")}>
                            {Resources.addOneItem[currentLanguage]}
                        </li>
                        <li
                            className={
                                "data__tabs--list " +
                                (this.state.activeTab == "many" ? "active" : "")
                            }
                            onClick={() => this.changeTab("many")}>
                            {Resources.addManyItems[currentLanguage]}
                        </li>
                    </ul>
                </div>
                <div className="document-fields">
                    {this.state.isLoading == true ? null : itemTable}
                </div>
                {this.state.activeTab == "one"
                    ? addItemContent
                    : this.state.activeTab == "many"
                        ? addManyItems
                        : null}
                {this.props.items.length > 0 ? subItemsGrid : null}
                <div
                    className="largePopup largeModal "
                    style={{
                        display: this.state.showPopUp ? "block" : "none"
                    }}>
                    <SkyLight
                        hideOnOverlayClicked
                        ref={ref => (this.simpleDialog = ref)}
                        title={Resources.boqType[currentLanguage]}>
                        {editItemContent}
                    </SkyLight>
                </div>
            </React.Fragment>
        );

        return (
            <React.Fragment>
                <div className="mainContainer">
                    <div
                        className={
                            this.state.isViewMode === true &&
                                this.state.CurrStep != 3
                                ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs"
                                : "documents-stepper noTabs__document one__tab one_step"
                        }>
                        <HeaderDocument
                            projectName={projectName}
                            isViewMode={this.state.isViewMode}
                            docTitle={Resources.contract[currentLanguage]}
                            moduleTitle={
                                Resources["contracts"][currentLanguage]
                            }
                        />
                        <div className="doc-container">
                            <div className="step-content">
                                {this.state.LoadingPage ? (
                                    <LoadingSection />
                                ) : (
                                        <Fragment>{Step_2}</Fragment>
                                    )}
                            </div>
                        </div>
                    </div>
                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={
                                Resources["smartDeleteMessageContent"][currentLanguage]
                            }
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName="delete"
                            clickHandlerContinue={this.ConfirmDelete}
                        />
                    ) : null}
                </div>
            </React.Fragment>
        );
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
        projectId: state.communication.projectId,
        showModal: state.communication.showModal
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Itemize));
