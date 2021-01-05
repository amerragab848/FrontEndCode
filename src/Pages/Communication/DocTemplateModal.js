import React, { Component, Fragment } from 'react';
import GridCustom from '../../Componants/Templates/Grid/CustomCommonLogGrid';
import Filter from '../../Componants/FilterComponent/filterComponent';
import Api from '../../api';
import dataservice from '../../Dataservice';
import Export from '../../Componants/OptionsPanels/Export';
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import Dropdown from '../../Componants/OptionsPanels/DropdownMelcous';
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal';
import documentDefenition from '../../documentDefenition.json';
//import Resources from '../../resources.json';
import { withRouter } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import { toast } from 'react-toastify';
import Config from '../../Services/Config.js';
import SkyLight from 'react-skylight';
import { SkyLightStateless } from 'react-skylight';
import XSLfile from '../../Componants/OptionsPanels/XSLfiel';
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown';
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown';
import { Resources } from '../../Resources';

let docTempLink;

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class DocTemplateModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projectId: this.props.projectId,
            docTemplateModal: true,
            docType: this.props.docType,
            companies: [],
            contacts: [],
            ToContacts: [],
            specsSection: [],
            reasonForIssue: [],
            disciplines: [],
            contracts: [],
            areas: [],
            locations: [],
            submittalType: [],
            approvales: [],
            selectedFromCompany: {
                label: Resources.ComapnyNameRequired[currentLanguage],
                value: '0',
            },
            selectedFromContact: {
                label: Resources.contactNameRequired[currentLanguage],
                value: '0',
            },
            selectedToCompany: {
                label: Resources.ComapnyNameRequired[currentLanguage],
                value: '0',
            },
            selectedToContact: {
                label: Resources.contactNameRequired[currentLanguage],
                value: '0',
            },
            selectedSpecsSection: {
                label: Resources.specsSectionSelection[currentLanguage],
                value: '0',
            },
            selectedDiscpline: {
                label: Resources.disciplineRequired[currentLanguage],
                value: '0',
            },
            selectedContract: {
                label: Resources.contractPoSelection[currentLanguage],
                value: '0',
            },
            selectedArea: {
                label: Resources.area[currentLanguage],
                value: '0',
            },
            selectedLocation: {
                label: Resources.locationRequired[currentLanguage],
                value: '0',
            },
            selectedSubmittalType: {
                label: Resources.submittalType[currentLanguage],
                value: '0',
            },
            selectedApprovalStatus: {
                label: Resources.approvalStatusSelection[currentLanguage],
                value: '0',
            },
        };
    }
    componentDidMount() {
        if (this.state.docType == 'submittal') {
            docTempLink = Config.getPublicConfiguartion().downloads + '/Downloads/Excel/tempSubmittal.xlsx';
        }
        //else if .... for more documents
        else {
            docTempLink = Config.getPublicConfiguartion().downloads + '/Downloads/Excel/tempLetter.xlsx';
        }
        this.fillDropDowns();
    };

    fillDropDowns() {
        if (this.state.docType == 'submittal' || this.state.docType == "Letters") {
            dataservice.GetDataListCached('GetProjectProjectsCompaniesForList?projectId=' + this.props.projectId, 'companyName', 'companyId', 'companies', this.props.projectId, 'projectId').then(result => {
                this.setState({ companies: [...result] })
            });
        }
        if (this.state.docType == 'submittal') {
            //discplines
            dataservice.GetDataListCached('GetaccountsDefaultListForList?listType=discipline', 'title', 'id', 'defaultLists', 'discipline', 'listType').then(result => {
                this.setState({ disciplines: [...result] })
            });

            //SubmittalTypes
            dataservice.GetDataListCached('GetaccountsDefaultListForList?listType=SubmittalTypes', 'title', 'id', 'defaultLists', 'SubmittalTypes', 'listType').then(result => {
                this.setState({ SubmittalTypes: [...result] })
            });

            //location
            dataservice.GetDataListCached('GetaccountsDefaultListForList?listType=location', 'title', 'id', 'defaultLists', 'location', 'listType').then(result => {
                this.setState({ locations: [...result] })
            });

            //area
            dataservice.GetDataListCached('GetaccountsDefaultListForList?listType=area', 'title', 'id', 'defaultLists', 'area', 'listType').then(result => {
                this.setState({ areas: [...result] })
            });

            //approvalstatus
            dataservice.GetDataListCached('GetaccountsDefaultListForList?listType=approvalstatus', 'title', 'id', 'defaultLists', 'approvalstatus', 'listType').then(result => {
                this.setState({ approvales: [...result] })
            });

            //specsSection
            dataservice.GetDataListCached('GetaccountsDefaultListForList?listType=specssection', 'title', 'id', 'defaultLists', 'specssection', 'listType').then(result => {
                this.setState({ specsSection: [...result] })
            });
            //contractList
            dataservice.GetDataList('GetPoContractForList?projectId=' + this.props.projectId, 'subject', 'id').then(result => {
                this.setState({ contracts: [...result] })
            });
        }
    }

    handleChangeDropDown(
        event,
        field,
        isSubscrib,
        targetState,
        url,
        param,
        selectedValue,
        subDatasource,
    ) {
        if (event == null) return;
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document,
            [selectedValue]: event,
        });

        if (isSubscrib) {
            let action = url + '?' + param + '=' + event.value;
            dataservice
                .GetDataList(action, 'contactName', 'id')
                .then(result => {
                    this.setState({
                        [targetState]: result,
                    });
                });
        }
    }

    handleChangeDropDownCycles(
        event,
        field,
        isSubscrib,
        targetState,
        url,
        param,
        selectedValue,
        subDatasource,
    ) {
        if (event == null) return;

        let original_document = { ...this.state.documentCycle };

        let updated_document = {};

        updated_document[field] = event.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            documentCycle: updated_document,
            [selectedValue]: event,
        });
    }

    render() {
        return (
            <div className="largePopup largeModal "> 

                    <SkyLightStateless
                        onOverlayClicked={() =>
                            this.props.onClose()
                        }
                        title={Resources['DocTemplate'][currentLanguage]}
                        onCloseClicked={() =>
                           this.props.onClose()
                        }
                        isVisible={this.state.docTemplateModal}>
                        <div className="proForm datepickerContainer customLayout">
                            <div className="linebylineInput valid-input mix_dropdown">
                                <label className="control-label">
                                    {Resources.fromCompany[currentLanguage]}
                                </label>
                                <div className="supervisor__company">
                                    <div className="super_name">
                                        <Dropdown
                                            //title={"fromCompany"}
                                            data={this.state.companies}
                                            isMulti={false}
                                            selectedValue={
                                                this.state
                                                    .selectedFromCompany
                                            }
                                            handleChange={event => {
                                                this.handleChangeDropDown(
                                                    event,
                                                    'companyId',
                                                    true,
                                                    'contacts',
                                                    'GetContactsByCompanyId',
                                                    'companyId',
                                                    'selectedFromCompany',
                                                    'selectedFromContact',
                                                );
                                            }}
                                            index="companyId"
                                            name="companyId"
                                            id=" companyId"
                                            styles={CompanyDropdown}
                                            classDrop="companyName1"
                                        />
                                    </div>
                                    <div className="super_company">
                                        <Dropdown
                                            isMulti={false}
                                            data={this.state.contacts}
                                            selectedValue={
                                                this.state
                                                    .selectedFromContact
                                            }
                                            handleChange={event =>
                                                this.handleChangeDropDown(
                                                    event,
                                                    'contactId',
                                                    false,
                                                    '',
                                                    '',
                                                    '',
                                                    'selectedFromContact',
                                                )
                                            }
                                            index="contactId"
                                            name="contactId"
                                            id="contactId"
                                            classDrop="contactName1"
                                            styles={ContactDropdown}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="linebylineInput valid-input mix_dropdown">
                                <label className="control-label">
                                    {Resources.toCompany[currentLanguage]}
                                </label>
                                <div className="supervisor__company">
                                    <div className="super_name">
                                        <Dropdown
                                            isMulti={false}
                                            data={this.state.companies}
                                            selectedValue={
                                                this.state.selectedToCompany
                                            }
                                            handleChange={event =>
                                                this.handleChangeDropDown(
                                                    event,
                                                    'toCompanyId',
                                                    true,
                                                    'ToContacts',
                                                    'GetContactsByCompanyId',
                                                    'companyId',
                                                    'selectedToCompany',
                                                    'selectedToContact',
                                                )
                                            }
                                            index="letter-toCompany"
                                            name="toCompanyId"
                                            id="toCompanyId"
                                            styles={CompanyDropdown}
                                            classDrop="companyName1"
                                        />
                                    </div>
                                    <div className="super_company">
                                        <Dropdown
                                            isMulti={false}
                                            data={this.state.ToContacts}
                                            selectedValue={
                                                this.state.selectedToContact
                                            }
                                            handleChange={event =>
                                                this.handleChangeDropDown(
                                                    event,
                                                    'toContactId',
                                                    false,
                                                    '',
                                                    '',
                                                    '',
                                                    'selectedToContact',
                                                )
                                            }
                                            index="letter-toContactId"
                                            name="toContactId"
                                            id="toContactId"
                                            classDrop="contactName1"
                                            styles={ContactDropdown}
                                        />
                                    </div>
                                </div>
                            </div>
                            {Config.getPayload().uty == 'company' ? (
                                this.state.docType == 'submittal' ? (
                                    <Fragment>
                                        <div className="dropdownFullWidthContainer">
                                            <div className="linebylineInput valid-input dropdownFullWidth">
                                                <Dropdown
                                                    title="disciplineTitle"
                                                    data={
                                                        this.state
                                                            .disciplines
                                                    }
                                                    isMulti={false}
                                                    selectedValue={
                                                        this.state
                                                            .selectedDiscpline
                                                    }
                                                    handleChange={event =>
                                                        this.handleChangeDropDown(
                                                            event,
                                                            'disciplineId',
                                                            false,
                                                            '',
                                                            '',
                                                            '',
                                                            'selectedDiscpline',
                                                        )
                                                    }
                                                    name="disciplineId"
                                                    id="disciplineId"
                                                />
                                            </div>
                                            <div className="linebylineInput valid-input dropdownFullWidth">
                                                <Dropdown
                                                    title="specsSection"
                                                    data={
                                                        this.state
                                                            .specsSection
                                                    }
                                                    isMulti={false}
                                                    selectedValue={
                                                        this.state
                                                            .selectedSpecsSection
                                                    }
                                                    handleChange={event =>
                                                        this.handleChangeDropDown(
                                                            event,
                                                            'specsSectionId',
                                                            false,
                                                            '',
                                                            '',
                                                            '',
                                                            'selectedSpecsSection',
                                                        )
                                                    }
                                                    name="specsSectionId"
                                                    id="specsSectionId"
                                                />
                                            </div>
                                        </div>
                                        <div className="dropdownFullWidthContainer">
                                            <div className="linebylineInput valid-input dropdownFullWidth">
                                                <Dropdown
                                                    title="submittalType"
                                                    data={
                                                        this.state
                                                            .SubmittalTypes
                                                    }
                                                    selectedValue={
                                                        this.state
                                                            .selectedSubmittalType
                                                    }
                                                    handleChange={event =>
                                                        this.handleChangeDropDown(
                                                            event,
                                                            'submittalTypeId',
                                                            false,
                                                            '',
                                                            '',
                                                            '',
                                                            'selectedSubmittalType',
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="linebylineInput valid-input  dropdownFullWidth">
                                                <Dropdown
                                                    title="area"
                                                    data={this.state.areas}
                                                    selectedValue={
                                                        this.state
                                                            .selectedArea
                                                    }
                                                    handleChange={event =>
                                                        this.handleChangeDropDown(
                                                            event,
                                                            'area',
                                                            false,
                                                            '',
                                                            '',
                                                            '',
                                                            'selectedArea',
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="dropdownFullWidthContainer">
                                            <div className="linebylineInput valid-input dropdownFullWidth">
                                                <Dropdown
                                                    title="location"
                                                    data={
                                                        this.state.locations
                                                    }
                                                    selectedValue={
                                                        this.state
                                                            .selectedLocation
                                                    }
                                                    handleChange={event =>
                                                        this.handleChangeDropDown(
                                                            event,
                                                            'location',
                                                            false,
                                                            '',
                                                            '',
                                                            '',
                                                            'selectedLocation',
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="linebylineInput valid-input dropdownFullWidth">
                                                <Dropdown
                                                    title="contractPo"
                                                    isMulti={false}
                                                    data={
                                                        this.state.contracts
                                                    }
                                                    selectedValue={
                                                        this.state
                                                            .selectedContract
                                                    }
                                                    handleChange={event =>
                                                        this.handleChangeDropDown(
                                                            event,
                                                            'contractId',
                                                            false,
                                                            '',
                                                            '',
                                                            '',
                                                            'selectedContract',
                                                        )
                                                    }
                                                    name="contractId"
                                                    id="contractId"
                                                    index="contractId"
                                                />
                                            </div>
                                        </div>
                                        <div className="dropdownFullWidthContainer">
                                            <div className="linebylineInput valid-input dropdownFullWidth">
                                                <Dropdown
                                                    title="approvalStatus"
                                                    isMulti={false}
                                                    data={
                                                        this.state
                                                            .approvales
                                                    }
                                                    selectedValue={
                                                        this.state
                                                            .selectedApprovalStatus
                                                    }
                                                    handleChange={event =>
                                                        this.handleChangeDropDownCycles(
                                                            event,
                                                            'approvalStatusId',
                                                            false,
                                                            '',
                                                            '',
                                                            '',
                                                            'selectedApprovalStatus',
                                                        )
                                                    }
                                                    name="approvalStatusId"
                                                    id="approvalStatusId"
                                                    index="approvalStatusId"
                                                />
                                            </div>
                                        </div>
                                    </Fragment>
                                ) : null
                            ) : null}

                            <XSLfile
                                key="docTemplate"
                                projectId={this.state.projectId}
                                companyId={
                                    this.state.document != null
                                        ? this.state.document.companyId
                                        : null
                                }
                                contactId={
                                    this.state.document != null
                                        ? this.state.document.contactId
                                        : null
                                }
                                toCompanyId={
                                    this.state.document != null
                                        ? this.state.document.toCompanyId
                                        : null
                                }
                                toContactId={
                                    this.state.document != null
                                        ? this.state.document.toContactId
                                        : null
                                }
                                disciplineId={
                                    this.state.document != null
                                        ? this.state.document.disciplineId
                                        : null
                                }
                                specsSectionId={
                                    this.state.document != null
                                        ? this.state.document.specsSectionId
                                        : null
                                }
                                submittalTypeId={
                                    this.state.document != null
                                        ? this.state.document
                                            .submittalTypeId
                                        : null
                                }
                                area={
                                    this.state.document != null
                                        ? this.state.selectedArea.label
                                        : null
                                }
                                location={
                                    this.state.document != null
                                        ? this.state.selectedLocation.label
                                        : null
                                }
                                contractId={
                                    this.state.document != null
                                        ? this.state.document.contractId
                                        : null
                                }
                                approvalStatusId={
                                    this.state.documentCycle != null
                                        ? this.state.documentCycle
                                            .approvalStatusId
                                        : null
                                }
                                docType={this.state.docType}
                                documentTemplate={true}
                                link={docTempLink}
                                header="addManyItems"
                                afterUpload={() => {
                                    this.props.afterUpload()
                                }}
                            />
                        </div>
                    </SkyLightStateless>
 
            </div>

        )
    }
}


function mapStateToProps(state, ownProps) {
    return {
        projectId: state.communication.projectId,
        showLeftMenu: state.communication.showLeftMenu,
        showSelectProject: state.communication.showSelectProject,
        projectName: state.communication.projectName,
        moduleName: state.communication.moduleName,
        document: state.communication.document,
        files: state.communication.files,
        workFlowCycles: state.communication.workFlowCycles,
        inventoryItems: state.communication.inventoryItems,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch),
    };
}



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DocTemplateModal));