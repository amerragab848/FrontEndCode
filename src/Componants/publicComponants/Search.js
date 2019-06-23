import react, { Component } from 'React'
import FillterComponent from '../FilterComponent/filterComponent'
class Search extends Component {
    constructor(props) {
        super(props)
    }
    filterMethodMain = () => {

    }
    render() {
        // const dataGrid = this.state.isLoading === false ?
        //     (<GridSetupWithFilter rows={this.state.rows}
        //          showCheckbox={false} columns={this.itemsColumns} key='items' />) 
        //          : <LoadingSection />;
        const ComponantFilter =
            this.state.isLoading === false ? (
                <FillterComponent
                    filtersColumns={this.state.filtersColumns} 
                    filterMethod={this.filterMethodMain}
                    key={this.state.docType}
                />
            ) : null;

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