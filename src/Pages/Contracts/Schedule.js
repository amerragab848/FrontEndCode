import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Resources from "../../resources.json";
import ReactTable from "react-table";
import moment from "moment";
import dataservice from "../../Dataservice";
import Config from "../../Services/Config.js";
import CryptoJS from "crypto-js";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from "react-toastify";
import Dropdown from '../../Componants/OptionsPanels/DropdownMelcous';
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import Api from "../../api.js";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const fromContractSchema = Yup.object().shape({
    fromContract: Yup.string().required(Resources['selectConditions'][currentLanguage])
});

const conditionSchema = Yup.object().shape({
    description: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    arrange: Yup.number().required(Resources['arrangeRequired'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]).min(0, Resources['onlyNumbers'][currentLanguage]),
});

class Schedule extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ScheduleLsit: [],
            //contractId:this.props.contractId
            contractId: 4664,
            ProjectScheduleDrop: [],
            ProjectScheduleFillData: [],
            SelectedProjectSchedule: {},
            projectId: 2,
            showDeleteModal: false,
            selectedId:0
        }
    }

    ConfirmDelete = () => {
        this.setState({ isLoading: true })

        Api.post('DeleteContractsScheduleById?id='+this.state.selectedId+'').then((res) => {

            let originalRows = this.state.ScheduleLsit
            let data=originalRows = originalRows.filter(r => r.id !==  this.state.selectedId);
            this.setState({
                ScheduleLsit: data,
                showDeleteModal: false,
                isLoading: false,
            })
            toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)

        }).catch(ex => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({
                isLoading: false,
            })
        });


    }

    componentWillMount = () => {

        dataservice.GetDataGrid('GetScheduleItemsByContractId?contractId=' + this.state.contractId + '').then(
            res => {
                this.setState({
                    ScheduleLsit: res
                })
            }
        )

        Api.get('ProjectScheduleGet?projectId=' + this.state.projectId + '&pageNumber=0&pageSize=1000000').then(
            result => {
                let Data = []
                result.data.map(i => {
                    var obj = {};
                    obj.label = i.subject;
                    obj.value = i.id;
                    Data.push(obj);
                })
                this.setState({
                    ProjectScheduleFillData: result,
                    ProjectScheduleDrop: Data
                })
            }
        )

        dataservice.GetDataList('ProjectScheduleGet?projectId=' + this.state.projectId + '&pageNumber=0&pageSize=1000000', '', '').then(
            res => {
                this.setState({
                    SelectedProjectSchedule: res
                })
            }
        )
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
                width: 350,
            }, {
                Header: Resources['description'][currentLanguage],
                accessor: 'description',
                width: 350,
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

        return (
            <div className="mainContainer">
                <div className="doc-pre-cycle">
                {/* {contractContent} */}
                    <header>
                        <h2 className="zero">{Resources['scheduleList'][currentLanguage]}</h2>
                    </header>
                    <ReactTable
                        ref={(r) => {
                            this.selectTable = r;
                        }}
                        data={this.state.ScheduleLsit}
                        columns={columns}
                        defaultPageSize={10}
                        minRows={2}
                        noDataText={Resources['noData'][currentLanguage]}
                    />
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

