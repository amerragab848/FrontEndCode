
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Api from '../../api';
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import Export from "../../Componants/OptionsPanels/Export";
import GridSetup from "../Communication/GridSetup"
import Resources from "../../resources.json";
import Config from "../../Services/Config";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import dataservice from "../../Dataservice";
import { connect } from 'react-redux';
import { toast } from "react-toastify";
import { SkyLightStateless } from 'react-skylight';
import { Formik, Form } from 'formik';
import DropdownMelcous from '../../Componants/OptionsPanels/DropdownMelcous';
import * as Yup from 'yup';
const _ = require('lodash')

let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const ValidtionSchema = Yup.object().shape({
    SelectedManageCompanies: Yup.string()
        .required(Resources['selectCompany'][currentLanguage])
        .nullable(true),
});

class ProjectCompanies extends Component {

    constructor(props) {
        super(props);

        if (!Config.IsAllow(4)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.ExportColumns = [

            {
                key: "companyName",
                name: Resources["CompanyName"][currentLanguage],

            },
            {
                key: "roleTitle",
                name: Resources["companyRole"][currentLanguage],

            },
            {
                key: "disciplineTitle",
                name: Resources["disciplineTitle"][currentLanguage],

            },
            {
                key: "keyContactName",
                name: Resources["KeyContact"][currentLanguage],
                width: 100,

            },
            {
                key: "location",
                name: Resources["location"][currentLanguage],

            },
            {
                key: "contactsTel",
                name: Resources["Telephone"][currentLanguage],

            },
            {
                key: "contactsMobile",
                name: Resources["Mobile"][currentLanguage],

            },
            {
                key: "contactsFax",
                name: Resources["Fax"][currentLanguage],
                width: 100,

            },
            {
                key: "grade",
                name: Resources["Grade"][currentLanguage],

            }
            ,
            {
                key: "enteredBy",
                name: Resources["enteredBy"][currentLanguage],

            }
            ,
            {
                key: "lastModified",
                name: Resources["lastModified"][currentLanguage],

            }
        ];

        const columnsGrid = [
            {
                formatter: this.customButton,
                key: 'customBtn'

            },
            {
                key: "companyName",
                name: Resources["CompanyName"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "roleTitle",
                name: Resources["companyRole"][currentLanguage],
                width: 180,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "disciplineTitle",
                name: Resources["disciplineTitle"][currentLanguage],
                width: 180,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "location",
                name: Resources["Address"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "contactsTel",
                name: Resources["Telephone"][currentLanguage],
                width: 180,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "contactsMobile",
                name: Resources["Mobile"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "contactsFax",
                name: Resources["Fax"][currentLanguage],
                width: 180,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "grade",
                name: Resources["Grade"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }

        ];

        this.state = {
            columns: columnsGrid.filter(column => column.visible !== false),
            isLoading: true,
            rows: [],
            totalRows: 0,
            pageTitle: Resources['Companies'][currentLanguage],
            selectedCompany: 0,
            Previous: false,
            rowSelectedId: '',
            projectId: this.props.projectId,
            ShowPopup: false,
            ManageCompaniesData: [],
            SelectedManageCompanies: [],
            HiddenBtnManage: false

        }

    }

    customButton = () => {
        return <button className="companies_icon" onClick={this.clickHandler} ><i className="fa fa-users"></i></button>;
    }

    componentDidMount() {
        if (Config.IsAllow(3)) {
            Api.get('GetProjectProjectsCompanies?projectId=' + this.state.projectId + '').then(result => {
                this.setState({
                    rows: result,
                    isLoading: false,
                    totalRows: result.length
                });
            });
        }
        else
            toast.warning("you don't have permission");

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.projectId !== this.props.projectId) {
            this.setState({
                isLoading: true
            })
            dataservice.GetDataGrid('GetProjectProjectsCompanies?projectId=' + this.props.projectId + '').then(data => {
                this.setState({
                    rows: data,
                    projectId: nextProps.projectId,
                    isLoading: false,
                    totalRows: data.length,
                })
            })
        }
    }

    viewContact = (rowSelected) => {
        if (Config.IsAllow(1)) {
            this.props.history.push({
                pathname: "/Contacts/" + rowSelected,
            });
        }
        else {
            toast.warning("you don't have permission");
        }
    }

    cellClick = (rowID, colID) => {
        let id = this.state.rows[rowID]['companyId']
        if (colID == 1)
            this.viewContact(id)
        else if (!Config.IsAllow(1)) {
            toast.warning("you don't have permission");
        }
        else if (colID != 0) {
            if (Config.IsAllow(1)) {
                this.props.history.push({
                    pathname: "/AddEditCompany/" + id,
                });
            }

        }
    }


    addRecord = () => {
        if (Config.IsAllow(810))
            this.props.history.push({
                pathname: "/AddEditCompany/0",
            });
        else
            toast.warning("you don't have permission");
    }

    clickHandlerDeleteRowsMain = selectedRows => {
        this.setState({
            showDeleteModal: true,
            selectedRowId: selectedRows
        });
    }

    onCloseModal() {
        this.setState({
            showDeleteModal: false
        });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    ConfirmDeleteComanies = () => {
        this.setState({ showDeleteModal: true })

        if (Config.IsAllow(2)) {
            this.setState({ isLoading: true })
            let newRows = []
            let selectedRow = {}
            this.state.rows.forEach(element => {
                if (element.id == this.state.selectedRowId)
                    selectedRow = element
                else
                    newRows.push(element)
            })
            if (selectedRow.deletable == true)
                toast.warning("you can't remove this company !")
            else {
                Api.post('ProjectProjectsCompaniesMultipleDelete', this.state.selectedRowId)
                    .then(result => {
                        this.setState({
                            rows: newRows,
                            totalRows: newRows.length,
                            isLoading: false,
                            showDeleteModal: false,
                            IsActiveShow: false
                        });
                        toast.success("operation complete successful")
                    })
                    .catch(ex => {
                        this.setState({
                            showDeleteModal: false,
                            IsActiveShow: false
                        })
                    })
            }
        }
        else
            toast.warning("you don't have permission");

    }

    ShowPopupModel = () => {
        this.setState({ isLoading: true, HiddenBtnManage: true })
        dataservice.GetDataList('GetProjectCompanyNotProjectProjectCompany?projectId=' + this.state.projectId + '', 'companyName', 'id').then(
            result => {
                this.setState({
                    isLoading: false,
                    ManageCompaniesData: result,
                    ShowPopup: true,
                    HiddenBtnManage: false
                })
            }
        )
    }

    handleChange = (e) => {
        this.setState({
            SelectedManageCompanies: e
        })
    }

    AddMangeCompanies = () => {

        let selectedCompanies = []
        this.state.SelectedManageCompanies.map(i => {
            selectedCompanies.push(i.value)
        })
        this.setState({ isLoading: true })

        let obj = {
            projectId: this.state.projectId,
            selectedCompanies: selectedCompanies
        }
        Api.post('AddProjectProjectsCompaniesList', obj).then(
            res => {
                this.setState({
                    rows: res,
                    ShowPopup: false,
                    isLoading: false
                })
                toast.success("operation complete successful")
            }
        )
    }

    render() {
        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={true}
                    clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                    viewContactHandler={this.clickHandler}
                    cellClick={this.cellClick}
                    single={true}

                />
            ) : <LoadingSection />;
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.ExportColumns} fileName={this.state.pageTitle} />
            : null;

        return (

            <div className='mainContainer'>

                <div className="submittalFilter">
                    <div className="subFilter">
                        <h3 className="zero">{this.state.pageTitle}</h3>
                        <span>{this.state.totalRows}</span>
                    </div>

                    <div className="filterBTNS">
                        {this.state.HiddenBtnManage === false ?
                            Config.IsAllow(5) ?
                                <button className="primaryBtn-1 btn mediumBtn" style={{ minWidth: 'auto' }}
                                    data-toggle="tooltip" title={Resources['manageCompanies'][currentLanguage]} onClick={this.ShowPopupModel}>
                                    <i className="fa fa-cogs"></i>
                                </button>
                                : null
                            : null}
                    </div>

                    <div className="filterBTNS">
                        {btnExport}
                        {Config.IsAllow(810) ?
                            <button className="primaryBtn-1 btn mediumBtn" onClick={this.addRecord}>{Resources['add'][currentLanguage]}</button>
                            : null}

                    </div>
                </div>

                <div className="grid-container">
                    {dataGrid}
                </div>

                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDeleteComanies}
                    />
                ) : null}




                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={() => this.setState({ ShowPopup: false })}
                        title={Resources['manageCompanies'][currentLanguage]}
                        onCloseClicked={() => this.setState({ ShowPopup: false })} isVisible={this.state.ShowPopup}>

                        <Formik
                            initialValues={{ SelectedManageCompanies: '' }}

                            enableReinitialize={true}

                            validationSchema={ValidtionSchema}

                            onSubmit={(values, actions) => {

                                this.AddMangeCompanies(values, actions)
                            }}>

                            {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                                <Form onSubmit={handleSubmit}>


                                    <div className='dropWrapper'>
                                        <div className="letterFullWidth multiChoice">
                                            <DropdownMelcous title='Companies' data={this.state.ManageCompaniesData} name='SelectedManageCompanies'
                                                value={this.state.SelectedManageCompanies} onChange={setFieldValue}
                                                isMulti={true} handleChange={(e) => this.handleChange(e)}
                                                onBlur={setFieldTouched}
                                                error={errors.SelectedManageCompanies}
                                                touched={touched.SelectedManageCompanies}
                                                value={values.SelectedManageCompanies} />
                                        </div>

                                        <div className="fullWidthWrapper slider-Btns">
                                            <button className="primaryBtn-1 btn meduimBtn" type='submit' >{Resources['save'][currentLanguage]}</button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>


                    </SkyLightStateless>
                </div>




            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        projectId: state.communication.projectId,
    }
}
export default connect(
    mapStateToProps,

)(withRouter(ProjectCompanies))
