import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Api from "../../../api";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import Resources from "../../../resources.json";
import Config from '../../../Services/Config'
import ConfirmationModal from "../../../Componants/publicComponants/ConfirmationModal"
import CryptoJS from 'crypto-js'
import { toast } from "react-toastify";
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import SkyLight from 'react-skylight';
import dataservice from "../../../Dataservice";
import Recycle from '../../../Styles/images/attacheRecycle.png'
import HeaderDocument from "../../../Componants/OptionsPanels/HeaderDocument";
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";

let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
const validationSchema = Yup.object().shape({
    Project: Yup.string().required(Resources['pleaseSelectProjectManagerContact'][currentLanguage]),
})
var epsId = 0
var epsName = ''
class Index extends Component {
    constructor(props) {
        super(props);
        const query = new URLSearchParams(this.props.location.search);
        let index = 0;
        for (let param of query.entries()) {
            if (index == 0) {
                try {
                    let obj = JSON.parse(CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8));
                    epsId = obj.epsId;
                    epsName = obj.epsName;
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }
        const columnsGrid = [
            {
                field: 'job',
                title: Resources['job'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: 'projectName',
                title: Resources['projectName'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'statusName',
                title: Resources['projectStatus'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }
        ];
       this.state = {
            epsId: epsId,
            epsName: epsName,
            showModal: false,
            saveLoading: false,
            currentComponent: '',
            currentTitle: '',
            columns: columnsGrid.filter(column => column.visible !== false),
            isLoading: false,
            rows: [],
            selectedExceptProject: { label: Resources.projectSelection[currentLanguage], value: "0" },
            accountsDataList: [],
            accountsData: [],
            selectedAccounts: []

        };
        this.rowActions = [
            {
                title: 'Delete',
                handleClick: value => {
                   this.clickHandlerDeleteRowsMain(value.id)
                }
            },
            {
                title: 'Merge Projects',
                handleClick: value => {
                    if (!Config.IsAllow(522)) {
                        toast.success(Resources["missingPermissions"][currentLanguage]);
                    }
                    else {
                        this.setState({selectedprojectId:value.id, currentComponent: 'mergeProjects', currentTitle: 'mergeProjects' })
                        dataservice.GetDataList('ProjectProjectsGetAllExceptprojectId?projectId=' + value.id, 'projectName', 'id').then(result => {
                            this.simpleDialog.show()
                            this.setState({
                                showModal: true, exceptProjects: result, isLoading: false
                            });
                        })
                    }
                }
            },
            {
                title:'Change Eps',
                handleClick:value=>{

                }
            },
            {
                title:'Add Accounts',
                handleClick:value=>{
                    if (!Config.IsAllow(522)) {
                        toast.success(Resources["missingPermissions"][currentLanguage]);
                    }
                    else {
                        this.setState({selectedprojectId:value.id, isLoading: true, currentComponent: 'addAccounts', currentTitle: 'selectAccounts' })
                        dataservice.GetDataList('GetAccountsNotAssignProject?projectId=' + value.id, 'contactName', 'accountId').then(res => {
                            this.setState({ accountsData: res, isLoading: false })
                        })
                        this.setState({ isLoading: true })
                        Api.get("GetAccountsProjectsByProjectId?projectId=" + value.id).then(res =>
                            this.setState({
                                accountsDataList: res,
                                LoadingTable: true,
                                isLoading: false,
                                showModal: true,
                                rowId: '',
                                index: ''
                            })).catch(() => {
                                this.setState({
                                    accountsDataList: [],
                                    isLoading: false
                                })
                                toast.error(Resources["operationCanceled"][currentLanguage]);
                            })
                        this.setState({ LoadingTable: false })
                        this.simpleDialog.show()
                    }
                }
            }
        ]
   
        this.Actions = [
            {
                icon: "fa fa-pencil",
                actions: [
                    {
                        text: 'Merge Projects',

                        callback: () => {
                            if (!Config.IsAllow(522)) {
                                toast.success(Resources["missingPermissions"][currentLanguage]);
                            }
                            else {
                                this.setState({ currentComponent: 'mergeProjects', currentTitle: 'mergeProjects' })
                                dataservice.GetDataList('ProjectProjectsGetAllExceptprojectId?projectId=' + this.state.selectedprojectId, 'projectName', 'id').then(result => {
                                    this.simpleDialog.show()
                                    this.setState({
                                        showModal: true, exceptProjects: result, isLoading: false
                                    });
                                })
                            }

                        }
                    }, {
                        text: "Change Eps",
                        callback: () => {

                        }
                    }, {
                        text: "Add Accounts",
                        callback: () => {
                            if (!Config.IsAllow(522)) {
                                toast.success(Resources["missingPermissions"][currentLanguage]);
                            }
                            else {
                                this.setState({ isLoading: true, currentComponent: 'addAccounts', currentTitle: 'selectAccounts' })
                                dataservice.GetDataList('GetAccountsNotAssignProject?projectId=' + this.state.selectedprojectId, 'contactName', 'accountId').then(res => {
                                    this.setState({ accountsData: res, isLoading: false })
                                })
                                this.setState({ isLoading: true })
                                Api.get("GetAccountsProjectsByProjectId?projectId=" + this.state.selectedprojectId).then(res =>
                                    this.setState({
                                        accountsDataList: res,
                                        LoadingTable: true,
                                        isLoading: false,
                                        showModal: true,
                                        rowId: '',
                                        index: ''
                                    })).catch(() => {
                                        this.setState({
                                            accountsDataList: [],
                                            isLoading: false
                                        })
                                        toast.error(Resources["operationCanceled"][currentLanguage]);
                                    })
                                this.setState({ LoadingTable: false })
                                this.simpleDialog.show()
                            }
                        }
                    }
                ]
            }

        ];
    }
    getCellActions = (column, row) => {
        const cellActions = {
            customBtn1: this.Actions
        };
        return cellActions[column.key];
    }

    componentDidMount() {
        if (Config.IsAllow(522)) {
            this.setState({ isLoading: true })
            try {
                Api.get('ProjectProjectsSelectByEps?epsId=' + this.state.epsId + '&pageNumber=0&pageSize=200').then(result => {
                    this.setState({
                        rows: result,
                        isLoading: false,
                    });
                })
            } catch {
                this.setState({ rows: [], isLoading: false });
                toast.error(Resources["operationCanceled"][currentLanguage]);
            }

        }

        else
            toast.success(Resources["missingPermissions"][currentLanguage]);
    }
    addAcounts = (items) => {
        let selectedAccounts = [];
        items.forEach(item => selectedAccounts.push(item.value))
        this.setState({ selectedAccounts })
    }
    saveAccounts = () => {
        this.setState({ saveLoading: true })
        Api.post('AddProjectsAccountsList?projectId=' + this.state.selectedprojectId, this.state.selectedAccounts).then(() => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.setState({ showModal: false, saveLoading: false, selectedAccounts: [] })
        }).catch((ex) => {
            this.setState({ showModal: false, saveLoading: false, selectedAccounts: [] })
            toast.error(Resources["operationCanceled"][currentLanguage]);
        })
    }
    deleteAccount = (rowId, index) => {
        this.setState({
            showDeleteModal: true,
            rowId: rowId,
            index: index
        })
    }

    mergeTwoProject = () => {
        this.setState({ saveLoading: true })
        Api.get('MergeTwoProjects?oldProjectId=' + this.state.selectedprojectId + '8&newProjectId=' + this.state.selectedExceptProject.value).then(() => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.setState({
                showModal: false, saveLoading: false,
                selectedExceptProject: { label: Resources.projectSelection[currentLanguage], value: "0" }
            })
        }).catch((ex) => {
            this.setState({ showModal: false, saveLoading: false })
            toast.error(Resources["operationCanceled"][currentLanguage]);
        })
    }
    onRowClick = (value, index, column) => {
        let id = value['id']
        if (column.key === 'customBtn1') {
            this.setState({ selectedprojectId: id })
        }
        else if (!Config.IsAllow(11)) {
            toast.warning("you don't have permission");
        }
        else if (column.key !== 'select-row') {
            let obj = {
                docId: id,
                epsId: this.state.epsId
            };
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
            this.props.history.push({
                pathname: "/projectsAddEdit",
                search: "?id=" + encodedPaylod
            });
        }
    }
    onRowClick = (value) => {
        let id = value['id']
         if (!Config.IsAllow(11)) {
            toast.warning("you don't have permission");
        }
        else {
            let obj = {
                docId: id,
                epsId: this.state.epsId
            };
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
            this.props.history.push({
                pathname: "/projectsAddEdit",
                search: "?id=" + encodedPaylod
            });
        }
    }

    addRecord = () => {
        if (Config.IsAllow(1256)) {
            let obj = {
                docId: 0,
                epsId: this.state.epsId
            };
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
            this.props.history.push({
                pathname: "/projectsAddEdit",
                search: "?id=" + encodedPaylod
            });
        }
        else
            toast.warning("you don't have permission");
    }
    clickHandlerDeleteRowsMain = selectedRows => {
        this.setState({
            showDeleteModal: true,
            selectedRowId: selectedRows
        });
    };
    onCloseModal() {
        this.setState({
            showDeleteModal: false
        });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };
    confirmDelete = () => {
        if (this.state.showModal) {
            const themData = this.state.accountsDataList;
            themData.splice(this.state.index, 1);
            this.setState({
                accountsDataList: themData
            });
            this.setState({ showDeleteModal: false, isLoading: true })
            Api.post("DeleteAccountsProjects?id=" + this.state.selectedRowId).then(() => {
                this.setState({ isLoading: false })
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }
            ).catch(ex => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({
                    showDeleteModal: false, isLoading: false
                });
            });
        }
        else {
            this.setState({ showDeleteModal: true })
            if (Config.IsAllow(522)) {
                let newRows = []
                let selectedRow = {}
                this.state.rows.forEach(element => {
                    if (element.id == this.state.selectedRowId)
                        selectedRow = element
                    else
                        newRows.push(element)
                })
                this.setState({ showDeleteModal: false, isLoading: true })
                Api.post('ProjectProjectsDelete?id=' + this.state.selectedRowId)
                    .then(result => {
                        this.setState({
                            rows: newRows,
                            isLoading: false,
                            IsActiveShow: false
                        });
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }).catch(ex => {
                        toast.error(Resources["operationCanceled"][currentLanguage]);
                        this.setState({
                            showDeleteModal: false,
                            IsActiveShow: false,
                            isLoading: false

                        })
                    })

            }

            else
                toast.success(Resources["missingPermissions"][currentLanguage]);
        }
    }

    render() {
        let RenderTable = this.state.accountsDataList.map((item, index) => {
            return (
                <tr key={item.id}>
                    <td className="removeTr">
                        <div className="contentCell tableCell-1">
                            <span className="pdfImage" onClick={() => this.deleteAccount(item.id, index)}>
                                <img src={Recycle} alt="pdf" />
                            </span>
                        </div>
                    </td>
                    <td>{item.contactName}</td>
                </tr>
            )
        })
        const dataGrid =
            this.state.isLoading === false ? (
                <GridCustom
                ref='custom-data-grid'
                gridKey="ProjectsIndex"
                data={this.state.rows}
                pageSize={this.state.rows.length}
                groups={[]}
                actions={[]}
                rowActions={this.rowActions}
                cells={this.state.columns}
                rowClick={(cell) => { this.onRowClick(cell) }}
            />
            ) : <LoadingSection />;
        const mergeProjects = <React.Fragment>
            <Formik
                initialValues={{
                    Project: this.state.selectedExceptProject.value == '0' ? '' : this.state.selectedExceptProject.value
                }}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={() => {
                    this.mergeTwoProject()
                }}
            >{({ touched, errors, setFieldValue, setFieldTouched }) => (
                <Form id="signupForm1" className="dropWrapper" noValidate="novalidate" >
                    <div className="fullWidthWrapper textLeft ">
                        <Dropdown
                            title="Project"
                            data={this.state.exceptProjects}
                            selectedValue={this.state.selectedExceptProject}
                            handleChange={event => {
                                this.setState({ selectedExceptProject: event })
                            }}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            error={errors.Project}
                            touched={touched.Project}
                            name="Project"
                            index="Project"
                        />
                        <div className="fullWidthWrapper textRight">
                            <button className="primaryBtn-2 btn mediumBtn" type='button' onClick={e => this.setState({ showModal: false })}>{Resources.cancel[currentLanguage]}</button>
                            {this.state.saveLoading === false ? (
                                <button
                                    className="primaryBtn-1 btn "
                                    type="submit"
                                >  {Resources['save'][currentLanguage]}
                                </button>
                            ) :
                                (
                                    <button className="primaryBtn-1 btn disabled" disabled="disabled">
                                        <div className="spinner">
                                            <div className="bounce1" />
                                            <div className="bounce2" />
                                            <div className="bounce3" />
                                        </div>
                                    </button>
                                )}
                        </div>
                    </div>
                </Form>
            )}
            </Formik>
        </React.Fragment>
        const addAccounts = <div className="dropWrapper">
            {this.state.isLoading === false ? <React.Fragment>
                <div className="fullWidthWrapper textLeft">
                    <Dropdown title='selectAccounts' data={this.state.accountsData}
                        handleChange={e => this.addAcounts(e)} placeholder='selectAccounts' isMulti={true} />
                </div>
                <div className="fullWidthWrapper">
                    <span className="border" ></span>
                    {this.state.saveLoading === false ? (
                        <button
                            className="primaryBtn-1 btn "
                            type="submit"
                            onClick={() => this.saveAccounts()}
                        >  {Resources['save'][currentLanguage]}
                        </button>
                    ) :
                        (
                            <button className="primaryBtn-1 btn disabled" disabled="disabled">
                                <div className="spinner">
                                    <div className="bounce1" />
                                    <div className="bounce2" />
                                    <div className="bounce3" />
                                </div>
                            </button>
                        )}
                </div>
                <table className="taskAdminTable">
                    <thead>
                        <tr>
                            <th>{Resources['delete'][currentLanguage]}</th>
                            <th>{Resources['ContactName'][currentLanguage]}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.LoadingTable ? RenderTable : <LoadingSection />}
                    </tbody>
                </table>
            </React.Fragment> : <LoadingSection></LoadingSection>}
        </div>
        return (
            <div className='mainContainer main__fulldash main__withouttabs' >

                <HeaderDocument
                    projectName={epsName}
                    isViewMode={false}
                    perviousRoute={"/TemplatesSettings"}
                    docTitle={Resources.Projects[currentLanguage]}
                />
                <div className="submittalFilter readOnly__disabled">
                    <div className="filterBTNS">
                        <button className="primaryBtn-1 btn mediumBtn" onClick={this.addRecord}>{Resources['add'][currentLanguage]}</button>
                    </div>
                </div>
                <div className="grid-container">
                    {dataGrid}
                </div>
                {
                    this.state.showDeleteModal == true ? (
                        <div style={{ position: 'relative', zIndex: '99999999' }}>
                            <ConfirmationModal
                                title={Resources['smartDeleteMessageContent'][currentLanguage]}
                                closed={this.onCloseModal}
                                showDeleteModal={this.state.showDeleteModal}
                                clickHandlerCancel={this.clickHandlerCancelMain}
                                buttonName='delete' clickHandlerContinue={this.confirmDelete}
                            />
                        </div>
                    ) : null
                }
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={this.state.currentTitle}>
                        {this.state.currentComponent == 'mergeProjects' ? mergeProjects : addAccounts}
                    </SkyLight>
                </div>
            </div >
        );
    }
}


export default withRouter(Index);
