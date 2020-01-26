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
import GridCustom from 'react-customized-grid';
import 'react-customized-grid/main.css';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    boqId: Yup.string().required(Resources['selectBoq'][currentLanguage])
});


let subjectFormat = ({ value, row }) => {
    let doc_view = "";
    if (row) {
        if (row.isItem === true) {
            doc_view = <span>&#9679; {row.subject}</span>
        } else {
            doc_view = <span>{row.subject}</span>
        }
        return doc_view;
    }
    return null;
};

class EstimationBoqComparison extends Component {
    constructor(props) {

        super(props)

        this.columnsGrid = [
            {
                "field": "subject",
                "title": Resources.subject[currentLanguage],
                "type": "text",
                "width": 15,
                "fixed": true,
                "groupable": true,
                "sortable": true
            }, {
                "field": "details",
                "title": Resources.details[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "docDate",
                "title": Resources.docDate[currentLanguage],
                "type": "date",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "unit",
                "title": Resources.unit[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "quantity",
                "title": Resources.quantity[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "unitPrice",
                "title": Resources.unitPrice[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "total",
                "title": Resources.total[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "itemCode",
                "title": Resources.itemCode[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
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

        if (!Config.IsAllow(691)) {
            toast.warning(Resources['missingPermissions'][currentLanguage])
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        this.props.actions.FillGridLeftMenu();
        dataService.GetDataList(`GetContractsBoqForDropEstimation?projectId=${this.state.projectId}`, 'subject', 'id').then(result => {
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

        dataService.GetDataGrid(`GetEstimationBoqItemsForReport?id=${id}`).then(result => {
            if (result.length > 0) {
                result.map(x => {
                    let subject = '';
                    if (x.isItem === true) {
                        subject = <span>&#9679; {x.subject}</span>;
                    } else {
                        subject = <span>{x.subject}</span>
                    } 
                    return subject;
                })
            }

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
                this.state.rows.length > 0 ?
                    <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columnsGrid}
                        pageSize={this.state.rows.length} actions={[]} rowActions={[]}rowClick={() => { }}
                    />
                    : null
            ) : (
                <LoadingSection />
            );

        const btnExport = this.state.isLoading === false ?
            (
                this.state.rows.length > 0 ? <Export
                    rows={this.state.isLoading === false ? this.state.rows : []}
                    columns={this.columnsGrid}
                    fileName={Resources.estimationBoqComparison[currentLanguage]}
                /> : null
            ) : null;

        return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
                    <HeaderDocument projectName={this.state.projectName} docTitle={Resources.estimationBoqComparison[currentLanguage]} moduleTitle={Resources['reportsCenter'][currentLanguage]} />
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
                                                    ) : (<button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.search[currentLanguage]}</button>)}
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

export default connect(mapStateToProps, mapDispatchToProps)(EstimationBoqComparison)