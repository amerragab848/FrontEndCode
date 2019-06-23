import react, { Component } from 'React'

class Search extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        // const dataGrid = this.state.isLoading === false ?
        //     (<GridSetupWithFilter rows={this.state.rows}
        //          showCheckbox={false} columns={this.itemsColumns} key='items' />) 
        //          : <LoadingSection />;

        return (
            <div className="doc-pre-cycle">
                <header className="doc-pre-btn">
                    <h2 className="zero">{Resources.subContractsList[currentLanguage]}</h2>
                    <button className={"primaryBtn-1 btn " + (this.state.isViewMode === true ? 'disNone' : '')} disabled={this.state.isViewMode} onClick={this.viewSubContract}><i className="fa fa-file-text"></i></button>
                </header>
                {/* {dataGrid} */}
            </div>
        );
    }
}
export default Search;