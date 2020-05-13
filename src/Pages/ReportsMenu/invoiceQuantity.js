import React, { Component } from 'react';
import Dropdown from '../../Componants/OptionsPanels/DropdownMelcous';
import Resources from '../../resources.json';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import dataService from '../../Dataservice'
import { toast } from "react-toastify";
import Config from "../../Services/Config.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Export from "../../Componants/OptionsPanels/Export";
import sumBy from 'lodash/sumBy';
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    poId: Yup.string().required(Resources['projectInvoices'][currentLanguage])
});

class InvoiceQuantity extends Component {
    constructor(props) {

        super(props)

        this.columnsGrid = [

            {
                field: "arrange",
                title: Resources["numberAbb"][currentLanguage],
                width: 5,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text"
            },  {
                field: "specsSectionTitle",
                title: Resources["specification"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },   {
                field: "details",
                title: Resources["description"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },  {
                field: "quantity",
                title: Resources["quantity"][currentLanguage],
                width: 5,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "quantityComplete",
                title: Resources["requestedQuantity"][currentLanguage],
                width: 5,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "variance",
                title: Resources["releasedQuantity"][currentLanguage],
                width: 5,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "unit",
                title: Resources["unit"][currentLanguage],
                width: 5,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "unitPrice",
                title: Resources["price"][currentLanguage],
                width: 5,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "total",
                title: Resources["total"][currentLanguage],
                width: 5,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            }, {
                field: "totalExcuted",
                title: Resources["totalRequest"][currentLanguage],
                width: 5,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            }
        ];

        this.state = {
            projectId: this.props.projectId || localStorage.getItem("lastSelectedProject"),
            projectName: this.props.projectName || localStorage.getItem("lastSelectedprojectName"),
            po: [],
            poId: "",
            selectedPO: { label: Resources.projectInvoices[currentLanguage], value: "0" },
            isLoading: true,
            rows: [],
            quantityTotal: 0,
            quantityCompleteTotal: 0,
            variance: 0,
            unitPriceTotal: 0,
            total: 0,
            totalExcuted: 0,
        }

        if (!Config.IsAllow(691)) {
            toast.warning(Resources['missingPermissions'][currentLanguage])
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        this.props.actions.FillGridLeftMenu();
        dataService.GetDataList(`GetContractsInvoicesForPoPurchaseOrder?projectId=${this.state.projectId}`, 'subject', 'id').then(result => {
            if (result.length > 0) {
                this.setState({
                    po: result
                });
            }
        })

        this.setState({ isLoading: false });
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            po: [],
            poId: "",
            selectedPO: { label: Resources.selectBoq[currentLanguage], value: "0" },
        });
    }

    search = (id) => {

        this.setState({ isLoading: true })

        dataService.GetDataGrid(`GetContractsInvoicesForPoItemsByPurchaseOrderId?purchaseOrderId=${id}&pageNumber=0&pageSize=200`).then(result => {

            const quantityTotal = sumBy(result, function (item) {
                return item.quantity
            });
            const quantityCompleteTotal = sumBy(result, function (item) {
                return item.quantityComplete
            });
            const variance = sumBy(result, function (item) {
                return item.variance
            });
            const unitPrice = sumBy(result, function (item) {
                return item.unitPrice
            });
            const total = sumBy(result, function (item) {
                return item.total
            });
            const totalExcuted = sumBy(result, function (item) {
                return item.totalExcuted
            });

            this.setState({
                rows: result || [],
                isLoading: false,
                quantityTotal,
                quantityCompleteTotal,
                variance,
                unitPrice,
                total,
                totalExcuted
            })
        })
    }

    handleChangeDropDown(event) {
        if (event == null) return;

        this.setState({
            selectedPO: event,
            poId: event.value
        });
    }

    render() {

        const dataGrid = this.state.isLoading === false ?
            (
                this.state.rows.length > 0 ?
                    <GridCustom
                        cells={this.columnsGrid}
                        data={this.state.rows}
                        groups={[]}
                        pageSize={50} 
                        actions={[]}
                        rowActions={[]}
                        rowClick={() => { }} /> : null
            ) : (
                <LoadingSection />
            );

        const btnExport = this.state.isLoading === false ?
            (
                this.state.rows.length > 0 ? <Export
                    rows={this.state.isLoading === false ? this.state.rows : []}
                    columns={this.columnsGrid}
                    fileName={Resources.invoiceQuantity[currentLanguage]}
                /> : null
            ) : null;

        return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
                    <HeaderDocument projectName={this.state.projectName} docTitle={Resources.invoiceQuantity[currentLanguage]} moduleTitle={Resources['reportsCenter'][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            <div className="subiTabsContent">
                                <div className="document-fields">
                                    {this.state.isLoading ? <LoadingSection /> : null}
                                    <Formik
                                        initialValues={{
                                            poId: ''
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={validationSchema}
                                        onSubmit={(values) => {
                                            if (values.poId.value) {
                                                this.search(values.poId.value);
                                            }
                                        }}>
                                        {({ errors, touched, handleSubmit, setFieldTouched, setFieldValue }) => (
                                            <Form id="signupForm1" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>
                                                <div className="proForm first-proform fullWidth_form">
                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="invoicesForPO" data={this.state.po}
                                                            selectedValue={this.state.selectedPO}
                                                            handleChange={event => this.handleChangeDropDown(event)}
                                                            onChange={setFieldValue}
                                                            onBlur={setFieldTouched}
                                                            error={errors.poId}
                                                            touched={touched.poId}
                                                            name="poId"
                                                            id="poId" />
                                                    </div>
                                                </div>
                                                <div className="slider-Btns fullWidthWrapper textLeft" style={{ margin: 0 }}>
                                                    {this.state.isLoading ? (
                                                        <button className="primaryBtn-1 btn disabled">
                                                            <div className="spinner">
                                                                <div className="bounce1" />
                                                                <div className="bounce2" />
                                                                <div className="bounce3" />
                                                            </div>
                                                        </button>
                                                    ) : (
                                                            <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.search[currentLanguage]}</button>)}
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                    <div className={"grid-container " + (this.state.rows.length === 0 ? "griddata__load" : " ")}>
                                        {this.state.rows.length > 0 ?
                                            <>
                                                <div className="proForm datepickerContainer">
                                                    <div className="linebylineInput">
                                                        <label className="control-label">
                                                            {Resources.quantity[currentLanguage]}
                                                        </label>
                                                        <div className="ui input inputDev">
                                                            <input type="text" className="form-control" id="quantity"
                                                                value={this.state.quantityTotal}
                                                                name="quantity"
                                                                readOnly
                                                                autoComplete="off"
                                                                placeholder={Resources.quantity[currentLanguage]} />
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput">
                                                        <label className="control-label">
                                                            {Resources.requestedQuantity[currentLanguage]}
                                                        </label>
                                                        <div className="ui input inputDev">
                                                            <input type="text" className="form-control" id="requestedQuantity"
                                                                value={this.state.quantityCompleteTotal}
                                                                name="requestedQuantity"
                                                                readOnly
                                                                autoComplete="off"
                                                                placeholder={Resources.requestedQuantity[currentLanguage]} />
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput">
                                                        <label className="control-label">
                                                            {Resources.releasedQuantity[currentLanguage]}
                                                        </label>
                                                        <div className="ui input inputDev">
                                                            <input type="text" className="form-control" id="releasedQuantity"
                                                                value={this.state.variance}
                                                                name="releasedQuantity"
                                                                readOnly
                                                                autoComplete="off"
                                                                placeholder={Resources.releasedQuantity[currentLanguage]} />
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput">
                                                        <label className="control-label">
                                                            {Resources.price[currentLanguage]}
                                                        </label>
                                                        <div className="ui input inputDev">
                                                            <input type="text" className="form-control" id="price"
                                                                value={this.state.unitPriceTotal}
                                                                name="price"
                                                                readOnly
                                                                autoComplete="off"
                                                                placeholder={Resources.price[currentLanguage]} />
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput">
                                                        <label className="control-label">
                                                            {Resources.total[currentLanguage]}
                                                        </label>
                                                        <div className="ui input inputDev">
                                                            <input type="text" className="form-control" id="total"
                                                                value={this.state.total}
                                                                name="total"
                                                                readOnly
                                                                autoComplete="off"
                                                                placeholder={Resources.total[currentLanguage]} />
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput">
                                                        <label className="control-label">
                                                            {Resources.totalRequest[currentLanguage]}
                                                        </label>
                                                        <div className="ui input inputDev">
                                                            <input type="text" className="form-control" id="totalRequest"
                                                                value={this.state.totalExcuted}
                                                                name="totalRequest"
                                                                readOnly
                                                                autoComplete="off"
                                                                placeholder={Resources.totalRequest[currentLanguage]} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="submittalFilter readOnly__disabled">
                                                    <div className="subFilter">
                                                        <h3 className="zero"></h3>
                                                    </div>
                                                    {btnExport}
                                                </div> </> : null}
                                        {dataGrid}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}
function mapStateToProps(state, ownProps) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceQuantity)