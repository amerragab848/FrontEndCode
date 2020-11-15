import React, { Component } from "react";
import Api from "../../../../api";
import SkyLight from 'react-skylight';
import LoadingSection from "../../../../Componants/publicComponants/LoadingSection";
import Export from "../../../OptionsPanels/Export";
import { Formik, Form } from 'formik';
import ConfirmationModal from "../../../publicComponants/ConfirmationModal";
 import GridCustom from "../../../../Componants/Templates/Grid/CustomGrid";

import config from "../../../../Services/Config";
import Resources from "../../../../resources.json";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { __esModule } from "react-modern-datepicker/build/components/ModernDatepicker";
import * as Yup from 'yup';
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
const find = require('lodash/find');

const validationSchema = Yup.object().shape({
    GroupName: Yup.string().required(Resources['GroupName'][currentLanguage])
})
class permissionsGroups extends Component {
    constructor(props) {
        super(props);
        const columnsGrid = [

            { title: '', type: 'check-box', fixed: true, field: 'id' },
            {
                field: "groupName",
                title: Resources["GroupName"][currentLanguage],
                width: 35,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text"
            },

        ];
        this.actions = [
            {
                title: 'Delete',
                handleClick: (values) => {
                    this.setState({
                        showDeleteModal: true,
                        selectedRow: values
                    });
                },
                classes: '',
            }
        ];

        this.rowActions = [
            {
                title: Resources['copyTo'][currentLanguage],
                handleClick: value => {
                    this.copyTo(value)

                }
            },
            {
                title: Resources['groupsPermissions'][currentLanguage],
                handleClick: value => {
                    this.props.history.push({
                        pathname: '/PermissionsGroupsPermissions/' + value.id,
                    })

                }
            },
            {
                title: Resources['contacts'][currentLanguage],
                handleClick: value => {
                    this.props.history.push({
                        pathname: '/AccountsGroup/' + value.id,
                    })
                }
            }
        ];
        this.state = {
            columns: columnsGrid,
            isLoading: true,
            currentTitle: 'add',
            rows: [],
            selectedRows: [],
            groupList: [],
            totalRows: 0
        }
        this.GetCellActions = this.GetCellActions.bind(this);
        if (config.getPayload().uty != 'company') {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }
    } 
    GetCellActions(column, row) {
        if (column.key === 'BtnActions') {
            return [{
                icon: "fa fa-pencil",
                actions: [
                    {
                        text: Resources['copyTo'][currentLanguage],
                        callback: value => {
                            this.copyTo(value)
                        }
                    },
                    {
                        text: Resources['groupsPermissions'][currentLanguage],
                        callback: value => {
                            this.props.history.push({
                                pathname: '/PermissionsGroupsPermissions/' + value.id,
                            })

                        }
                    },
                    {
                        text: Resources['contacts'][currentLanguage],
                        callback: value => {
                            this.props.history.push({
                                pathname: '/AccountsGroup/' + value.id,
                            })
                        }
                    }
                ]
            }];
        }
    } 
    copyTo = (value) => {
        this.setState({ isLoading: true })
        let Group = {
            id: value.id,
            groupName: value.groupName
        }
        Api.post('AddAccountsPermissionsGroupsCopy', Group).then((res) => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            let rows = [...this.state.rows]
            rows.unshift(res)
            this.setState({rows, isLoading: false })
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ isLoading: false })
        })
    }
    deleteGroupName = (rowId) => {
        this.setState({ showDeleteModal: true, rowId: rowId })
    } 
    onCloseModal() {
        this.setState({
            showDeleteModal: false, showResetPasswordModal: false
        });
    } 
    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false, showResetPasswordModal: false });
    }; 
    addRecord = () => {
        this.setState({ showPopUp: true, isLoading: false, selectedgroupName: '', currentTitle: 'add' })
        this.simpleDialog.show()
    } 
    ConfirmdeleteGroupName = () => {
        let id = '';
        this.setState({ isLoading: true, showDeleteModal: false })
        let rowsData = this.state.rows;
        this.state.selectedRow.map(i => {
            id = i
        })
        let group = find(rowsData, { 'id': id })
        Api.post('AccountsPermissionsGroupsDelete?id=' + group.id).then(() => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            let rows = []
            this.state.rows.forEach(element => {
                if (element.id != group.id) {
                    rows.push(element)
                }
            })
            this.setState({ rows, isLoading: false })
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ isLoading: false })
        })
    } 
    componentWillMount = () => {
        Api.get('GetPermissionsGroupsGrid?pageNumber=0&pageSize=200').then(result => {
            if (result != null) {
                let groupList = []
                result.forEach(element => {
                    groupList.push({ label: element.groupName, value: element.id })
                });
                this.setState({
                    groupList,
                    rows: result,
                    isLoading: false,
                    totalRows: result.length,
                });
            }
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ isLoading: false })
        })

    } 
    onRowClick(value, index, column) {
        this.setState({
            selectedRow: value,
            selectedgroupName: value.groupName
        })
        if (column.key != 'BtnActions' && column.key != 'select-row') {
            this.setState({ showPopUp: true, isLoading: false, currentTitle: 'update' })
            this.simpleDialog.show()
        }

    }  
    addEditGroupName = (value) => {
        if (this.state.currentTitle == 'update') {
            let group = { ...this.state.selectedRow }
            group.groupName = value.GroupName
            this.setState({ isLoading: true })
            Api.post('AccountsPermissionsGroupsEdit', group).then(() => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
                let rows = []
                this.state.rows.forEach(element => {
                    if (element.id == this.state.selectedRow.id) {
                        element.groupName = value.GroupName
                    }
                    rows.push(element)
                })
                this.setState({ rows, isLoading: false, showPopUp: false })
            }).catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ isLoading: false, showPopUp: false })
            })
        }
        else {
            let groupObj = {}
            groupObj.id = 0;
            groupObj.groupName = value.GroupName;
            this.setState({ isLoading: true, showPopUp: false })
            Api.post('AccountsPermissionsGroupsAdd', groupObj).then((res) => {
                let rows = [...this.state.rows]
                rows.push(res)
                this.setState({ rows, isLoading: false })
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }).catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ isLoading: false, showPopUp: false })
            })
        }

    } 
    render() {

        const dataGrid =
            this.state.isLoading === false ? (

                <GridCustom
                    ref='custom-data-grid'
                    key='permissionGroup'
                    data={this.state.rows}
                    pageSize={this.state.pageSize}
                    groups={[]}
                    actions={this.actions}
                    rowActions={this.rowActions}
                    cells={this.state.columns}
                    openModalColumn={this.state.columnsModal}
                    showCheckAll={true}
                    rowClick={cell => {
                        this.setState({
                            selectedRow: cell,
                            selectedgroupName: cell.groupName,
                            showPopUp: true,
                            isLoading: false,
                            currentTitle: 'update'
                        });
                        this.simpleDialog.show()
                    }
                    }
                />

            ) : (<LoadingSection />);
        let Exportcolumns = this.state.columns.filter(s => s.key !== 'BtnActions')

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={Exportcolumns} fileName={'groupsPermissions'} />
            : null;
        const addEditGroupName = this.state.isLoading === false ? <React.Fragment>
            <Formik
                initialValues={{ GroupName: this.state.selectedgroupName }}
                validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={(values) => {
                    this.addEditGroupName(values)
                }}>
                {({ errors, touched, handleBlur, handleChange, handleSubmit, values }) => (
                    <Form id="letterForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                        <div className="fullWidthWrapper textLeft">
                            <label className="control-label">{Resources.GroupName[currentLanguage]}</label>
                            <div className={"inputDev ui input" + (errors.GroupName && touched.GroupName ? (" has-error") : !errors.GroupName && touched.GroupName ? (" has-success") : " ")} >
                                <input name='GroupName' className="form-control fsadfsadsa" id="GroupName"
                                    placeholder={Resources.GroupName[currentLanguage]}
                                    autoComplete='off'
                                    value={values.GroupName}
                                    onBlur={handleBlur}
                                    onChange={handleChange} />
                                {touched.GroupName ? (<em className="pError">{errors.GroupName}</em>) : null}
                            </div>
                        </div>
                        <div className="fullWidthWrapper">
                            <button
                                className="primaryBtn-1 btn mediumBtn"
                                type="submit"
                            >  {Resources['save'][currentLanguage]}
                            </button>


                        </div>
                    </Form>
                )}
            </Formik>
        </React.Fragment> : <LoadingSection />
        return (
            <div >
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero">{Resources.groupsPermissions[currentLanguage]}</h3>
                        <span>{this.state.totalRows}</span>
                    </div>
                    <div className="filterBTNS">
                        {btnExport}
                        <button className="primaryBtn-1 btn mediumBtn" onClick={this.addRecord.bind(this)}>NEW</button>
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
                        buttonName='delete' clickHandlerContinue={this.ConfirmdeleteGroupName}
                    />
                ) : null}

                <div className="largePopup" style={{ display: this.state.showPopUp ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                        {addEditGroupName}
                    </SkyLight>
                </div>
            </div>
        );
    }
}

export default withRouter(permissionsGroups)