import React, { Component, Fragment } from 'react'

import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import NotifiMsg from '../publicComponants/NotifiMsg';
import Api from '../../api'
import Dropdown from "../OptionsPanels/DropdownMelcous";
import Resources from '../../resources.json';
import DatePicker from '../OptionsPanels/DatePicker'
import moment from 'moment';
import GridSetup from "../../Pages/Communication/GridSetup";
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import Filter from "../FilterComponent/filterComponent";
import Export from "../../Componants/OptionsPanels/Export";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
 
export default class Expenses extends Component {
    constructor(props) {
        super(props)

        const columnsGrid = [
            {
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,
            },
            {
                key: "description",
                name: Resources["description"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,
                filterable: true,
            },
            {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,
                filterable: true,

            },
            {
                key: "expenseValue",
                name: Resources["hours"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,

            },
            {
                key: "approvalStatusName",
                name: Resources["status"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,

            },
            {
                key: "comment",
                name: Resources["comment"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,

            }
        ];

        this.state = {
            startDate: moment(),
            finishDate: moment(),
            Projects: [],
            projectId: '',
            columns: columnsGrid,
            isLoading: true,
            rows: [],
            isCustom: true,
            btnisLoading: false,
            isLoadingsendRequest: false,
            statusClassSuccess: "disNone",
            isLoadingFirst: true,
            Loading: false,
            pageSize: 50,
            pageNumber: 0,
            totalRows: 0,
        };
    }
  
    
    render() {
         
        return (
          <div className="mainContainer">Hamada</div>
 
        )
    } 
}