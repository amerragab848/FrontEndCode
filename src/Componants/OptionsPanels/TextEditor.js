import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LoadingSection from './../publicComponants/LoadingSection';

export default class TextEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            rtl: false,
            isLoading: false
        }
    }

    handleChange = (data) => {
        if (this.props.onChange)
            this.props.onChange(data)
    }

    handleChangeTextDirection = (dir) => {
        if (dir !== this.state.rtl) {
            this.setState({ rtl: dir, isLoading: true })
            setTimeout(() => {
                this.setState({ isLoading: false })
            }, 0.001)
        }

    }

    render() {
        return (
            this.state.isLoading ? <LoadingSection /> : (
                <div>
                    <div className="dirIcon">
                        <button type="button" className={`btn ${this.state.rtl ? null : "active"}`} onClick={() => this.handleChangeTextDirection(false)}><i className="fa fa-align-left" aria-hidden="true"></i> </button>
                        <button type="button" className={`btn ${this.state.rtl ? "active" : null}`} onClick={() => this.handleChangeTextDirection(true)}><i className="fa fa-align-right" aria-hidden="true"></i> </button>
                    </div>

                    <CKEditor
                        config={
                            {
                                language: {
                                    content: this.state.rtl ? "ar" : "en"
                                }
                            }
                        }

                        editor={ClassicEditor}
                        data={this.props.value != undefined ? this.props.value : ''}
                        disabled={this.props.disabled != undefined ? this.props.disabled : false}
                        onInit={(event, editor) => {
                            // You can store the "editor" and use when it is needed. 
                        }}
                        onChange={(event, editor) => {
                            // const data = editor.getData();
                            // this.handleChange(data)
                        }}

                        onBlur={(event, editor) => {
                            const data = editor.getData();
                            this.handleChange(data)
                        }}
                    // onFocus={ editor => { 
                    // } }
                    />
                </div>
            )
        )
    }
}