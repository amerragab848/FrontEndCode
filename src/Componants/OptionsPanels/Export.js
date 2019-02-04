import React, { Component } from 'react' 

import ReactExport from 'react-data-export'; 
import Resources from '../../resources.json'; 
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
 
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Export extends Component {

    constructor(props) {
        super(props);
        this.state = { 
        	rows: this.props.rows,
        	columns: this.props.columns,
        	fileName:this.props.fileName
        } 
    }
 
    render() { 
    	const style= { fill: { patternType: "solid", fgColor: {rgb: "FFCCEEFF"}},font: {sz: "7.5", bold: true}} ;
        return (
            <ExcelFile element={ <button className="primaryBtn-2 btn mediumBtn">EXPORT</button>  } fileExtension="xlsx" filename={this.state.fileName}>
                <ExcelSheet data={this.props.rows} name={this.state.fileName}>
                { this.state.columns.map((column,index)=>  
                	<ExcelColumn label={column.name} width={column.width} value={column.key} key={index} style={style} /> )
           		} 
                </ExcelSheet> 
            </ExcelFile>
        )
    }
}

export default Export;

