import React, { Component } from 'react';

import CustomGrid from 'react-customized-grid';

export default class Grid extends Component {
    render() {
        return (
            <CustomGrid
                cells={this.props.cells}
                data={this.props.data}
                pageSize={50}
                actions={this.props.actions}
                rowActions={this.props.rowActions}
                rowClick={cell => this.props.rowClick(cell)}
            />
        );
    }
}
