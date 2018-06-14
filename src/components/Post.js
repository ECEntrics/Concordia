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
            <div className="post"
                onClick={() => { this.context.router.push("/topic/"
                    + this.props.blockchainData[0].returnData[4] + "/"
                    + this.props.postID)}}>
                <div className="row">
                    <div className="col s1">
                        {this.props.blockchainData[0].returnData !== null
                            ?<Link to={"/profile/" + this.props.blockchainData[0].returnData[1]
                                + "/" + this.props.blockchainData[0].returnData[2]}
                            onClick={(event) => {event.stopPropagation()}}>
                                {avatarView}
                            </Link>
                            :avatarView
                        }
	                </div>
	                <div className="col s11">
	                    <div>
	                        <div className="stretch-space-between">
                                <strong><span className={this.props.blockchainData[0].returnData !== null ? "" : "grey-text"}}>
                                    {this.props.blockchainData[0].returnData !== null
                                        ?this.props.blockchainData[0].returnData[2]
                                        :"Username"
                                    }
                                </span></strong>
                        		<span className="grey-text text-darken-2">
                            		{this.props.blockchainData[0].returnData !== null &&
                                		<TimeAgo date={epochTimeConverter(this.props.blockchainData[0].returnData[3])}/>
                            		}, #{this.props.postIndex}
                        		</span>
	                        </div>
	                        <div className="stretch-space-between">
								<strong><span className={this.orbitPostData.subject ? "" : "grey-text"}>
                                    Subject: {this.orbitPostData.subject}
                                </span></strong>
	                        </div>
	                        <div>
                    			{this.orbitPostData.content
                        			? <ReactMarkdown source={this.orbitPostData.content} />
                        			: <p className="grey-text">Post content...</p>
                    			}
                			</div>
	                    </div>
	                </div>
	            </div>
	            <div className="row">
	                <div className="post-meta grey-text text-darken-2">
	                    <i className="material-icons waves-effect waves-teal circle">
	                        keyboard_arrow_up
	                    </i>
	                    <span>8</span>
	                    <i className="material-icons waves-effect waves-teal circle">
	                        keyboard_arrow_down
	                    </i>
	                    <i className="material-icons waves-effect waves-teal circle" onClick={props.onHrefClick}>
	                        link
	                    </i>
	                </div>
	            </div>
	            <div className="divider"></div>
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