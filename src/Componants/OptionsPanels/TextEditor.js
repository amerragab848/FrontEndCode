import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default class TextEditor extends React.Component {
    constructor(props) {
        super(props)
      
    }

    handleChange = (data) => {
        if (this.props.onChange)
            this.props.onChange(data)
    }

    render() {
        return (
            <div> 
                <CKEditor
                    editor={ClassicEditor}
                    data={this.props.value !=undefined?this.props.value:''}
                    onInit={(event, editor) => {
                        // You can store the "editor" and use when it is needed. 
                    }}
                    onChange={(event,editor) => {
                        // const data = editor.getData();
                        // this.handleChange(data)
                    }}

                onBlur={ (event,editor) => {
                    const data = editor.getData();
                    this.handleChange(data)
                } }
                // onFocus={ editor => { 
                // } }
                />
            </div>
        )
    }
}