import React, { Component, Fragment } from "react";
import Resources from "../../resources.json";
import DropDown from './DropdownMelcous'
import SkyLight from 'react-skylight';
import Config from '../../Services/Config';
import find from 'lodash/find'

////array hold information fro panels (path,title and value  )
const importedPaths = [
    {
        title: "distributionList", path: "./DistributionList", value: 0
    }, {
        title: "sendToWorkFlow", path: "./SendWorkFlow", value: 1
    }, {
        title: "documentApproval", path: "./wfApproval", value: 2
    }, {
        title: "documentApproval", path: "./wfApproval", value: 3
    }, {
        title: "export", path: "./ExportDetails", value: 4
    }, {
        title: "copyTo", path: "./CopyTo", value: 5
    }, {
        title: "sendByEmail", path: "./SendByEmails", value: 6
    }, {
        title: "sendByInbox", path: "./SendToInbox", value: 7
    }, {
        title: "sendTask", path: "./SendTask", value: 8
    }, {
        title: "createTransmittal", path: "./CreateTransmittal", value: 9
    }
]

let publicFonts = currentLanguage === "ar" ? 'cairo-b' : 'Muli, sans-serif'

const actionPanel = {
    control: (styles, { isFocused }) => ({
        ...styles,
        height: '36px',
        borderRadius: '4px',
        boxShadow: 'none',
        transition: ' all 0.4s ease-in-out',
        width: '115px',
        backgroundColor: isFocused ? '#fafbfc' : 'rgba(255, 255, 255, 0)',
        border: isFocused ? 'solid 1px #858d9e' : ' solid 1px #ccd2db',
        cursor: 'pointer',
        '&:hover': {
            border: 'solid 1px #a8b0bf',
            backgroundColor: ' #fafbfc'
        }
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isDisabled ? '#fff' : isSelected ? '#e9ecf0' : isFocused ? '#f2f6fa' : "#fff",
            color: '#3e4352',
            fontSize: '14px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            textTransform: 'capitalize',
            fontFamily: publicFonts,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            fontWeight: '700',
            textOverflow: 'ellipsis',
            zIndex: '155'
        };
    },
    input: styles => ({ ...styles, maxWidth: '100%' }),
    placeholder: styles => ({ ...styles, color: '#5e6475', fontSize: '14px', width: '100%', fontFamily: publicFonts, fontWeight: '700' }),
    singleValue: styles => ({ ...styles, color: '#5e6475', fontSize: '14px', width: '100%', fontFamily: publicFonts, fontWeight: '700', textAlign: 'center' }),
    indicatorSeparator: styles => ({ ...styles, backgroundColor: '#dadee6' }),
    menu: styles => ({ ...styles, zIndex: 155, boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.2)', border: 'solid 1px #ccd2db', top: '-155px', minWidth: '180px' }),
    menuList: styles => ({ ...styles, color: 'red', height: '145px' }),
};
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class DocumentActions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedPanels: [],
            currentTitle: "sendToWorkFlow",
            defualtValue: { label: Resources["action"][currentLanguage], value: '-1' },
            approvalStatus: true
        }

        ////common props which passed to imported panels component
        this.subComponentProps = {
            docTypeId: this.props.docTypeId,
            docId: this.props.docId,
            previousRoute: this.props.perviousRoute,
            approvalStatus: true,
            projectId: this.props.projectId,
            docApprovalId: this.props.docApprovalId,
            currentArrange: this.props.arrange,
        }

    }
    ////handle button clcik for dynamically import panel component and show popUp model with loaded panel
    //// props => item = object hold dynamic path  and title for panel
    handleShowAction = (item) => {
        if (item.value != "-1") {
            import(`${item.path}`)
                .then(module => {
                    ///cahnage approvalStatus (true or false ) to set correct parameter for document approvel 
                    if (item.value == 3)
                        this.subComponentProps = Object.assign(this.subComponentProps, { approvalStatus: false });
                    else
                        this.subComponentProps = Object.assign(this.subComponentProps, { approvalStatus: true });
                    this.setState({ module: module.default, currentTitle: item.title })
                    this.props.showOptionPanel();
                    this.simpleDialog.show();
                });
        }
    }

    componentDidMount = () => {
        ///fillter importedPath array to fill dropdowns (actions) with coorect panels bassed on permmsion given from props  (without reject,approved,workFlow anddistribution panels)
        let dropActions = importedPaths.slice(4, 10);
        let allowActions = [];
        dropActions.map(i => {
            if (this.IsAllow(i.title)) {
                let obj = { label: i.title, value: i.value };
                allowActions.push(obj);
            }
        });
        this.setState({ selectedPanels: allowActions });
    }

    ///check validity of permissin to show or not panel
    IsAllow = (name) => {
        let obj = find(this.props.permission, function (o) { return o.name == name; });
        if (obj) {
            if (obj.code === 0)
                return false;
            else
                return Config.IsAllow(obj.code);
        }
        else {
            if (name === 'export' || name === 'copyTo')
                return true;
            else
                return false;
        }
    }

    render() {
        let Component = this.state.module;
        return (
            <Fragment>
                {
                    this.props.isApproveMode === true ?
                        <div >
                            <button className="primaryBtn-1 btn " type="button" onClick={(e) => this.handleShowAction(importedPaths[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                            <button className="primaryBtn-2 btn middle__btn" type="button" onClick={(e) => this.handleShowAction(importedPaths[3])} >{Resources.approvalModalReject[currentLanguage]}</button>
                        </div> : null
                }

                <Fragment>
                    {this.IsAllow(importedPaths[1]['title']) ?
                        <button type="button" className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(importedPaths[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                        : null}
                </Fragment>

                <Fragment>
                    {this.IsAllow(importedPaths[0]['title']) ?
                        <button type="button" className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(importedPaths[0])}>{Resources.distributionList[currentLanguage]}</button>
                        : null}
                </Fragment>

                <span className="border"></span>
                <div className="document__action--menu">
                    <Fragment>
                        {this.IsAllow(importedPaths[6]['title']) || this.IsAllow(importedPaths[7]['title'])
                            || this.IsAllow(importedPaths[9]['title']) || this.IsAllow(importedPaths[8]['title']) ?
                            <DropDown data={this.state.selectedPanels} name="ddlActions" handleChange={item => this.handleShowAction(importedPaths[item.value])} index='ddlActions' selectedValue={this.state.defualtValue} styles={actionPanel} />
                            : null}
                    </Fragment>
                </div>
                <div className="largePopup largeModal " style={{ display: this.props.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                        {Component && <Component {...this.subComponentProps} />}
                    </SkyLight>
                </div>
            </Fragment>
        );
    }
}
export default DocumentActions;