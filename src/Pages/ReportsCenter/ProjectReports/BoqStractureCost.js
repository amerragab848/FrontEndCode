import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export"; 
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";

import Dataservice from '../../../Dataservice';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Api from '../../../api.js';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')
const ValidtionSchema = Yup.object().shape({
    selectedBoq: Yup.string()
        .required(Resources['boqType'][currentLanguage])
        .nullable(true),
});

class BoqStractureCost extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            BoqTypeData: [],
            selectedBoq: [{ label: Resources.boqType[currentLanguage], value: "0" }],
            rows: [],
            pageSize: 200,
        }

        if (!Config.IsAllow(4019)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.columns = [
            {
                field: "building",
                title: Resources["Building"][currentLanguage],
                width: 25,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: "code",
                title: Resources["code"][currentLanguage],
                width: 25,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "exists",
                title: Resources["exists"][currentLanguage],
                width: 25,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "rowTotal",
                title: Resources["rowTotal"][currentLanguage],
                width: 25,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
        ];
    }

    componentWillMount() {
        Dataservice.GetDataList('GetBoqStracture', 'title', 'id').then(
            result => {
                this.setState({
                    BoqTypeData: result
                })
            }).catch(() => {
                toast.error('somthing wrong')
            })
    }


    getGridRows = () => {
        this.setState({ isLoading: true })
        let selectedBoqLsit = []
        this.state.selectedBoq.map(s => {
            selectedBoqLsit.push(s.value)
        })
        Api.post('GetTotalBOQParentFromChild', selectedBoqLsit).then(            res => {
                this.setState({
                    rows: res || [],
                    isLoading: false
                }) 
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
              <GridCustom
                ref='custom-data-grid'
                key="BoqStractureCost"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'boqStractureCost'} />
            : null

        return (
            <div className="reports__content reports__multiDrop">
                <header>
                    <h2 className="zero">{Resources.boqStractureCost[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <Formik
                    initialValues={{
                        selectedBoq: '',
                    }}
                    enableReinitialize={true}
                    validationSchema={ValidtionSchema}
                    onSubmit={(values, actions) => {
                        this.getGridRows()
                    }}>
                    {({ errors, touched, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} className="proForm reports__proForm">
                            <div className="linebylineInput multiChoice">
                                <Dropdown title='boqType' data={this.state.BoqTypeData} name='selectedBoq'
                                    isMulti={true} value={this.state.selectedBoq} onChange={setFieldValue}
                                    handleChange={e => this.setState({ selectedBoq: e })}
                                    onBlur={setFieldTouched}
                                    error={errors.selectedBoq}
                                    touched={touched.selectedBoq}
                                    value={values.selectedBoq} />
                            </div>
                            <div className="linebylineInput ">

                                <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

}
export default withRouter(BoqStractureCost)
