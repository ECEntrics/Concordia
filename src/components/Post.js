import React from 'react';
import UserAvatar from 'react-user-avatar';
import TimeAgo from 'react-timeago';
import ReactMarkdown from 'react-markdown';

const Post = (props) => {
    return (
        props.post !== null
        ? <div className="pure-u-1-1 post card">
            <div className="post-header">
                <div className="vertical-center-children">
                    <UserAvatar
                        size="40"
                        className="inline user-avatar"
                        src={props.post.avatarUrl}
                        name={props.post.username}/>
                    <p className="inline no-margin">
                        <strong>
                            {props.post.username}
                            <br/>
                            Subject: {props.post.subject}
                        </strong>
                    </p>
                </div>
                <div className="post-info">
                    <span>Posted <TimeAgo date={props.post.date}/></span>
                    <span>#{props.post.postIndex}</span>
                </div>
            </div>
            <hr/>
            <div className="post-content">
                {props.post.postContent
                    ? <ReactMarkdown source={props.post.postContent} />
                    : <p style={{color: 'grey'}}>Post content...</p>
                }
            </div>
            <hr/>
            <div className="post-meta">
                Maybe add buttons for upvote etc here...
            </div>
        </div>
        : <div className="pure-u-1-1 post card" style={{color: 'grey'}}>
            <div className="post-header">
                <p className="inline no-margin">
                    <strong>Subject</strong>
                </p>
                <div className="post-info">
                    <span>Posted </span>
                </div>
            </div>
            <hr/>
            <div className="post-content">
                <p>Post content...</p>
            </div>
            <hr/>
            <div className="post-meta">
                Maybe add buttons for upvote etc here...
            </div>
        </div>
    );
};

export default Post;