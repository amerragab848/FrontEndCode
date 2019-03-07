import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../../publicComponants/ConfirmationModal";
import GridSetup from "../../../../Pages/Communication/GridSetup";
import NotifiMsg from '../../../publicComponants/NotifiMsg'
import Export from "../../../../Componants/OptionsPanels/Export";
import config from "../../../../Services/Config";
import Resources from "../../../../resources.json";
import Api from '../../../../api';
import DropDown from '../../../OptionsPanels/DropdownMelcous'
import DatePicker from '../../../OptionsPanels/DatePicker'
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let CurrProject = localStorage.getItem('lastSelectedprojectName')

class ExpensesWorkFlow extends Component {
    constructor(props) {
        const columnsGrid = [
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "arrange",
                name: Resources["arrange"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "subject",
                name: Resources["subject"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }]
            
        super(props)
        this.state = {
          rows:[] ,
          columns: columnsGrid.filter(column => column.visible !== false),
            showCheckbox:true
        }

    }


    componentDidMount = () => {

    }

    render() {

        return (
            <div className="document-fields">

                <form className="proForm datepickerContainer">
                    <div className="linebylineInput valid-input">
                        <div className="inputDev ui input">
                            <DropDown />
                        </div>
                    </div>

                    <div className="linebylineInput valid-input">
                        <div className="inputDev ui input">
                            <DropDown />
                        </div>
                    </div>
                    <div className="linebylineInput valid-input">
                        <label className="control-label">dsadadadasd</label>
                        <div className="inputDev ui input">
                            <input autoComplete="off" type="text" className="form-control fsadfsadsa" id="firstname1" name="firstname1" placeholder="" />
                        </div>
                    </div>

                    <div className="linebylineInput valid-input">
                        <label className="control-label">dsadadadasd</label>
                        <div className="inputDev ui input">
                            <input autoComplete="off" type="text" className="form-control fsadfsadsa" id="firstname1" name="firstname1" placeholder="" />
                        </div>
                    </div>

                </form>

            </div>
        )
    }

}

export default withRouter(ExpensesWorkFlow)

export let MultiApproval = () => {
    // const dataGrid =

    //     <GridSetup  columns={this.state.columns}
    //         showCheckbox={this.state.showCheckbox}
    //         clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
    //     // onRowClick={this.cellClick.bind(this)}
    //     />
  
    return (
        <Fragment>
            <header>
                <h2 className="zero">Multi Approval</h2>
            </header>
            <div className="precycle-grid">
                <table className="ui table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Subject</th>
                           
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td><DropDown data={[{label:'Multi', value:true},{label:'Single', value:false}]}/></td>
                            <td>
                                <img alt="" title="" src="images/table3Dots.png"/>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="submittalFilter">
                    <div className="subFilter">
                        <h3 className="zero">{CurrProject + ' - ' + Resources['expensesWorkFlow'][currentLanguage]}</h3>
                        <span>
                            <svg width="16px" height="18px" viewBox="0 0 16 18" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" >
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" >
                                    <g id="Action-icons/Filters/Hide+text/24px/Grey_Base"
                                        transform="translate(-4.000000, -3.000000)" >
                                    </g>
                                </g>
                            </svg>
                        </span>
                    </div>


                    <div className="filterBTNS">
                        {config.IsAllow(1182) ?
                            <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.setState({ ShowPopup: true })}>New</button>
                            : null}
                        {/* {btnExport} */}
                    </div>

                </div>
                <div className="grid-container">
                    {/* {dataGrid} */}
                </div>
        </Fragment>
            )
}  