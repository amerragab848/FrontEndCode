import React, { Component } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Api from "../../../api";
import Dropdown from "../../OptionsPanels/DropdownMelcous";
import Resources from "../../../resources.json";
import { withRouter } from "react-router-dom";
import LoadingSection from "../../publicComponants/LoadingSection";
import { connect } from "react-redux";
import {
  Add_Contact,
  HidePopUp_Contact,
  ShowNotifyMessage
} from "../../../store/actions/types";
import * as AdminstrationActions from "../../../store/actions/Adminstration";

import { bindActionCreators } from "redux";
import { SkyLightStateless } from "react-skylight";

let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email(Resources["emailFormat"][currentLanguage])
    .required(Resources["emailRequired"][currentLanguage]),
  ContactNameEn: Yup.string().required(
    Resources["contactNameRequired"][currentLanguage]
  ),
  ContactNameAr: Yup.string().required(
    Resources["contactNameRequired"][currentLanguage]
  ),
  Mobile: Yup.number().required(Resources["mobileRequired"][currentLanguage]),
  Telephone: Yup.number().required(
    Resources["telephoneRequired"][currentLanguage]
  )
});
class AddNewContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTitle: "",
      TitleValidation: true,
      TitleData: [],
      isLoading: false,
      sectionLoading: false,
      titleEnCompany: "",
      titleArCompany: "",
      exitsNameEn: false,
      exitsNameAr: false
    };
  }
  handleChange = (item, name) => {
    switch (name) {
      case "title":
        this.setState({ selectedTitle: item, TitleValidation: false });
        break;
      case "ContactNameEn":
        this.setState({ isLoading: true });
        Api.get("CheckContactNameEn?contactNameEn=" + item).then(result => {
          this.setState({ isLoading: false, exitsNameEn: result });
        });
        break;
      case "ContactNameAr":
        this.setState({ isLoading: true });
        Api.get("CheckContactNameAr?contactNameAr=" + item).then(result => {
          this.setState({ isLoading: false, exitsNameAr: result });
        });
        break;
      default:
        break;
    }
  };

  Save = values => {
    let SendingObject = {
      titleId: this.state.selectedTitle.value,
      title: this.state.selectedTitle.label,
      contactNameEn: values.contactNameEn,
      contactNameAr: values.ContactNameAr,
      positionEn: values.positionEn,
      positionAr: values.positionAr,
      addressEn: values.addressEn,
      addressAr: values.addressAr,
      telephone: values.Telephone,
      mobile: values.mobile,
      email: values.email,
      companyId: this.props.companyID
    };

    let url = "AddCompanyContactOnly";
    this.props.actions.addContact(url, SendingObject);
  };

  componentDidMount() {}
  _component = () => {
    return (
      <div className="dropWrapper">
        {this.state.sectionLoading ? (
          <LoadingSection />
        ) : (
          <Formik
            initialValues={{
              email: "",
              ContactNameEn: "",
              ContactNameAr: "",
              Mobile: "",
              positionEn: "",
              positionAr: "",
              addressEn: "",
              addressAr: "",
              Telephone: ""
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={values => {
              if (!this.state.exitsNameEn && !this.state.exitsNameAr)
                this.Save(values);
            }}
          >
            {({ touched, errors, handleBlur, handleChange, values }) => (
              <Form
                id="signupForm1"
                className="proForm customProform"
                noValidate="novalidate"
              >
                <div className="fullWidthWrapper">
                  <h2 className="twoLineHeader">
                    {Resources["addContact"][currentLanguage]}
                  </h2>
                </div>
                <Dropdown
                  title="title"
                  data={this.props.titleData}
                  defaultValue={this.state.selectedTitle}
                  handleChange={e => this.handleChange(e, "title")}
                  index="discipline"
                  name="title"
                  handleBlur={handleBlur}
                />
                <div
                  className={
                    errors.email && touched.email
                      ? "ui input inputDev fillter-item-c has-error"
                      : !errors.password && touched.password
                      ? "ui input inputDev fillter-item-c has-success"
                      : "ui input inputDev fillter-item-c"
                  }
                >
                  <label className="control-label">
                    {" "}
                    {Resources["email"][currentLanguage]}{" "}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className="form-control"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={Resources["email"][currentLanguage]}
                  />
                  {errors.email && touched.email ? (
                    <span className="glyphicon glyphicon-remove form-control-feedback spanError" />
                  ) : !errors.email && touched.email ? (
                    <span className="glyphicon form-control-feedback glyphicon-ok" />
                  ) : null}
                  {errors.email && touched.email ? (
                    <em className="pError">{errors.email}</em>
                  ) : null}
                </div>
                <div
                  className={
                    "ui input inputDev fillter-item-c " +
                    ((errors.ContactNameEn && touched.ContactNameEn) ||
                    this.state.exitsNameEn
                      ? " has-error"
                      : !errors.password && touched.password
                      ? "has-success"
                      : " ")
                  }
                >
                  <label className="control-label">
                    {" "}
                    {Resources["ContactNameEn"][currentLanguage]}{" "}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className="form-control"
                    name="ContactNameEn"
                    onBlur={e => {
                      handleBlur(e);
                      this.handleChange(e.target.value, "ContactNameEn");
                    }}
                    onChange={handleChange}
                    placeholder={Resources["ContactNameEn"][currentLanguage]}
                  />
                  {(errors.ContactNameEn && touched.ContactNameEn) ||
                  this.state.exitsNameEn ? (
                    <span className="glyphicon glyphicon-remove form-control-feedback spanError" />
                  ) : !errors.ContactNameEn &&
                    touched.ContactNameEn &&
                    !this.state.exitsNameEn ? (
                    <span className="glyphicon form-control-feedback glyphicon-ok" />
                  ) : null}
                  {errors.ContactNameEn &&
                  touched.ContactNameEn &&
                  this.state.exitsNameEn ? (
                    <em className="pError">{errors.ContactNameEn}</em>
                  ) : null}
                  {!errors.ContactNameEn && this.state.exitsNameEn ? (
                    <em className="pError">{"name is exist"}</em>
                  ) : null}
                </div>
                <div
                  className={
                    (errors.ContactNameAr && touched.ContactNameAr) ||
                    this.state.exitsNameAr
                      ? "ui input inputDev fillter-item-c has-error"
                      : !errors.password && touched.password
                      ? "ui input inputDev fillter-item-c has-success"
                      : "ui input inputDev fillter-item-c"
                  }
                >
                  <label className="control-label">
                    {" "}
                    {Resources["ContactNameAr"][currentLanguage]}{" "}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className="form-control"
                    name="ContactNameAr"
                    onBlur={e => {
                      handleBlur(e);
                      this.handleChange(e.target.value, "ContactNameAr");
                    }}
                    onChange={handleChange}
                    placeholder={Resources["ContactNameAr"][currentLanguage]}
                  />
                  {(errors.ContactNameAr && touched.ContactNameAr) ||
                  this.state.exitsNameAr ? (
                    <span className="glyphicon glyphicon-remove form-control-feedback spanError" />
                  ) : !errors.ContactNameAr &&
                    touched.ContactNameAr &&
                    !this.state.exitsNameAr ? (
                    <span className="glyphicon form-control-feedback glyphicon-ok" />
                  ) : null}
                  {errors.ContactNameAr &&
                  touched.ContactNameAr &&
                  this.state.exitsNameAr ? (
                    <em className="pError">{errors.ContactNameAr}</em>
                  ) : null}
                  {!errors.ContactNameAr && this.state.exitsNameAr ? (
                    <em className="pError">{"name is exist"}</em>
                  ) : null}
                </div>
                <div className="ui input inputDev fillter-item-c">
                  <label className="control-label">
                    {" "}
                    {Resources["EnglishPosition"][currentLanguage]}{" "}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className="form-control"
                    name="positionEn"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={Resources["EnglishPosition"][currentLanguage]}
                  />
                </div>

                <div className="ui input inputDev fillter-item-c">
                  <label className="control-label">
                    {" "}
                    {Resources["ArabicPosition"][currentLanguage]}{" "}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className="form-control"
                    name="positionAr"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={Resources["ArabicPosition"][currentLanguage]}
                  />
                </div>

                <div className="ui input inputDev fillter-item-c">
                  <label className="control-label">
                    {" "}
                    {Resources["EnglishAddress"][currentLanguage]}{" "}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className="form-control"
                    name="addressEn"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={Resources["EnglishAddress"][currentLanguage]}
                  />
                </div>

                <div className="ui input inputDev fillter-item-c">
                  <label className="control-label">
                    {" "}
                    {Resources["ArabicAddress"][currentLanguage]}{" "}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className="form-control"
                    name="addressAr"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={Resources["ArabicAddress"][currentLanguage]}
                  />
                </div>

                <div
                  className={
                    errors.Telephone && touched.Telephone
                      ? "ui input inputDev fillter-item-c has-error"
                      : !errors.password && touched.password
                      ? "ui input inputDev fillter-item-c has-success"
                      : "ui input inputDev fillter-item-c"
                  }
                >
                  <label className="control-label">
                    {" "}
                    {Resources["Telephone"][currentLanguage]}{" "}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className="form-control"
                    name="Telephone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={Resources["Telephone"][currentLanguage]}
                  />
                  {errors.Telephone && touched.Telephone ? (
                    <span className="glyphicon glyphicon-remove form-control-feedback spanError" />
                  ) : !errors.Telephone && touched.Telephone ? (
                    <span className="glyphicon form-control-feedback glyphicon-ok" />
                  ) : null}
                  {errors.Telephone && touched.Telephone ? (
                    <em className="pError">{errors.Telephone}</em>
                  ) : null}
                </div>

                <div
                  className={
                    errors.Mobile && touched.Mobile
                      ? "ui input inputDev fillter-item-c has-error"
                      : !errors.password && touched.password
                      ? "ui input inputDev fillter-item-c has-success"
                      : "ui input inputDev fillter-item-c"
                  }
                >
                  <label className="control-label">
                    {" "}
                    {Resources["Mobile"][currentLanguage]}{" "}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className="form-control"
                    name="Mobile"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={Resources["Mobile"][currentLanguage]}
                  />
                  {errors.Mobile && touched.Mobile ? (
                    <span className="glyphicon glyphicon-remove form-control-feedback spanError" />
                  ) : !errors.Mobile && touched.Mobile ? (
                    <span className="glyphicon form-control-feedback glyphicon-ok" />
                  ) : null}
                  {errors.Mobile && touched.Mobile ? (
                    <em className="pError">{errors.Mobile}</em>
                  ) : null}
                </div>
                <div className="fullWidthWrapper">
                  <button className="primaryBtn-1 btn largeBtn" type="submit">
                    {" "}
                    {Resources["save"][currentLanguage]}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    );
  };
  render() {
    return (
      <div>
        <div
          className="largePopup"
          style={{ display: this.props.companies.popUp ? "block" : "none" }}
        >
          <SkyLightStateless
            isVisible={true}
            onCloseClicked={() => {
              this.props.actions.TogglePopUp();
              this.props.actions.toggleNotifyMessage();
            }}
          >
            {this._component()}
          </SkyLightStateless>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  let sState = state;
  return sState;
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AdminstrationActions, dispatch)
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddNewContact)
);
