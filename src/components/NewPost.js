import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import UserAvatar from 'react-user-avatar';
import ReactMarkdown from 'react-markdown';

class NewPost extends Component {
    constructor(props, context) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePreviewToggle = this.handlePreviewToggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            postContent: '',
            previewEnabled: false
        };
    }

    async handleSubmit() {
        /*this.stackId = this.contracts[contract].methods[startTopicMethod].cacheSend();*/
    }

    handleInputChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handlePreviewToggle(){
        this.setState((prevState, props) => ({
          previewEnabled: !prevState.previewEnabled
        }));
    }

    render() {
        return (
            <div className="pure-u-1-1 post card">
                <div className="post-header">
                    <UserAvatar
                        size="40"
                        className="inline user-avatar"
                        src={this.props.user.avatarUrl}
                        name={this.props.user.username}/>
                    <p className="inline no-margin">
                        <strong>{this.props.user.username}<br/>Subject: {this.props.subject}</strong>
                    </p>
                    <div className="post-info">
                        <span></span>
                        <span>#{this.props.postIndex}</span>
                    </div>
                </div>
                <hr/>
                <div className="post-content">
                    <form className="topic-form">
                        {this.state.previewEnabled
                            ? <ReactMarkdown source={this.state.postContent} className="markdownPreview" />
                            : <textarea key={"postContent"}
                            name={"postContent"}
                            value={this.state.postContent}
                            placeholder="Post"
                            id="postContent"
                            onChange={this.handleInputChange} />}
                        <button key="submit"
                            className="pure-button pure-button-primary"
                            type="button"
                            onClick={this.handleSubmit}>
                                Post
                        </button>
                        <button className="pure-button margin-left-small"
                            type="button"
                            onClick={this.handlePreviewToggle}>
                                {this.state.previewEnabled ? "Edit" : "Preview"}
                        </button>
                        <button className="pure-button margin-left-small"
                            type="button"
                            onClick={this.props.onCancelClick}>
                                Cancel
                        </button>
                    </form>
                </div>
            </div>
        );
    }
};

const mapStateToProps = state => {
  return {
    user: state.user
  }
};

export default drizzleConnect(NewPost, mapStateToProps);