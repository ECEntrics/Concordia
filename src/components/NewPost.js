import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import TimeAgo from 'react-timeago';
import UserAvatar from 'react-user-avatar';
import ReactMarkdown from 'react-markdown';

const contract = "Forum";
const contractMethod = "createPost";

class NewPost extends Component {
    constructor(props, context) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePreviewToggle = this.handlePreviewToggle.bind(this);
        this.validateAndPost = this.validateAndPost.bind(this);
        this.pushToDatabase = this.pushToDatabase.bind(this);

        this.newPostOuterRef = React.createRef();
        this.subjectInputRef = React.createRef();

        this.transactionProgressText = [];
        this.drizzle = context.drizzle;

        this.state = {
            postSubjectInput: this.props.subject ? this.props.subject : "",
            postContentInput: '',
            postSubjectInputEmptySubmit: false,
            postContentInputEmptySubmit: false,
            previewEnabled: false,
            previewDate: "",
            creatingPost: false,
            transactionState: null,
            savingToOrbitDB: null,
            transactionOutputTimerActive: false
        };
    }

    async validateAndPost() {
        if (this.state.postSubjectInput === '' || this.state.postContentInput === ''){
            this.setState({
                postSubjectInputEmptySubmit: this.state.postSubjectInput === '',
                postContentInputEmptySubmit: this.state.postContentInput === ''
            });
            return;
        }

        this.stackId = this.drizzle.contracts[contract].methods[contractMethod].cacheSend(this.props.topicID);
        this.transactionProgressText.push(<br key={uuidv4()}/>);
        this.transactionProgressText.push("Waiting for transaction acceptance...");
        this.setState({
            'creatingPost': true,
            'transactionState': "ACCEPTANCE_PENDING"
        });
    }

    async pushToDatabase() {
        await this.props.orbitDB.postsDB.put(this.postIDFetched, {
            subject: this.state.postSubjectInput,
            content: this.state.postContentInput
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
            <div className="post" ref={this.newPostOuterRef}>
                {this.state.creatingPost && <div id="overlay">
                        <div id="overlay-content">
                            <p><i className="fas fa-spinner fa-3x fa-spin"></i></p>
                            <br/>
                            {this.transactionProgressText}
                        </div>
                    </div>
                }
                <div className="row">
                    <div className="col s1">
                        <UserAvatar
                            size="40"
                            className="inline user-avatar"
                            src={this.props.avatarUrl}
                            name={this.props.user.username}
                        />
                    </div>
                    <div className="col s11">
                        <div>
                            <div className="stretch-space-between">
                                <strong><span>{this.props.user.username}</span></strong>
                                <span className="grey-text text-darken-2">
                                    {this.state.previewEnabled && 
                                        <TimeAgo date={this.state.previewDate}/>
                                    }{this.state.previewEnabled && ","} #{this.props.postIndex}
                                </span>
                            </div>
                            <div className="stretch-space-between">
                                <strong><span>
                                    {this.state.previewEnabled &&
                                        ("Subject: " + this.state.postSubjectInput)
                                    }
                                </span></strong>
                            </div>
                            <div>
                                <form className="topic-form">
                                    {this.state.previewEnabled
                                        ? <ReactMarkdown source={this.state.postContentInput}
                                            className="markdownPreview" />
                                        : [
                                        <input key={"postSubjectInput"}
                                            name={"postSubjectInput"}
                                            className={this.state.postSubjectInputEmptySubmit ? "form-input-required" : ""}
                                            type="text"
                                            value={this.state.postSubjectInput}
                                            placeholder="Subject"
                                            id="postSubjectInput"
                                            ref={this.subjectInputRef}
                                            onChange={this.handleInputChange} />,
                                        <textarea key={"postContentInput"}
                                            name={"postContentInput"}
                                            value={this.state.postContentInput}
                                            placeholder="Post"
                                            id="postContentInput"
                                            onChange={this.handleInputChange} />
                                        ]}
                                    <button key="submit"
                                        className="btn waves-effect waves-teal white black-text"
                                        type="button"
                                        onClick={this.validateAndPost}>
                                            <i className="material-icons right">send</i>Post
                                    </button>
                                    <button className="waves-effect waves-orange btn white black-text margin-left-small"
                                        type="button"
                                        onClick={this.handlePreviewToggle}>
                                        <span>{this.state.previewEnabled ? "Edit" : "Preview"}</span>
                                    </button>
                                    <button className="btn red margin-left-small"
                                        type="button"
                                        onClick={this.props.onCancelClick}>
                                        <span>Cancel</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="divider"></div>
            </div>
        );
    }

    componentWillReceiveProps(){
        if(this.state.creatingPost && !this.state.transactionOutputTimerActive){
            /*      User submitted a new Post       */

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

                    //Gets post's id returned by contract
                    let postData = this.props.transactions[this.txHash].receipt.events.PostCreated
                        .returnValues;
                    this.topicIDFetched = postData.topicID;
                    this.postIDFetched = postData.postID;

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
                            'creatingPost': false,
                            'transactionState': null,
                            'savingToOrbitDB': null,
                            'transactionOutputTimerActive': false
                        });
                        this.props.onPostCreated();
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
                            Post successfully saved in OrbitDB.
                        </strong>
                    </span>);
                    this.setState({'transactionOutputTimerActive': true});
                    this.transactionOutputTimer = setTimeout(() => {
                        this.transactionProgressText = [];
                        this.setState({
                            'creatingPost': false,
                            'transactionState': null,
                            'savingToOrbitDB': null,
                            'transactionOutputTimerActive': false
                        });
                        this.props.onPostCreated();
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
                            'creatingPost': false,
                            'transactionState': null,
                            'savingToOrbitDB': null,
                            'transactionOutputTimerActive': false
                        });
                        this.props.onPostCreated();
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
                        'creatingPost': false,
                        'transactionState': null,
                        'savingToOrbitDB': null,
                        'transactionOutputTimerActive': false
                    });
                    this.props.onPostCreated();
                }, 5000);
            }
        }
    }

    componentDidUpdate(prevProps, prevState){
        if (!this.state.previewEnabled && prevState.previewEnabled){
            this.newPostOuterRef.current.scrollIntoView(true);
        }
    }

    componentDidMount(){
        this.newPostOuterRef.current.scrollIntoView(true);
    }
}

NewPost.contextTypes = {
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

export default drizzleConnect(NewPost, mapStateToProps);