import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Grid from '../../Componants/Templates/Grid';

import GridConfig from '../../grid-config.js';

import * as gridActions from '../../store/actions/grid';

class Logs extends Component {
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

    componentDidUpdate(prevProps) {
        if (
            prevProps.match.params.document !== this.props.match.params.document
        ) {
            this.props.actions.fetchData(
                GridConfig[this.props.match.params.document].api.fetch,
                this.props.match.params.project,
                0,
                50,
            );

            this.state = {
                cells: GridConfig[this.props.match.params.document].cells,
                actions: GridConfig[this.props.match.params.document].actions,
                rowActions:
                    GridConfig[this.props.match.params.document].rowActions,
            };
        }
    }

    render() {
        return (
            <div
                className="minimizeRelative"
                style={{ paddingLeft: 130, paddingRight: 40, paddingTop: 72 }}>
                <Grid
                    cells={this.state.cells}
                    data={this.props.data}
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
        data: state.grid.data,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(gridActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Logs);
