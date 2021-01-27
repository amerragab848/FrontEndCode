import React, { Component } from "react";
import Api from "../../api";
import Dropdown from "./DropdownMelcous";
import Resources from "../../resources.json";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
  projectId: Yup.string().required(Resources['projectRequired'][currentLanguage]).nullable(true),
  copiesNumber: Yup.number().integer().min(1)
});

class CopyTo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objCopyTo: {
        projectId: this.props.projectId,
        docId: this.props.docId,
        docType: this.props.docTypeId,
        copiesNumber: 1
      },
      isLoading: false,
      selectedValue: { label: Resources['projectSelection'][currentLanguage], value: "0" },
      Projects: []
    };
  }
  componentWillReceiveProps = (props) => {
    if (props.showModal == false)
      this.setState({ isLoading: false })
  }

  componentDidMount = () => {
    Api.get("GetAccountsProjects").then(result => {
      var data = [];

      result.map(item => {
        var obj = {};
        obj.label = item["projectName"];
        obj.value = item["projectId"];

        data.push(obj);
      });

      let selectedProject = data.find(x => x.value === parseInt(this.props.projectId));

      this.setState({
        Projects: data,
        selectedValue: this.props.projectId != null ? { label: selectedProject.label, value: selectedProject.value } : { label: Resources['projectSelection'][currentLanguage], value: "0" }
      });
    });
  };

  selectValue(value) {

    var objCopy = { ...this.state.objCopyTo };

    objCopy.projectId = value["value"];

    this.setState(state => {
      return {
        objCopyTo: objCopy,
        selectedValue: { label: value.label, value: value.value }
      };
    });
  }

  handleChange = (value, field) => {
    var objCopy = { ...this.state.objCopyTo };
    let newDoc = {};
    newDoc[field] = value;
    Object.assign(objCopy, newDoc);
    this.setState({
      objCopyTo: objCopy
    });

  }

  saveCopyTo() {
    if (this.state.selectedValue.value != "0") {
      this.props.actions.setLoading();
      this.props.actions.copyTo("CopyDocument", this.state.objCopyTo);
    }
  }

  render() {
    return (
      this.props.isLoading == true ? <LoadingSection /> : 
        <div className="document-fields">
          <Formik
            initialValues={{...this.state.objCopyTo}}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={() => {
              this.saveCopyTo();
            }}>
            {({ errors, touched,setFieldTouched, handleSubmit,setFieldValue }) => (
              <Form
                id="letterForm"
                className="proForm datepickerContainer"
                noValidate="novalidate"
                onSubmit={handleSubmit}>
                <div className="dropWrapper">
                  <Dropdown
                    title="Projects"
                    data={this.state.Projects}
                    selectedValue={this.state.selectedValue}
                    handleChange={value => this.selectValue(value)}
                    placeholder="Projects"
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    error={errors.projectId}
                    touched={touched.projectId}
                  />
                  <div className="linebylineInput valid-input fullInputWidth ">
                    <label className="control-label">
                      {Resources.copiesNumber[currentLanguage]}
                    </label>
                    <div className={'inputDev ui input ' + (errors.copiesNumber && touched.copiesNumber ? " has-error" : !errors.copiesNumber && touched.copiesNumber ? " has-success" : " ")}>
                      <input
                        type="text"
                        className="form-control"
                        id="copiesNumber"
                        value={this.state.objCopyTo.copiesNumber}
                        name="copiesNumber"
                        placeholder={Resources.copiesNumber[currentLanguage]}
                        onChange={e => this.handleChange(e.target.value, 'copiesNumber')}
                      />
                     {errors.copiesNumber && touched.copiesNumber ? (<em className="pError"> {errors.copiesNumber} </em>) : null}
                    </div>
                  </div>

                </div>

                <div className="fullWidthWrapper">
                  {this.state.isLoading === false ? (
                    <button className="primaryBtn-1 btn" type="submit" >
                      {Resources["save"][currentLanguage]}
                    </button>
                  ) :
                    (
                      <button className="primaryBtn-1 btn mediumBtn disabled" disabled="disabled">
                        <div className="spinner">
                          <div className="bounce1" />
                          <div className="bounce2" />
                          <div className="bounce3" />
                        </div>
                      </button>
                    )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
    );
  }
}
function mapStateToProps(state) {

  return {
    showModal: state.communication.showModal,
    isLoading: state.communication.isLoading
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CopyTo); 
