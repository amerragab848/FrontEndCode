import React, { Component } from 'react';
import GridCustom from 'react-customized-grid';
//import GridConfig from '../../../grid-config.js';

import * as gridActions from '../../../store/actions/grid';
class CustomGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cells: this.props.cells,
            actions: this.props.actions,
            rowActions: this.props.rowActions,
            rows: this.props.rows
        };
    }

    componentDidMount() {
        //this.props.actions.fetchData(GridConfig[this.props.match.params.document].api.fetch, this.props.match.params.project, 0, 50);
    }

    render() {
        return (
            <div
                className="minimizeRelative"
                style={{ paddingLeft: 130, paddingRight: 40, paddingTop: 72 }}>
                <GridCustom
                    cells={this.state.cells}
                    data={this.props.rows}
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

export default CustomGrid;
