import React from 'react';
import Topic from './Topic';
import { Link } from 'react-router';

const topics1 = [
    {topicSubject: 'This is a topic about something 1',
     topicStarter: 'username1',
     numberOfReplies: 12,
     date: 'May 20, 2018, 10:10:10',
     id: 1,
     address: 0x5fe3062B24033113fbf52b2b75882890D7d8CA54
    },
    {topicSubject: 'This is a topic about something 2',
     topicStarter: 'username2',
     numberOfReplies: 41,
     date: 'May 20, 2018, 10:10:10',
     id: 2,
     address: 0x083c41ea13af6c2d5aaddf6e73142eb9a7b00183
    },
    {topicSubject: 'This is a topic about something 3',
     topicStarter: 'username3',
     numberOfReplies: 73,
     date: 'May 20, 2018, 10:10:10',
     id: 3,
     address: 0x26d1ec50b4e62c1d1a40d16e7cacc6a6580757d5
    }
];

const TopicList = (props) => {
    const topics = topics1.map((topic) =>
        <Link to={"/topic/" + topic.id + "/" + topic.topicSubject}
            key={topic.id}>
                <Topic topicSubject={topic.topicSubject}
                topicStarter={topic.topicStarter}
                numberOfReplies={topic.numberOfReplies}
                date={topic.date}
                id={topic.id}
                key={topic.id}
                address={topic.address}/>
        </Link>
    );

    return (
        <div className="topics-list">
            {topics}
        </div>
    );
};

export default TopicList;