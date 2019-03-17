import React, { Component } from 'react';

import FullDashBoard from '../Componants/Index';

import { connect } from 'react-redux';
import {
  bindActionCreators
} from 'redux';

import * as dashboardComponantActions from '../store/actions/dashboardComponant';

class DashBoard extends Component {
  
  componentWillMount = () => {
    
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
    showLeftMenu: state.dashboardComponant.showLeftMenu,
    showSelectProject: state.dashboardComponant.showSelectProject
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(dashboardComponantActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashBoard);