import React, { Component } from "react";
import Api from "../../../../api";
import LoadingSection from "../../../publicComponants/LoadingSection";
import Dropdown from "../../../OptionsPanels/DropdownMelcous";
// import "../../../../Styles/css/semantic.min.css";
// import "../../../../Styles/scss/en-us/layout.css";
import Resources from "../../../../resources.json";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { connect } from 'react-redux';
import config from "../../../../Services/Config";
import permissions from '../../../../permissions.json'
import HeaderDocument from '../../../OptionsPanels/HeaderDocument'
import _ from "lodash";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
//const filePermissions = JSON.parse(permissions).authorization;

class PermissionsGroupsPermissions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            groupId: props.match.params.groupId,
            selectedDocument: { label: Resources.selectDocType[currentLanguage], value: -1 },
            checkedAll: false,
            groupName: '',
            disabled: true,
            status: 0
        }
        if (config.getPayload().uty != 'company') {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }
    }

    componentWillMount() {
        this.setState({ isLoading: true })
        Api.get('AccountsPermissionsGroupsGetById?id=' + this.state.groupId).then(res => {
            if (!_.isEmpty(res))
                this.setState({ groupName: res[0].groupName, isLoading: false })
        }).catch(() => {
            this.setstate({ isLoading: false })
        })

        let docs = []
        let module = []
        let options = []
        permissions.authorization.forEach(element => {
            docs = []
            module.push()
            element.modules.forEach(item => {
                docs.push({ label: item.title[currentLanguage], value: item.id })
                this.setState({ [item.id]: item.permissions })
            })
            options.push({ label: element.title[currentLanguage], options: docs })
        })
        this.setState({ options })

    }
    checkedAll = () => {
        this.state[this.state.selectedDocument.value].forEach(item => {
            this.setState({ [item.code]: !this.state.checkedAll })
        })
        this.setState({ checkedAll: !this.state.checkedAll })

    }
    handleCheck = (code) => {
        this.setState({ [code]: !this.state[code] })
    }

    addEditPermission = () => {
        if (this.state.selectedDocument.value != -1) {
            let group = []
            if (this.state.status == 1) {
                this.state[this.state.selectedDocument.value].forEach(item => {
                    group.push({ permissionId: item.code, groupName: this.state.groupName, permissionValue: this.state[item.code], groupId: this.state.groupId })
                })
            }
            else {
                this.state[this.state.selectedDocument.value].forEach(item => {
                    if (this.state[item.code] == true)
                        group.push({ permissionId: item.code, permissionValue: this.state[item.code], groupId: this.state.groupId })
                })
            }
            this.setState({ isLoading: true })
            let url = this.state.status == 0 ? 'AddGroupsPermissions' : 'EditGroupsPermissions'
            Api.post(url, group).then(() => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
                this.setState({ isLoading: false, selectedDocument: { label: Resources.selectDocType[currentLanguage], value: -1 }, disabled: true })
            }).catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ isLoading: false })
            })
        }
    }
    changeSelect = (event) => {
        this.setState({ selectedDocument: event })
        let documentPermission = [];
        this.state[event.value].forEach(item => {
            documentPermission.push(item.code)
        })
        let doc = {
            groupId: this.state.groupId,
            documentPermissions: documentPermission
        }
        this.setState({ isLoading: true })
        Api.post('GetGroupsPermissionsV5', doc).then(res => {
            if (!_.isEmpty(res)) {
                res.forEach(item => {
                    this.setState({ [item.permissionId]: item.permissionValue })
                })
                this.setState({ isLoading: false, disabled: false, status: 1 ,checkedAll:false})
            }
            else {
                this.setState({ isLoading: false, disabled: false, status: 0 ,checkedAll:false})
            }
        }).catch(() => {
            this.setState({ isLoading: false, disabled: false, status: 0,checkedAll:false })
        })
    }

    render() {
        let checkBoxs = this.state.selectedDocument.value == -1 ? null :
            this.state[this.state.selectedDocument.value].map(item => {
                return (
                    <div className="project__Permissions--type " key={item.code}>
                        <div id="allSelected" className="ui checkbox checkBoxGray300 checked " >
                            <input name="CheckBox" type="checkbox" id="allPermissionInput" checked={this.state[item.code]}
                                onChange={(e) => this.handleCheck(item.code)} />
                            <label>{item.title[currentLanguage]}</label>
                        </div>
                    </div>
                )
            })

        return (
            <div className="mainContainer">
                <div className="documents-stepper noTabs__document">
                    <HeaderDocument projectName={''} isViewMode={this.state.isViewMode} docTitle={Resources.groupsPermissions[currentLanguage]} moduleTitle='' />
                    {this.state.isLoading == true ? <LoadingSection /> :
                        <div className="doc-container">
                            {/* <!-- Start Submittal Actions --> */}
                            <div className="step__permission">
                                <div className="subiTabsContent">
                                    {/* <!--End Header--> */}
                                    <div className="ProForm permission__proForm">
                                        <div className="linebylineInput valid-input odd">
                                            <div className="linebylineInput valid-input">
                                                <Dropdown
                                                    title="userPermissions"
                                                    data={this.state.options}
                                                    selectedValue={this.state.selectedDocument}
                                                    handleChange={event => { this.changeSelect(event) }}
                                                    name="userPermissions"
                                                    index="userPermissions" />
                                            </div>
                                        </div>
                                        <div className="permissins__btns">
                                            <button className={"primaryBtn-1 btn mediumBtn " +( this.state.disabled ? "disabled" : '')} disabled={this.state.disabled} onClick={this.addEditPermission}>{Resources.save[currentLanguage]}</button>
                                            <button className="primaryBtn-2 btn mediumBtn middle__btn">Revoke All</button>
                                        </div>
                                    </div>
                                    <header className="main__header">
                                        <div className="main__header--div">
                                            <h2 className="zero"> </h2>
                                        </div>
                                    </header>
                                    <div className="project__Permissions">
                                        {this.state.selectedDocument.value == -1 ? null :
                                            <div className="project__Permissions--selectAll ">
                                                <div id="allSelected" className="ui checkbox checkBoxGray300 checked " >
                                                    <input name="CheckBox" type="checkbox" id="allPermissionInput" defaultChecked={this.state.checkedAll}
                                                        onChange={(e) => this.checkedAll(e)} />
                                                    <label>Select All</label>
                                                </div>
                                            </div>}
                                        {checkBoxs}

                                    </div>
                                </div>
                            </div>
                        </div>}
                </div>
            </div>
        )
    }
}
function mapStateToProps(state, ownProps) {
    return {
        projectId: state.communication.projectId,
        projectName: state.communication.projectName
    }
}
export default connect(
    mapStateToProps
)(withRouter(PermissionsGroupsPermissions))