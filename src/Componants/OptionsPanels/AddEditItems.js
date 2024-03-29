import React, { Component } from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Dropdown from "./DropdownMelcous";
import Resources from "../../resources.json";
import DataService from "../../Dataservice";
import ReactTable from "react-table";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";


import { toast } from "react-toastify";
import find from "lodash/find";

let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const documentItemValidationSchema = Yup.object().shape({
    description: Yup.string().required(
        Resources["subjectRequired"][currentLanguage]
    ),
    itemCode: Yup.string().required(Resources["itemCode"][currentLanguage]),
    unitPrice: Yup.string().matches(
        /(^[0-9]+$)/,
        Resources["onlyNumbers"][currentLanguage]
    ),
    days: Yup.string().matches(
        /(^[0-9]+$)/,
        Resources["onlyNumbers"][currentLanguage]
    ),
    quantity: Yup.string().matches(
        /(^[0-9]+$)/,
        Resources["onlyNumbers"][currentLanguage]
    )
});
class AddEditItems extends Component {
    constructor(props) {
        super(props);
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
                boqTypeChildId: "",
                arrange: 0,
                parentId: "",
                itemType: "",
                equipmentType: "",
                itemCode: "",
                resourceCode: ""
            },
            Units: [],
            selectedUnit: {
                label: Resources.unitSelection[currentLanguage],
                value: "0"
            },

            columns: [],
            action: null,
            selectedItemType: {
                label: Resources.itemTypeSelection[currentLanguage],
                value: "0"
            },
            selectedequipmentType: {
                label: Resources.equipmentTypeSelection[currentLanguage],
                value: "0"
            },
            addItemApi: this.props.addItemApi,
            getItemsApi: this.props.getItemsApi
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.docId) {
            this.fillTable();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.isViewMode !== prevProps.isViewMode) {
        }
    }
    componentDidMount() {
        this.fillTable();
        DataService.GetDataList(
            "GetDefaultListForUnit?listType=unit",
            "listType",
            "listType"
        ).then(res => {
            this.setState({ Units: [...res] });
        });

        DataService.GetDataList(
            "GetAllBoqParentNull?projectId=" + this.props.projectId,
            "title",
            "id"
        ).then(res => {
            this.setState({ boqTypes: [...res] });
        });
        if (this.props.showItemType === true) {
            DataService.GetDataGrid(
                "GetAccountsDefaultList?listType=estimationitemtype&pageNumber=0&pageSize=10000"
            ).then(result => {
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

            DataService.GetDataList(
                "GetAccountsDefaultList?listType=equipmentType&pageNumber=0&pageSize=10000",
                "title",
                "id"
            ).then(res => {
                this.setState({ equipmentTypes: [...res] });
            });
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

        let saveDocument = { ...this.state.itemDescription };

        saveDocument[this.props.mainColumn] = this.props.docId;
        saveDocument.parentId = this.props.parentId;

        dataservice
            .addObject(this.props.addItemApi, saveDocument)
            .then(result => {
                if (result) {
                    let arr = [];
                    arr.push(result);
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
                            boqTypeChildId: "",
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
                }
            })
            .catch(res => {
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

    handleChangeItemDropDown(
        event,
        field,
        selectedValue,
        isSubscribe,
        url,
        param,
        nextTragetState
    ) {
        if (event == null) return;
        let original_document = { ...this.state.itemDescription };
        let updated_document = {};
        updated_document[field] = event.value;
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
        console.log(event, selectedValue.label);
        if (isSubscribe) {
            let action = url + "?" + param + "=" + event.value;
            dataservice.GetDataList(action, "title", "id").then(result => {
                this.setState({
                    [nextTragetState]: result
                });
            });
        }
    }
    render() {
        return (
            <div className="step-content">
                <div
                    className={
                        "subiTabsContent feilds__top " +
                        (this.props.isViewMode ? "readOnly_inputs" : " ")
                    }>
                    <Formik
                        initialValues={{ ...this.state.itemDescription }}
                        validationSchema={documentItemValidationSchema}
                        enableReinitialize={true}
                        onSubmit={values => {
                            this.saveVariationOrderItem();
                        }}>
                        {({
                            errors,
                            touched,
                            setFieldTouched,
                            setFieldValue,
                            handleBlur,
                            handleChange
                        }) => (
                            <Form
                                id="voItemForm"
                                className="proForm datepickerContainer customProform"
                                noValidate="novalidate">
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero">
                                            {
                                                Resources["addItems"][
                                                currentLanguage
                                                ]
                                            }
                                        </h2>
                                    </div>
                                </header>
                                <div className="document-fields">
                                    <div className="letterFullWidth proForm  first-proform proform__twoInput">
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources["description"][
                                                    currentLanguage
                                                    ]
                                                }{" "}
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input " +
                                                    (errors.description
                                                        ? "has-error"
                                                        : !errors.description &&
                                                            touched.description
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    name="description"
                                                    className="form-control"
                                                    autoComplete="off"
                                                    id="description"
                                                    placeholder={
                                                        Resources[
                                                        "description"
                                                        ][currentLanguage]
                                                    }
                                                    onBlur={handleBlur}
                                                    value={
                                                        this.state
                                                            .itemDescription
                                                            .description
                                                    }
                                                    onChange={e =>
                                                        this.handleChangeItem(
                                                            e,
                                                            "description"
                                                        )
                                                    }
                                                />
                                                {errors.description ? (
                                                    <em className="pError">
                                                        {errors.description}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="proForm datepickerContainer">
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources.quantity[
                                                    currentLanguage
                                                    ]
                                                }
                                            </label>
                                            <div className="ui input inputDev">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="quantity"
                                                    name="quantity"
                                                    onBlur={handleBlur}
                                                    value={
                                                        this.state
                                                            .itemDescription
                                                            .quantity
                                                    }
                                                    placeholder={
                                                        Resources.quantity[
                                                        currentLanguage
                                                        ]
                                                    }
                                                    onChange={e =>
                                                        this.handleChangeItem(
                                                            e,
                                                            "quantity"
                                                        )
                                                    }
                                                />
                                                {errors.quantity ? (
                                                    <em className="pError">
                                                        {errors.quantity}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources.unitPrice[
                                                    currentLanguage
                                                    ]
                                                }
                                            </label>
                                            <div className="ui input inputDev">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="unitPrice"
                                                    value={
                                                        this.state
                                                            .itemDescription
                                                            .unitPrice
                                                    }
                                                    placeholder={
                                                        Resources.unitPrice[
                                                        currentLanguage
                                                        ]
                                                    }
                                                    name="unitPrice"
                                                    onBlur={handleBlur}
                                                    onChange={e =>
                                                        this.handleChangeItem(
                                                            e,
                                                            "unitPrice"
                                                        )
                                                    }
                                                />
                                                {errors.unitPrice ? (
                                                    <em className="pError">
                                                        {errors.unitPrice}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources["itemCode"][
                                                    currentLanguage
                                                    ]
                                                }{" "}
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input " +
                                                    (errors.itemCode
                                                        ? "has-error"
                                                        : !errors.itemCode &&
                                                            touched.itemCode
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    name="itemCode"
                                                    className="form-control"
                                                    autoComplete="off"
                                                    id="itemCode"
                                                    placeholder={
                                                        Resources["itemCode"][
                                                        currentLanguage
                                                        ]
                                                    }
                                                    onBlur={handleBlur}
                                                    value={
                                                        this.state
                                                            .itemDescription
                                                            .itemCode
                                                    }
                                                    onChange={e =>
                                                        this.handleChangeItem(
                                                            e,
                                                            "itemCode"
                                                        )
                                                    }
                                                />
                                                {errors.itemCode ? (
                                                    <em className="pError">
                                                        {errors.itemCode}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources["resourceCode"][
                                                    currentLanguage
                                                    ]
                                                }{" "}
                                            </label>
                                            <div className="inputDev ui input has-success">
                                                <input
                                                    name="resourceCode"
                                                    className="form-control"
                                                    id="resourceCode"
                                                    autoComplete="off"
                                                    placeholder={
                                                        Resources[
                                                        "resourceCode"
                                                        ][currentLanguage]
                                                    }
                                                    onBlur={handleBlur}
                                                    value={
                                                        this.state
                                                            .itemDescription
                                                            .resourceCode
                                                    }
                                                    onChange={e =>
                                                        this.handleChangeItem(
                                                            e,
                                                            "resourceCode"
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources.unitPrice[
                                                    currentLanguage
                                                    ]
                                                }
                                            </label>
                                            <div className="ui input inputDev">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="unitPrice"
                                                    placeholder={
                                                        Resources.unitPrice[
                                                        currentLanguage
                                                        ]
                                                    }
                                                    value={
                                                        this.state
                                                            .itemDescription
                                                            .unitPrice
                                                    }
                                                    name="unitPrice"
                                                    onBlur={handleBlur}
                                                    onChange={e =>
                                                        this.handleChangeItem(
                                                            e,
                                                            "unitPrice"
                                                        )
                                                    }
                                                />
                                                {errors.unitPrice ? (
                                                    <em className="pError">
                                                        {errors.unitPrice}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources["days"][
                                                    currentLanguage
                                                    ]
                                                }{" "}
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input " +
                                                    (errors.days
                                                        ? "has-error"
                                                        : !errors.days &&
                                                            touched.days
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    name="days"
                                                    autoComplete="off"
                                                    className="form-control"
                                                    id="days"
                                                    placeholder={
                                                        Resources["days"][
                                                        currentLanguage
                                                        ]
                                                    }
                                                    onBlur={handleBlur}
                                                    value={
                                                        this.state
                                                            .itemDescription
                                                            .days
                                                    }
                                                    onChange={e =>
                                                        this.handleChangeItem(
                                                            e,
                                                            "days"
                                                        )
                                                    }
                                                />
                                                {errors.days ? (
                                                    <em className="pError">
                                                        {errors.days}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div
                                            className={
                                                "linebylineInput valid-input " +
                                                (this.props.showItemType !==
                                                    false
                                                    ? " "
                                                    : " disNone")
                                            }>
                                            <Dropdown
                                                title="itemType"
                                                data={this.state.itemTypes}
                                                selectedValue={
                                                    this.state.selectedItemType
                                                }
                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                error={errors.itemType}
                                                touched={touched.itemType}
                                                name="itemType"
                                                index="itemType"
                                                handleChange={event =>
                                                    this.handleChangeItemDropDown(
                                                        event,
                                                        "itemType",
                                                        "selectedItemType",
                                                        false,
                                                        "",
                                                        "",
                                                        ""
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="slider-Btns fullWidthWrapper textLeft ">
                                            {this.state.isLoading === false ? (
                                                <button
                                                    className={
                                                        "primaryBtn-1 btn " +
                                                        (this.props
                                                            .isViewMode === true
                                                            ? " disNone"
                                                            : "")
                                                    }
                                                    type="submit"
                                                    disabled={
                                                        this.props.isViewMode
                                                    }>
                                                    {
                                                        Resources["save"][
                                                        currentLanguage
                                                        ]
                                                    }
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

                    <div className="doc-pre-cycle">
                        <header>
                            <h2 className="zero">
                                {Resources["AddedItems"][currentLanguage]}
                            </h2>
                        </header>
                        <ReactTable
                            ref={r => {
                                this.selectTable = r;
                            }}
                            data={this.state.itemsList}
                            columns={this.state.columns}
                            defaultPageSize={10}
                            minRows={2}
                            noDataText={Resources["noData"][currentLanguage]}
                        />
                    </div>
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
)(withRouter(AddEditItems));
