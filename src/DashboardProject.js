import React, { Component } from "react";

import { connect } from 'react-redux';
import {
  bindActionCreators
} from 'redux';

import * as dashboardComponantActions from './store/actions/dashboardComponant';

class DashboardProject extends Component {

  constructor(props) {
    super(props);

  }

  componentWillMount = () => {
    
    var e = { label: this.props.projectName, value: this.props.projectId };

    this.props.actions.RouteToDashboardProject(e); 
  };

  render() {

    return (
      <span>Project Dashboard</span>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    showLeftMenu: state.dashboardComponant.showLeftMenu,
    showSelectProject: state.dashboardComponant.showSelectProject,
    projectId: state.dashboardComponant.projectId,
    projectName: state.dashboardComponant.projectName
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
)( DashboardProject);
