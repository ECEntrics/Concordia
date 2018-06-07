import React from 'react';
import TimeAgo from 'react-timeago';

const Topic = (props) => {
        return (
            props.topic !== null
                ? <div className={"topic card"}>
                    <p className="topic-subject" style={{color: props.topic.topicSubject ? "" : "grey"}}>
                        <strong>{props.topic.topicSubject ? props.topic.topicSubject : "Subject"}</strong>
                    </p>
                    <hr/>
                    <div className="topic-meta">
                        <p className="no-margin">{props.topic.topicStarter}</p>
                        <p className="no-margin">Number of replies: {props.topic.numberOfReplies}</p>
                        <p className="topic-date">Started <TimeAgo date={props.topic.date}/></p>
                    </div>
                </div>
                : <div className={"topic card"} style={{color: 'grey'}}>
                    <p className="topic-subject"><strong>Subject</strong></p>
                    <hr/>
                    <div className="topic-meta">
                        <p className="no-margin">Username</p>
                        <p className="no-margin">Number of replies: </p>
                        <p className="topic-date">Started </p>
                    </div>
                </div>
        );
};

export default Topic;