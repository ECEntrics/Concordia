import React from 'react';

import WithBlockchainData from './WithBlockchainData';

import Post from './Post';

const PostList = (props) => {
    const posts = props.postIDs.map((postID, index) => {
        return (
            <WithBlockchainData
                component={Post}
                callsInfo={[{
                        contract: 'Forum',
                        method: 'getPost',
                        params: [postID]
                }]}
                avatarUrl={""}
                postIndex={index}
                postID={postID}
                key={postID}
            />
        );
    });

    return (
        <div>
            {props.recentToTheTop
                ?posts.slice(0).reverse()
                :posts
            }
        </div>
    );
};

export default PostList;