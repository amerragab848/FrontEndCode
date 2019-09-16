import React, { Component, Fragment } from 'react';
import Resources from "../../resources.json";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import { toast } from "react-toastify";
import orderBy from 'lodash/orderBy';
import { object } from 'prop-types';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class RiskCategorisation extends Component {

    constructor(props) {

        super(props);

        this.state = {
            projectPhase: [],
            organisation: [],
            managementlevel: [],
            project_stage: [],
            lots: [],
            assets_types: [],
            SelectProjectPhase: { label: Resources["projectPhase"][currentLanguage], value: "0" },
            SelectOrganisation: { label: Resources["organisation"][currentLanguage], value: "0" },
            SelectManagementlevel: { label: Resources["managementlevel"][currentLanguage], value: "0" },
            SelectProjectStage: { label: Resources["projectStage"][currentLanguage], value: "0" },
            Selectlots: { label: Resources["lots"][currentLanguage], value: "0" },
            SelectassetsTypes: { label: Resources["assetsTypes"][currentLanguage], value: "0" },
            selectedProjectPhase: [],
            selectedOrganisation: [],
            selectedManagementlevel: [],
            selectedProjectStage: [],
            selectedLots: [],
            selectedAssetsTypes: [],
            bulkSelected: [],
            lastData: [],
            lastSelected: null,

        }
    }

    componentDidMount() {

        if (this.props.riskId) {

            const listType = ["projectPhase", "organisation", "managementlevel", "project_stage", "lots", "assets_types"];

            dataservice.addObject("GetContainsAccountsDefaultList", listType).then(result => {

                let projectPhase = result.filter(x => x.listType === "projectPhase").map(x => { return { label: x.title, value: x.id } });
                let organisation = result.filter(x => x.listType === "organisation").map(x => { return { label: x.title, value: x.id } });
                let managementlevel = result.filter(x => x.listType === "managementlevel").map(x => { return { label: x.title, value: x.id } });
                let project_stage = result.filter(x => x.listType === "project_stage").map(x => { return { label: x.title, value: x.id } });
                let lots = result.filter(x => x.listType === "lots").map(x => { return { label: x.title, value: x.id } });
                let assets_types = result.filter(x => x.listType === "assets_types").map(x => { return { label: x.title, value: x.id } });

                projectPhase.push({ label: "Select ALL", value: 0 });
                organisation.push({ label: "Select ALL", value: 0 });
                managementlevel.push({ label: "Select ALL", value: 0 });
                project_stage.push({ label: "Select ALL", value: 0 });
                lots.push({ label: "Select ALL", value: 0 });
                assets_types.push({ label: "Select ALL", value: 0 });

                this.setState({
                    projectPhase: orderBy(projectPhase, 'value', 'asc'),
                    organisation: orderBy(organisation, 'value', 'asc'),
                    managementlevel: orderBy(managementlevel, 'value', 'asc'),
                    project_stage: orderBy(project_stage, 'value', 'asc'),
                    lots: orderBy(lots, 'value', 'asc'),
                    assets_types: orderBy(assets_types, 'value', 'asc')
                });

                if (this.props.isEdit === true) {

                    dataservice.GetDataGrid("GetCommunicationRiskCategorisationByRiskId?riskId=" + this.props.riskId).then(result => {

                        if (result) {
                            let selectedProjectPhase = result.filter(x => x.categoryType === "projectPhase").map(x => { return { label: x.categoryName, value: x.generalListId } });
                            let selectedOrganisation = result.filter(x => x.categoryType === "organisation").map(x => { return { label: x.categoryName, value: x.generalListId } });
                            let selectedManagementlevel = result.filter(x => x.categoryType === "managementlevel").map(x => { return { label: x.categoryName, value: x.generalListId } });
                            let selectedProjectStage = result.filter(x => x.categoryType === "project_stage").map(x => { return { label: x.categoryName, value: x.generalListId } });
                            let selectedLots = result.filter(x => x.categoryType === "lots").map(x => { return { label: x.categoryName, value: x.generalListId } });
                            let selectedAssetsTypes = result.filter(x => x.categoryType === "assets_types").map(x => { return { label: x.categoryName, value: x.generalListId } });
                            let bulkSelected = result.map(x => { return { label: x.categoryName, value: x.generalListId } });

                            if (projectPhase.filter(x => x.value != 0).length === selectedProjectPhase.length) {
                                selectedProjectPhase.push({ label: "Select ALL", value: 0 });
                            }
                            if (organisation.filter(x => x.value != 0).length === selectedOrganisation.length) {
                                selectedOrganisation.push({ label: "Select ALL", value: 0 });
                            }
                            if (managementlevel.filter(x => x.value != 0).length === selectedManagementlevel.length) {
                                selectedManagementlevel.push({ label: "Select ALL", value: 0 });
                            }
                            if (project_stage.filter(x => x.value != 0).length === selectedProjectStage.length) {
                                project_stage.push({ label: "Select ALL", value: 0 });
                            }
                            if (lots.filter(x => x.value != 0).length === selectedLots.length) {
                                selectedLots.push({ label: "Select ALL", value: 0 });
                            }
                            if (assets_types.filter(x => x.value != 0).length === assets_types.length) {
                                assets_types.push({ label: "Select ALL", value: 0 });
                            }

                            this.setState({
                                bulkSelected,
                                selectedProjectPhase,
                                selectedOrganisation,
                                selectedManagementlevel,
                                selectedProjectStage,
                                selectedLots,
                                selectedAssetsTypes,
                                lastData: result || []
                            });
                        }
                    });
                }
            }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
        }
    }

    toggleSelected(obj, type, selectedValue) {

        let selectAll = obj.filter(x => x.value === 0);

        const lengthObj = obj.length;

        let selectedLengthListTypes = this.state[selectedValue].length;

        let selectedListTypes = this.state[selectedValue].map(x => x.value);

        const retriveObj = obj.map(x => x.value);

        let bulkSelected = this.state.bulkSelected;

        let lastData = this.state.lastData;

        //this is for obj more than one and check if have select all or not

        if (selectAll.length > 0) {

            const id = selectedListTypes.filter((o) => retriveObj.indexOf(o) === -1);

            if (id.length > 0) {

                let idDoc = lastData.find(x => x.generalListId == id[0]);

                dataservice.GetDataGrid("DeleteRiskCategorisation?id=" + idDoc.id).then(result => {

                    const indexBulk = bulkSelected.findIndex(x => x.value === id[0]);

                    const indexData = lastData.findIndex(x => x.id === idDoc.id);

                    bulkSelected.splice(indexBulk, 1);

                    lastData.splice(indexData, 1);

                    if (id[0] != 0) {
                        obj = obj.filter(x => x.value != 0);

                        this.setState({
                            [selectedValue]: obj,
                            bulkSelected,
                            lastData
                        });
                    }
                    else {
                        this.setState({
                            [selectedValue]: obj,
                            bulkSelected,
                            lastData
                        });
                    }

                    toast.success(Resources["operationSuccess"][currentLanguage]);
                });
            }
            else {
                //check if selectedValue have Selected All
                const hasSalectAll = selectedListTypes.filter(x => x.value === 0);

                if (hasSalectAll.length === 0) {

                    let data = this.state[type].filter(x => x.value != 0);

                    this.setState({
                        [selectedValue]: this.state[type]
                    });

                    data.forEach(item => {

                        let isAdding = lastData.filter(x => x.generalListId === item.value);

                        if (isAdding.length === 0) {
                            const document = {
                                riskId: this.props.riskId,
                                categoryType: type,
                                generalListId: item.value,
                                categoryName: item.label
                            }

                            dataservice.addObject("AddRiskCategorisation", document).then(result => {

                                lastData.push(result);

                                const isAdd = bulkSelected.filter(x => x.value === item.value);

                                if (isAdd.length === 0) {
                                    bulkSelected.push(item);
                                }

                                this.setState({
                                    lastData,
                                    bulkSelected
                                });
                            }).catch(ex => {
                                toast.success(Resources["operationCanceled"][currentLanguage]);
                            });
                        }
                    });
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }
            }
        }
        //  this is no select all
        else if (lengthObj > selectedLengthListTypes) {

            const listTypeIds = retriveObj.filter((o) => selectedListTypes.indexOf(o) === -1);

            if (listTypeIds) {

                let categoryName = obj.filter(x => x.value === listTypeIds[0]);

                const document = {
                    riskId: this.props.riskId,
                    categoryType: type,
                    generalListId: listTypeIds[0],
                    categoryName: categoryName[0].label
                }

                dataservice.addObject("AddRiskCategorisation", document).then(result => {

                    lastData.push(result);

                    obj.forEach(item => {
                        let isAdd = bulkSelected.filter(x => x.value === item.value);

                        if (isAdd.length === 0) {
                            bulkSelected.push(item);
                        }
                    });

                    let allData = this.state[type].length - 1;

                    if (lengthObj === allData) {

                        obj.push({ label: "Select ALL", value: 0 });

                        this.setState({
                            [selectedValue]: obj,
                            lastData,
                            bulkSelected
                        });
                    } else {
                        this.setState({
                            [selectedValue]: obj,
                            lastData,
                            bulkSelected
                        });
                    }

                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.success(Resources["operationCanceled"][currentLanguage]);
                });
            }
        } else {

            //check if selectedValue have Selected All
            const isSalectAll = selectedListTypes.indexOf(0);

            if (isSalectAll != -1) {

                selectedListTypes = selectedListTypes.filter(x => x != 0);

                selectedListTypes.forEach(item => {

                    let data = lastData.filter(x => x.generalListId === item);

                    const indexBulk = bulkSelected.findIndex(x => x.value === item);

                    const indexData = lastData.findIndex(x => x.id === data[0].id);

                    bulkSelected.splice(indexBulk, 1);

                    lastData.splice(indexData, 1);

                    this.setState({
                        [selectedValue]: [],
                        bulkSelected,
                        lastData
                    });

                    dataservice.GetDataGrid("DeleteRiskCategorisation?id=" + data[0].id);
                });

                toast.success(Resources["operationSuccess"][currentLanguage]);
            }
            else {
                const id = selectedListTypes.filter((o) => retriveObj.indexOf(o) === -1);

                let idDoc = lastData.find(x => x.generalListId == id[0]);

                dataservice.GetDataGrid("DeleteRiskCategorisation?id=" + idDoc.id).then(result => {

                    const indexBulk = bulkSelected.findIndex(x => x.value === id[0]);

                    const indexData = lastData.findIndex(x => x.id === idDoc.id);

                    bulkSelected.splice(indexBulk, 1);

                    lastData.splice(indexData, 1);

                    this.setState({
                        [selectedValue]: obj,
                        bulkSelected,
                        lastData
                    });

                    toast.success(Resources["operationSuccess"][currentLanguage]);
                });
            }
        }
    }

    render() {
        return (
            <div className="doc-pre-cycle letterFullWidth">
                <div className="document-fields">
                    <header className="subHeader" style={{ paddingTop: '0' }}>
                        <h2 className="zero">{Resources['categorisation'][currentLanguage]}</h2>
                    </header>
                    <Fragment>
                        <div id="riskForm" className="proForm datepickerContainer" noValidate="novalidate">
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="projectPhase"
                                    data={this.state.projectPhase}
                                    handleChange={event => this.toggleSelected(event, "projectPhase", "selectedProjectPhase")}
                                    index="projectPhase"
                                    name="projectPhase"
                                    hideSelectedOptions={false}
                                    backspaceRemovesValue={false}
                                    checked={true}
                                    isMulti={true}
                                    closeMenuOnSelect={false}
                                    checked="true"
                                    value={this.state.selectedProjectPhase}
                                    id="projectPhase" />
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="rbs"
                                    data={this.state.organisation}
                                    handleChange={event => this.toggleSelected(event, "organisation", "selectedOrganisation")}
                                    index="organisation"
                                    name="organisation"
                                    id="organisation"
                                    hideSelectedOptions={false}
                                    backspaceRemovesValue={false}
                                    checked="true"
                                    isMulti={true}
                                    closeMenuOnSelect={false}
                                    value={this.state.selectedOrganisation}
                                />
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="managementlevel"
                                    data={this.state.managementlevel}
                                    handleChange={event => this.toggleSelected(event, "managementlevel", "selectedManagementlevel")}
                                    index="managementlevel"
                                    name="managementlevel"
                                    id="managementlevel"
                                    hideSelectedOptions={false}
                                    backspaceRemovesValue={false}
                                    checked="true"
                                    isMulti={true}
                                    closeMenuOnSelect={false}
                                    value={this.state.selectedManagementlevel}
                                />
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="projectStage"
                                    data={this.state.project_stage}
                                    handleChange={event => this.toggleSelected(event, "project_stage", "selectedProjectStage")}
                                    index="projectStage"
                                    name="projectStage"
                                    id="projectStage"
                                    hideSelectedOptions={false}
                                    backspaceRemovesValue={false}
                                    checked="true"
                                    isMulti={true}
                                    closeMenuOnSelect={false}
                                    value={this.state.selectedProjectStage}
                                />
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="lots"
                                    data={this.state.lots}
                                    handleChange={event => this.toggleSelected(event, "lots", "selectedLots")}
                                    index="lots"
                                    name="lots"
                                    id="lots"
                                    hideSelectedOptions={false}
                                    backspaceRemovesValue={false}
                                    checked="true"
                                    isMulti={true}
                                    closeMenuOnSelect={false}
                                    value={this.state.selectedLots}
                                />
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="assetsTypes"
                                    data={this.state.assets_types}
                                    handleChange={event => this.toggleSelected(event, "assets_types", "selectedAssetsTypes")}
                                    index="assetsTypes"
                                    name="assetsTypes"
                                    id="assetsTypes"
                                    hideSelectedOptions={false}
                                    backspaceRemovesValue={false}
                                    checked="true"
                                    isMulti={true}
                                    closeMenuOnSelect={false}
                                    value={this.state.selectedAssetsTypes}
                                />
                            </div>
                        </div>
                    </Fragment>
                </div>
            </div>
        );
    }
}

export default RiskCategorisation