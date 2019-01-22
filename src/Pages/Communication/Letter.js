import React, { Component } from 'react';  
   
import GridSetup from  './GridSetup';
 
import Api from '../../api'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const defaultColumnProperties = {
  resizable: true,
  width: 120
};
const ProgressBarFormatter = ({ value }) => {
	//style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"
  return <div id="divSubject" ><a data-bind="attr: { href: '#lettersAddEdit/' + $parent.entity.id + '/' + $parent.entity.projectId + '/' + undefined  + '/' + undefined + '/' + undefined + '/' + $parent.entity.projectName }"><span>{`${value}%`}</span></a></div>;
};

class Letter extends Component {
  
    constructor(props) {
        super(props)
        this.state = { 
        	projectId: 4330,
            rows: [{arange:'1',subject:'subject 001',statusName: 'opened',docDate:'2018/12/31'}],
            columns:[
					  {
					    key: "arrange",
					    name: "arrange"
					  },
					  {
					    key: "subject",
					    name: "subject", formatter: ProgressBarFormatter 
					  },
					  {
					    key: "statusName",
					    name: "status"
					  },
					  {
					    key: "docDate",
					    name: "Document Date"
					  } 
					],
			pageSize: 50,
			isLoading: true		
        } 
    }

	componentWillMount = () => {

	    let url = "GetLettersByProjectIdCustom?projectId=" + this.state.projectId+'&pageNumber=0&pageSize=100';
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

  	let columns=this.state.columns.map(c => ({ ...c, ...defaultColumnProperties }));
  	const dataGrid = this.state.isLoading===false ? <GridSetup rows={this.state.rows} pageSize={this.state.pageSize}  columns={columns} /> :null;
  	return( 
  		<div>
  		{dataGrid}
  		</div>
   );
  }

}

export default Letter;