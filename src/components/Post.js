import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import TimeAgo from 'react-timeago';
import epochTimeConverter from '../helpers/EpochTimeConverter'
import UserAvatar from 'react-user-avatar';
import ReactMarkdown from 'react-markdown';

class Post extends Component {
    constructor(props, context) {
        super(props);

        this.fetchPost = this.fetchPost.bind(this);

        this.orbitPostData = {
            content: "",
            subject: ""
        };
        this.orbitPostDataFetchStatus = "pending";
    }

    async fetchPost(postID) {
        this.orbitPostDataFetchStatus = "fetching";

        var som = this.props.orbitDB.postsDB.get(postID);
        if (som){
            this.orbitPostData = som;
        }
        this.orbitPostDataFetchStatus = "fetched";
    }

    render(){
        let avatarView = (this.props.blockchainData[0].returnData
            ? <UserAvatar
                size="40"
                className="inline user-avatar"
                src={this.props.avatarUrl}
                name={this.props.blockchainData[0].returnData[2]}/>
            : <div className="user-avatar" style={{width: "40px"}}></div>
        );

        return (
            <div className="pure-u-1-1 post card"
                onClick={() => { this.context.router.push("/topic/"
                    + this.props.blockchainData[0].returnData[4] + "/"
                    + this.props.postID)}}>
                <div className="post-header">
                    <div className="vertical-center-children">
                        {this.props.blockchainData[0].returnData !== null
                            ?<Link to={"/profile/" + this.props.blockchainData[0].returnData[1]
                                + "/" + this.props.blockchainData[0].returnData[2]}
                            onClick={(event) => {event.stopPropagation()}}>
                                {avatarView}
                            </Link>
                            :avatarView
                        }
                        <p className="inline no-margin">
                            <strong>
                                <span style={{color: this.props.blockchainData[0].returnData !== null ? "" : "grey"}}>
                                    {this.props.blockchainData[0].returnData !== null
                                        ?this.props.blockchainData[0].returnData[2]
                                        :"Username"
                                    }
                                </span>
                                <br/>
                                <span style={{color: this.orbitPostData.subject ? "" : "grey"}}>
                                    Subject: {this.orbitPostData.subject}
                                </span>
                            </strong>
                        </p>
                    </div>
                    <div className="post-info">
                        <span>
                            Posted {this.props.blockchainData[0].returnData !== null &&
                                <TimeAgo date={epochTimeConverter(this.props.blockchainData[0].returnData[3])}/>
                            }
                        </span>
                        <span>#{this.props.postIndex}</span>
                    </div>
                </div>
                <hr/>
                <div className="post-content">
                    {this.orbitPostData.content
                        ? <ReactMarkdown source={this.orbitPostData.content} />
                        : <p style={{color: 'grey'}}>Post content...</p>
                    }
                </div>
                <hr/>
                <div className="post-meta">
                    Maybe add buttons for upvote etc here...
                </div>
            </div>
        );
    }

    componentDidUpdate() {
        if (this.props.blockchainData[0].status === "success"
            && this.orbitPostDataFetchStatus === "pending") {
            this.fetchPost(this.props.postID);
        }
    }
};

Post.contextTypes = {
    router: PropTypes.object
};

const mapStateToProps = state => {
    return {
        user: state.user,
        orbitDB: state.orbitDB
    }
};

export default drizzleConnect(withRouter(Post), mapStateToProps);