import React, { Component } from 'react';  
   
import GridSetup from  './GridSetup';
 
import Api from '../../api'

import { Toolbar, Data, Filters } from "react-data-grid-addons";
import documentDefenition from "../../documentDefenition.json";
import Resources from '../../resources.json';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
 const {
  NumericFilter,
  AutoCompleteFilter,
  MultiSelectFilter,
  SingleSelectFilter
} = Filters;

const subjectLink = ({ value ,row}) => { 
	return <a href={'letterAddEdit/'+row.id+'/'+row.projectId}>{row.subject}</a> 
};
 
class Letter extends Component {
  
    constructor(props) {
        super(props)
        let documentObj=documentDefenition['Letters'];
        let cNames=[];
        
        console.log(documentObj);
        documentObj.documentColumns.map((item,index)=>{
        	
        	if(item.isCustom===true){ 
	        	var obj={
	        		key: item.field,
	        		name: Resources[item.friendlyName][currentLanguage],
	        		width: item.minWidth,
			        draggable: true,
	  				sortable: true,
			        resizable: true,
	 				filterable: true,
	    			sortDescendingFirst: true, 
	    			formatter: item.field=='subject'?  subjectLink : null, 
	    			//getRowMetaData: (data)=>(data),
	    			filterRenderer: item.dataType === 'number' ? NumericFilter: SingleSelectFilter
	        	};
	        	cNames.push(obj);
        	}
        });
        
        console.log(cNames);

        this.state = { 
        	projectId: 4330,
        	docType: 'Letters',
            rows: [],
            columns:cNames, 
			pageSize: 50,
			isLoading: true	,
			api: documentObj.documentApi.get,
			pageNumber:0

        } 
    }

	componentWillMount = () => {  
	    let url = this.state.api+"?projectId=" + this.state.projectId+'&pageNumber='+ this.state.pageNumber+'&pageSize='+ this.state.pageSize;
	    this.GetLogData(url, 'rows');
	}

	GetLogData = (url, currState) => { 
	    Api.get(url).then(result => { 
	        console.log('loading data....');
	        this.setState({
	            rows: result,
	            isLoading: false
	        });
	        
	        console.log(result);

	    }).catch(ex => {
	    });

	}

  render() {   
  	const dataGrid = this.state.isLoading===false ? <GridSetup rows={this.state.rows} pageSize={this.state.pageSize}  columns={this.state.columns} /> :null;
  	return( 
  		<div>
  		{dataGrid}
  		</div>
   );
  }

}

export default Letter;