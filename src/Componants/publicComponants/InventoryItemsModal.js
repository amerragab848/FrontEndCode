import React, { Component, Fragment } from 'react';
import Resources from "../../resources.json";
import SkyLight from "react-skylight";
import { withRouter } from "react-router-dom"; 
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication"; 
import ReactTable from "react-table";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

let columns = [];

class InventoryItemsModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showInventoryItemsModal: this.props.showInventoryItemsModal,
            inventoryItems: [],
            gridLoading: false
        };
        columns = [{
            accessor: 'id',
            Header: Resources['arrange'][currentLanguage],
            width: 50
        },
        {
            accessor: 'resourceCode',
            Header: Resources['resourceCode'][currentLanguage],
            width: 130

        },
        {
            accessor: 'description',
            Header: Resources['description'][currentLanguage],
            width: 170

        },
        {
            accessor: 'disciplineName',
            Header: Resources['disciplineName'][currentLanguage],
            width: 130

        }
            ,
        {
            accessor: 'remainingQuantity',
            Header: Resources['remainingQuantity'][currentLanguage],
            width: 160

        }, {
            accessor: 'unitPrice',
            Header: Resources['unitPrice'][currentLanguage],
            width: 160

        }
            , {
            accessor: 'total',
            Header: Resources['total'][currentLanguage],
            width: 160

        }, {
            accessor: 'quantity',
            Header: Resources['quantity'][currentLanguage],
            width: 160

        },
        {
            accessor: 'releasedQuantity',
            Header: Resources['releasedQuantity'][currentLanguage],
            width: 160

        }
            , {
            accessor: 'unit',
            Header: Resources['unit'][currentLanguage],
            width: 150

        }, {
            accessor: 'approvedQuantity',
            Header: Resources['approvedQuantity'][currentLanguage],
            width: 150
        }
            , {
            accessor: 'rejectedQuantity',
            Header: Resources['rejectedQuantity'][currentLanguage],
            width: 150
        }
            , {
            accessor: 'pendingQuantity',
            Header: Resources['pendingQuantity'][currentLanguage],
            width: 150
        }, {
            accessor: 'releasePrice',
            Header: Resources['releasePrice'][currentLanguage],
            width: 150
        },
        {
            accessor: 'lastDeliveryDate',
            Header: Resources['lastDeliveryDate'][currentLanguage],
            width: 100
        }, {
            accessor: 'lastSendDate',
            Header: Resources['lastSendDate'][currentLanguage],
            width: 100
        }
            , {
            accessor: 'lastSendTime',
            Header: Resources['lastSendTime'][currentLanguage],
            width: 100
        }, {
            accessor: 'lastApproveDate',
            Header: Resources['lastApproveDate'][currentLanguage],
            width: 100

        },  {
            accessor: 'lastApproveTime',
            Header: Resources['lastApproveTime'][currentLanguage],
            width: 100
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
        return (
            <div>
                {this.state.showInventoryItemsModal == true ? (
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
                            <br />
                            <div className="doc-pre-cycle"> 
                                <ReactTable
                                    ref={(r) => {
                                        this.selectTable = r;
                                    }}
                                    data={this.props.inventoryItems}
                                    columns={columns}
                                    defaultPageSize={10}
                                    minRows={2}
                                    noDataText={Resources['noData'][currentLanguage]}
                                />
                            </div> 
                        </div>
                    </SkyLight>
                ) : null}
            </div>
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
