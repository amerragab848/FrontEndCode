import React, {
    Component,
    Fragment
} from "react";

import SkyLight from "react-skylight";

import Distribution from "../../Componants/OptionsPanels/DistributionList";
import SendToWorkflow from "../../Componants/OptionsPanels/SendWorkFlow";
import DocumentApproval from "../../Componants/OptionsPanels/wfApproval";

import {
    connect
} from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import * as communicationActions from '../../store/actions/communication';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class ActionsPanel extends Component {
    constructor(props) {}

    handleShowAction = item => {
        if (item.title == "sendToWorkFlow") {
            this.props.actions.SendingWorkFlow(true);
        }
        if (item.value != "0") {
            this.props.actions.showOptionPanel(false);
            this.setState({
                currentComponantDocument: item.value,
                currentTitle: item.title,
                showModal: true
            });
            this.simpleDialog.show();
        }
    };

    executeBeforeModalClose = e => {
        this.setState({
            showModal: false
        });
    };

    render() {

        let actions = [{
                title: "distributionList",
                value: ( <
                    Distribution docTypeId = {
                        this.state.docTypeId
                    }
                    docId = {
                        this.state.docId
                    }
                    projectId = {
                        this.state.projectId
                    }
                    />
                ),
                label: Resources["distributionList"][currentLanguage]
            },
            {
                title: "sendToWorkFlow",
                value: ( <
                    SendToWorkflow docTypeId = {
                        this.state.docTypeId
                    }
                    docId = {
                        this.state.docId
                    }
                    projectId = {
                        this.state.projectId
                    }
                    />
                ),
                label: Resources["sendToWorkFlow"][currentLanguage]
            },
            {
                title: "documentApproval",
                value: ( <
                    DocumentApproval docTypeId = {
                        this.state.docTypeId
                    }
                    docId = {
                        this.state.docId
                    }
                    previousRoute = {
                        this.state.perviousRoute
                    }
                    approvalStatus = {
                        true
                    }
                    projectId = {
                        this.state.projectId
                    }
                    docApprovalId = {
                        this.state.docApprovalId
                    }
                    currentArrange = {
                        this.state.arrange
                    }
                    />
                ),
                label: Resources["documentApproval"][currentLanguage]
            },
            {
                title: "documentApproval",
                value: ( <
                    DocumentApproval docTypeId = {
                        this.state.docTypeId
                    }
                    docId = {
                        this.state.docId
                    }
                    previousRoute = {
                        this.state.perviousRoute
                    }
                    approvalStatus = {
                        false
                    }
                    projectId = {
                        this.state.projectId
                    }
                    docApprovalId = {
                        this.state.docApprovalId
                    }
                    currentArrange = {
                        this.state.arrange
                    }
                    />
                ),
                label: Resources["documentApproval"][currentLanguage]
            }
        ];

        return ( <Fragment >


            {
                this.state.isApproveMode === true ? ( <                    div >
                    <button className = "primaryBtn-1 btn "
                    type = "button"
                    onClick = {
                        e =>
                        this.handleShowAction(
                            actions[2]
                        )
                    } > {
                        Resources
                        .approvalModalApprove[
                            currentLanguage
                        ]
                    } </button> 
                    <button className = "primaryBtn-2 btn middle__btn"
                    type = "button"
                    onClick = {
                        e =>
                        this.handleShowAction(
                            actions[3]
                        )
                    } > {
                        Resources
                        .approvalModalReject[
                            currentLanguage
                        ]
                    } </button> 
                    </div>
                ) : null
            } <            button type = "button"
            className = "primaryBtn-2 btn middle__btn"
            onClick = {                e =>                this.handleShowAction(                    actions[1]                )
            } > {                Resources                .sendToWorkFlow[                    currentLanguage                ]
            } </button> 
            <button type = "button"
            className = "primaryBtn-2 btn"
            onClick = {
                e =>
                this.handleShowAction(                    actions[0]                )
            } > {
                Resources                .distributionList[                    currentLanguage                ]
            } </button>

            <   div className = "largePopup largeModal "
            style = {                {                    display: this.state.showModal ? "block" : "none"                }
            }
            key = "opActionsLetter" >
            <  SkyLight hideOnOverlayClicked ref = {                ref => (this.simpleDialog = ref)            }
            title = {                Resources[this.state.currentTitle][currentLanguage]            }
            beforeClose = {                () => {                    this.executeBeforeModalClose();                }
            } > {
                this.state.currentComponantDocument
            } </SkyLight>
             </div>
              </Fragment>

        )
    }
}

function mapStateToProps(state) {
    return {
        docId: state.communication.docId,
        changeStatus: state.communication.changeStatus
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(ActionsPanel));