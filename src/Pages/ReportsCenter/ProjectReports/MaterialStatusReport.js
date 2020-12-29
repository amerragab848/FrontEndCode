import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Export from "../../../Componants/OptionsPanels/Export"; 
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";

import Dataservice from '../../../Dataservice';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')
class MaterialStatusReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            ProjectsData: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: "0" },
            rows: [],
            pageSize: 200,
        }

        if (!Config.IsAllow(3688)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.columns = [
            {
                field: "projectName",
                title: Resources["projectName"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: "resourceCode",
                title: Resources["resourceCode"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "description",
                title: Resources["description"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "unitPrice",
                title: Resources["unitPrice"][currentLanguage],
                width: 14,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "quantity",
                title: Resources["quantity"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }
        ];

    }

    componentWillMount() {
        this.setState({ isLoading: true })
        Dataservice.GetDataGrid('GetMaterialStatus').then(
            res => {
                this.setState({
                    rows: res,
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
                gridKey="materialStatusReport"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'invoicesReport'} />
            : null

        return (

            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.materialStatusReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>

        )
    }

}
export default withRouter(MaterialStatusReport)
