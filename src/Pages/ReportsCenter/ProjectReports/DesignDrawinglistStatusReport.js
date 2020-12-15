import React, { Component } from 'react';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous';
import Resources from '../../../resources.json';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import dataService from '../../../Dataservice'
import { toast } from "react-toastify";
import Config from "../../../Services/Config.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../../store/actions/communication';
import HeaderDocument from '../../../Componants/OptionsPanels/HeaderDocument'
import moment from "moment";
import Export from "../../../Componants/OptionsPanels/Export";
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import Api from "../../../api";
import CryptoJS from "crypto-js";
import { withRouter } from "react-router-dom";


let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');


class DesignDrawinglistStatusReport extends Component {
    constructor(props) {
        super(props)
        this.columnsGrid = [
            {
                field: "statusName",
                title: Resources["status"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: true,
                sortable: true,
                type:"text"
            },
            {
                field: "subject",
                title: Resources["subject"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: true,
                sortable: true,
                type:"text"
            },
            {
                field: "docDate",
                title: Resources["docDate"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                sortable: true,
                type:"date"
            },
            {
                field: "openedBy",
                title: Resources["openedBy"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                sortable: true,
                type:"text"
            },
            {
                field: "submittedFor",
                title: Resources["submittedFor"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                sortable: true,
                type:"text"
            },
            {
                field: "drawingSubject",
                title: Resources["drawingSubject"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                sortable: true,
                type:"text"
            },
            {
                field: "drawingScale",
                title: Resources["drawingScale"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                sortable: true,
                type:"text"
            },
            {
                field: "paper",
                title: Resources["paper"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                sortable: true,
                type:"text"
            },
            {
                field: "drawingReference",
                title: Resources["drawingReference"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                sortable: true,
                type:"text"
            },
            {
                field: "estimatedTime",
                title: Resources["estimatedTime"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                sortable: true,
                type:"text"
            },
            {
                field: "disciplineName",
                title: Resources["discipline"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                sortable: true,
                type:"text"
            },
            {
                field: "projectName",
                title: Resources["projectName"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                sortable: true,
                type:"text"
            },
            {
                field: "lastWorkFlow",
                title: Resources["lastWorkFlow"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                sortable: true,
                type:"text"
            },
            {
                field: "durationDays",
                title: Resources["durationDays"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                sortable: true,
                type:"number"
            },{
                field: "closedDate",
                title: Resources["docClosedate"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                sortable: true,
                type:"date"
            },
            {
                field: "lastSentDate",
                title: Resources["lastSentDate"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                sortable: true,
                type:"text"
            },
            {
                field: "lastSentTime",
                title: Resources["lastSentTime"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                sortable: true,
                type:"text"
            },
            {
                field: "lastApproveDate",
                title: Resources["lastApproveDate"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                sortable: true,
                type:"date"
            },
            {
                field: "lastApproveTime",
                title: Resources["lastApproveTime"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                sortable: true,
                type:"text"
            }
        ];
        this.state = {
            isLoading: false,
            projects: [],
            selectedProjects: { label: Resources.projectSelection[currentLanguage], value: "0" },
            rows: [],
            pageSize: 200,
        }
        if (!Config.IsAllow(305)) {
            toast.warning(Resources['missingPermissions'][currentLanguage])
            this.props.history.push('/');
        }
        this.GetCellActions = this.GetCellActions.bind(this);
    }

    GetCellActions(column, row) {
        if (column.key === 'BtnActions') {
            return [{
                icon: "fa fa-pencil",
                callback: (e) => {
                    alert(row.id)
                }
            }];
        }
    }

    componentDidMount() {
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
        this.setState({
            selectProjects: { label: Resources.projectSelection[currentLanguage], value: "0" },
        });
    }

    search = (values) => {
           let ids=[]
           for(let i =0;i< values.selectedProjects.length;i++)
           {
            ids.push(values.selectedProjects[i].value);
           };
               
        this.setState({ isLoading: true })
        Api.post("GetDesignDrawingListStatusReportData",ids).then(result => {
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
        const btnExport = this.state.isLoading === false ?
            (
                this.state.rows.length > 0 ? <Export
                    rows={this.state.isLoading === false ? this.state.rows : []}
                    columns={this.columnsGrid}
                    fileName={Resources.DesignDrawinglistStatusReport[currentLanguage]}
                /> : null
            ) : null;
            const dataGrid = this.state.isLoading === false ?
            (
                this.state.rows.length > 0 ?
                <GridCustom 
                     cells={this.columnsGrid}
                     data={this.state.rows}
                     groups={[]} 
                     pageSize={50}  
                     pageSize={50} 
                     actions={[]} 
                     rowActions={[]} 
                     rowClick={cell => {
                        if (cell.designDrawingListId != 0) {
                            if (Config.IsAllow(304) || Config.IsAllow(302)) 
                            {
                                let addView = "drawingListAddEdit";
                                    let obj = {
                                      docId: cell.designDrawingListId,
                                      projectId: cell.projectId,
                                      projectName: cell.projectName,
                                      arrange: 0,
                                      docApprovalId: 0,
                                      isApproveMode: false,
                                      perviousRoute: window.location.pathname + window.location.search
                                    };
                                    let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
                                    let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
                                    this.props.history.push({ pathname: "/" + addView, search: "?id=" + encodedPaylod });
                        }
                      }
                    }
                }
                     
                     />  : null
            ) : (
                <LoadingSection />
            );

            return (
                <div className="reports__content">
                    <header>
                        <h2 className="zero">{Resources.DesignDrawinglistStatusReport[currentLanguage]}</h2>
                          {btnExport}
                    </header>
                    <Formik
                    initialValues={{
                        selectedProjects: '',
                    }}
                    enableReinitialize={true}
                    onSubmit={(values) => {
                        this.search(values)
                    }}>
                    {({ errors, touched, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                         <Form onSubmit={handleSubmit} className="proForm reports__proForm">
                             <div className="linebylineInput valid-input">
                                <Dropdown title='Projects' 
                                    data={this.state.projects} 
                                    isMulti={true}
                                    name='selectedProjects'
                                    selectedValue={this.state.selectedProjects}
                                    onChange={setFieldValue}
                                    handleChange={e => { this.handleChangeDropDown(e)}}
                                    onBlur={setFieldTouched}
                                    error={errors.selectedProjects}
                                    touched={touched.selectedProjects}
                                    value={values.selectedProjects} />
                             </div>
                             <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                         </Form>
                     )}
                    </Formik>
                    <div className="doc-pre-cycle letterFullWidth">
                       {dataGrid}
                     </div>
                </div>  
            );
            
    }
}



export default withRouter(DesignDrawinglistStatusReport)
