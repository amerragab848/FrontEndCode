import React, { Component } from 'react';

import FullDashBoard from '../Componants/Index';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as dashboardComponantActions from '../store/actions/communication';

class DashBoard extends Component {
    componentDidMount = () => {
        var e = { label: this.props.projectName, value: this.props.projectId };

        this.props.actions.RouteToMainDashboard(e);
    };

    render() {
        return (
            <div className="mainContainer main__fulldash">
                <FullDashBoard />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        showLeftMenu: state.communication.showLeftMenu,
        showSelectProject: state.communication.showSelectProject,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(dashboardComponantActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
