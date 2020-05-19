import React, { Component } from 'react';

import ContentEditable from 'react-contenteditable';

import { Editor, Frame, useNode, Canvas, useEditor } from '@craftjs/core';

import { v1 as uuidv1 } from 'uuid';

import './styles.css';

import { ReactComponent as CloseIcon } from './close.svg';
import { ReactComponent as ChevronDownIcon } from './chevron-down.svg';

const Container = ({ children }) => {
    const {
        connectors: { connect },
    } = useNode();

    return (
        <div ref={connect} className="document-canvas">
            {children}
        </div>
    );
};

const Row = ({ children }) => {
    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <div ref={ref => connect(drag(ref))} className="proForm editor">
            {children}
        </div>
    );
};

const Text = ({ text }) => {
    const {
        connectors: { connect, drag },
        setProp,
    } = useNode();

    let uuid = uuidv1();

    return (
        <div
            className="linebylineInput valid-input odd"
            ref={ref => connect(drag(ref))}>
            <label className="control-label">
                [
                <ContentEditable
                    html={text}
                    onChange={e =>
                        setProp(props => (props.text = e.target.value))
                    }
                    tagName="span"
                />
                ]
            </label>
            <div className="inputDev ui input has-error">
                <input
                    className="form-control fsadfsadsa"
                    id={'field-' + uuid}
                    placeholder={text}
                    autoComplete="off"
                    value=""
                    name={text}
                    readOnly
                    disabled
                    datatype="text"
                />
            </div>
        </div>
    );
};

const DatePicker = ({ text }) => {
    const {
        connectors: { connect, drag },
        setProp,
    } = useNode();

    let uuid = uuidv1();

    return (
        <div
            className="linebylineInput valid-input odd"
            ref={ref => connect(drag(ref))}>
            <div
                className="customDatepicker fillter-status fillter-item-c"
                style={{
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'flex-start',
                }}>
                <label className="control-label">
                    [
                    <ContentEditable
                        html={text}
                        onChange={e =>
                            setProp(props => (props.text = e.target.value))
                        }
                        tagName="span"
                    />
                    ]
                </label>
                <div
                    className="inputDev ui input input-group date NormalInputDate"
                    style={{ maxWidth: '192px' }}>
                    <input
                        className="sc-bwzfXH kGGIis"
                        placeholder="Select a date"
                        id={'field-' + uuid}
                        type="text"
                        value="YYYY-MM-DD"
                        readOnly
                        disabled
                        datatype="date"
                    />
                </div>
            </div>
        </div>
    );
};

const SystemDropDowns = () => {
    let uuid = uuidv1();

    return (
        <Row>
            <div className="linebylineInput valid-input mix_dropdown odd">
                <input type="hidden" id={uuid} datatype="system-dropdowns" />
                <label className="control-label">From Company</label>
                <div className="supervisor__company">
                    <div className="super_name">
                        <div
                            className="fillter-status fillter-item-c new_height"
                            style={{ textAlign: 'left' }}>
                            <div
                                className="customD_Menu"
                                style={{
                                    outline: 'none',
                                    position: 'relative',
                                }}>
                                <div>
                                    <div
                                        className="css-1pcexqc-container companyName1"
                                        id="fromCompanyId">
                                        <div className="css-sbntoc-control">
                                            <div className="css-1hwfws3">
                                                <div className="css-mc5y5a-singleValue">
                                                    Select Company
                                                </div>
                                                <div className="css-1jsskz2"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="super_company">
                        <div
                            className="fillter-status fillter-item-c new_height"
                            style={{ textAlign: 'left' }}>
                            <div
                                className="customD_Menu"
                                style={{
                                    outline: 'none',
                                    position: 'relative',
                                }}>
                                <div>
                                    <div
                                        className="css-1pcexqc-container contactName1"
                                        id="proposal-fromContactId">
                                        <div className="css-kew30o-control">
                                            <div className="css-1hwfws3">
                                                <div className="css-145t3ae-singleValue">
                                                    Select Contact
                                                </div>
                                                <div className="css-1jsskz2"></div>
                                            </div>
                                            <div className="css-1wy0on6">
                                                <div
                                                    aria-hidden="true"
                                                    class="css-16pqwjk-indicatorContainer">
                                                    <ChevronDownIcon />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="linebylineInput valid-input mix_dropdown odd">
                <label className="control-label">To Company</label>
                <div className="supervisor__company">
                    <div className="super_name">
                        <div
                            className="fillter-status fillter-item-c new_height"
                            style={{ textAlign: 'left' }}>
                            <div
                                className="customD_Menu"
                                style={{
                                    outline: 'none',
                                    position: 'relative',
                                }}>
                                <div>
                                    <div
                                        className="css-1pcexqc-container companyName1"
                                        id="fromCompanyId">
                                        <div className="css-sbntoc-control">
                                            <div className="css-1hwfws3">
                                                <div className="css-mc5y5a-singleValue">
                                                    Select Company
                                                </div>
                                                <div className="css-1jsskz2"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="super_company">
                        <div
                            className="fillter-status fillter-item-c new_height"
                            style={{ textAlign: 'left' }}>
                            <div
                                className="customD_Menu"
                                style={{
                                    outline: 'none',
                                    position: 'relative',
                                }}>
                                <div>
                                    <div
                                        className="css-1pcexqc-container contactName1"
                                        id="proposal-fromContactId">
                                        <div className="css-kew30o-control">
                                            <div className="css-1hwfws3">
                                                <div className="css-145t3ae-singleValue">
                                                    Select Contact
                                                </div>
                                                <div className="css-1jsskz2"></div>
                                            </div>
                                            <div className="css-1wy0on6">
                                                <div
                                                    aria-hidden="true"
                                                    class="css-16pqwjk-indicatorContainer">
                                                    <ChevronDownIcon />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Row>
    );
};

const Info = () => {
    return (
        <div className="proForm editor no-border first-proform">
            <div className="linebylineInput valid-input odd">
                <label className="control-label">Subject</label>
                <div className="inputDev ui input">
                    <input
                        className="form-control fsadfsadsa"
                        placeholder="Subject"
                        autoComplete="off"
                        value=""
                        name="subject"
                        readOnly
                        disabled
                    />
                </div>
            </div>
            <div className="linebylineInput valid-input even">
                <label className="control-label">Status</label>
                <div className="ui checkbox radio radioBoxBlue">
                    <input
                        type="radio"
                        name="proposal-status"
                        value="true"
                        checked
                        readOnly
                        disabled
                    />
                    <label>Opened</label>
                </div>
                <div className="ui checkbox radio radioBoxBlue">
                    <input
                        type="radio"
                        name="proposal-status"
                        value="false"
                        readOnly
                        disabled
                    />
                    <label>Closed</label>
                </div>
            </div>
        </div>
    );
};

Container.craft = {
    rules: {
        canMoveIn: (incomingChildNode, node) => {
            return [Row, SystemDropDowns].includes(incomingChildNode.data.type);
        },
    },
};

Row.craft = {
    rules: {
        canMoveIn: (incomingChildNode, node) => {
            return (
                node.data.nodes.length < 2 &&
                [Text, DatePicker].includes(incomingChildNode.data.type)
            );
        },
    },
};

const ToolBox = () => {
    const { connectors } = useEditor();

    return (
        <div id="editor" className="ui vertical menu">
            <div className="header item">Editor Tools</div>
            <div className="item">
                <button
                    className="fluid ui button"
                    ref={ref =>
                        connectors.create(
                            ref,
                            <Canvas
                                id={`doc-row-${uuidv1()}`}
                                is={Row}></Canvas>,
                        )
                    }>
                    Create Row
                </button>
            </div>
            <div className="item">
                <button
                    className="fluid ui button"
                    ref={ref =>
                        connectors.create(ref, <Text text="Field Name" />)
                    }>
                    Create Text
                </button>
            </div>
            <div className="item">
                <button
                    className="fluid ui button"
                    ref={ref =>
                        connectors.create(ref, <DatePicker text="Field Name" />)
                    }>
                    Create Date
                </button>
            </div>
            <div className="item">
                <button
                    className="fluid ui button"
                    ref={ref => connectors.create(ref, <SystemDropDowns />)}>
                    Create Company/Contact
                </button>
            </div>
            <div className="item">
                <button className="fluid ui button">Generate</button>
            </div>
        </div>
    );
};

class DocGen extends Component {
    state = {
        name: 'New Document',
    };

    close() {
        this.props.history.goBack();
    }

    render() {
        return (
            <div className="mainContainer generator" id="mainContainer">
                <Editor
                    resolver={{
                        Container,
                        Text,
                        Row,
                        DatePicker,
                        SystemDropDowns,
                    }}>
                    <div className="documents-stepper noTabs__document">
                        <div className="submittalHead">
                            <h2 className="zero">
                                [
                                <ContentEditable
                                    html={this.state.name}
                                    onChange={e =>
                                        this.setState({ name: e.target.value })
                                    }
                                    tagName="p"
                                    style={{
                                        display: 'inline-block',
                                        margin: 0,
                                    }}
                                />
                                ]<span>08. Training · Communication</span>
                            </h2>
                            <div
                                className="SubmittalHeadClose"
                                onClick={() => this.close()}>
                                <CloseIcon />
                            </div>
                        </div>
                        <div className="doc-container">
                            <div className="step-content">
                                <div id="step1" className="step-content-body">
                                    <div className="subiTabsContent">
                                        <div className="document-fields">
                                            <Info />
                                            <Frame>
                                                <Canvas
                                                    id="doc-fields"
                                                    is={Container}>
                                                    <Canvas
                                                        is={Row}
                                                        id="doc-row-main"></Canvas>
                                                </Canvas>
                                            </Frame>
                                            <div class="slider-Btns">
                                                <button
                                                    disabled
                                                    class="primaryBtn-1 btn meduimBtn"
                                                    type="button">
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ToolBox />
                        </div>
                    </div>
                </Editor>
            </div>
        );
    }
}

export default DocGen;
