import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import { Form, TextArea, Button, Icon } from 'semantic-ui-react'

import NewTopicPreview from '../components/NewTopicPreview'

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
        if (!this.props.user.hasSignedUp) {
            this.context.router.push("/signup");
            return(null);
        }

        var previewEditText = this.state.previewEnabled ? "Edit" : "Preview";
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
                    <NewTopicPreview
                        date={this.state.previewDate}
                        subject={this.state.topicSubjectInput}
                        content={this.state.topicMessageInput}
                    />
                }
                <Form>
                    {!this.state.previewEnabled &&
                        [<Form.Field key={"topicSubjectInput"}>
                            <Form.Input name={"topicSubjectInput"}
                                error={this.state.topicSubjectInputEmptySubmit}
                                type="text"
                                value={this.state.topicSubjectInput}
                                placeholder="Subject"
                                id="topicSubjectInput"
                                onChange={this.handleInputChange} />
                        </Form.Field>,
                        <TextArea key={"topicMessageInput"}
                            name={"topicMessageInput"}
                            className={this.state.topicMessageInputEmptySubmit ? "form-textarea-required" : ""}
                            value={this.state.topicMessageInput}
                            placeholder="Post"
                            id="topicMessageInput"
                            rows={5}
                            autoHeight
                            onChange={this.handleInputChange} />]
                    }
                    <br/><br/>
                    <Button.Group>
                        <Button animated key="submit" type="button" color='teal'
                            onClick={this.validateAndPost}>
                            <Button.Content visible>Post</Button.Content>
                            <Button.Content hidden>
                                <Icon name='send' />
                            </Button.Content>
                        </Button>
                        <Button type="button" color='yellow'
                            onClick={this.handlePreviewToggle}>
                            {previewEditText}
                        </Button>
                    </Button.Group>
                </Form>
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
    drizzle: PropTypes.object,
    router: PropTypes.object
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