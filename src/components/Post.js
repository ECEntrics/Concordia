import React from 'react';
import { Link, withRouter } from 'react-router';
import UserAvatar from 'react-user-avatar';
import TimeAgo from 'react-timeago';
import ReactMarkdown from 'react-markdown';

const Post = (props) => {
    return (
        props.post !== null
        ? <div className="post">
            <div className="row">
                <div className="col s1">
                    <Link to={"/profile/" + props.post.userAddress + "/" + props.post.username}
                        onClick={(event) => {event.stopPropagation()}}>
                        <UserAvatar
                            size="50"
                            className="inline user-avatar"
                            src={props.post.avatarUrl}
                            name={props.post.username}/>
                    </Link>
                </div>
                <div className="col s11">
                    <div>
                        <div className="stretch-space-between">
                            <strong><span>{props.post.username}</span></strong>
                            <span className="grey-text text-darken-2">
                                <TimeAgo date={props.post.date}/>, #{props.post.postIndex}
                            </span>
                        </div>
                        <div className="stretch-space-between">
                            <strong><span>{props.post.subject}</span></strong>
                        </div>
                        <div>
                            {props.post.postContent
                                ? <ReactMarkdown source={props.post.postContent} />
                                : <p style={{color: 'grey'}}>Post content...</p>
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
        : <div className="post grey-text text-darken-2">
            <div className="row">
                <div className="col s1">
                    <div></div>
                </div>
                <div className="col s11">
                    <div>
                        <div className="stretch-space-between">
                            <span></span>
                        </div>
                        <div className="stretch-space-between">
                            <span>Subject:</span>
                        </div>
                        <div>
                            <p>Post content...</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="post-meta">
                </div>
            </div>
            <div className="divider"></div>
        </div>
    );
};

export default withRouter(Post);