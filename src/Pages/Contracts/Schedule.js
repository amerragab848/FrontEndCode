import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Resources from "../../resources.json";
import ReactTable from "react-table";
import moment from "moment";
import dataservice from "../../Dataservice";
import Config from "../../Services/Config.js";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from "react-toastify";
import Dropdown from '../../Componants/OptionsPanels/DropdownMelcous';
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import Api from "../../api.js";
import Export from "../../Componants/OptionsPanels/Export";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const _ = require('lodash')
const TabTwoSchema = Yup.object().shape({
    ProjectSchedule: Yup.string().required(Resources['selectProjectSchedule'][currentLanguage])
});

const TabOneSchema = Yup.object().shape({
    description: Yup.string().required(Resources['descriptionRequired'][currentLanguage]),
    arrange: Yup.number().required(Resources['arrangeRequired'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]).min(0, Resources['onlyNumbers'][currentLanguage]),
    taskId: Yup.string().required(Resources['taskIdRequired'][currentLanguage])
})

class Schedule extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ApiDelete: this.props.ApiDelete,
            Api: this.props.Api,
            ApiGet: this.props.ApiGet,
            ScheduleLsit: [],
            docId: this.props.contractId,
            ProjectScheduleDrop: [],
            ProjectScheduleFillData: [],
            projectId: this.props.projectId,
            showDeleteModal: false,
            selectedId: 0,
            TabActive: 0,
            StartDate: moment(),
            FinishDate: moment(),
            selectedProjectSchedule: { label: Resources.selectProjectSchedule[currentLanguage], value: "0" },
            BtnLoading: false,
        }
    }

    ConfirmDelete = () => {
        this.setState({ isLoading: true })

        dataservice.addObject(this.state.ApiDelete + this.state.selectedId).then((res) => {

            let originalRows = this.state.ScheduleLsit

            let data = originalRows.filter(r => r.id !== this.state.selectedId);

            this.setState({
                ScheduleLsit: data,
                showDeleteModal: false,
                isLoading: false,
            });

            toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)

        }).catch(ex => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({
                isLoading: false,
            })
        });
    }

    componentWillMount = () => {

        dataservice.GetDataGrid(this.state.ApiGet).then(result => {
            this.setState({
                ScheduleLsit: result
            })
        })

        dataservice.GetDataGrid('ProjectScheduleGetForList?projectId=' + this.state.projectId + '&pageNumber=0&pageSize=1000000').then(result => {

            let data = [];

            result.forEach(item => {
                var obj = {};
                obj.label = item["subject"];
                obj.value = item["id"];
                data.push(obj);
            });

            this.setState({
                ProjectScheduleDrop: data,
                ProjectScheduleFillData: result
            })
        })
    }

    onCloseModal() {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerDeleteRowsMain = selectedRows => {
        this.setState({
            showDeleteModal: true,
            selectedId: selectedRows
        });
    }

    SaveSchedule = (values) => {
        this.setState({
            BtnLoading: true
        });

        let typeColumn = this.props.type;

        if (this.state.TabActive === 0) {


            let AddObj = {
                [typeColumn]: this.state.docId,
                arrange: values.arrange,
                taskId: values.taskId,
                description: values.description,
                startDate: this.state.StartDate,
                finishDate: this.state.FinishDate,
            }

            dataservice.addObject(this.state.Api, AddObj).then(
                res => {
                    this.setState({
                        ScheduleLsit: res,
                        isLoading: false,
                        BtnLoading: false,
                    })
                    toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
                }).catch(ex => {
                    toast.error(Resources["operationCanceled"][currentLanguage]);
                    this.setState({
                        isLoading: false,
                        BtnLoading: false,
                    })
                });
        }
        else {

            let selectedProjectScheduleItem = this.state.ProjectScheduleFillData.find(s => s.id === this.state.selectedProjectSchedule.value);

            const objDocument = {
                //field
                id: 0,
                [typeColumn]: this.state.docId,
                projectTaskId: selectedProjectScheduleItem.id,
                startDate: selectedProjectScheduleItem.startDate,
                finishDate: selectedProjectScheduleItem.finishDate,
                description: selectedProjectScheduleItem.subject
            };

            dataservice.addObject(this.state.Api, objDocument).then(
                res => {
                    this.setState({
                        ScheduleLsit: res,
                        isLoading: false,
                        BtnLoading: false,
                        selectedProjectSchedule: { label: Resources.selectProjectSchedule[currentLanguage], value: "0" },
                    })
                    toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
                }).catch(ex => {
                    toast.error(Resources["operationCanceled"][currentLanguage]);
                    this.setState({
                        isLoading: false,
                        BtnLoading: false,
                    })
                });
        }
    }

    render() {

        let columns = [
            {
                Header: Resources["action"][currentLanguage],
                accessor: "id",
                Cell: ({ row }) => {
                    return (
                        <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.clickHandlerDeleteRowsMain(row.id)}>
                            <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                        </div>
                    );
                },
                width: 70
            },
            {
                Header: Resources['arrange'][currentLanguage],
                accessor: 'arrange',
                width: 100,
            }, {
                Header: Resources['taskId'][currentLanguage],
                accessor: 'taskId',
                width: 200,
            }, {
                Header: Resources['description'][currentLanguage],
                accessor: 'description',
                width: 200,
            }, {
                Header: Resources["startDate"][currentLanguage],
                accessor: "startDate",
                width: 180,
                sortabel: true,
                Cell: row => (
                    <span>
                        <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                    </span>
                )
            }, {
                Header: Resources["finishDate"][currentLanguage],
                accessor: "finishDate",
                width: 180,
                sortabel: true,
                Cell: row => (
                    <span>
                        <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                    </span>
                )
            }
        ]

        let ExportColumns = [
            { key: 'arrange', name: Resources['arrange'][currentLanguage] },
            { key: 'taskId', name: Resources['taskId'][currentLanguage] },
            { key: 'description', name: Resources['description'][currentLanguage] },
            { key: 'startDate', name: Resources['startDate'][currentLanguage] },
            { key: 'finishDate', name: Resources['finishDate'][currentLanguage] }, ,
        ]

        return (
            <div className="doc-pre-cycle">
                <div className="document-fields">
                    <Formik

                        initialValues={{
                            description: '',
                            arrange: this.state.ScheduleLsit.length ? this.state.ScheduleLsit.length + 1 : 1,
                            ProjectSchedule: '',
                            taskId: ''
                        }}
                        enableReinitialize={true}
                        validationSchema={this.state.TabActive == 0 ? TabOneSchema : TabTwoSchema}

                        onSubmit={(values) => { this.SaveSchedule(values) }}>

                        {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange, values }) => (
                            <Form id="signupForm1" className="proForm datepickerContainer customProform" noValidate="novalidate" >

                                <header>
                                    <h2 className="zero">{Resources['scheduleAdd'][currentLanguage]}</h2>
                                </header>

                                <div className="proForm first-proform letterFullWidth radio__only">
                                    <div className="linebylineInput valid-input">
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="status" defaultChecked={values.status === false ? null : 'checked'} value="true" onChange={e => this.setState({ TabActive: 0 })} />
                                            <label>{Resources.normal[currentLanguage]}</label>
                                        </div>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="status" defaultChecked={values.status === false ? 'checked' : null} value="false" onChange={e => this.setState({ TabActive: 1 })} />
                                            <label>{Resources.projectSchedule[currentLanguage]}</label>
                                        </div>
                                    </div>
                                </div>

                                {this.state.TabActive == 0 ?
                                    <div className="proForm datepickerContainer">
                                        <div className="proForm first-proform letterFullWidth proForm_onlyChild">

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.description[currentLanguage]}</label>
                                                <div className={"inputDev ui input " + (errors.description ? 'has-error' : !errors.description && touched.description ? (" has-success") : " ")}>
                                                    <input type="text" className="form-control" id="description" value={values.description}
                                                        name="description" placeholder={Resources.description[currentLanguage]}
                                                        onBlur={(e) => {
                                                            handleChange(e)
                                                            handleBlur(e)
                                                        }}
                                                        onChange={handleChange} />
                                                    {errors.description ? (<em className="pError">{errors.description}</em>) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                            <div className={"inputDev ui input " + (errors.arrange ? 'has-error' : !errors.arrange && touched.arrange ? (" has-success") : " ")}>
                                                <input type="text" className="form-control" id="arrange" value={values.arrange} onBlur={handleBlur}
                                                    onChange={handleChange} name="arrange" placeholder={Resources.arrange[currentLanguage]} />
                                                {errors.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources.taskId[currentLanguage]}</label>
                                            <div className={"ui input inputDev" + (errors.taskId && touched.taskId ? (" has-error") : "ui input inputDev")} >
                                                <input type="text" className="form-control" id="taskId"
                                                    value={values.taskId}
                                                    name="taskId"
                                                    placeholder={Resources.taskId[currentLanguage]}
                                                    onBlur={(e) => {
                                                        handleChange(e)
                                                        handleBlur(e)
                                                    }}
                                                    onChange={handleChange} />
                                                {touched.taskId ? (<em className="pError">{errors.taskId}</em>) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <div className="inputDev ui input">
                                                <DatePicker title='startDate' handleChange={e => this.setState({ StartDate: e })} startDate={this.state.StartDate} />
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <div className="inputDev ui input">
                                                <DatePicker title='finishDate' handleChange={e => this.setState({ FinishDate: e })} startDate={this.state.FinishDate} />
                                            </div>
                                        </div>
                                    </div> :
                                    <div className="linebylineInput valid-input">
                                        <Dropdown title='projectSchedule' data={this.state.ProjectScheduleDrop} selectedValue={this.state.selectedProjectSchedule}
                                            handleChange={e => this.setState({ selectedProjectSchedule: e })}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.ProjectSchedule} touched={touched.ProjectSchedule}
                                            name="ProjectSchedule" index="ProjectSchedule" />
                                    </div>
                                }
                                <div className={"slider-Btns fullWidthWrapper textLeft "}>
                                    {this.state.BtnLoading === false ?
                                        <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? 'disNone' : '')} type="submit" disabled={this.state.isApproveMode}  >{Resources['add'][currentLanguage]}</button>
                                        :
                                        <button className="primaryBtn-1 btn  disabled" disabled="disabled">
                                            <div className="spinner">
                                                <div className="bounce1" />
                                                <div className="bounce2" />
                                                <div className="bounce3" />
                                            </div>
                                        </button>
                                    }
                                </div>
                            </Form>
                        )}
                    </Formik>
                    <header>
                        <h2 className="zero">{Resources['scheduleList'][currentLanguage]}</h2>
                    </header>
                    <div className="filterBTNS exbortBtn">
                        <Export rows={this.state.ScheduleLsit}
                            columns={ExportColumns} fileName={Resources['scheduleList'][currentLanguage]} />
                    </div>
                    <ReactTable ref={(r) => { this.selectTable = r; }} filterable
                        data={this.state.ScheduleLsit} columns={columns} defaultPageSize={10}
                        minRows={2} noDataText={Resources['noData'][currentLanguage]} />
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
        )
    }
}
export default withRouter(Schedule)

