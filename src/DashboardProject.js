import React, { Component } from "react";

import { connect } from 'react-redux';
import {
  bindActionCreators
} from 'redux';

import * as dashboardComponantActions from './store/actions/communication';

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
    showLeftMenu: state.communication.showLeftMenu,
    showSelectProject: state.communication.showSelectProject,
    projectId: state.communication.projectId,
    projectName: state.communication.projectName
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
