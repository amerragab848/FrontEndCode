import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CustomGrid from 'react-customized-grid';

import GridConfig from '../../../grid-config.js';

import * as gridActions from '../../../store/actions/grid';

class Grid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cells: GridConfig[this.props.match.params.document].cells,
            actions: GridConfig[this.props.match.params.document].actions,
            rowActions: GridConfig[this.props.match.params.document].rowActions,
        };
    }

    componentDidMount() {
        this.props.actions.fetchData(
            GridConfig[this.props.match.params.document].api.fetch,
            this.props.match.params.project,
            0,
            50,
        );
    }

    render() {
        return (
            <div
                className="minimizeRelative"
                style={{ paddingLeft: 130, paddingRight: 40, paddingTop: 72 }}>
                <CustomGrid
                    cells={this.state.cells}
                    data={this.props.data}
                    pageSize={50}
                    actions={this.state.actions}
                    rowActions={this.state.rowActions}
                    rowClick={cell => {
                        alert('Row. clicked!!!');
                        console.log(cell);
                    }}
                />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        rowActions: state.grid.rowActions,
        actions: state.grid.actions,
        cells: state.grid.cells,
        data: state.grid.data,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(gridActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
