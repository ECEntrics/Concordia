import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Post from './Post'

const contract = "Forum";
const contractMethod = "createTopic";

class StartTopic extends Component {
    constructor(props, context) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePreviewToggle = this.handlePreviewToggle.bind(this);
        this.validateAndPost = this.validateAndPost.bind(this);
        this.pushToDatabase = this.pushToDatabase.bind(this);

        this.transactionProgressText = [];
        this.drizzle = context.drizzle;

        this.state = {
            topicSubjectInput: '',
            topicMessageInput: '',
            topicSubjectInputEmptySubmit: false,
            topicMessageInputEmptySubmit: false,
            previewEnabled: false,
            previewDate: "",
            creatingTopic: false,
            transactionState: null,
            savingToOrbitDB: null
        };
    }

    async validateAndPost() {
        if (this.state.topicSubjectInput === '' || this.state.topicMessageInput === ''){
            this.setState({
                topicSubjectInputEmptySubmit: this.state.topicSubjectInput === '',
                topicMessageInputEmptySubmit: this.state.topicMessageInput === ''
            });
            return;
        }

        this.stackId = this.drizzle.contracts[contract].methods[contractMethod].cacheSend();
        this.transactionProgressText.push(<br/>);
        this.transactionProgressText.push("Waiting for transaction acceptance...");
        this.setState({
            'creatingTopic': true,
            'transactionState': "ACCEPTANCE_PENDING"
        });
    }

    async pushToDatabase() {
        await this.props.orbitDB.topicsDB.put(this.topicIDFetched, {
            subject: this.state.topicSubjectInput,
            content: this.state.topicMessageInput
        });
        this.setState({'savingToOrbitDB': "SUCCESS"});
    }

    handleInputChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handlePreviewToggle() {
        this.setState((prevState, props) => ({
          previewEnabled: !prevState.previewEnabled,
          previewDate: this.getDate()
        }));
    }

    getDate() {
        const currentdate = new Date();
        return ((currentdate.getMonth() + 1)  + " "
            + currentdate.getDate() + ", "
            + currentdate.getFullYear() + ", "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds());
    }

    render() {
        return(
            <div>
                {this.state.creatingTopic && <div id="overlay">
                        <div id="overlay-content">
                            <p><i className="fas fa-spinner fa-3x fa-spin"></i></p>
                            <br/>
                            {this.transactionProgressText}
                        </div>
                    </div>
                }
                <div className="pure-u-1-1 start-topic-back-button">
                    <p className="no-margin" onClick={this.props.onClick}>
                        <i className="fas fa-arrow-left fa-3x"></i>
                    </p>
                </div>
                {this.state.previewEnabled &&
                    <Post avatarUrl={this.props.user.avatarUrl}
                        username={this.props.user.username}
                        subject={this.state.topicSubjectInput}
                        date={this.state.previewDate}
                        postContent={this.state.topicMessageInput}
                        id={0}/>}
                <form className="topic-form">
                    {!this.state.previewEnabled &&
                        [
                        <input key={"topicSubjectInput"}
                            name={"topicSubjectInput"}
                            className={this.state.topicSubjectInputEmptySubmit && "form-input-required"}
                            type="text"
                            value={this.state.topicSubjectInput}
                            placeholder="Subject"
                            id="topicSubjectInput"
                            onChange={this.handleInputChange} />,
                        <textarea key={"topicMessageInput"}
                            name={"topicMessageInput"}
                            className={this.state.topicMessageInputEmptySubmit && "form-input-required"}
                            value={this.state.topicMessageInput}
                            placeholder="Post"
                            id="topicMessageInput"
                            onChange={this.handleInputChange} />
                        ]}
                    <button key="submit"
                        className="pure-button"
                        type="button"
                        onClick={this.validateAndPost}>
                            Post
                    </button>
                    <button className="pure-button margin-left-small"
                        type="button"
                        onClick={this.handlePreviewToggle}>
                            {this.state.previewEnabled ? "Edit" : "Preview"}
                    </button>
                </form>
            </div>
        );
    }

    componentWillReceiveProps(){ //Maybe change it with this: https://redux.js.org/api-reference/store#subscribe
        let currentDrizzleState = this.drizzle.store.getState();

        if(this.state.creatingTopic){
            if (this.state.transactionState === "ACCEPTANCE_PENDING" && 
                currentDrizzleState.transactionStack[this.stackId]) {
    
                this.txHash = currentDrizzleState.transactionStack[this.stackId];
                this.transactionProgressText.push(<br/>);
                this.transactionProgressText.push("Transaction in progress: txHash = " + this.txHash);
                this.setState({'transactionState': "IN_PROGRESS"});
            } else if (this.state.transactionState === "IN_PROGRESS") {
                if (currentDrizzleState.transactions[this.txHash].status === "success"){
                    this.topicIDFetched = currentDrizzleState.transactions[this.txHash].receipt
                        .events.TopicCreated.returnValues.topicID;
                    this.transactionProgressText.push(<br/>);
                    this.transactionProgressText.push("Transaction completed successfully.");
                    this.transactionProgressText.push(<br/>);
                    this.transactionProgressText.push("TopicID = " + this.topicIDFetched);
                    this.setState({'transactionState': "SUCCESS"});
                } else if (currentDrizzleState.transactions[this.txHash].status === "error"){
                    this.transactionProgressText.push(<br/>);
                    this.transactionProgressText.push("Transaction failed to complete.");
                    this.setState({'transactionState': "ERROR"});
                }
            } else if (this.state.transactionState === "SUCCESS") {
                this.pushToDatabase();
                if (this.state.savingToOrbitDB === "SUCCESS"){
                    this.transactionProgressText.push(<br/>);
                    this.transactionProgressText.push("Post successfully saved in OrbitDB.");
                    this.setState({creatingTopic: false});
                } else if (this.state.savingToOrbitDB === "ERROR"){
                    this.transactionProgressText.push(<br/>);
                    this.transactionProgressText.push(<span style={{color: 'red'}}><strong>
                            An error occurred while trying to save post in OrbitDB.
                        </strong></span>);
                    this.setState({creatingTopic: false});
                }
            } else if (this.state.transactionState === "ERROR"){
                this.transactionProgressText.push(<br/>);
                this.transactionProgressText.push(<span style={{color: 'red'}}><strong>
                        An error occurred while trying to complete transaction.
                    </strong></span>);
                this.setState({creatingTopic: false});
            }
        }
    }
}

StartTopic.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        orbitDB: state.orbitDB,
        user: state.user
    }
};

export default drizzleConnect(StartTopic, mapStateToProps);