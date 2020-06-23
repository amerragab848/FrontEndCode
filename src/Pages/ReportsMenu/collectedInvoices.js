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
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument';
import Export from "../../Componants/OptionsPanels/Export";
import sumBy from 'lodash/sumBy';
import BarChartComp from '../../Componants/ChartsWidgets/BarChartCompJS';
import GridCustom from 'react-customized-grid'; 

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    poId: Yup.string().required(Resources['projectInvoices'][currentLanguage])
});

class CollectedInvoices extends Component {
    constructor(props) {

        super(props)

        this.columnsGrid = [
            {
                field: "subject",
                title: Resources["subject"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: "collected",
                title: Resources["collected"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "variance",
                title: Resources["variance"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "total",
                title: Resources["total"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "totalExcuted",
                title: Resources["totalExcuted"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
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
            totalExecuted: 0,
            totalcollected: 0,
            total: 0,
            variance: 0,
            pageSize: 200,
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

        dataService.GetDataGrid(`GetInvoicesByPurchaseOrderIdForReport?purchaseOrderId=${id}`).then(result => {

            const totalExecuted = sumBy(result, function (item) {
                return item.totalExecuted
            });
            const totalcollected = sumBy(result, function (item) {
                return item.collected
            });
            const variance = sumBy(result, function (item) {
                return item.variance
            });

            const total = sumBy(result, function (item) {
                return item.total
            });

            this.setState({
                rows: result || [],
                isLoading: false,
                totalExecuted,
                totalcollected,
                variance,
                total
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
                ref='custom-data-grid'
                key="collectedInvoices"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                rowClick={() => { }}
                cells={this.columnsGrid}
                   /> : null
            ) : (
                <LoadingSection />
            );

        const btnExport = this.state.isLoading === false ?
            (
                this.state.rows.length > 0 ? <Export
                    rows={this.state.isLoading === false ? this.state.rows : []}
                    columns={this.columnsGrid}
                    fileName={Resources.collectedInvoices[currentLanguage]}
                /> : null
            ) : null;

        return (
            <div className="mainContainer">
                <div className="documents-stepper noTabs__document">
                    <HeaderDocument projectName={this.state.projectName} docTitle={Resources.collectedInvoices[currentLanguage]} moduleTitle={Resources['reportsCenter'][currentLanguage]} />
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
                                    <div style={{ display: 'flex', flexDirection: 'column' }} className={"grid-container " + (this.state.rows.length === 0 ? "griddata__load" : " ")}>
                                        {this.state.rows.length > 0 ?
                                            <>
                                                <div className="reportChart__charts">
                                                    <BarChartComp
                                                        reports={true}
                                                        rows={this.state.rows}
                                                        barContent={[
                                                            { name: Resources['total'][currentLanguage], value: 'total' },
                                                            { name: Resources['collected'][currentLanguage], value: 'collected' }
                                                        ]}
                                                        catagName="subject"
                                                        multiSeries="yes"
                                                        ukey="collectedInvoices"
                                                        title={Resources['collectedInvoices'][currentLanguage]}
                                                        y="total"
                                                        yTitle={Resources['total'][currentLanguage]} />
                                                </div>
                                                <div className="proForm datepickerContainer">
                                                    <div className="linebylineInput">
                                                        <label className="control-label">
                                                            {Resources.totalExecuted[currentLanguage]}
                                                        </label>
                                                        <div className="ui input inputDev">
                                                            <input type="text" className="form-control" id="totalExecuted"
                                                                value={this.state.totalExecuted}
                                                                name="totalExecuted"
                                                                readOnly
                                                                autoComplete="off"
                                                                placeholder={Resources.totalExecuted[currentLanguage]} />
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput">
                                                        <label className="control-label">
                                                            {Resources.collected[currentLanguage]}
                                                        </label>
                                                        <div className="ui input inputDev">
                                                            <input type="text" className="form-control" id="collected"
                                                                value={this.state.totalcollected}
                                                                name="collected"
                                                                readOnly
                                                                autoComplete="off"
                                                                placeholder={Resources.collected[currentLanguage]} />
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
                                                            {Resources.variance[currentLanguage]}
                                                        </label>
                                                        <div className="ui input inputDev">
                                                            <input type="text" className="form-control" id="variance"
                                                                value={this.state.variance}
                                                                name="variance"
                                                                readOnly
                                                                autoComplete="off"
                                                                placeholder={Resources.variance[currentLanguage]} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CollectedInvoices)