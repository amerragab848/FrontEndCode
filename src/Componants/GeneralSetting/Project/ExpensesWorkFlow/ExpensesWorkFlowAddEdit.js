import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../../publicComponants/ConfirmationModal";
import GridSetup from "../../../../Pages/Communication/GridSetup";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import config from "../../../../Services/Config";
import Resources from "../../../../resources.json";
import dataservice from "../../../../Dataservice";
import DatePicker from '../../../OptionsPanels/DatePicker'
import moment from 'moment';
import { SkyLightStateless } from 'react-skylight';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DropdownMelcous from '../../../OptionsPanels/DropdownMelcous';
import find from "lodash/find";
import filter from "lodash/filter";
import Select, { components } from 'react-select';
import { toast } from "react-toastify";
import * as AdminstrationActions from '../../../../store/actions/Adminstration'
const publicConfiguarion = config.getPayload();
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let CurrProject = localStorage.getItem('lastSelectedprojectName')
let MaxArrange = ''
let idEdit = ''

let publicFonts = currentLanguage === "ar" ? 'cairo-sb' : 'Muli, sans-serif'


const filterStyle = {
    control: (styles, { isFocused }) =>
        ({
            ...styles,
            backgroundColor: '#fff',
            width: '100%',
            height: '36px',
            borderRadius: '4px',
            border: isFocused ? "solid 2px #83B4FC" : '2px solid #E9ECF0',
            boxShadow: 'none',
            transition: ' all 0.4s ease-in-out',
            minHeight: '36px'
        }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isDisabled ? '#fff' : isSelected ? '#e9ecf0' : isFocused ? '#f2f6fa' : "#fff",
            color: '#3e4352',
            fontSize: '14px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            textTransform: 'capitalize',
            fontFamily: publicFonts,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            zIndex: '155'
        };
    },
    input: styles => ({ ...styles, maxWidth: '100%' }),
    placeholder: styles => ({ ...styles, color: '#A8B0BF', fontSize: '13px', width: '100%', fontFamily: publicFonts }),
    singleValue: styles => ({ ...styles, color: '#252833', fontSize: '13px', width: '100%', fontFamily: publicFonts }),
    indicatorSeparator: styles => ({ ...styles, display: 'none' }),
    menu: styles => ({ ...styles, zIndex: 155, boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.2)', border: 'solid 1px #ccd2db' })
};

const ArrowPublic = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" xmlnsXlink="http://www.w3.org/1999/xlink">
            <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Icons/Info/drop/defaultBtn/16px/Black" fill="#5E6475">
                    <g id="info_24pt-black">
                        <path fill="#5E6475" fillRule="evenodd" d="M11.319 6c.886 0 .8.687.346 1.235-.587.705-2.28 2.757-2.728 3.224-.69.721-1.004.722-1.696 0L4.303 7.235C3.866 6.719 3.848 6 4.606 6h6.713z"></path>
                    </g>
                </g>
            </g>
        </svg>
    );
};

const DropdownIndicator = props => {
    return (
        <Fragment>
            <components.DropdownIndicator {...props}>
                <ArrowPublic />
            </components.DropdownIndicator>
        </Fragment>
    );
};

const ValidtionSchema = Yup.object().shape({
    ArrangeContact: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
    Company: Yup.string()
        .required(Resources['toCompanyRequired'][currentLanguage])
        .nullable(true),
    ContactName: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage])
        .nullable(false),
});

const ValidtionSchemaForEdit = Yup.object().shape({
    ArrangeContactForEdit: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
    CompanyForEdit: Yup.string()
        .required(Resources['toCompanyRequired'][currentLanguage])
        .nullable(true)
    ,
    ContactNameForEdit: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage])
        .nullable(false),
});


const ValidtionSchemaExpensesWorkFlow = Yup.object().shape({
    ArrangeExpensesWorkFlow: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
    Subject: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
    ProjectName: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage])
        .nullable(true),
})

class ExpensesWorkFlowAddEdit extends Component {

    constructor(props) {
        super(props)
        if (!config.IsAllow(3661) && !config.IsAllow(3662)) {
            toast.warn(Resources['missingPermissions'][currentLanguage])
            this.props.history.goBack()
        }

        const columnsGrid = [
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "arrange",
                name: Resources["numberAbb"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "companyName",
                name: Resources["CompanyName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "contactName",
                name: Resources["ContactName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "description",
                name: Resources["description"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
        ]

        this.state = {
            showCheckbox: false,
            columns: columnsGrid.filter(column => column.visible !== false),
            ProjectList: [],
            CompanyData: [],
            ContactData: [],
            CurrStep: 1,
            firstComplete: false,
            secondComplete: false,
            thirdComplete: false,
            rows: [],
            selectedRows: [],
            isLoading: true,
            MultiApprovalData: [],
            showPopUp: false,
            ExpensesWorkFlowDataForEdit: {},
            ContactName: '',
            IsEditMode: false,
            DocumentDate: moment(),
            Status: 'true',
            selectedProject: '',
            selectedMultiApproval: '',
            ExpensesWorkFlowItem: '',
            IsEditExpensesWorkFlowItem: false,
            SelectedCompany: '',
            SelectedContact: '',
            MultiApproval: false,
            NewMultiApprovalData: [],
            SelectedCompanyForEdit: '',
            SelectedContactForEdit: '',
            selectedRows: [],
            showDeleteModal: false,
            MoveSteps: false,
            btnLoading: false
        }

    }

    DocumentDatehandleChange = (date) => {
        this.setState({
            DocumentDate: date
        })
    }

    componentWillReceiveProps() {
        console.log(this.props.ProjectReducer.expensesWorkFlowData)
    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    };

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    clickHandlerDeleteRowsMain = (selectedRows) => {
        this.setState({
            selectedRows,
            showDeleteModal: true
        })
    }

    ConfirmDelete = () => {
        this.setState({
            isLoading: true
        })
        dataservice.addObject('ExpensesWorkFlowItemsMultipleDelete', this.state.selectedRows).then(
            res => {
                let originalRows = this.state.rows

                this.state.selectedRows.map(i => {
                    originalRows = originalRows.filter(r => r.id !== i);
                })
                this.setState({
                    rows: originalRows,
                    showDeleteModal: false,
                    isLoading: false,
                    MaxArrange: Math.max.apply(Math, originalRows.map(function (o) { return o.arrange + 1 }))
                })
            },
            toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
        ).catch(ex => {
            this.setState({
                isLoading: false,

            })
        });
    }

    NextStep = () => {
        window.scrollTo(0, 0)
        switch (this.state.CurrStep) {
            case 1:
                this.setState({
                    CurrStep: this.state.CurrStep + 1,
                    firstComplete: true
                })
                break;
            case 2:

                this.setState({
                    CurrStep: this.state.CurrStep + 1, secondComplete: true,
                })
                break;
            case 3:
                this.props.actions.routeToTabIndex(4)
                this.props.history.push({ pathname: '/TemplatesSettings' })
                break;
        }
    }

    PreviousStep = () => {
        window.scrollTo(0, 0)
        switch (this.state.CurrStep) {
            case 2:
                this.setState({ CurrStep: this.state.CurrStep - 1, secondComplete: false })
                break;
            case 3:
                this.setState({ CurrStep: this.state.CurrStep - 1, thirdComplete: false })
                break;
        }
    }

    componentWillMount = () => {
        const query = new URLSearchParams(this.props.location.search);
        for (let param of query.entries()) {

            if (param[0] === 'arrange') {
                MaxArrange = param[1];
                idEdit = 0
            }
            else {
                idEdit = param[1];
                MaxArrange = 0;
                this.setState({
                    IsEditMode: true
                })
            }
        }
        dataservice.GetDataList('ProjectProjectsGetAll', 'projectName', 'projectId').then(
            res => {
                this.setState({
                    ProjectList: res,
                })
                let DataDrop = res;
                if (idEdit !== 0) {
                    dataservice.GetRowById('GetExpensesWorkFlowForEdit?id=' + idEdit + '').then(
                        res => {
                            let selectDrop = find(DataDrop, function (i) { return i.value == res.projectId });
                            this.setState({
                                ExpensesWorkFlowDataForEdit: res,
                                DocumentDate: res.docDate = res.docDate === null ? moment().format('YYYY-MM-DD') : moment(res.docDate).format('YYYY-MM-DD'),
                                selectedProject: selectDrop,
                            })
                        }
                    )
                }
            }
        )
        if (config.IsAllow(3742)) {
            this.setState({
                showCheckbox: true
            })
        }
    }

    componentDidMount = () => {

        dataservice.GetDataList('GetProjectCompanies?accountOwnerId=' + publicConfiguarion.aoi + '', 'companyName', 'id').then(
            res => {
                this.setState({ CompanyData: res, });
            });

        if (idEdit !== 0) {
            dataservice.GetDataGrid('getExpensesWorkFlowItemsByWorkFlowId?WorkFlowId=' + idEdit + '').then(
                res => {
                    this.setState({ rows: res, isLoading: false, MoveSteps: true })
                    dataservice.GetDataGrid('GetExpensesWorkFlowItemsByWorkFlowIdLevel?workFlow=' + idEdit + '').then(
                        res => {
                            this.setState({
                                MultiApprovalData: res,
                                NewMultiApprovalData: res,
                            })
                        }
                    )
                }
            )
        }
    }

    AddContact = (values, actions) => {

        if (!config.IsAllow(3740)) {
            toast.warn(Resources['missingPermissions'][currentLanguage])
        }
        else {
            this.setState({
                isLoading: true
            })
            let contactData = this.state.rows
            let ValidLeaveAndContactId = contactData.filter(s => s.contactId === values.ContactName.value && s.arrange === parseInt(values.ArrangeContact))
            if (!ValidLeaveAndContactId.length) {
                let obj = {
                    id: 1, arrange: values.ArrangeContact, companyId: values.Company.value,
                    contactId: values.ContactName.value, Description: values.Description,
                    workFlowId: idEdit !== 0 ? idEdit : this.state.ExpensesWorkFlowDataForEdit.id, multiApproval: false,
                }
                dataservice.addObject('AddExpensesWorkFlowItem', obj).then(res => {
                    values.ArrangeContact = Math.max.apply(Math, res.map(function (o) { return o.arrange + 1 }))
                    this.setState({ rows: res, isLoading: false, })
                    toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
                }).catch(ex => {
                    this.setState({ isLoading: false })
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                });
            }

            else {
                setTimeout(() => {
                    this.setState({ isLoading: false })
                }, 300);
                toast.error('This Contact Already Exist in Same Level ....')
            }
            values.Company = ''
            values.ContactName = ''
            values.Description = ''
            dataservice.GetDataGrid('GetExpensesWorkFlowItemsByWorkFlowIdLevel?workFlow=' + this.state.ExpensesWorkFlowDataForEdit.id + '').then(
                res => {
                    this.setState({
                        MultiApprovalData: res,
                        NewMultiApprovalData: res
                    })
                }
            )
        }
    }

    EditContact = (values, actions) => {
        if (!config.IsAllow(3741)) {
            toast.warn(Resources['missingPermissions'][currentLanguage])
        }
        else {
            this.setState({ isLoading: true })
            let contactData = this.state.rows
            let ValidLeaveAndContactId = contactData.filter(s => s.contactId === values.ContactNameForEdit.value && s.arrange === parseInt(values.ArrangeContactForEdit))
            if (!ValidLeaveAndContactId.length) {
                let obj = {
                    id: 1, arrange: values.ArrangeContactForEdit, Description: values.DescriptionForEdit,
                    companyId: values.CompanyForEdit.value, contactId: values.ContactNameForEdit.value,
                    workFlowId: idEdit !== 0 ? idEdit : this.state.ExpensesWorkFlowDataForEdit.id, multiApproval: false,
                }
                dataservice.addObject('EditExpensesWorkFlowItems', obj).then(res => {
                    this.setState({ rows: res, isLoading: false, showPopUp: false, })
                    toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
                }).catch(ex => {
                    this.setState({ isLoading: false })
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                });
            }
            else {
                values.Company = ''
                values.ContactName = ''
                values.Description = ''
                values.ArrangeContact = ''
                setTimeout(() => {
                    this.setState({
                        isLoading: false,
                        showPopUp: false,
                    })
                }, 300);
                toast.error('This Contact Already Exist in Same Level ....')
            }
        }
    }

    handleChangeDrops = (item, name) => {
        switch (name) {
            case "ProjectName":
                this.setState({ selectedProject: item })
                break;

            case 'multiApproval':
                this.setState({ selectedMultiApproval: item })
                break;

            case 'ContactName':
                this.setState({ SelectedContact: item })
                break;

            case 'Company':
                this.setState({ SelectedCompany: item })
                if (item !== null) {
                    dataservice.GetDataList('GetContactsByCompanyIdForOnlyUsers?companyId=' + item.value + '', 'contactName', 'id').then(
                        res => {
                            this.setState({
                                ContactData: res,
                            })
                        }
                    )
                }
                break;

            default:
                break;
        }
    }

    handleChangeDropsForEdit = (item, name) => {
        switch (name) {
            case 'ContactNameForEdit':
                this.setState({ SelectedContactForEdit: item })
                break;

            case 'CompanyForEdit':
                this.setState({ SelectedCompanyForEdit: item })
                if (item !== null) {
                    dataservice.GetDataList('GetContactsByCompanyIdForOnlyUsers?companyId=' + item.value + '', 'contactName', 'id').then(
                        res => {
                            this.setState({
                                ContactData: res,
                            })
                        }
                    )
                }
                break;
            default:
                break;
        }
    }

    saveDocment = (values, actions) => {
        this.setState({ btnLoading: true })
        if (this.state.IsEditMode) {
            let doc = {
                id: idEdit, projectId: values.ProjectName.value, status: this.state.Status,
                arrange: parseInt(values.ArrangeExpensesWorkFlow), subject: values.Subject,
                creationDate: moment(this.state.DocumentDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
            }
            dataservice.addObject('EditExpensesWorkFlow', doc).then(result => {
                this.setState({ isLoading: false, MoveSteps: true, btnLoading: false })
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
                this.NextStep()
            }).catch(ex => {
                this.setState({ isLoading: false, btnLoading: false })
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            });

        }
        else {

            let doc = {
                projectId: values.ProjectName.value,
                arrange: values.ArrangeExpensesWorkFlow, subject: values.Subject, status: this.state.Status,
                creationDate: moment(this.state.DocumentDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
            }
            dataservice.addObject('AddExpensesWorkFlow', doc).then(result => {
                this.setState({ isLoading: false, ExpensesWorkFlowDataForEdit: result, MoveSteps: true, btnLoading: false })
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
                this.NextStep()
            }).catch(ex => {
                this.setState({ isLoading: false, btnLoading: false })
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            });

        }
    }

    ShowPopUp = (obj) => {
        if (!config.IsAllow(3741)) {
            toast.warn(Resources['missingPermissions'][currentLanguage])
        }
        else {
            dataservice.GetRowById('GetExpensesWorkFlowItemsById?id=' + obj.id + '').then(
                res => {

                    this.setState({ showPopUp: true, IsEditExpensesWorkFlowItem: true })
                    let Companies = this.state.CompanyData

                    let SelectedCompany = find(Companies, function (i) { return i.value == res.companyId });

                    dataservice.GetDataList('GetContactsByCompanyIdForOnlyUsers?companyId=' + res.companyId + '', 'contactName', 'id').then(
                        res => {
                            this.setState({
                                ContactData: res,
                            })
                        }
                    )

                    this.setState({
                        ExpensesWorkFlowItem: res,
                        SelectedCompanyForEdit: SelectedCompany,
                        SelectedContactForEdit: { 'value': res.contactId, 'label': res.contactName },
                    })
                }
            )
        }

    }

    handleBlurmultiApproval = (id, value) => {

        let Data = this.state.NewMultiApprovalData

        let SelectedRow = Data.filter(s => s.workFlowItemId === id)
        let OldData = Data.filter(s => s.workFlowItemId !== id)

        let SelectedValue = this.state.MultiApproval.val === undefined ? null : this.state.MultiApproval.val.value
        filter(SelectedRow, function (i) {
            let x = {};
            x.arrange = i.arrange
            x.workFlowItemId = i.workFlowItemId
            x.count = i.count
            x.workFlowId = i.workFlowId
            x.multiApproval = SelectedValue
            OldData.push(x)
        })
        this.setState({
            NewMultiApprovalData: OldData
        })
    }

    MultiApprovalhandleChange = (id, Value) => {

        this.setState({
            MultiApproval: { id: id, val: Value }
        })

    }

    SaveMultiApproval = () => {
        dataservice.addObject('UpdateMultiApproval', this.state.NewMultiApprovalData).then(
            toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)

        )
        this.props.actions.routeToTabIndex(4)
        this.props.history.push({ pathname: '/TemplatesSettings' })
    }

    StepOneLink = () => {
        if (idEdit !== 0) {
            this.setState({
                firstComplete: true,
                secondComplete: false,
                CurrStep: 1,
                thirdComplete: false,
            })
        }
    }

    StepTwoLink = () => {
        if (idEdit !== 0) {
            this.setState({
                firstComplete: true,
                secondComplete: true,
                CurrStep: 2,
                thirdComplete: false,
            })
        }
    }

    StepThreeLink = () => {
        if (idEdit !== 0) {
            this.setState({
                thirdComplete: true,
                CurrStep: 3,
                firstComplete: true,
                secondComplete: true,
            })
        }
    }

    render() {

        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={this.state.showCheckbox}
                    minHeight={350}
                    clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                    onRowClick={this.ShowPopUp}
                />
            ) : <LoadingSection />

        const renderMultiApprovalTable =
            this.state.MultiApprovalData.map((item) => {

                return (
                    <tr key={item.workFlowItemId}>
                        <td>
                            <div className="contentCell tableCell-1">
                                <span>

                                    {item.arrange}

                                </span>
                            </div>
                        </td>
                        {() => this.setState({ MultiApproval: item.multiApproval ? { label: 'Multi', value: true } : { label: 'Single', value: false } })}
                        <td>
                            <Select options={[{ label: 'Multi', value: true }, { label: 'Single', value: false }]}
                                onChange={e => this.MultiApprovalhandleChange(item.workFlowItemId, e)}
                                onBlur={() => this.handleBlurmultiApproval(item.workFlowItemId)}
                                defaultValue={item.multiApproval ? { label: 'Multi', value: true } : { label: 'Single', value: false }}
                                styles={filterStyle} components={{ DropdownIndicator }}
                            />
                        </td>
                    </tr>
                )
            })

        const AddContact = () => {
            return (
                <Fragment>

                    <Formik
                        initialValues={{
                            ArrangeContact: idEdit !== 0 ? Math.max.apply(Math, this.state.rows.map(function (o) { return o.arrange + 1 })) : 1,
                            Company: '',
                            ContactName: '',
                            Description: '',
                        }}

                        enableReinitialize={true}
                        validationSchema={ValidtionSchema}
                        onSubmit={(values, actions) => {
                            this.AddContact(values, actions)
                        }}>

                        {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                            <Form onSubmit={handleSubmit}>
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero">{Resources['addContact'][currentLanguage]}</h2>
                                    </div>
                                </header>

                                <div className='document-fields'>
                                    <div className="proForm datepickerContainer">


                                        <div className="linebylineInput valid-input">
                                            <DropdownMelcous title="company" data={this.state.CompanyData} name="Company"
                                                selectedValue={this.state.IsEditExpensesWorkFlowItem ? this.state.SelectedCompany : values.Company} onChange={setFieldValue}
                                                handleChange={(e) => this.handleChangeDrops(e, "Company")}
                                                onBlur={setFieldTouched}
                                                error={errors.Company}
                                                touched={touched.Company}
                                                value={values.Company} isClear={true} />
                                        </div>


                                        <div className="linebylineInput valid-input">
                                            <DropdownMelcous title="ContactName" data={this.state.ContactData} name="ContactName"
                                                selectedValue={this.state.IsEditExpensesWorkFlowItem ? this.state.SelectedContact : values.ContactName} onChange={setFieldValue}
                                                handleChange={(e) => this.handleChangeDrops(e, "ContactName")}
                                                onBlur={setFieldTouched}
                                                error={errors.ContactName}
                                                touched={touched.ContactName}
                                                value={values.ContactName} />
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                            <div className={'ui input inputDev ' + (errors.ArrangeContact && touched.ArrangeContact ? 'has-error' : null) + ' '}>
                                                <input readOnly autoComplete="off" value={values.ArrangeContact} className="form-control" name="ArrangeContact"
                                                    onBlur={(e) => { handleBlur(e) }}
                                                    onChange={(e) => {
                                                        handleChange(e)
                                                    }} placeholder={Resources['numberAbb'][currentLanguage]} />
                                                {errors.ArrangeContact && touched.ArrangeContact ? (<em className="pError">{errors.ArrangeContact}</em>) : null}
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['description'][currentLanguage]}</label>
                                            <div className="inputDev ui input">
                                                <input autoComplete="off" className="form-control"
                                                    onChange={(e) => {
                                                        handleChange(e)
                                                    }} value={values.Description} name="Description" placeholder={Resources['description'][currentLanguage]} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="slider-Btns">
                                        <button className="primaryBtn-1 btn meduimBtn" type='submit' >ADD</button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Fragment>
            )
        }

        return (

            <div className="mainContainer main__fulldash" >
                <div className="documents-stepper noTabs__document one__tab one_step">
                    {/* Header */}
                    <div className="submittalHead">
                        <h2 className="zero">{CurrProject + ' - ' + Resources['expensesWorkFlow'][currentLanguage]}</h2>
                        <div className="SubmittalHeadClose">
                            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                        <g id="Group-2">
                                            <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                    <g id="Group">
                                                        <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                        <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z"
                                                            id="Combined-Shape" fill="#858D9E" fillRule="nonzero"></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div className="doc-container">

                        {/* EditContact */}
                        <div className="skyLight__form">
                            <SkyLightStateless onOverlayClicked={() => this.setState({ showPopUp: false, IsEditExpensesWorkFlowItem: false })}
                                title={Resources['editTitle'][currentLanguage]}
                                onCloseClicked={() => this.setState({ showPopUp: false, IsEditExpensesWorkFlowItem: false })} isVisible={this.state.showPopUp}>

                                <Fragment>

                                    <Formik
                                        initialValues={{
                                            ArrangeContactForEdit: this.state.ExpensesWorkFlowItem.arrange,
                                            CompanyForEdit: ' ',
                                            ContactNameForEdit: ' ',
                                            DescriptionForEdit: this.state.ExpensesWorkFlowItem.description,
                                        }}

                                        enableReinitialize={true}

                                        validationSchema={ValidtionSchemaForEdit}

                                        onSubmit={(values, actions) => {
                                            this.EditContact(values, actions)
                                        }}>

                                        {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                                            <Form onSubmit={handleSubmit}>
                                                <header className="main__header">
                                                    <div className="main__header--div">
                                                        <h2 className="zero">{Resources['addContact'][currentLanguage]}</h2>
                                                    </div>
                                                </header>

                                                <div className='document-fields'>
                                                    <div className="proForm datepickerContainer">

                                                        <div className="linebylineInput valid-input">
                                                            <DropdownMelcous title="company" data={this.state.CompanyData} name="CompanyForEdit"
                                                                selectedValue={this.state.IsEditExpensesWorkFlowItem ? this.state.SelectedCompanyForEdit : values.CompanyForEdit} onChange={setFieldValue}
                                                                handleChange={(e) => this.handleChangeDropsForEdit(e, "CompanyForEdit")}
                                                                onBlur={setFieldTouched}
                                                                error={errors.CompanyForEdit}
                                                                touched={touched.CompanyForEdit}
                                                                value={values.CompanyForEdit} isClear={true} />
                                                        </div>


                                                        <div className="linebylineInput valid-input">
                                                            <DropdownMelcous title="ContactName" data={this.state.ContactData} name="ContactNameForEdit"
                                                                selectedValue={this.state.IsEditExpensesWorkFlowItem ? this.state.SelectedContactForEdit : values.ContactNameForEdit} onChange={setFieldValue}
                                                                handleChange={(e) => this.handleChangeDropsForEdit(e, "ContactNameForEdit")}
                                                                onBlur={setFieldTouched}
                                                                error={errors.ContactNameForEdit}
                                                                touched={touched.ContactNameForEdit}
                                                                value={values.ContactNameForEdit} />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                                            <div className={'ui input inputDev ' + (errors.ArrangeContact && touched.ArrangeContact ? 'has-error' : null) + ' '}>
                                                                <input readOnly autoComplete="off" value={values.ArrangeContactForEdit}
                                                                    className="form-control" name="ArrangeContactForEdit" onBlur={(e) => { handleBlur(e) }}
                                                                    onChange={(e) => {
                                                                        handleChange(e)
                                                                    }}
                                                                    placeholder={Resources['numberAbb'][currentLanguage]} />
                                                                {errors.ArrangeContactForEdit && touched.ArrangeContactForEdit ? (<em className="pError">{errors.ArrangeContactForEdit}</em>) : null}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources['description'][currentLanguage]}</label>
                                                            <div className="inputDev ui input">
                                                                <input autoComplete="off" className="form-control"
                                                                    onChange={(e) => {
                                                                        handleChange(e)
                                                                    }} value={values.DescriptionForEdit}
                                                                    name="DescriptionForEdit" placeholder={Resources['description'][currentLanguage]} />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="slider-Btns">
                                                        <button className="primaryBtn-1 btn meduimBtn" type='submit' >{Resources['addTitle'][currentLanguage]}</button>
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </Fragment>

                                {/* {AddContact()} */}
                            </SkyLightStateless>
                        </div>
                        {/* Render Steps */}
                        <div className="step-content">
                            {this.state.CurrStep === 1 ?
                                //  First Step 
                                <Fragment>
                                    <Formik
                                        initialValues={{
                                            ArrangeExpensesWorkFlow: this.state.IsEditMode ? this.state.ExpensesWorkFlowDataForEdit.arrange : MaxArrange,
                                            Subject: this.state.IsEditMode ? this.state.ExpensesWorkFlowDataForEdit.subject : '',
                                            ProjectName: this.state.IsEditMode ? this.state.selectedProject : '',
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={ValidtionSchemaExpensesWorkFlow}

                                        onSubmit={(values, actions) => {
                                            this.saveDocment(values, actions)
                                        }}
                                    >

                                        {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldValue, setFieldTouched }) => (
                                            <Form onSubmit={handleSubmit}>

                                                <div className="document-fields">

                                                    <div className="proForm first-proform">
                                                        <div className='linebylineInput '>
                                                            <label className="control-label">{Resources['subject'][currentLanguage]}</label>
                                                            <div className={"inputDev ui input " + (errors.Subject && touched.Subject ? 'has-error' : null) + ' '}>
                                                                <input autoComplete="off" className="form-control" name="Subject"
                                                                    value={this.state.IsEditMode ? this.state.ExpensesWorkFlowDataForEdit.subject : values.Subject}
                                                                    onBlur={(e) => { handleBlur(e) }}
                                                                    onChange={(e) => {
                                                                        handleChange(e)
                                                                        if (this.state.IsEditMode) {
                                                                            this.setState({ ExpensesWorkFlowDataForEdit: { ...this.state.ExpensesWorkFlowDataForEdit, subject: e.target.value } })
                                                                        }
                                                                    }}
                                                                    placeholder={Resources['subject'][currentLanguage]} />
                                                                {errors.Subject && touched.Subject ? (<em className="pError">{errors.Subject}</em>) : null}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput">
                                                            <label className="control-label"> {Resources['status'][currentLanguage]} </label>
                                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                                <input type="radio" defaultChecked={this.state.ExpensesWorkFlowDataForEdit.status ? 'checked' : null} name="Status" value="true" onChange={(e) => this.setState({ Status: e.target.value })} />
                                                                <label>{Resources['oppened'][currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue ">
                                                                <input type="radio" name="Status" value="false" defaultChecked={this.state.ExpensesWorkFlowDataForEdit.status ? null : 'checked'}
                                                                    onChange={(e) => this.setState({ Status: e.target.value })} />
                                                                <label> {Resources['closed'][currentLanguage]}</label>
                                                            </div>
                                                        </div>

                                                    </div>



                                                    <div className="proForm datepickerContainer">
                                                        <div className="linebylineInput valid-input">
                                                            <DropdownMelcous title="projectName" data={this.state.ProjectList} name="ProjectName"
                                                                selectedValue={this.state.selectedProject} onChange={setFieldValue}
                                                                handleChange={(e) => this.handleChangeDrops(e, "ProjectName")}
                                                                onBlur={setFieldTouched}
                                                                error={errors.ProjectName}
                                                                touched={touched.ProjectName}
                                                                value={values.ProjectName} isClear={true} />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <DatePicker title='docDate' handleChange={this.DocumentDatehandleChange}
                                                                startDate={this.state.IsEditMode ? this.state.ExpensesWorkFlowDataForEdit.creationDate === null ?
                                                                    this.state.DocumentDate : this.state.ExpensesWorkFlowDataForEdit.creationDate
                                                                    : this.state.DocumentDate} />
                                                        </div>



                                                        <div className='linebylineInput'>
                                                            <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                                            <div className={"inputDev ui input" +  (errors.ArrangeExpensesWorkFlow && touched.ArrangeExpensesWorkFlow ? 'has-error' : '') + ''}>
                                                                <input readOnly autoComplete="off" className="form-control" name="ArrangeExpensesWorkFlow"
                                                                    value={this.state.IsEditMode ? this.state.ExpensesWorkFlowDataForEdit.arrange : values.ArrangeExpensesWorkFlow}
                                                                    onBlur={(e) => { handleBlur(e) }}
                                                                    onChange={(e) => {
                                                                        handleChange(e)
                                                                        if (this.state.IsEditMode) {
                                                                            this.setState({ ExpensesWorkFlowDataForEdit: { ...this.state.ExpensesWorkFlowDataForEdit, arrange: e.target.value } })
                                                                        }
                                                                    }}
                                                                    placeholder={Resources['numberAbb'][currentLanguage]} />
                                                                {errors.ArrangeExpensesWorkFlow && touched.ArrangeExpensesWorkFlow ? (<em className="pError">{errors.ArrangeExpensesWorkFlow}</em>) : null}
                                                            </div>
                                                        </div>


                                                    </div>

                                                </div>
                                                <div className="doc-pre-cycle">
                                                    {this.state.btnLoading ?
                                                        <button className="primaryBtn-1 btn disabled">
                                                            <div className="spinner">
                                                                <div className="bounce1" />
                                                                <div className="bounce2" />
                                                                <div className="bounce3" />
                                                            </div>
                                                        </button> :
                                                        <div className="slider-Btns">
                                                            <button className="primaryBtn-1 btn meduimBtn" type='submit'>NEXT STEP</button>
                                                        </div>}
                                                </div>

                                            </Form>
                                        )}
                                    </Formik>
                                </Fragment>

                                :
                                <Fragment>
                                    {this.state.CurrStep === 2 ?
                                        //Second Step
                                        <div className="subiTabsContent feilds__top">

                                            {AddContact()}

                                            <div className="doc-pre-cycle">
                                                <header>
                                                    <h2 className="zero">{Resources['contactList'][currentLanguage]}</h2>
                                                </header>
                                                {dataGrid}
                                            </div>

                                            <div className="doc-pre-cycle">
                                                <div className="slider-Btns">
                                                    <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextStep}>NEXT STEP</button>
                                                </div>
                                                {/* <div className="slider-Btns">
                                                    <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.setState({ FirstStep: true, SecondStepComplate: false, ThirdStepComplate: false ,CurrStep:this.state.CurrStep -1 })}>Last STEP</button>
                                                </div> */}
                                            </div>
                                        </div>
                                        :
                                        //Third Step
                                        <Fragment>
                                            <div className='document-fields'>
                                                <table className="attachmentTable">
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                <div className="headCell tableCell-1">
                                                                    <span> No.</span>
                                                                </div>
                                                            </th>
                                                            <th>
                                                                <div className="headCell tableCell-2">
                                                                    <span>
                                                                        Subject
                                                                </span>
                                                                </div>
                                                            </th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {renderMultiApprovalTable}

                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="doc-pre-cycle">

                                                <div className="slider-Btns">

                                                    <button className="primaryBtn-1 btn meduimBtn" onClick={this.SaveMultiApproval} >Save STEP</button>
                                                </div>
                                            </div>
                                        </Fragment>
                                    }
                                </Fragment>}
                        </div>




                        {/* {this.state.IsEditMode ?
                            <div className="editView__tabs">
                                <div onClick={this.StepOneLink} className={this.state.FirstStep ? "editView__tabs--title active" : "editView__tabs--title "}>
                                    <h3 className="zero">{Resources["schedule"][currentLanguage]}</h3>
                                </div>
                                <div onClick={this.StepTwoLink} className={this.state.SecondStep ? "editView__tabs--title active" : "editView__tabs--title "}>
                                    <h3 className="zero">{Resources["items"][currentLanguage]}</h3>
                                </div>
                            </div>
                            :

                            <div className="docstepper-levels" style={{ boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)', width: '100%', background: '#fff', zIndex: '14' }}>
                                <div class="StepperNum1 StepperNum" style={{ justifyContent: 'center', marginTop: '40px' }}>
                                    <div onClick={this.StepOneLink} data-id="step1" className={'StepNumber ' + (this.state.FirstStep ? "current__step active" : ' active')}>
                                        <div class="StepNum">
                                            <p class="StepN zero" >1</p>
                                            <p class="StepTrue zero">✔</p>
                                        </div>
                                        <div class="stepWord">{Resources["schedule"][currentLanguage]}</div>
                                    </div>
                                    <span class="Step-Line"></span>
                                    <div onClick={this.StepTwoLink} data-id="step2 " className={'StepNumber ' + (this.state.SecondStepComplate ? " active current__step" : " ")}>
                                        <div class="StepNum">
                                            <p class="StepN zero">2</p>
                                            <p class="StepTrue zero">✔</p>
                                        </div>
                                        <div class="stepWord">{Resources["items"][currentLanguage]}</div>
                                    </div>
                                </div>
                            </div>
                        } */}
                        {/* Right Menu */}

                        {idEdit !== 0 ?
                            <div className="editView__tabs">
                                <div onClick={this.StepOneLink} className={this.state.CurrStep == 1 ? "editView__tabs--title active" : "editView__tabs--title "}>
                                    <p className="zero">{Resources.expensesWorkFlow[currentLanguage]}</p>
                                </div>
                                <div onClick={this.StepTwoLink} className={this.state.CurrStep == 2 ? "editView__tabs--title active" : "editView__tabs--title "}>
                                    <p className="zero">{Resources.contacts[currentLanguage]}</p>
                                </div>
                                <div onClick={this.StepThreeLink} className={this.state.CurrStep == 3 ? "editView__tabs--title active" : "editView__tabs--title "}>
                                    <p className="zero">{Resources.multiApproval[currentLanguage]}</p>
                                </div>
                            </div>
                            :
                            <div className="docstepper-levels" style={{ width: '100%', background: '#fff', zIndex: '14' }}>

                                <div class="StepperNum1 StepperNum" style={{ justifyContent: 'center', marginTop: '40px' }}>

                                    <div data-id="step1" className={'StepNumber ' + (this.state.CurrStep == 1 ? "current__step active" : this.state.firstComplete ? "activea" : "")}>
                                        <div class="StepNum">
                                            <p class="StepN zero" >1</p>
                                            <p class="StepTrue zero">✔</p>
                                        </div>
                                        <div class="stepWord">{Resources.expensesWorkFlow[currentLanguage]}</div>
                                    </div>
                                    <span class="Step-Line"></span>

                                    <div data-id="step1" className={'StepNumber ' + (this.state.CurrStep == 2 ? "current__step active" : this.state.secondComplete ? "activea" : "")}>
                                        <div class="StepNum">
                                            <p class="StepN zero" >2</p>
                                            <p class="StepTrue zero">✔</p>
                                        </div>
                                        <div class="stepWord">{Resources.contacts[currentLanguage]}</div>
                                    </div>
                                    <span class="Step-Line"></span>

                                    <div data-id="step1" className={'StepNumber ' + (this.state.CurrStep == 3 ? "current__step active" : "")}>
                                        <div class="StepNum">
                                            <p class="StepN zero" >3</p>
                                            <p class="StepTrue zero">✔</p>
                                        </div>
                                        <div class="stepWord">{Resources.multiApproval[currentLanguage]}</div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessage'][currentLanguage].content}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                        />
                    ) : null}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    let sState = state;
    return sState;
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AdminstrationActions, dispatch)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)
    (ExpensesWorkFlowAddEdit))