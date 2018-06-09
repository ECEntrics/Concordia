import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import Post from './Post';

import epochTimeConverter from '../helpers/EpochTimeConverter'

const contract = "Forum";
const contractMethod = "getPost";

class PostList extends Component {
    constructor(props, context) {
        super(props);

        this.fetchPost = this.fetchPost.bind(this);

        this.drizzle = context.drizzle;
        this.dataKeys = [];
        this.postsData = new Array(parseInt(this.props.postIDs.length, 10)).fill(undefined);
        this.orbitPostsData = new Array(parseInt(this.props.postIDs.length, 10)).fill(undefined);
        this.orbitPostsDataFetchStatus = new Array(parseInt(this.props.postIDs.length, 10)).fill("pending");

        for (var i = 0; i < this.props.postIDs.length; ++i){
            this.dataKeys[i] = this.drizzle.contracts[contract].methods[contractMethod]
                .cacheCall(this.props.postIDs[i]);
        }
    }

    async fetchPost(index) {
        /*const fullAddress = this.postsData[postID][1];
        const store = await this.props.orbitDB.orbitdb.keyvalue(JSON.stringify(fullAddress));
        await store.load();
        var som = store.get(JSON.stringify(postID));
        this.orbitPostsData[postID] = som['subject'];
        this.orbitPostsDataFetchStatus[postID] = "fetched";*/

        var som = this.props.orbitDB.postsDB.get(this.props.postIDs[index]);
        this.orbitPostsData[index] = som;
        this.orbitPostsDataFetchStatus[index] = "fetched";
    }

    render (){
        const posts = this.postsData.map((post, index) => {
            if (post) {
                return (
                    <Link to={"/topic/" + post[4] + "/" + 
                        ((this.orbitPostsData[index] !== undefined) ? this.orbitPostsData[index].subject + "/" +
                            this.props.postIDs[index] : "")}
                        key={index}>
                        <Post post={{
                                avatarUrl: post.avatarUrl,
                                username: post[2],
                                subject: (this.orbitPostsData[index] !== undefined) && this.orbitPostsData[index].subject,
                                date: epochTimeConverter(post[3]),
                                postIndex: index,
                                postContent: (this.orbitPostsData[index] !== undefined) && this.orbitPostsData[index].content
                            }}
                            id={index}
                            key={index}/>
                    </Link>
                );
            } else {
                return (
                    <Post post={null}
                        id={index}
                        key={index}/>
                );
            }
        });

        return (
            <div className="posts-list">
                {posts}
            </div>
        );
    }

    componentWillReceiveProps() {
        for (var i = 0; i < this.props.postIDs.length; ++i){
            if (this.postsData[i] === undefined) {
                let currentDrizzleState = this.drizzle.store.getState();
                let dataFetched = (currentDrizzleState.contracts[contract][contractMethod])[this.dataKeys[i]];
                if (dataFetched){
                    this.postsData[i] = dataFetched.value;
                }
            } else if (!this.orbitPostsData[i] && this.orbitPostsDataFetchStatus[i] === "pending") {
                this.orbitPostsDataFetchStatus[i] = "fetching";
                this.fetchPost(i);
            }
        }
    }
};

PostList.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        user: state.user, //Needed!!
        orbitDB: state.orbitDB,
    }
};

export default drizzleConnect(PostList, mapStateToProps);