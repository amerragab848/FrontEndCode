import React, { Component, Fragment } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Resources from "../../resources.json";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import { toast } from "react-toastify";
import LoadingSection from "../../Componants/publicComponants/LoadingSection"; 

const _ = require('lodash');

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
    projectPhase: Yup.string().required(Resources['projectPhase'][currentLanguage]).nullable(true),
    organisation: Yup.string().required(Resources['organisation'][currentLanguage]).nullable(true),
    managementlevel: Yup.string().required(Resources['managementlevel'][currentLanguage]).nullable(true)
})

class RiskCategorisation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            document: {},
            isLoading: false,
            projectPhase: [],
            organisation: [],
            managementlevel: [],
            riskCategorisation: [],
            SelectProjectPhase: { label: Resources["projectPhase"][currentLanguage], value: "0" },
            SelectOrganisation: { label: Resources["organisation"][currentLanguage], value: "0" },
            SelectManagementlevel: { label: Resources["managementlevel"][currentLanguage], value: "0" },
            currentDocument: 0,
            showDeleteModal: false
        }
    }

    componentWillMount() {
        if (this.props.riskId) {

            dataservice.GetDataList("GetaccountsDefaultListForList?listType=projectPhase", "title", "id").then(result => {

                this.setState({
                    projectPhase: [...result]
                });
            }).catch(ex => toast.error(Resources["failError"][currentLanguage]));

            dataservice.GetDataList("GetaccountsDefaultListForList?listType=organisation", "title", "id").then(result => {

                this.setState({
                    organisation: [...result]
                });
            }).catch(ex => toast.error(Resources["failError"][currentLanguage]));

            dataservice.GetDataList("GetaccountsDefaultListForList?listType=managementlevel", "title", "id").then(result => {

                this.setState({
                    managementlevel: [...result]
                });

            }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
 
            let document = {
                projectPhase: "",
                organisation: "",
                managementlevel: "",
                riskId: this.props.riskId
            }

            this.setState({
                document: document
            })
        }
    }

    handleChangeDropDown(event, field, selectedValue) {
        if (event == null) return;
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document,
            [selectedValue]: event
        });
    }

    saveCategorisation = () => {
        this.setState({
            isLoading: true
        });

        dataservice.addObject("AddRiskCategorisation", this.state.document).then(result => {

            let original_Data = this.state.riskCategorisation;

            original_Data.push(result);

            this.setState({
                riskCategorisation: original_Data,
                isLoading: false,
                SelectProjectPhase: { label: Resources["projectPhase"][currentLanguage], value: "0" },
                SelectOrganisation: { label: Resources["organisation"][currentLanguage], value: "0" },
                SelectManagementlevel: { label: Resources["managementlevel"][currentLanguage], value: "0" }
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(ex => {
            this.setState({
                isLoading: false
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }

    clickHandlerContinueMain = () => {

        this.setState({
            isLoading: true
        });

        dataservice.GetDataGrid("DeleteRiskCategorisation?id=" + this.state.currentDocument).then(result => {

            let original_Data = this.state.riskCategorisation;

            let getIndex = original_Data.findIndex(x => x.id === this.state.currentDocument);

            original_Data.splice(getIndex, 1);

            this.setState({
                riskCategorisation: original_Data,
                isLoading: false,
                showDeleteModal: false
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);

        }).catch(ex => {
            this.setState({
                isLoading: false,
                showDeleteModal: false
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    };

    viewConfirmDelete(id) {
        this.setState({
            currentDocument: id,
        })
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    };

    render() {
      
        return (
            <div className="doc-pre-cycle letterFullWidth">
                <div className="document-fields">
                    <header style={{ paddingTop: '0' }}>
                        <h2 className="zero">{Resources['categorisation'][currentLanguage]}</h2>
                    </header>
                    {this.state.isLoading == true ? <LoadingSection /> :
                        <Fragment>
                            <Formik initialValues={{
                                projectPhase: this.state.SelectProjectPhase.value > 0 ? this.state.SelectProjectPhase.value : '',
                                organisation: this.state.SelectOrganisation.value > 0 ? this.state.SelectOrganisation.value : '',
                                managementlevel: this.state.SelectManagementlevel.value > 0 ? this.state.SelectManagementlevel.value : ''
                            }} validationSchema={validationSchema} enableReinitialize={true}
                                onSubmit={(values) => {
                                    if (this.props.showModal) { return; }
                                    if (this.props.riskId > 0) {
                                        this.saveCategorisation();
                                    }
                                }}>
                                {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                    <Form id="riskForm" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>
                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                title="projectPhase"
                                                data={this.state.projectPhase}
                                                selectedValue={this.state.SelectProjectPhase}
                                                handleChange={event => this.handleChangeDropDown(event, 'projectPhase', 'SelectProjectPhase')}
                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                error={errors.projectPhase}
                                                touched={touched.projectPhase}
                                                index="projectPhase"
                                                name="projectPhase"
                                                id="projectPhase" />
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                title="organisation"
                                                data={this.state.organisation}
                                                selectedValue={this.state.SelectOrganisation}
                                                handleChange={event => this.handleChangeDropDown(event, 'organisation', "SelectOrganisation")}
                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                error={errors.organisation}
                                                touched={touched.organisation}
                                                index="organisation"
                                                name="organisation"
                                                id="organisation"
                                            />
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                title="managementlevel"
                                                data={this.state.managementlevel}
                                                selectedValue={this.state.SelectManagementlevel}
                                                handleChange={event => this.handleChangeDropDown(event, 'managementlevel', 'SelectManagementlevel')}
                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                error={errors.managementlevel}
                                                touched={touched.managementlevel}
                                                index="managementlevel"
                                                name="managementlevel"
                                                id="managementlevel"
                                            />
                                        </div>
                                        <div className="slider-Btns letterFullWidth">
                                            {this.state.isLoading ?
                                                <button className="primaryBtn-1 btn disabled">
                                                    <div className="spinner">
                                                        <div className="bounce1" />
                                                        <div className="bounce2" />
                                                        <div className="bounce3" />
                                                    </div>
                                                </button>
                                                : <button className={"primaryBtn-1 btn meduimBtn"} type='submit'>{Resources['save'][currentLanguage]}</button>
                                            }
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Fragment>
                    }
                    
                </div> 
            </div>
        );
    }
}

export default RiskCategorisation