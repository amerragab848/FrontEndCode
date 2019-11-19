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
import GridSetup from "../Communication/GridSetup";
import moment from "moment";
import Export from "../../Componants/OptionsPanels/Export";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    boqId: Yup.string().required(Resources['selectBoq'][currentLanguage])
});

class ContractsBoqQuantities extends Component {
    constructor(props) {

        super(props)

        this.columnsGrid = [
            {
                key: "details",
                name: Resources["description"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            },
            {
                key: "resourceCode",
                name: Resources["resourceCode"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            },
            {
                key: "itemCode",
                name: Resources["itemCode"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            },
            {
                key: "mainContractUnitPrice",
                name: Resources["mainContractUnitPrice"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            },
            {
                key: "subContractUnitPrice",
                name: Resources["subContractUnitPrice"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            },
            {
                key: "boqQty",
                name: Resources["boqQuanty"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            },
            {
                key: "mainContractQty",
                name: Resources["contractQty"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            },
            {
                key: "subContractQty",
                name: Resources["subContractQty"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            },
            {
                key: "totalItem",
                name: Resources["total"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            },
            {
                key: "mainContractTotal",
                name: Resources["mainContractTotal"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            },
            {
                key: "subContractTotal",
                name: Resources["subContractTotal"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true
            }
        ];

        this.state = {
            projectId: this.props.projectId || localStorage.getItem("lastSelectedProject"),
            projectName: this.props.projectName || localStorage.getItem("lastSelectedprojectName"),
            boq: [],
            boqId: "",
            selectedBoq: { label: Resources.selectBoq[currentLanguage], value: "0" },
            isLoading: true,
            rows: []
        }

        if (!Config.IsAllow(3508)) {
            toast.warning(Resources['missingPermissions'][currentLanguage])
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        this.props.actions.FillGridLeftMenu();
        dataService.GetDataList(`GetContractForDrop?projectId=${this.state.projectId}`, 'subject', 'id').then(result => {
            if (result.length > 0) {
                this.setState({
                    boq: result
                });
            }
        })

        this.setState({ isLoading: false });
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            boq: [],
            boqId: "",
            selectedBoq: { label: Resources.selectBoq[currentLanguage], value: "0" },
        });
    }

    search = (id) => {

        this.setState({ isLoading: true })

        dataService.GetDataGrid(`GetContractBoq?id=${id}`).then(result => {
            this.setState({
                rows: result || [],
                isLoading: false
            })
        })
    }

    handleChangeDropDown(event) {
        if (event == null) return;

        this.setState({
            selectedBoq: event,
            boqId: event.value
        });
    }

    render() {

        const dataGrid = this.state.isLoading === false ?
            (
                this.state.rows.length > 0 ? <GridSetup rows={this.state.rows} showCheckbox={false} columns={this.columnsGrid} /> : null
            ) : (
                <LoadingSection />
            );

        const btnExport = this.state.isLoading === false ?
            (
                this.state.rows.length > 0 ? <Export
                    rows={this.state.isLoading === false ? this.state.rows : []}
                    columns={this.columnsGrid}
                    fileName={Resources.boqCostReport[currentLanguage]}
                /> : null
            ) : null;

        return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
                    <HeaderDocument projectName={this.state.projectName} docTitle={Resources.boqCostReport[currentLanguage]} moduleTitle={Resources['reportsCenter'][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            <div className="subiTabsContent">
                                <div className="document-fields">
                                    {this.state.isLoading ? <LoadingSection /> : null}
                                    <Formik
                                        initialValues={{
                                            boqId: ''
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={validationSchema}
                                        onSubmit={(values) => {
                                            if (values.boqId.value) {
                                                this.search(values.boqId.value);
                                            }
                                        }}>
                                        {({ errors, touched, handleSubmit, setFieldTouched, setFieldValue }) => (
                                            <Form id="signupForm1" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>
                                                <div className="proForm first-proform fullWidth_form">
                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="boq" data={this.state.boq}
                                                            selectedValue={this.state.selectedBoq}
                                                            handleChange={event => this.handleChangeDropDown(event)}
                                                            onChange={setFieldValue}
                                                            onBlur={setFieldTouched}
                                                            error={errors.boqId}
                                                            touched={touched.boqId}
                                                            name="boqId"
                                                            id="boqId" />
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
                                </div>
                                <div className={"grid-container " + (this.state.rows.length === 0 ? "griddata__load" : " ")}>
                                    <div class="submittalFilter">
                                        <div class="subFilter">
                                            <h3 class="zero"></h3>
                                        </div>
                                        {btnExport}
                                    </div>
                                    {dataGrid}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ContractsBoqQuantities)