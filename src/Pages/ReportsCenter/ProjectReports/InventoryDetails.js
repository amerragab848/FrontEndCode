

import CryptoJS from "crypto-js";

import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export"; 
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";

import Dataservice from '../../../Dataservice';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Api from '../../../api';
import { __esModule } from 'material-ui/svg-icons/image/flash-on';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

const ValidtionSchema = Yup.object().shape({
    selectedProject: Yup.string()
        .required(Resources['projectSelection'][currentLanguage])
        .nullable(true),
});

class InventoryDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            ProjectsData: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: "0" },
            RowsParent: [],
            RowsChilds: [],
            Description: '',
            ResourceCode: '',
            AllRows: [],
            pageSize: 200,
        }

        if (!Config.IsAllow(3689)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }
        this.GetCellActions = this.GetCellActions.bind(this);
        this.columns = [
            {
                field: "projectName",
                title: Resources["projectName"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
                onClick: (cell) => {
                    this.setState({ isLoading: true })
                    let RowsChilds = []
                    this.state.RowsChilds.map(i => {
                        if (i.parentId === cell.id) {
                            RowsChilds.push(i)
                        }
                    })
                    setTimeout(() => {
                        this.setState({ RowsChilds, isLoading: false, })
                    }, 200);
                }
            }, {
                field: "itemCode",
                title: Resources["itemCode"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }, {
                field: "quantity",
                title: Resources["quantity"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }, {
                field: "unitPrice",
                title: Resources["unitPrice"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }, {
                field: "resourceCode",
                title: Resources["resourceCode"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }, {
                field: "total",
                title: Resources["total"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }
        ];

        this.rowActions = [
            {
                title: 'Itemization',
                handleClick: value => {
                    let obj = {
                        id: value.id,
                        boqId: value.boqId,
                        projectId: this.state.projectId,
                        projectName: this.state.projectName
                    };
                    let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
                    let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
                    this.props.history.push({ pathname: "/Itemize", search: "?id=" + encodedPaylod });
                }
            }
        ];

    }
  
    GetCellActions(column, row) {
        if (column.key === 'BtnActions') {
            return [{
                icon: "fa fa-pencil"
                , callback: (e) => {
                    alert(row.id)
                }
            }];
        }
    }

    componentWillMount() {
        Dataservice.GetDataList('ProjectProjectsGetAll', 'projectName', 'projectId').then(
            result => {
                this.setState({
                    ProjectsData: result
                })
            }).catch(() => {
                toast.error('somthing wrong')
            })
    }

    getGridRows = () => {
        this.setState({ isLoading: true })

        let obj = {
            projectId: this.state.selectedProject.value,
            description: this.state.Description, resourceCode: this.state.ResourceCode
        }

        Api.post('GetMaterialInventoryDetails', obj).then(
            res => {
                let RowsChilds = []
                let RowsParent = []
                res.map(i => {
                    if (i.parentId === null) {
                        RowsParent.push(i)
                    }
                    else {
                        RowsChilds.push(i)
                    }
                })
                this.setState({
                    AllRows: res, RowsParent, RowsChilds, isLoading: false
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }
 
    render() {

        const DataGridChilds = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                key="BudgetCashFlowReport"
                data={this.state.RowsChilds}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const DataGridParent = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                key="BudgetCashFlowReport"
                data={this.state.RowsParent}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={this.rowActions}
                rowClick={() => { }} 
                cells={this.columns} />) : <LoadingSection />

        let Exportcolumns = this.columns.filter(s => s.key !== 'BtnActions')
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.RowsParent : []} columns={Exportcolumns} fileName={'inventoryDetails'} />
            : null

        const btnExportChild = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.RowsChilds : []} columns={Exportcolumns} fileName={'inventoryDetails'} />
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.inventoryDetails[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <Formik
                    initialValues={{
                        selectedProject: '',
                    }}
                    enableReinitialize={true}
                    validationSchema={ValidtionSchema}
                    onSubmit={(values, actions) => {
                        this.getGridRows()
                    }}>

                    {({ errors, touched, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} className="proForm reports__proForm">
                            <div className="linebylineInput valid-input">
                                <Dropdown title='Projects' data={this.state.ProjectsData} name='selectedProject'
                                    selectedValue={this.state.selectedProject} onChange={setFieldValue}
                                    handleChange={e => this.setState({ selectedProject: e })}
                                    onBlur={setFieldTouched}
                                    error={errors.selectedProject}
                                    touched={touched.selectedProject}
                                    value={values.selectedProject} />
                            </div>
                            <div className="linebylineInput valid-input">
                                <label className="control-label">{Resources['description'][currentLanguage]}</label>
                                <div className="inputDev ui input">
                                    <input autoComplete="off" className="form-control" value={this.state.Description}
                                        onChange={(e) => this.setState({ Description: e.target.value })}
                                        name="revisions" placeholder={Resources['description'][currentLanguage]} />
                                </div>
                            </div>

                            <div className="linebylineInput valid-input">
                                <label className="control-label">{Resources['resourceCode'][currentLanguage]}</label>
                                <div className="inputDev ui input">
                                    <input autoComplete="off" className="form-control" value={this.state.ResourceCode}
                                        onChange={(e) => this.setState({ ResourceCode: e.target.value })}
                                        placeholder={Resources['resourceCode'][currentLanguage]} />
                                </div>
                            </div>


                            <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>


                        </Form>
                    )}
                </Formik>
                <div className="doc-pre-cycle letterFullWidth">
                    {DataGridParent}
                </div>
                <div className=" fullWidthWrapper textRight">
                    {btnExportChild}
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {DataGridChilds}
                </div>
            </div>
        )
    }

}
export default withRouter(InventoryDetails)




