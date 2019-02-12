import React, { Component } from 'react';
import DropdownMelcous from '../OptionsPanels/DropdownMelcous';
import moment from 'moment';
import Api from '../../api';
import InputMelcous from '../OptionsPanels/InputMelcous';
//let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
var date = moment().format("DD/MM/YYYY");
var LastDate = ((moment().day() == 0) ? moment().subtract(3, "days").format("DD-MM-YYYY") : moment().subtract(1, "days").format("DD-MM-YYYY"));
var TodayTitle = "Today - " + date;
var YesterdayTitle = "Yesterday - " + LastDate;
const options = [
    { value: 'NoDate', label: 'Please Select Date' },
    { value: 'felmeshmesh', label: TodayTitle },
    { value: 'felmeshmesh2', label: YesterdayTitle }
]


class AddTimeSheet_Inputs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Projects: [],
            projectId: '',
            TaskData:[] , 
            taskId:'',
            countryData:[],
            LocationData:[]
        };
    }

    componentDidMount = () => {
        this.GetData("GetAccountsProjectsByIdForList", 'projectName', 'projectId', 'Projects');
        this.GetData("GetAccountsDefaultList?listType=country&pageNumber=0&pageSize=10000",'title','id','countryData');
        this.GetData("GetAccountsDefaultList?listType=timesheetlocation&pageNumber=0&pageSize=10000",'title','id',"LocationData")
    }

    ProjectshandleChange = (e) => {
        this.setState({ taskId:'' })
        let url = "GetTasksAsignUsers?projectId=" + e.value;
        this.setState({ projectId: e.value })
        this.GetData(url, "subject", "id", "TaskData");
    }

    Task_handelChange=(e)=>{
        this.setState({ taskId: e.value })
    }

    render() {
        return (
            <div className="mainContainer">
                <DropdownMelcous
                    title='date'
                    data={options}
                // handleChange={this.To_company_handleChange}
                />
                <div className="form-group fillterinput fillter-item-c">
                    <DropdownMelcous title='Projects' data={this.state.Projects}
                        handleChange={this.ProjectshandleChange} placeholder='Projects' />
                </div>
                <DropdownMelcous title='Task'
                    data={this.state.TaskData} 
                    handleChange={this.Task_handelChange}
                    placeholder='Task' />

               <InputMelcous  title='workHours'placeholderText='workHours'
                       //inputChangeHandler={this.inputSubjectChangeHandler}
                         />

               <DropdownMelcous title='country'
                    data={this.state.countryData} 
                  //  handleChange={this.country_handelChange}
                    placeholder='country' />

                        <DropdownMelcous title='location'
                    data={this.state.LocationData} 
                  //  handleChange={this.country_handelChange}
                    placeholder='location' />
 
              <label>Description</label>
              <textarea> </textarea>
            </div>


        )
    }

    GetData = (url, label, value, currState) => {
        let Data = []
        Api.get(url).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                Data.push(obj);
            });
            this.setState({
                [currState]: [...Data]
            });
        }).catch(ex => {
        });
    }
}





export default AddTimeSheet_Inputs;