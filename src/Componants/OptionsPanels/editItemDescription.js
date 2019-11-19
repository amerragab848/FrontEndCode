import React, { Component } from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import Resources from "../../resources.json";
import XSLfile from "../../Componants/OptionsPanels/XSLfiel";
import DataService from "../../Dataservice";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import Config from "../../Services/Config.js";
import { toast } from "react-toastify";
import find from "lodash/find";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const documentItemValidationSchema = Yup.object().shape({
    description: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
    itemCode: Yup.string().required(Resources["itemCode"][currentLanguage]),
    unitPrice: Yup.number().typeError(Resources["onlyNumbers"][currentLanguage]),
    days: Yup.number().typeError(Resources["onlyNumbers"][currentLanguage]),
    quantity: Yup.number().typeError(Resources["onlyNumbers"][currentLanguage])
});
class addItemDescription extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: 0,
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
                arrange: 0,
                parentId: "",
                itemType: "",
                equipmentType: "",
                itemCode: "",
                resourceCode: ""
            },
            Units: [],
            selectedUnit: { label: Resources.unitSelection[currentLanguage], value: "0" },
            columns: [],
            action: null,
            selectedItemType: { label: Resources.itemTypeSelection[currentLanguage], value: "0" },
            selectedequipmentType: { label: Resources.equipmentTypeSelection[currentLanguage], value: "0" },
            selectedBoqType: { label: Resources.boqType[currentLanguage], value: "0" },
            selectedBoqSubType: { label: Resources.boqTypeChild[currentLanguage], value: "0" },
            selectedBoqSubTypeChild: { label: Resources.boqSubType[currentLanguage], value: "0" },
            addItemApi: this.props.addItemApi,
            getItemsApi: this.props.getItemsApi
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.docId !== prevState.id && nextProps.changeStatus === true) {
            if (nextProps.onRowClick) {

                return {
                    id: nextProps.docId,
                    itemDescription: nextProps.item,
                    selectedUnit: { label: nextProps.item.unit, value: nextProps.item.unit }
                }
            }
            return null
        }
        return null
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.itemDescription.id !== this.props.item.id && this.props.changeStatus === true) {
            if (this.props.onRowClick) {

                if (this.props.item.boqTypeId !== null || this.props.item.boqTypeId !== undefined) {
                    this.fillDropDownData(this.props.item.boqTypeId, "BoqTypeChilds", "selectedBoqSubType", this.props.item.boqSubType, this.props.item.subBoqTypeId);
                }
                else if (this.props.item.subBoqTypeId !== null || this.props.item.subBoqTypeId !== undefined) {
                    this.fillDropDownData(this.props.item.subBoqTypeId, "BoqSubTypes", "selectedBoqSubTypeChild", this.props.item.boqTypeChild, this.props.item.boqChildTypeId);
                }

                return {
                    selectedBoqType: { label: this.props.item.boqType, value: this.props.item.boqTypeId },
                    selectedBoqSubType: { label: this.props.item.boqSubType, value: this.props.item.subBoqTypeId },
                    selectedBoqSubTypeChild: { label: this.props.item.boqTypeChild, value: this.props.item.boqChildTypeId }
                }
            }
        }
    }

    componentDidMount() {
        //this.fillTable();

        DataService.GetDataList("GetDefaultListForUnit?listType=unit", "listType", "listType").then(res => {
            this.setState({ Units: [...res] });
        });

        DataService.GetDataList("GetAllBoqParentNull?projectId=" + this.props.projectId, "title", "id").then(res => {
            this.setState({ boqTypes: [...res] });
        });

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

            DataService.GetDataList("GetAccountsDefaultList?listType=equipmentType&pageNumber=0&pageSize=10000", "title", "id").then(res => {
                this.setState({ equipmentTypes: [...res] });
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.isViewMode !== prevProps.isViewMode) {
        }
    }

    fillTable() {
        // dataservice.GetDataGrid(this.props.getItemsApi).then(result => {
        //     this.setState({
        //         itemsList: [...result]
        //     });
        // });
    }

    saveVariationOrderItem(event) {
        this.setState({ isLoading: true });

        this.props.actions.setLoading();

        let saveDocument = { ...this.state.itemDescription };

        saveDocument[this.props.mainColumn] = this.props.docId;

        saveDocument.parentId = this.props.parentId;

        dataservice.addObject(this.props.editItemApi, saveDocument).then(result => {
            if (result) {

                let arr = [];

                arr.push(result);
                this.props.actions.editItemDescriptions(arr);
                this.setState({
                    id: 0,
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
                        arrange: 0,
                        parentId: "",
                        itemType: "",
                        equipmentType: "",
                        itemCode: "",
                        resourceCode: ""
                    },
                    isLoading: false
                });

                toast.success(
                    Resources["operationSuccess"][currentLanguage]
                );

                this.props.disablePopUp(false);
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
            [selectedValue]: event
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
            dataservice.GetDataList(action, "title", "id").then(result => {
                this.setState({
                    [nextTragetState]: result
                });
            });
        }
    }

    fillDropDownData(parentId, data, selectedValue, label, value) {
        dataservice.GetDataList(`GetAllBoqChild?parentId=${parentId}`, "title", "id").then(result => {
            this.setState({
                [data]: result,
                [selectedValue]: { label: label, value: value }
            });
        });
    }

    componentWillUnmount() {
        this.setState({ id: 0 })
    }

    render() {
        return (
            <div className="step-content">
                {this.props.showImportExcel !== false ? (
                    <XSLfile
                        key="boqImport"
                        docId={this.props.docId}
                        docType={this.props.docType}
                        link={Config.getPublicConfiguartion().downloads + this.props.docLink}
                        header="addManyItems"
                        disabled={this.props.changeStatus ? this.props.docId > 0 ? true : false : false}
                    //afterUpload={() => this.fillTable()}
                    />
                ) : null}
                <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                    <Formik
                        initialValues={{ ...this.state.itemDescription }}
                        validationSchema={documentItemValidationSchema}
                        enableReinitialize={true}
                        onSubmit={values => {
                            this.saveVariationOrderItem();
                        }}>
                        {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                            <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate">
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero">
                                            {Resources["addItems"][currentLanguage]}
                                        </h2>
                                    </div>
                                </header>
                                <div className="document-fields">
                                    <div className="letterFullWidth proForm  first-proform proform__twoInput">
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources["description"][currentLanguage]}
                                            </label>
                                            <div className={"inputDev ui input " + (errors.description ? "has-error" : !errors.description && touched.description ? " has-success" : " ")}>
                                                <input name="description" className="form-control" id="description"
                                                    placeholder={Resources["description"][currentLanguage]}
                                                    autoComplete="off"
                                                    onBlur={handleBlur}
                                                    value={this.state.itemDescription.description || ''}
                                                    onChange={e => this.handleChangeItem(e, "description")} />
                                                {errors.description ? (<em className="pError"> {errors.description} </em>) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="proForm datepickerContainer">
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources.quantity[currentLanguage]}
                                            </label>
                                            <div className="ui input inputDev">
                                                <input type="text" className="form-control" id="quantity"
                                                    value={this.state.itemDescription.quantity || ''}
                                                    name="quantity" onBlur={handleBlur}
                                                    placeholder={Resources.quantity[currentLanguage]}
                                                    onChange={e => this.handleChangeItem(e, "quantity")} />
                                                {errors.quantity ? (<em className="pError"> {errors.quantity} </em>) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources.unitPrice[currentLanguage]}
                                            </label>
                                            <div className="ui input inputDev">
                                                <input type="text" className="form-control" id="unitPrice"
                                                    value={this.state.itemDescription.unitPrice || ''}
                                                    name="unitPrice" onBlur={handleBlur}
                                                    placeholder={Resources.unitPrice[currentLanguage]}
                                                    onChange={e => this.handleChangeItem(e, "unitPrice")}
                                                />
                                                {errors.unitPrice ? (<em className="pError"> {errors.unitPrice} </em>) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources["itemCode"][currentLanguage]}
                                            </label>
                                            <div className={"inputDev ui input " + (errors.itemCode ? "has-error" : !errors.itemCode && touched.itemCode ? " has-success" : " ")}>
                                                <input name="itemCode" className="form-control" id="itemCode"
                                                    placeholder={Resources["itemCode"][currentLanguage]}
                                                    autoComplete="off" onBlur={handleBlur}
                                                    value={this.state.itemDescription.itemCode || ''}
                                                    onChange={e => this.handleChangeItem(e, "itemCode")}
                                                />
                                                {errors.itemCode ? (<em className="pError"> {errors.itemCode} </em>) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources["resourceCode"][currentLanguage]}
                                            </label>
                                            <div className="inputDev ui input has-success">
                                                <input name="resourceCode" className="form-control" id="resourceCode"
                                                    placeholder={Resources["resourceCode"][currentLanguage]}
                                                    autoComplete="off" onBlur={handleBlur}
                                                    value={this.state.itemDescription.resourceCode || ''}
                                                    onChange={e => this.handleChangeItem(e, "resourceCode")}
                                                />
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <Dropdown title="unit" data={this.state.Units}
                                                selectedValue={this.state.selectedUnit}
                                                handleChange={event => this.handleChangeItemDropDown(event, "unit", "selectedUnit", false, "", "", "")}
                                                index="unit" />
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources["days"][currentLanguage]}
                                            </label>
                                            <div className={"inputDev ui input " + (errors.days ? "has-error" : !errors.days && touched.days ? " has-success" : " ")}>
                                                <input name="days" className="form-control" id="days"
                                                    placeholder={Resources["days"][currentLanguage]}
                                                    autoComplete="off" onBlur={handleBlur}
                                                    value={this.state.itemDescription.days || ''}
                                                    onChange={e => this.handleChangeItem(e, "days")} />
                                                {errors.days ? (<em className="pError"> {errors.days} </em>) : null}
                                            </div>
                                        </div>
                                        {this.props.showBoqType == true ? (
                                            <React.Fragment>
                                                <div className="linebylineInput valid-input">
                                                    <Dropdown title="boqType" data={this.state.boqTypes}
                                                        selectedValue={this.state.selectedBoqType}
                                                        handleChange={event => this.handleChangeItemDropDown(event, "boqTypeId", "selectedBoqType", true, "GetAllBoqChild", "parentId", "BoqTypeChilds", "boqType")}
                                                        name="boqType" index="boqType" />
                                                </div>
                                                <div className="linebylineInput valid-input">
                                                    <Dropdown title="boqTypeChild"
                                                        data={this.state.BoqTypeChilds}
                                                        selectedValue={this.state.selectedBoqTypeChild}
                                                        handleChange={event => this.handleChangeItemDropDown(event, "boqChildTypeId", "selectedBoqTypeChild", true, "GetAllBoqChild", "parentId", "BoqSubTypes", "boqChildType")}
                                                        name="boqTypeChild" index="boqTypeChild" />
                                                </div>
                                                <div className="letterFullWidth">
                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="boqSubType"
                                                            data={this.state.BoqSubTypes}
                                                            selectedValue={this.state.selectedBoqSubType}
                                                            handleChange={event => this.handleChangeItemDropDown(event, "boqSubTypeId", "selectedBoqSubType", false, "", "", "", "boqSubType")}
                                                            name="boqSubType"
                                                            index="boqSubType"
                                                        />
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ) : null}
                                        <div className={"linebylineInput valid-input " + (this.props.showItemType !== false ? " " : " disNone")}>
                                            <Dropdown title="itemType" data={this.state.itemTypes}
                                                selectedValue={this.state.selectedItemType}
                                                handleChange={event => this.handleChangeItemDropDown(event, "itemType", "selectedItemType", false, "", "", "")}
                                                onChange={setFieldValue} onBlur={setFieldTouched}
                                                error={errors.itemType} touched={touched.itemType}
                                                name="itemType" index="itemType" />
                                        </div>
                                        {this.state.action == 2 ? (
                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="equipmentType"
                                                    data={this.state.equipmentTypes}
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
                                                    <button
                                                        className="primaryBtn-1 btn  disabled"
                                                        disabled="disabled">
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

                    {/* <div className="doc-pre-cycle">
                        <header>
                            <h2 className="zero">{Resources['AddedItems'][currentLanguage]}</h2>
                        </header>
                        <ReactTable
                            ref={(r) => {
                                this.selectTable = r;
                            }}
                            data={this.state.itemsList}
                            columns={this.state.columns}
                            defaultPageSize={10}
                            minRows={2}
                            noDataText={Resources['noData'][currentLanguage]}
                        />
                    </div> */}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        docId: state.communication.docId,
        changeStatus: state.communication.changeStatus
        // projectId: state.communication.projectId,
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
)(withRouter(addItemDescription));
