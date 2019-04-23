import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import Dataservice from '../../../Dataservice';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')
class MaterialStatusReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            ProjectsData: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: "0" },
            rows: []
        }

        if (!Config.IsAllow(3688)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.columns = [
            {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "resourceCode",
                name: Resources["resourceCode"][currentLanguage],
                width: 180,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "description",
                name: Resources["description"][currentLanguage],
                width: 180,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "unitPrice",
                name: Resources["unitPrice"][currentLanguage],
                width: 140,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            },
            {
                key: "quantity",
                name: Resources["quantity"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
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
            <GridSetup rows={this.state.rows} showCheckbox={false}
                columns={this.columns} />) : <LoadingSection />

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
