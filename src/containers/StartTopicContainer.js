import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import Post from '../components/Post'

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
            savingToOrbitDB: null,
            transactionOutputTimerActive: false
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
        this.transactionProgressText.push(<br key={uuidv4()}/>);
        this.transactionProgressText.push("Waiting for transaction acceptance...");
        this.setState({
            'creatingTopic': true,
            'transactionState': "ACCEPTANCE_PENDING"
        });
    }

    async pushToDatabase() {
        await this.props.orbitDB.topicsDB.put(this.topicIDFetched, {
            subject: this.state.topicSubjectInput
        });

        await this.props.orbitDB.postsDB.put(this.postIDFetched, {
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
        return (
            <div>
                {this.state.creatingTopic && <div id="overlay">
                        <div id="overlay-content">
                            <p><i className="fas fa-spinner fa-3x fa-spin"></i></p>
                            <br/>
                            {this.transactionProgressText}
                        </div>
                    </div>
                }
                {this.state.previewEnabled &&
                    <Post post = {{
                            avatarUrl: this.props.user.avatarUrl,
                            username: this.props.user.username,
                            subject: this.state.topicSubjectInput,
                            date: this.state.previewDate,
                            postContent: this.state.topicMessageInput
                        }}
                        id={0}/>}
                <form className="topic-form">
                    {!this.state.previewEnabled &&
                        [
                        <input key={"topicSubjectInput"}
                            name={"topicSubjectInput"}
                            className={this.state.topicSubjectInputEmptySubmit ? "form-input-required" : ""}
                            type="text"
                            value={this.state.topicSubjectInput}
                            placeholder="Subject"
                            id="topicSubjectInput"
                            onChange={this.handleInputChange} />,
                        <textarea key={"topicMessageInput"}
                            name={"topicMessageInput"}
                            className={this.state.topicMessageInputEmptySubmit ? "form-input-required" : ""}
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

    componentWillReceiveProps(){
        if(this.state.creatingTopic && !this.state.transactionOutputTimerActive){
            /*      User submitted a new Topic       */

            if (this.state.transactionState === "ACCEPTANCE_PENDING" && 
                this.props.transactionStack[this.stackId]) {
                /*      User confirmed the transaction       */

                //Gets transaciton's hash
                this.txHash = this.props.transactionStack[this.stackId];

                //Updates output and state
                this.transactionProgressText.push(<br key={uuidv4()}/>);
                this.transactionProgressText.push("Transaction in progress: txHash = " + this.txHash);
                this.setState({'transactionState': "IN_PROGRESS"});
            }
            else if (this.state.transactionState === "IN_PROGRESS") {
                if (this.props.transactions[this.txHash].status === "success"){
                    /*      Transaction completed successfully      */

                    //Gets topic's id returned by contract
                    let topicData = this.props.transactions[this.txHash].receipt.events.TopicCreated
                        .returnValues;
                    this.topicIDFetched = topicData.topicID;
                    this.postIDFetched = topicData.postID;

                    //Updates output and state
                    this.transactionProgressText.push(<br key={uuidv4()}/>);
                    this.transactionProgressText.push(<span key={uuidv4()} style={{color: 'green'}}>
                        <strong>
                            Transaction completed successfully.
                        </strong>
                    </span>);
                    this.transactionProgressText.push(<br key={uuidv4()}/>);
                    this.transactionProgressText.push(<span key={uuidv4()} style={{color: 'green'}}>
                        <strong>
                            TopicID = {this.topicIDFetched}, PostID = {this.postIDFetched}
                        </strong>
                    </span>);
                    this.setState({'transactionState': "SUCCESS"});
                } else if (this.props.transactions[this.txHash].status === "error"){
                    /*      Transaction failed to complete      */

                    //Updates output and state
                    this.transactionProgressText.push(<br key={uuidv4()}/>);
                    this.transactionProgressText.push(<span key={uuidv4()} style={{color: 'red'}}>
                        <strong>
                            Transaction failed to complete with error:
                        </strong>
                    </span>);
                    this.transactionProgressText.push(<br key={uuidv4()}/>);
                    this.transactionProgressText.push(<span key={uuidv4()} style={{color: 'red'}}>
                        <strong>
                            {this.props.transactions[this.txHash].error}
                        </strong>
                    </span>);
                    this.setState({
                        'transactionState': "ERROR",
                        'transactionOutputTimerActive': true
                    });
                    this.transactionOutputTimer = setTimeout(() => {
                        this.transactionProgressText = [];
                        this.setState({
                            'creatingTopic': false,
                            'transactionState': null,
                            'savingToOrbitDB': null,
                            'transactionOutputTimerActive': false
                        });
                    }, 5000);
                }
            }
            else if (this.state.transactionState === "SUCCESS") {
                /*      Transaction completed successfully      */

                //Tries to store data in OrbitDB
                this.pushToDatabase();
                if (this.state.savingToOrbitDB === "SUCCESS"){
                    /*      Data successfully saved in OrbitDB      */

                    //Updates output and state
                    this.transactionProgressText.push(<br key={uuidv4()}/>);
                    this.transactionProgressText.push(<span key={uuidv4()} style={{color: 'green'}}>
                        <strong>
                            Topic successfully saved in OrbitDB.
                        </strong>
                    </span>);
                    this.setState({'transactionOutputTimerActive': true});
                    this.transactionOutputTimer = setTimeout(() => {
                        this.transactionProgressText = [];
                        this.setState({
                            'creatingTopic': false,
                            'transactionState': null,
                            'savingToOrbitDB': null,
                            'transactionOutputTimerActive': false
                        });
                        this.props.router.push("/topic/" + this.topicIDFetched);
                    }, 5000);
                }
                else if (this.state.savingToOrbitDB === "ERROR"){
                    /*      Failed to save data in OrbitDB      */

                    //Updates output and state
                    this.transactionProgressText.push(<br key={uuidv4()}/>);
                    this.transactionProgressText.push(<span key={uuidv4()} style={{color: 'red'}}>
                        <strong>
                            An error occurred while trying to save post in OrbitDB.
                        </strong>
                    </span>);
                    this.setState({'transactionOutputTimerActive': true});
                    this.transactionOutputTimer = setTimeout(() => {
                        this.transactionProgressText = [];
                        this.setState({
                            'creatingTopic': false,
                            'transactionState': null,
                            'savingToOrbitDB': null,
                            'transactionOutputTimerActive': false
                        });
                    }, 5000);
                }
            }
            else if (this.state.transactionState === "ACCEPTANCE_PENDING" &&
                this.props.transactions.undefined !== undefined &&
                this.props.transactions.undefined.status === "error"){
                /*      User probably canceled the transaction      */

                //TODO user can't post after this!
                this.transactionProgressText.push(<br key={uuidv4()}/>);
                this.transactionProgressText.push(<span key={uuidv4()} style={{color: 'orange'}}>
                    <strong>
                        Transaction canceled.
                    </strong>
                </span>);
                this.setState({'transactionState': "SUCCESS"});
                this.setState({'transactionOutputTimerActive': true});
                this.transactionOutputTimer = setTimeout(() => {
                    this.transactionProgressText = [];
                    this.setState({
                        'creatingTopic': false,
                        'transactionState': null,
                        'savingToOrbitDB': null,
                        'transactionOutputTimerActive': false
                    });
                }, 5000);
            }
        }
    }
}

StartTopic.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        transactions: state.transactions,
        transactionStack: state.transactionStack,
        orbitDB: state.orbitDB,
        user: state.user
    }
};

const StartTopicContainer = drizzleConnect(StartTopic, mapStateToProps)

export default StartTopicContainer;