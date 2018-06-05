import React from 'react';
import UserAvatar from 'react-user-avatar';
import TimeAgo from 'react-timeago';
import ReactMarkdown from 'react-markdown';

const Post = (props) => {
    const username = props.username && [props.username, <br key={props.id}/>];

    return (
        <div className="pure-u-1-1 post card">
            <div className="post-header">
                {props.avatarUrl && <UserAvatar
                    size="40"
                    className="inline user-avatar"
                    src={props.avatarUrl}
                    name={props.username}/>}
                <p className="inline no-margin">
                    <strong>{username}Subject: {props.subject}</strong>
                </p>
                <div className="post-info">
                    <span>Posted <TimeAgo date={props.date}/></span>
                    {props.postIndex && <span>#{props.postIndex}</span>}
                </div>
            </div>
            <hr/>
            <div className="post-content">
                <ReactMarkdown source={props.postContent} />
            </div>
            <hr/>
            <div className="post-meta">
                Maybe add buttons for upvote etc here...
            </div>
        </div>
    );
};

export default Post;