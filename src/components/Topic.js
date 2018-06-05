import React from 'react';
import TimeAgo from 'react-timeago';

const Topic = (props) => {
        return (
            <div className="topic card">
                <p className="topic-subject"><strong>{props.topicSubject}</strong></p>
                <hr/>
                <div className="topic-meta">
                    <p className="no-margin">{props.topicStarter}</p>
                    <p className="no-margin">Number of replies: {props.numberOfReplies}</p>
                    <p className="topic-date">Started <TimeAgo date={props.date}/></p>
                </div>
            </div>
        );
};

export default Topic;