import React, { Component } from 'react';  
   
import GridSetup from  './GridSetup';
 
import Api from '../../api'

import { Toolbar, Data, Filters } from "react-data-grid-addons";
import documentDefenition from "../../documentDefenition.json";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
 const {
  NumericFilter,
  AutoCompleteFilter,
  MultiSelectFilter,
  SingleSelectFilter
} = Filters;

const subjectLink = ({ value }) => {
	//style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"
  return <div id="divSubject" ><a data-bind="attr: { href: '#lettersAddEdit/' + $parent.entity.id + '/' + $parent.entity.projectId + '/' + undefined  + '/' + undefined + '/' + undefined + '/' + $parent.entity.projectName }"><span>{`${value}%`}</span></a></div>;
};

class Letter extends Component {
  
    constructor(props) {
        super(props)
        let documentObj=documentDefenition['Letters'];
        let cNames=[];
        
        console.log(documentObj);
        documentObj.documentColumns.map(item=>{
        	
        	if(item.isCustom===true){
	        	var obj={
	        		key: item.field,
	        		name: item.friendlyName,
	        		width: item.minWidth,
			        draggable: true,
	  				sortable: true,
			        resizable: true,
	 				filterable: true,
	    			sortDescendingFirst: true, 
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

  	//let columns=this.state.columns;//.map(c => ({ ...c, ...defaultColumnProperties }));
  	const dataGrid = this.state.isLoading===false ? <GridSetup rows={this.state.rows} pageSize={this.state.pageSize}  columns={this.state.columns} /> :null;
  	return( 
  		<div>
  		{dataGrid}
  		</div>
   );
  }

}

export default Letter;