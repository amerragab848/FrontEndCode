import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import Config from '../../../Services/Config';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import moment from "moment";
import dataService from '../../../Dataservice'
import BarChartComp from './BarChartComp'
const _ = require('lodash')
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class SubmittalsPerNeighBorhood extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showChart: false,
            finishDate: moment(),
            startDate: moment()
        }

        if (!Config.IsAllow(3761)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

    }

    componentDidMount() {
    }
    componentWillMount() {
      
    }

    getChartData = () => {
            this.setState({ currentComponent: null })
            let reportobj = {
                fromDate: moment(this.state.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                toDate: moment(this.state.finishDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            }
            let currentComponent = <BarChartComp api={'GetEpsCountFromSubmittals'} sendingObj={reportobj} catagName={'title'} catagValue={'count'}
                title={Resources['submittalsPerNeighBorhood'][currentLanguage]} yTitle={Resources['count'][currentLanguage]} seriesName={Resources['count'][currentLanguage]} />
            this.setState({ currentComponent, showChart: true })
    }
    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }
    render() {
        const Chart = this.state.currentComponent
        return (
            <div className='mainContainer main__fulldash'>
                <div className="documents-stepper noTabs__document">
                    <div className="submittalHead">
                        <h2 className="zero">{Resources['technicalOfficeDocument'][currentLanguage]}</h2>
                        <div className="SubmittalHeadClose">
                            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnslink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                        <g id="Group-2">
                                            <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                <g id="Action-icons/Close/Circulated/20pt/Grey_Normal"><g id="Group"><circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                    <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" id="Combined-Shape" fill="#858D9E" fill-rule="nonzero">
                                                    </path>
                                                </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div className="doc-container">
                        <div className="step-content">
                            <div className="document-fields">
                                <div className="proForm datepickerContainer">
                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker title='startDate'
                                            startDate={this.state.startDate}
                                            handleChange={e => this.handleChange('startDate', e)} />
                                    </div>
                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker title='finishDate'
                                            startDate={this.state.finishDate}
                                            handleChange={e => this.handleChange('finishDate', e)} />
                                    </div>

                                    <div className="fullWidthWrapper ">
                                        <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.getChartData()}>{Resources['search'][currentLanguage]}</button>
                                    </div>
                                </div>

                            </div>
                            <div className="doc-pre-cycle letterFullWidth">
                                {this.state.showChart ? Chart : null}
                            </div>

                        </div>
                    </div>
                </div>



            </div >
        )
    }

}


export default SubmittalsPerNeighBorhood
