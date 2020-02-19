import React from 'react';
import SkyLight from 'react-skylight';
import DropDown from './DropdownMelcous';
import SendTask from "./SendTask";
import CreateTransmittal from "./CreateTransmittal";
import CreateVO from "./CreateVO";
import ExportDetails from "./ExportDetails";
import SendToInbox from './SendToInbox';
import SendByEmails from './SendByEmails';
import CopyTo from './CopyTo';
import Resources from '../../resources.json';
import Config from '../../Services/Config';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const find = require("lodash/find")
const filter = require("lodash/filter")

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
    menu: styles => ({
        ...styles, zIndex: 155, boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.2)',
        border: 'solid 1px #ccd2db', top: '-155px', minWidth: '180px',
        right: currentLanguage == 'ar' ? 'auto' : '0', left: currentLanguage == 'ar' ? '0' : 'auto'
    }),
    menuList: styles => ({ ...styles, color: 'red', height: '145px' }),
};

class OptionContainer extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            currentComponent: '',
            currentTitle: 'LogControls',
            selectedPanels: [],
            showModal: false,
            defualtValue: { label: Resources["action"][currentLanguage], value: '0' },
            data: [
                { title: "export", value: <ExportDetails />, label: Resources["export"][currentLanguage] },
                { title: "copyTo", value: <CopyTo docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />, label: Resources["copyTo"][currentLanguage] },
                { title: "sendByEmail", value: <SendByEmails docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />, label: Resources["sendByEmail"][currentLanguage] },
                { title: "sendByInbox", value: <SendToInbox docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />, label: Resources["sendByInbox"][currentLanguage] },
                { title: "sendTask", value: <SendTask docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />, label: Resources["sendTask"][currentLanguage] },
                { title: "createTransmittal", value: <CreateTransmittal docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />, label: Resources["createTransmittal"][currentLanguage] },
                { title: "createVO", value: <CreateVO docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />, label: Resources["createVO"][currentLanguage] },
            ]
        }
    }

    componentWillReceiveProps(nextProps, prevState) {
        if (nextProps.showModal != prevState.showModal) {
            this.setState({ showModal: nextProps.showModal });
        }
    };

    handleChange = (item) => {
        if (item.value != "0") {
            this.props.actions.showOptionPanel(false);
            this.props.actions.showOptionPanel(true);
            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            })
            this.simpleDialog.show()
        }
    }

    executeBeforeModalClose = (e) => {
        this.props.actions.showOptionPanel(false);
    }

    IsAllow = (permission) => {
        let obj = find(this.props.permission, function (o) { return o.name == permission; });
        if (obj != undefined) {
            return Config.IsAllow(obj.code);
        }
    }

    componentDidMount = () => {
        let allowPanel = filter(this.state.data, (item) => {
            if (item.value != '0') {
                if (item.title != 'export' && item.title != 'copyTo') {
                    return this.IsAllow(item.title)
                } else {
                    return item
                }
            } else {
                return item;
            }
        })
        this.setState({ selectedPanels: allowPanel })
    }

    render() {
        return (
            <div>
                <DropDown data={this.state.selectedPanels} name="ddlActions" handleChange={this.handleChange} index='ddlActions' selectedValue={this.state.defualtValue} styles={actionPanel} />
                <div className="largePopup" style={{ display: this.state.showModal ? 'block' : 'none' }} key="opActions">
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]} beforeClose={() => { this.executeBeforeModalClose() }}>
                        {this.state.currentComponent}
                    </SkyLight>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        showModal: state.communication.showModal
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionContainer);