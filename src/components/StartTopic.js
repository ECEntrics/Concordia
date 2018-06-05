import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Post from './Post'

const contract = "Forum";
const startTopicMethod = "createTopic";

class StartTopic extends Component {
    constructor(props, context) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePreviewToggle = this.handlePreviewToggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.drizzle = context.drizzle;
        this.drizzleState = this.drizzle.store.getState();
        this.contracts = this.drizzle.contracts;
        this.abi = this.contracts[contract].abi;
        this.state = {
            topicSubjectInput: '',
            topicMessageInput: '',
            previewEnabled: false,
            previewDate: ""
        };
    }

    async handleSubmit() {
        console.log("contracts:");
        console.log(this.contracts);
        console.log("DS contracts:");
        console.log(this.drizzleState.contracts);

        this.dataKey = this.drizzleState.contracts[contract].methods[startTopicMethod].cacheCall();
        //TODO get return value and pass it to orbit
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
        if(this.dataKey) {
            /*console.log(this.drizzleState);*/
            if (this.drizzleState.contracts[contract]) {
                console.log(this.drizzleState.contracts[contract].storedData[this.dataKey].value);
            }
        }
        return(
            <div>
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
                            type="text"
                            value={this.state.topicSubjectInput}
                            placeholder="Subject"
                            id="topicSubjectInput"
                            onChange={this.handleInputChange} />,
                        <textarea key={"topicMessageInput"}
                            name={"topicMessageInput"}
                            value={this.state.topicMessageInput}
                            placeholder="Post"
                            id="topicMessageInput"
                            onChange={this.handleInputChange} />
                        ]}
                    <button key="submit"
                        className="pure-button"
                        type="button"
                        onClick={this.handleSubmit}>
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
}

StartTopic.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        contracts: state.contracts,
        user: state.user
    }
};

export default drizzleConnect(StartTopic, mapStateToProps);