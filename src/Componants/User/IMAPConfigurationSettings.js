import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../publicComponants/LoadingSection";
import ConfirmationModal from "../publicComponants/ConfirmationModal";
import Export from "../OptionsPanels/Export";
import { SkyLightStateless } from 'react-skylight';
import { Formik, Form } from 'formik';
import config from "../../Services/Config";
import * as Yup from 'yup';
import { toast } from "react-toastify";
import dataservice from "../../Dataservice";
import Resources from "../../resources.json";
import GridCustom from 'react-customized-grid';
import * as dashboardComponantActions from "../../store/actions/communication";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
    userNameText: Yup.string().required(Resources['userNameRequired'][currentLanguage]),
    userPasswordText: Yup.string().required(Resources['passwordRequired'][currentLanguage]),
    port: Yup.string().required(Resources['portRequired'][currentLanguage]),
})
let projectId=localStorage.getItem("lastSelectedProject");
class IMAPConfigurationSettings extends Component {

    constructor(props) {
        super(props)
        const columnsGrid = [
            {
                field: "name",
                title: Resources["imapConfigurationName"][currentLanguage],
                groupable: true,
                fixed: true,
                width: 10,
                sortable: true,
                type: "text"
            },
            {
                field: "server",
                title: Resources["serverName"][currentLanguage],
                groupable: true,
                fixed: true,
                width: 10,
                sortable: true,
                type: "text"
            },
            {
                field: "port",
                title: Resources["port"][currentLanguage],
                groupable: true,
                fixed: true,
                width: 10,
                sortable: true,
                type: "number"
            },
            {
                field: "userName",
                title: Resources["UserName"][currentLanguage],
                groupable: true,
                fixed: true,
                width: 10,
                sortable: true,
                type: "text"
            },
            {
                field: "isOnStatus",
                title: Resources["isOn"][currentLanguage],
                groupable: true,
                fixed: true,
                width: 10,
                sortable: true,
                type: "text"
            },
            {
                field: "useSslStatus",
                title: Resources["useSsl"][currentLanguage],
                groupable: true,
                fixed: true,
                width: 10,
                sortable: true,
                type: "text"
            },
            {
                field: "folder",
                title: Resources["folder"][currentLanguage],
                groupable: true,
                fixed: true,
                width: 10,
                sortable: true,
                type: "text"
            }
        ]
        this.state = {
            columns: columnsGrid,
            isLoading: false,
            rows: [],
            imapObj: {
                id: null,
                projectId: null,
                accountId: null,
                name: null,
                server: null,
                port: null,
                useSsl: true,
                userNameText: null,
                userPasswordText: null,
                folder: null,
                isOn: true,
                totalQuota: null,
                usedQuota: null
            },
            selectedId: 0,
            showDeleteModal: false,
            ShowPopup: false,
            isAdd: true
        }
        this.rowActions = [{
            title: 'Delete',
            handleClick: cell => {
                this.setState({
                    showDeleteModal: true,
                    selectedId: cell.id
                });
            },
            classes: '',
        }];
        if (!config.getPayload().uty === 'company') {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.goBack();
        }
    }

    componentDidMount = () => {
        dataservice.GetDataGrid('GetImapConfiguration').then(result => {
            this.setState({ rows: result || [] });
        });
    }

    clickHandlerDeleteRowsMain = (selectedId) => {
        this.setState({ selectedId, showDeleteModal: true });
    }

    ConfirmDelete = () => {
        this.setState({ isLoading: true });
        dataservice.addObject(`DeleteImapConfiguration?id=${this.state.selectedId}`).then(res => {
            let originalData = this.state.rows;
            let index = originalData.findIndex(x => x.id === this.state.selectedId);
            if (index !== null) {
                originalData.splice(index, 1);
            }
            this.setState({
                isAdd: true,
                rows: originalData,
                showDeleteModal: false,
                isLoading: false,
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });
    }

    submitIMAP = (values) => {
        this.setState({ isLoading: true })
        let params={...this.state.imapObj}
        Object.assign(params,{userName:params.userNameText,userPassword:params.userPasswordText})
        if (this.state.isAdd === true) {
            dataservice.addObject(`SetImapConfiguration?projectId=${projectId}`, params).then(
                result => {
                    let data = this.state.rows
                    params.id=result;
                    data.push({ ...params })
                    this.setState({ rows: data, isLoading: false, ShowPopup: false });
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                });
        } else {
            dataservice.addObject('EditImapConfiguration',params).then(
                result => {
                    let data = this.state.rows;
                    let index = data.findIndex(x => x.id === values.id);
                    if (index) {
                        data.splice(index, 1);
                        data.push({ ...params });
                    }
                    this.setState({ rows: data, isLoading: false, ShowPopup: false });
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                });
        }
    }
    handleChange = (obj, fieldName, fieldValue) => {
        let originalDocument = { ...this.state[obj] }
        let newDocument = {}
        newDocument[fieldName] = fieldValue;
        Object.assign(originalDocument, newDocument);
        this.setState({ [obj]: originalDocument })
    }
    addNew = () => {
        let obj = {
            id: null,
            projectId: null,
            accountId: null,
            name: null,
            server: null,
            port: null,
            useSsl: true,
            userNameText: null,
            userPasswordText: null,
            folder: null,
            isOn: true,
            totalQuota: null,
            usedQuota: null
        };
        this.setState({ imapObj: obj,isAdd:true, ShowPopup: true })
    }

    rowClick(cell) {
        dataservice.GetRowById(`GetImapConfigurationForEdit?id=${cell.id}`).then(result => {
            Object.assign(result,{userNameText:result.userName,userPasswordText:result.userPassword})
            this.setState({
                ShowPopup: true,
                imapObj: result,
                isAdd: false
            });
        })
    }

    render() {
        const dataGrid =
            this.state.isLoading === false ?
                <GridCustom key={"IMAPConfigurationGrid"}
                    cells={this.state.columns}
                    data={this.state.rows}
                    pageSize={20000}
                    actions={[]}
                    rowActions={this.rowActions}
                    rowClick={cell => this.rowClick(cell)}
                    groups={[]}
                    showCheckAll={true}
                /> : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []}
                columns={this.state.columns} fileName={Resources['imapConfigurationName'][currentLanguage]} />
            : null;
        let RenderSettings = () => {
            return (
                <div className="doc-pre-cycle">
                    <div className="subiTabsContent feilds__top">
                        <Formik
                            initialValues={{ ...this.state.imapObj }}
                            enableReinitialize={true}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                this.submitIMAP(values)
                            }}>
                            {({ errors, touched, handleBlur, handleSubmit}) => (
                                <Form onSubmit={handleSubmit}>
                                    <div className='document-fields'>
                                        <div className="proForm datepickerContainer">
                                            <div className="linebylineInput valid-input fullInputWidth letterFullWidth">
                                                <label className="control-label">{Resources['imapConfigurationName'][currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.name && touched.name ? (" has-error") : !errors.name && touched.name ? (" has-success") : " ")} >
                                                    <div className="inputDev ui input">
                                                        <input autoComplete="off" className="form-control"
                                                            value={this.state.imapObj.name} name="name"
                                                            defaultValue={this.state.imapObj.name}
                                                            onBlur={handleBlur} onChange={(e) => this.handleChange('imapObj', 'name', e.target.value)}
                                                            placeholder={Resources['imapConfigurationName'][currentLanguage]} />
                                                        {touched.name ? (<em className="pError">{errors.name}</em>) : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources['UserName'][currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.userNameText && touched.userNameText ? (" has-error") : !errors.userNameText && touched.userNameText ? (" has-success") : " ")} >
                                                    <div className="inputDev ui input">
                                                        <input autoComplete="off" className="form-control"
                                                            value={this.state.imapObj.userNameText} name="userNameText"
                                                            onBlur={handleBlur} onChange={(e) => this.handleChange('imapObj', 'userNameText', e.target.value)}
                                                            placeholder={Resources['UserName'][currentLanguage]} />
                                                        {touched.userNameText ? (<em className="pError">{errors.userNameText}</em>) : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources['password'][currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.userPasswordText && touched.userPasswordText ? (" has-error") : !errors.userPasswordText && touched.userPasswordText ? (" has-success") : " ")} >
                                                    <div className="inputDev ui input">
                                                        <input autoComplete="off" className="form-control" type="password"
                                                            value={this.state.imapObj.userPasswordText} name="userPasswordText"
                                                            onBlur={handleBlur} onChange={(e) => this.handleChange('imapObj', 'userPasswordText', e.target.value)}
                                                            placeholder={Resources['password'][currentLanguage]} />
                                                        {touched.userPasswordText ? (<em className="pError">{errors.userPasswordText}</em>) : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources['serverName'][currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.server && touched.server ? (" has-error") : !errors.server && touched.server ? (" has-success") : " ")} >
                                                    <div className="inputDev ui input">
                                                        <input autoComplete="off" className="form-control"
                                                            value={this.state.imapObj.server} name="server"
                                                            onBlur={handleBlur} onChange={(e) => this.handleChange('imapObj', 'server', e.target.value)}
                                                            placeholder={Resources['serverName'][currentLanguage]} />
                                                        {touched.server ? (<em className="pError">{errors.server}</em>) : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources['port'][currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.port && touched.port ? (" has-error") : !errors.port && touched.port ? (" has-success") : " ")} >
                                                    <div className="inputDev ui input">
                                                        <input autoComplete="off" className="form-control"
                                                            value={this.state.imapObj.port} name="port"
                                                            onBlur={handleBlur} onChange={(e) => this.handleChange('imapObj', 'port', e.target.value)}
                                                            placeholder={Resources['port'][currentLanguage]} />
                                                        {touched.port ? (<em className="pError">{errors.port}</em>) : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources['folder'][currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.folder && touched.folder ? (" has-error") : !errors.folder && touched.folder ? (" has-success") : " ")} >
                                                    <div className="inputDev ui input">
                                                        <input autoComplete="off" className="form-control"
                                                            value={this.state.imapObj.folder} name="folder"
                                                            onBlur={handleBlur} onChange={(e) => this.handleChange('imapObj', 'folder', e.target.value)}
                                                            placeholder={Resources['folder'][currentLanguage]} />
                                                        {touched.folder ? (<em className="pError">{errors.folder}</em>) : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="linebylineInput">
                                                <div className="ui checkbox checkBoxGray300 checked" >
                                                    <input type="checkbox"
                                                        id="useSsl"
                                                        name="useSsl"
                                                        value={this.state.imapObj.useSsl}
                                                        checked={this.state.imapObj.useSsl}
                                                        onChange={(e) => { this.handleChange('imapObj', 'useSsl', e.target.checked) }}
                                                    />
                                                    <label>{Resources.useSsl[currentLanguage]}</label>
                                                </div>
                                            </div>
                                            <div className="linebylineInput">
                                                <div className="ui checkbox checkBoxGray300 checked" >
                                                    <input type="checkbox"
                                                        id="isOn"
                                                        name="isOn"
                                                        value={this.state.imapObj.isOn}
                                                        checked={this.state.imapObj.isOn}
                                                        onChange={(e) => { this.handleChange('imapObj', 'isOn', e.target.checked) }}
                                                    />
                                                    <label>{Resources.isOn[currentLanguage]}</label>
                                                </div>
                                            </div>

                                            <div className="slider-Btns">
                                                <button className="primaryBtn-1 btn meduimBtn" type='submit' >{Resources['save'][currentLanguage]}</button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )
        }

        return (
            <Fragment>
                <div className="mainContainer">
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero">{Resources.imapConfigurationName[currentLanguage]}</h3>
                    </div>
                    <div className="filterBTNS">
                        {btnExport}
                        <button className="primaryBtn-1 btn mediumBtn" onClick={()=>this.addNew()}>{Resources['add'][currentLanguage]}</button>
                    </div>
                </div>
                <div className="grid-container">
                    {dataGrid}
                </div>
                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={() => this.setState({ ShowPopup: false })}
                        title={Resources[this.state.isAdd==true?'add':'editTitle'][currentLanguage]} isVisible={this.state.ShowPopup}
                        onCloseClicked={() => this.setState({ ShowPopup: false })} >
                        {RenderSettings()}
                    </SkyLightStateless>
                </div>
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
                        closed={() => this.setState({ showDeleteModal: false })}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={() => this.setState({ showDeleteModal: false })}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                    />
                ) : null}
                </div>
            </Fragment>
        )
    }
}

  
  export default withRouter(IMAPConfigurationSettings);
