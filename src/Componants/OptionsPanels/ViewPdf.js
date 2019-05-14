import React, { Component } from 'react'
import { Document, Page } from "react-pdf/dist/entry.webpack";
export default class ViewPdf extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        numPages: null,
        pageNumber: 1,
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    };

    goToPrevPage = () =>
        this.setState(state => ({ pageNumber: state.pageNumber - 1 }));
    goToNextPage = () =>
        this.setState(state => ({ pageNumber: state.pageNumber + 1 }));

    render() {
        const { pageNumber, numPages } = this.state;
        const url = "https://newgizastorage.blob.core.windows.net/project-files/b9a8b348-45fd-4f86-ba94-7a9d90cee1c6.pdf"
        return (
            <div>
                <nav>
                    <button onClick={this.goToPrevPage}>Prev</button>
                    <button onClick={this.goToNextPage}>Next</button>
                </nav>
                <div style={{ width: 600 }}>
                    <Document
                        file='../../../src/submittals.pdf'
                        onLoadSuccess={this.onDocumentLoadSuccess}
                    >
                        <Page pageNumber={pageNumber} width={600} />
                    </Document>
                </div>
                <p>
                    Page {pageNumber} of {numPages}
                </p>
            </div>
        );
    }
}