import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Api from "../../../api";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import GridSetup from "../../../Pages/Communication/GridSetup";
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
const _ = require('lodash')
let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
const validationSchema = Yup.object().shape({
    Project: Yup.string().required(Resources['pleaseSelectProjectManagerContact'][currentLanguage]),
})
let epsId = 0
let epsName = ''
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
                formatter: this.customButton,
                key: 'customBtn1',
                width: 150,
            },
            {
                key: "id",
                visible: false,
                width: 20,
                frozen: true
            },
            {
                key: "job",
                name: Resources["job"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "statusName",
                name: Resources["projectStatus"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
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
                                    }))
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
            Api.get('ProjectProjectsSelectByEps?epsId=' + this.state.epsId + '&pageNumber=0&pageSize=200').then(result => {
                this.setState({
                    rows: result,
                    isLoading: false,
                });
            });
        }
        else
            toast.success(Resources["missingPermissions"][currentLanguage]);
    }
    addAcounts = (item) => {
        let selectedAccounts = this.state.selectedAccounts
        selectedAccounts.push(item.value)
        this.setState({ selectedAccounts })
    }
    saveAccounts = () => {
        this.setState({ saveLoading: true })
        Api.post('AddProjectsAccountsList?projectId=' + this.state.selectedprojectId, this.state.selectedAccounts).then(() => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.setState({ showModal: false, saveLoading: false })
        }).catch((ex) => {
            this.setState({ showModal: false, saveLoading: false })
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
            Api.get("DeleteAccountsProjects?id=" + this.state.rowId).then(() => {
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
                Api.post('ProjectCompaniesDelete?id=' + this.state.selectedRowId)
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
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={true}
                    clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                    viewContactHandler={this.clickHandler}
                    onRowClick={this.onRowClick}
                    single={true}
                    getCellActions={this.getCellActions}

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
                <div className="submittalHead">
                    <h2 className="zero">{Resources.Projects[currentLanguage]}
                        <span>{epsName.replace(/_/gi, ' ')} · {Resources['Projects'][currentLanguage]}</span>
                    </h2>
                    <div className="SubmittalHeadClose">
                        <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                    <g id="Group-2">
                                        <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                            <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                <g id="Group">
                                                    <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                    <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" id="Combined-Shape" fill="#858D9E" fillRule="nonzero"></path>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                </div>
                <div className="submittalFilter">
                    <div className="filterBTNS">
                        <button className="primaryBtn-1 btn mediumBtn" onClick={this.addRecord}>{Resources['add'][currentLanguage]}</button>
                    </div>
                </div>
                <div className="grid-container">
                    {dataGrid}
                </div>
                {
                    this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessage'][currentLanguage].content}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.confirmDelete}
                        />
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
