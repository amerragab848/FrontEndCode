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
import moment from "moment";
import Export from "../../Componants/OptionsPanels/Export";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";


let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    projectId: Yup.string().required(Resources['selectProjects'][currentLanguage])
});

class DeliveredQuantitieReport extends Component {
    constructor(props) {

        super(props)

        this.columnsGrid = [
            {
                field: "description",
                title: Resources["description"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text"
            },
            {
                field: "recourceCode",
                title: Resources["resourceCode"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text"
            },
            {
                field: "materialDeliverySubject",
                title: Resources["subject"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text"
            },
            {
                field: "quantity",
                title: Resources["quantity"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text"
            },
            {
                field: "unitPrice",
                title: Resources["unitPrice"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text"
            },
            {
                field: "remaining",
                title: Resources["remaining"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text"
            },
            {
                field: "projectName",
                title: Resources["projectName"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text"
            },
            {
                field: "fromContact",
                title: Resources["fromContact"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text"
            },
            {
                field: "purchaseOrderDate",
                title: Resources["purchaseOrderDate"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "date"
            },
            {
                field: "conditionDate",
                title: Resources["conditionDate"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "date"
            },

        ];

        this.state = {
            projectId: this.props.projectId || localStorage.getItem("lastSelectedProject"),
            projectName: this.props.projectName || localStorage.getItem("lastSelectedprojectName"),
            projects: [],
            projectId: "",
            selectProjects: { label: Resources.selectProjects[currentLanguage], value: "0" },
            isLoading: true,
            rows: []
        }

        if (!Config.IsAllow(691)) {
            toast.warning(Resources['missingPermissions'][currentLanguage])
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        this.props.actions.FillGridLeftMenu();
        dataService.GetDataList(`GetAllProjectForDrop`, 'projectName', 'id').then(result => {
            if (result.length > 0) {
                this.setState({
                    projects: result
                });
            }
        })

        this.setState({ isLoading: false });
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            boq: [],
            projectId: "",
            selectProjects: { label: Resources.selectProjects[currentLanguage], value: "0" },
        });
    }

    search = (id) => {

        this.setState({ isLoading: true })

        dataService.GetDataGrid(`GetPurchaseOrderByProjectId?projectId=${id}`).then(result => {
            this.setState({
                rows: result || [],
                isLoading: false
            })
        })
    }

    handleChangeDropDown(event) {
        if (event == null) return;

        this.setState({
            selectProjects: event,
            projectId: event.value
        });
    }

    render() {
        const dataGrid = this.state.isLoading === false ?
            (
                this.state.rows.length > 0 ?
                    <GridCustom
                        gridKey="DeliveredQuantityReport"
                        cells={this.columnsGrid}
                        data={this.state.rows}
                        groups={[]} pageSize={50}
                        pageSize={50} actions={[]}
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
                    fileName={Resources.deliveredMaterial[currentLanguage]}
                /> : null
            ) : null;

        return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
                    <HeaderDocument projectName={this.state.projectName} docTitle={Resources.deliveredMaterial[currentLanguage]} moduleTitle={Resources['reportsCenter'][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            <div className="subiTabsContent">
                                <div className="document-fields">
                                    {this.state.isLoading ? <LoadingSection /> : null}
                                    <Formik
                                        initialValues={{
                                            projectId: ''
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={validationSchema}
                                        onSubmit={(values) => {
                                            if (values.projectId.value) {
                                                this.search(values.projectId.value);
                                            }
                                        }}>
                                        {({ errors, touched, handleSubmit, setFieldTouched, setFieldValue }) => (
                                            <Form id="signupForm1" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>
                                                <div className="proForm first-proform fullWidth_form">
                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="projectName" data={this.state.projects}
                                                            selectedValue={this.state.selectProjects}
                                                            handleChange={event => this.handleChangeDropDown(event)}
                                                            onChange={setFieldValue}
                                                            onBlur={setFieldTouched}
                                                            error={errors.projectId}
                                                            touched={touched.projectId}
                                                            name="projectId"
                                                            id="projectId" />
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
                                    <div className="submittalFilter readOnly__disabled">
                                        <div className="subFilter">
                                            <h3 className="zero"></h3>
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

export default connect(mapStateToProps, mapDispatchToProps)(DeliveredQuantitieReport)