import React from 'react';
import TimeAgo from 'react-timeago';

const Topic = (props) => {
    return (
        props.topic !== null
            ? <div className="topic card white hoverable">
                <div className="card-content">
                    <div className="topic-subject">
                        <p style={{color: props.topic.topicSubject ? "" : "grey"}}>
                            {props.topic.topicSubject ? props.topic.topicSubject : "Subject"}
                        </p>
                    </div>
                    <hr/>
                    <div className="topic-meta">
                        <p className="no-margin">{props.topic.topicStarter}</p>
                        <p className="no-margin">Number of replies: {props.topic.numberOfReplies}</p>
                        <p className="topic-date grey-text darken-3">Started <TimeAgo date={props.topic.date}/></p>
                    </div>
                </div>
            </div>
            : <div className="topic card white hoverable">
                <div className="card-content grey-text">
                    <div className="topic-subject">
                        <p>Subject</p>
                    </div>
                    <hr/>
                    <div className="topic-meta">
                        <p className="no-margin">Username</p>
                        <p className="no-margin">Number of replies: </p>
                        <p className="topic-date grey-text darken-3"></p>
                    </div>
                </div>
            </div>
    );
};

export default Topic;