import React, { useState,Component } from "react"; 
import ReactDataGrid from "react-data-grid";   
    
class GridSetup extends Component {

   constructor(props) {

          super(props) 

          this.state={
            columns: [],
            rows: [] 
          };
      };

  componentWillMount = () => {

    // this.setState({
    //   columns: this.props.columns,
    //   rows:    this.props.rows
    // }); 
  }

  render() { 
       return (
          <ReactDataGrid
            columns={this.props.columns}
            rowGetter={i => this.props.rows[i]}
            rowsCount={this.props.rows.length} 
            enableCellSelect={false}
            onColumnResize={(idx, width) =>
              console.log(`Column ${idx} has been resized to ${width}`)
            }
          />
    );
  }
  
}
export default GridSetup;