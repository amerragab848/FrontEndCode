import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import dataservice from "../../../Dataservice";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    contactName: Yup.string().required(Resources['contactNameRequired'][currentLanguage]).nullable(true)
})
class EpsTimeSheet extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            dropDownList: [],
            selectedEps: { label: Resources.selectEPS[currentLanguage], value: 0 },
            rows: [],
            finishDate: moment(),
            startDate: moment(),
        }

        if (!Config.IsAllow(3717)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });

        }

        this.columns = [{
            key: "number",
            name: Resources["arrange"][currentLanguage],
            width: 220,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            frozen: true,
            sortDescendingFirst: true
        }, {
            key: "projectName",
            name: Resources["projectName"][currentLanguage],
            width: 220,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true,
        }, {
            key: "subject",
            name: Resources["subject"][currentLanguage],
            width: 160,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true
        }, {
            key: "total",
            name: Resources["total"][currentLanguage],
            width: 160,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true

        }, {
            key: "estimatedTime",
            name: Resources["estimatedTime"][currentLanguage],
            width: 160,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true,

        }, {
            key: "variance",
            name: Resources["variance"][currentLanguage],
            width: 160,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true,

        }
        ];

    }

    componentDidMount() {
        dataservice.GetDataList('GetAllEPSForDrop', 'title', 'id').then(result => {
            if (Config.IsAllow(3737)) {
                this.columns.push({
                    key: "cost",
                    name: Resources["cost"][currentLanguage],
                    width: 80,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                })
            }
            this.setState({
                dropDownList: result
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }

    getGridRows = () => {
        this.setState({ isLoading: true })
        let obj = {
            epsId: this.state.selectedEps.value,
            startDate: moment(this.state.startDate),
            finishDate: moment(this.state.finishDate)
        }

        Api.post('GetTaskDetailByEpsId', obj).then((res) => {
            if (res.length > 0) {
                this.setState({
                    rows: res, isLoading: false, showChart: true
                });
            }
            else
                this.setState({
                    rows: [], isLoading: false, showChart: false
                });

        }).catch(() => {
            this.setState({ isLoading: false })
        })

    }

    setDate = (name, value) => {
        this.setState({ [name]: value })
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                selectedCopmleteRow={true}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={Resources['epsTimeSheetReport'][currentLanguage]} />
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.epsTimeSheetReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className=''>
                    <Formik
                        initialValues={{ contactName: this.state.selectedEps.value }}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            this.getGridRows()
                        }}>
                        {({ errors, touched, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="InspectionRequestForm" className="proForm reports__proForm" noValidate="novalidate" onSubmit={handleSubmit}>

                                <div className="linebylineInput valid-input">
                                    <Dropdown title="ContactName" name="contactName" index="contactName"
                                        data={this.state.dropDownList} selectedValue={this.state.selectedEps}
                                        handleChange={event => this.setState({ selectedEps: event })}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.contactName}
                                        touched={touched.contactName}
                                        isClear={false}
                                        isMulti={false} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='startDate'
                                        startDate={this.state.startDate}
                                        handleChange={e => this.setDate('startDate', e)} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='finishDate'
                                        startDate={this.state.finishDate}
                                        setDate={e => this.setDate('finishDate', e)} />
                                </div>
                                <button className="primaryBtn-1 btn smallBtn"  >{Resources['search'][currentLanguage]}</button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

} export default EpsTimeSheet;
