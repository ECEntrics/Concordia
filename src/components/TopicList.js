import React from 'react';

import WithBlockchainData from './WithBlockchainData';

import Topic from './Topic';

const TopicList = (props) => {
    const topics = props.topicIDs.map((topicID) => {
        return (
            <WithBlockchainData
                component={Topic}
                callsInfo={[{
                        contract: 'Forum',
                        method: 'getTopic',
                        params: [topicID]
                }]}
                topicID={topicID}
                key={topicID}
            />
        );
    });

    return (
        <div className="topics-list">
            {topics.slice(0).reverse()}
        </div>
    );
};

export default TopicList;