import React, { Component, Fragment } from 'react';
import Resources from "../../resources.json";
import SkyLight from "react-skylight";
import { withRouter } from "react-router-dom";
import GridCustom from "../../Componants/Templates/Grid/CustomCommonLogGrid";
//import GridCustom from 'react-customized-grid';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication"; 
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import { inherits } from '@babel/types';


let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class InventoryItemsModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showInventoryItemsModal: this.props.showInventoryItemsModal,
            inventoryItems: [],
            gridLoading : false
        };
        this.columns = [
            {
                field: 'id',
                title: Resources['arrange'][currentLanguage],
                width: 5,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            },
            {
                field: 'resourceCode',
                title: Resources['resourceCode'][currentLanguage],
                width: 5,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true

            },
            {
                field: 'description',
                title: Resources['description'][currentLanguage],
                width: 17,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true

            },
            {
                field: 'disciplineName',
                title: Resources['disciplineName'][currentLanguage],
                width: 13,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true

            }
            ,
            {
                field: 'remainingQuantity',
                title: Resources['remainingQuantity'][currentLanguage],
                width: 7,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true

            }, {
                field: 'unitPrice',
                title: Resources['unitPrice'][currentLanguage],
                width: 7,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true

            }
            , {
                field: 'total',
                title: Resources['total'][currentLanguage],
                width: 7,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true

            }, {
                field: 'quantity',
                title: Resources['quantity'][currentLanguage],
                width: 7,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true

            },
            {
                field: 'releasedQuantity',
                title: Resources['releasedQuantity'][currentLanguage],
                width: 7,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true

            }
            , {
                field: 'unit',
                title: Resources['unit'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true

            }, {
                field: 'approvedQuantity',
                title: Resources['approvedQuantity'][currentLanguage],
                width: 5,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true

            }
            , {
                field: 'rejectedQuantity',
                title: Resources['rejectedQuantity'][currentLanguage],
                width: 5,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true

            }
            , {
                field: 'pendingQuantity',
                title: Resources['pendingQuantity'][currentLanguage],
                width: 5,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true

            }, {
                field: 'releasePrice',
                title: Resources['releasePrice'][currentLanguage],
                width: 5,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true

            },
            {
                field: 'lastDeliveryDate',
                title: Resources['lastDeliveryDate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true

            }, {
                field: 'lastSendDate',
                title: Resources['lastSendDate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true

            }
            , {
                field: 'lastSendTime',
                title: Resources['lastSendTime'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true

            }, {
                field: 'lastApproveDate',
                title: Resources['lastApproveDate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true

            }, {
                field: 'lastApproveDate',
                title: Resources['lastApproveDate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true

            }, {
                field: 'lastApproveTime',
                title: Resources['lastApproveTime'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true

            }]
    }
    clickMoreDetailsHandler = e => {
        this.props.clickMoreDetailsHandler();

    };
    closeModal = e => {
        this.props.closed();
        this.props.actions.emptyList("inventoryItems")

    }
    componentDidMount() {
        this.simpleDialog.show();

    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.inventoryItems.length != prevProps.inventoryItems.length) {
            this.setState({
                inventoryItems: this.props.inventoryItems || [],
                showInventoryItemsModal: true,
                gridLoading: true
            });
        }
    }
    render() {
        const dataGrid = (
            <GridCustom
                ref='custom-data-grid'
                key="Inventory-Items-Modal"
                groups={[]}
                cells={this.columns}
                data={this.props.inventoryItems || []}
                pageSize={this.props.inventoryItems.length}
                actions={[]}
                rowActions={[]}
                rowClick={() => { }}
            />
        );

        return (
            <div className="mainContainer">
                {this.state.showInventoryItemsModal == true ? (
                    <div className="largePopup largeModal" id="largeModal">
                        <SkyLight
                            ref={ref => this.simpleDialog = ref}
                            title={this.props.title}
                            beforeClose={this.closeModal}
                        >
                            <div className="fullWidthWrapper" id="smallModal">
                                <button onClick={this.clickMoreDetailsHandler}
                                    className="primaryBtn-1 btn mediumBtn"
                                    type="submit"
                                >  {Resources[this.props.buttonName][currentLanguage]}
                                </button>

                                <div className="grid-container fixed__loading">
                                    <br />
                                    {this.state.gridLoading == true ? (
                                    dataGrid
                                    ): null} 
                                </div>
                            </div>
                        </SkyLight>
                    </div>
                ) : null}
            </div>
            // <div>
            //     <SkyLight ref={ref => (this.simpleDialog = ref)}>
            //         <div className="ui modal smallModal ConfirmationModal" id="smallModal">
            //             <div className="header zero">
            //                 {this.props.title}
            //             </div>
            //             <div className="actions">
            //                 <button className="defaultBtn btn cancel smallBtn" type="button" onClick={this.clickHandlerCancel}>
            //                     {this.props.cancel ? Resources[this.props.cancel][currentLanguage] : Resources["cancel"][currentLanguage]}
            //                 </button>

            //                 <button className="smallBtn primaryBtn-1 btn approve" type="button" onClick={this.clickHandlerContinue}>
            //                     {this.props != null ? Resources[this.props.buttonName][currentLanguage] : Resources["goEdit"][currentLanguage]}
            //                 </button>
            //             </div>
            //         </div>
            //     </SkyLight>
            // </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        inventoryItems: state.communication.inventoryItems
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InventoryItemsModal));
