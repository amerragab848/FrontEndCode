import React, { Component } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Dropdown from "./DropdownMelcous";
import Resources from "../../resources.json";
import XSLfile from "./XSLfiel";
import DataService from "../../Dataservice";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import { toast } from "react-toastify";
import Config from "../../Services/Config.js";
import find from "lodash/find";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const documentItemValidationSchema = Yup.object().shape({
    description: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
    itemCode: Yup.string().required(Resources["itemCode"][currentLanguage]),
    unitPrice: Yup.number().typeError(Resources["onlyNumbers"][currentLanguage]),
    days: Yup.number().typeError(Resources["onlyNumbers"][currentLanguage]),
    quantity: Yup.number().typeError(Resources["onlyNumbers"][currentLanguage])
});

class AddItemDescription extends Component {
    constructor(props) {
        super(props);

        let maxArrange = this.props.items;

        this.state = {
            isLoading: false,
            itemsList: [],
            itemDescription: {
                id: 0,
                description: "",
                unit: "",
                unitPrice: 0,
                quantity: 0,
                revisedQuantity: 0,
                boqTypeId: "",
                SubBoqTypeId: "",
                boqChildTypeId: "",
                arrange: maxArrange.length > 0 ? maxArrange.length + 1 : 1,
                parentId: "",
                itemType: "",
                equipmentType: "",
                itemCode: "",
                resourceCode: "",
                days: 1
            },
            Units: [],
            selectedUnit: { label: Resources.unitSelection[currentLanguage], value: "0" },
            columns: [],
            action: null,
            selectedItemType: { label: Resources.itemTypeSelection[currentLanguage], value: "0" },
            selectedequipmentType: { label: Resources.equipmentTypeSelection[currentLanguage], value: "0" },
            selectedBOQType: { label: Resources.boqType[currentLanguage], value: "0" },
            selectedBOQSubType: { label: Resources.boqSubType[currentLanguage], value: "0" },
            selectedBOQSubTypeChild: { label: Resources.boqTypeChild[currentLanguage], value: "0" },
            addItemApi: this.props.addItemApi,
            getItemsApi: this.props.getItemsApi,
            itemTypeTitle: "",
            collapsed: true,
            showEquipmentDrop: false
        };
    }

    componentDidMount() {

        DataService.GetDataList("GetDefaultListForUnit?listType=unit", "listType", "listType").then(res => {
            this.setState({ Units: [...res] });
        });

        if (this.props.showBoqType === true) {
            DataService.GetDataList("GetAllBoqParentNull?projectId=" + this.props.projectId, "title", "id").then(res => {
                this.setState({ boqTypes: [...res] });
            });
        }

        if (this.props.showItemType === true) {
            DataService.GetDataGrid("GetAccountsDefaultList?listType=estimationitemtype&pageNumber=0&pageSize=10000").then(result => {
                let Data = [];
                result.forEach(item => {
                    var obj = {};
                    obj.label = item.title;
                    obj.value = item.id;
                    Data.push(obj);
                });

                this.setState({
                    itemTypes: [...Data],
                    poolItemTypes: result
                });
            });
        }

        if (this.props.docType === "boq") {
            DataService.GetDataList("GetAccountsDefaultList?listType=equipmentType&pageNumber=0&pageSize=10000", "title", "id").then(res => {
                this.setState({ equipmentTypes: [...res] });
            });
        }

    }


    saveVariationOrderItem(event) {

        this.props.actions.setLoading();

        this.setState({ isLoading: true });

        let saveDocument = { ...this.state.itemDescription };

        saveDocument[this.props.mainColumn] = this.props.docId;

        saveDocument.parentId = this.props.parentId;

        DataService.addObject(this.props.addItemApi, saveDocument).then(result => {
            if (result) {
                let arr = [];
                let item = result;
                item.boqTypeChild = saveDocument.boqChildType;
                arr.push(item);
                this.props.actions.addItemDescription(arr);

                this.setState({
                    itemDescription: {
                        id: 0,
                        description: "",
                        unit: "",
                        unitPrice: 0,
                        quantity: 0,
                        revisedQuantity: 0,
                        boqTypeId: "",
                        SubBoqTypeId: "",
                        boqChildTypeId: "",
                        arrange: saveDocument.arrange + 1,
                        parentId: "",
                        itemType: "",
                        equipmentType: "",
                        itemCode: "",
                        resourceCode: "",
                        days: 1
                    },
                    isLoading: false,
                    selectedBOQType: { label: Resources.boqType[currentLanguage], value: "0" },
                    selectedBOQSubType: { label: Resources.boqTypeChild[currentLanguage], value: "0" },
                    selectedBOQSubTypeChild: { label: Resources.boqSubType[currentLanguage], value: "0" }
                });

                toast.success(Resources["operationSuccess"][currentLanguage]);
            }
        }).catch(res => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ isLoading: true });
        });
    }

    handleChangeItem(e, field) {
        let original_document = { ...this.state.itemDescription };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            itemDescription: updated_document
        });
    }

    handleChangeItemDropDown(event, field, selectedValue, isSubscribe, url, param, nextTragetState, fieldLabel) {

        if (event == null) return;

        let original_document = { ...this.state.itemDescription };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document[fieldLabel] = event.label;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            itemDescription: updated_document,
            [selectedValue]: event,
            itemTypeTitle: event.label === "Material" ? event.label : ""
        });
        if (field === "itemType") {
            let poolItemTypes = this.state.poolItemTypes;
            let item = find(poolItemTypes, function (x) {
                return x.id == event.value;
            });
            if (item) {
                this.setState({
                    action: item.action
                });
            }
        }
        if (isSubscribe) {
            let action = url + "?" + param + "=" + event.value;
            DataService.GetDataList(action, "title", "id").then(result => {
                this.setState({
                    [nextTragetState]: result
                });
            });
        }
    }

    render() {
        return (
            <div className="step-content">
                {this.props.showImportExcel !== false ? (
                    <XSLfile key="boqImport"
                        docId={this.props.docId}
                        docType={this.props.docType}
                        link={this.props.docLink != "" ? Config.getPublicConfiguartion().downloads + this.props.docLink : ""}
                        header="addManyItems" 
                        disabled={this.props.changeStatus ? this.props.docId > 0 ? false : true : false}
                        afterUpload={() => this.fillTable()} />                ) : null}
                
                <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                    <Formik initialValues={{ ...this.state.itemDescription }}
                        validationSchema={documentItemValidationSchema}
                        enableReinitialize={true}
                        onSubmit={values => {
                            this.saveVariationOrderItem();
                        }}>
                        {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                            <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate">
                                <header style={{ cursor: 'pointer' }} onClick={() => { this.setState({ collapsed: !this.state.collapsed }) }} className="main__header">
                                    <div style={{ padding: '0' }} className="main__header--div">
                                        <h2 className="zero">
                                            {Resources["addItems"][currentLanguage]}
                                        </h2>
                                        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                            {this.state.collapsed ?
                                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                                                    <path fill="#A8B0BF" fillRule="nonzero" d="M29.355 17.356h-6.712v-6.712a2.644 2.644 0 0 0-5.287 0v6.713h-6.712a2.644 2.644 0 0 0 0 5.287h6.713v6.713a2.644 2.644 0 0 0 5.287 0v-6.714h6.712a2.644 2.644 0 1 0-.001-5.287z" />
                                                </svg> :
                                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                                                    <path fill="#A8B0BF" fillRule="nonzero" d="M29.355 17.356H10.644a2.644 2.644 0 0 0 0 5.288h18.712a2.644 2.644 0 1 0-.001-5.288z" />
                                                </svg>
                                            }
                                        </button>
                                    </div>
                                </header>
                                <div className="document-fields " style={{ maxHeight: this.state.collapsed ? '0' : '10000px', overflow: this.state.collapsed ? 'hidden' : 'unser', transition: 'all 0.3s ease-in-out' }}>
                                    <div className="letterFullWidth proForm  first-proform proform__twoInput">
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources["description"][currentLanguage]}
                                            </label>
                                            <div className={"inputDev ui input " + (errors.description ? "has-error" : !errors.description && touched.description ? " has-success" : " ")}>
                                                <input name="description" className="form-control" id="description" placeholder={Resources["description"][currentLanguage]} autoComplete="off"
                                                    onBlur={handleBlur}
                                                    value={this.state.itemDescription.description}
                                                    onChange={e =>
                                                        this.handleChangeItem(e, "description")
                                                    }
                                                />
                                                {errors.description ? (<em className="pError"> {errors.description} </em>) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="proForm datepickerContainer">
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources.arrange[
                                                    currentLanguage
                                                    ]
                                                }
                                            </label>
                                            <div className="ui input inputDev">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="arrange"
                                                    readOnly
                                                    defaultValue={
                                                        this.state.itemDescription
                                                            .arrange
                                                    }
                                                    name="arrange"
                                                    placeholder={
                                                        Resources.arrange[
                                                        currentLanguage
                                                        ]
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources.quantity[currentLanguage]}
                                            </label>
                                            <div className="ui input inputDev">
                                                <input type="text" className="form-control" id="quantity" value={this.state.itemDescription.quantity}
                                                    name="quantity" onBlur={handleBlur} placeholder={Resources.quantity[currentLanguage]}
                                                    onChange={e => this.handleChangeItem(e, "quantity")} />
                                                {errors.quantity ? (<em className="pError">{errors.quantity}</em>
                                                ) : null}
                                            </div>
                                        </div>
                                        {this.props.isUnitPrice === undefined ? <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources.unitPrice[currentLanguage]}
                                            </label>
                                            <div className="ui input inputDev">
                                                <input type="text" className="form-control" id="unitPrice"
                                                    value={this.state.itemDescription.unitPrice} name="unitPrice"
                                                    onBlur={handleBlur}
                                                    placeholder={Resources.unitPrice[currentLanguage]}
                                                    onChange={e => this.handleChangeItem(e, "unitPrice")}
                                                />
                                                {errors.unitPrice ? (<em className="pError">{errors.unitPrice}</em>) : null}
                                            </div>
                                        </div> : null}
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources["itemCode"][currentLanguage]}
                                            </label>
                                            <div className={"inputDev ui input " + (errors.itemCode ? "has-error" : !errors.itemCode && touched.itemCode ? " has-success" : " ")}>
                                                <input name="itemCode" className="form-control" id="itemCode" placeholder={Resources["itemCode"][currentLanguage]}
                                                    autoComplete="off"
                                                    onBlur={handleBlur}
                                                    value={this.state.itemDescription.itemCode}
                                                    onChange={e => this.handleChangeItem(e, "itemCode")} />
                                                {errors.itemCode ? (<em className="pError">{errors.itemCode}</em>) : null}
                                            </div>
                                        </div>
                                        {this.state.itemTypeTitle === "Material" ? <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources["resourceCode"][currentLanguage]}
                                            </label>
                                            <div className="inputDev ui input has-success">
                                                <input name="resourceCode" className="form-control" id="resourceCode"
                                                    placeholder={Resources["resourceCode"][currentLanguage]}
                                                    autoComplete="off"
                                                    onBlur={handleBlur}
                                                    value={this.state.itemDescription.resourceCode}
                                                    onChange={e => this.handleChangeItem(e, "resourceCode")} />
                                            </div>
                                        </div> : null}
                                        <div className="linebylineInput valid-input">
                                            <Dropdown title="unit" data={this.state.Units} selectedValue={this.state.selectedUnit}
                                                handleChange={event => this.handleChangeItemDropDown(event, "unit", "selectedUnit", false, "", "", "")} index="unit" />
                                        </div>
                                        {this.state.action == 2 || this.state.action == 3 ?
                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">
                                                    {Resources["days"][currentLanguage]}
                                                </label>
                                                <div className={"inputDev ui input " + (errors.days ? "has-error" : !errors.days && touched.days ? " has-success" : " ")}>
                                                    <input name="days" className="form-control" id="days"
                                                        placeholder={Resources["days"][currentLanguage]}
                                                        autoComplete="off"
                                                        onBlur={handleBlur}
                                                        value={this.state.itemDescription.days}
                                                        onChange={e => this.handleChangeItem(e, "days")} />
                                                    {errors.days ? (<em className="pError"> {errors.days} </em>) : null}
                                                </div>
                                            </div>
                                            : null}
                                        {this.props.showBoqType == true ? (
                                            <React.Fragment>
                                                <div className="linebylineInput valid-input">
                                                    <Dropdown title="boqType" data={this.state.boqTypes}
                                                        selectedValue={this.state.selectedBOQType}
                                                        handleChange={event => this.handleChangeItemDropDown(event, "boqTypeId", "selectedBOQType", true, "GetAllBoqChild", "parentId", "BoqTypeChilds", "boqType")}
                                                        name="boqType" index="boqType" />
                                                </div>
                                                <div className="linebylineInput valid-input">
                                                    <Dropdown title="boqTypeChild" data={this.state.BoqTypeChilds}
                                                        selectedValue={this.state.selectedBOQSubTypeChild}
                                                        handleChange={event => this.handleChangeItemDropDown(event, "boqChildTypeId", "selectedBOQSubTypeChild", true, "GetAllBoqChild", "parentId", "BoqSubTypes", "boqChildType")}
                                                        name="boqTypeChild" index="boqTypeChild" />
                                                </div>
                                                <div className="letterFullWidth">
                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="boqSubType" data={this.state.BoqSubTypes}
                                                            selectedValue={this.state.selectedBOQSubType}
                                                            handleChange={event => this.handleChangeItemDropDown(event, "boqSubTypeId", "selectedBOQSubType", false, "", "", "", "boqSubType")}
                                                            name="boqSubType" index="boqSubType" />
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ) : null}
                                        <div
                                            className={"linebylineInput valid-input " + (this.props.showItemType !== false ? " " : " disNone")}>
                                            <Dropdown title="itemType" data={this.state.itemTypes}
                                                selectedValue={this.state.selectedItemType}
                                                handleChange={event => this.handleChangeItemDropDown(event, "itemType", "selectedItemType", false, "", "", "")}
                                                onChange={setFieldValue} onBlur={setFieldTouched} error={errors.itemType} touched={touched.itemType}
                                                name="itemType" index="itemType" />
                                        </div>

                                        {this.state.action == 3 ? (
                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="equipmentType" data={this.state.equipmentTypes}
                                                    selectedValue={this.state.selectedequipmentType}
                                                    handleChange={event => this.handleChangeItemDropDown(event, "equipmentType", "selectedequipmentType", false, "", "", "")}
                                                    name="equipmentType" index="equipmentType" />
                                            </div>
                                        ) : null}

                                        <div className="slider-Btns fullWidthWrapper textLeft ">
                                            {this.state.isLoading === false ? (
                                                <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? " disNone" : "")} type="submit" disabled={this.props.isViewMode}>
                                                    {Resources["save"][currentLanguage]}
                                                </button>
                                            ) : (
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
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        changeStatus: state.communication.changeStatus,
        items: state.communication.items
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddItemDescription);
