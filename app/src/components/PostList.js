import React, { Component } from 'react';
import { connect } from 'react-redux';
import { drizzle } from '../index';

import Post from './Post';

const contract = "Forum";
const getPostMethod = "getPost";

class PostList extends Component {
    constructor(props) {
        super(props);

        this.getBlockchainData = this.getBlockchainData.bind(this);
        this.dataKeys = [];
    }

    getBlockchainData(){
        if (this.props.drizzleStatus['initialized']){
            this.props.postIDs.forEach( postID => {
                if (!this.dataKeys[postID]) {
                    this.dataKeys[postID] = drizzle.contracts[contract].methods[getPostMethod].cacheCall(postID);
                }
            })
        }
    }

    render() {
        const posts = this.props.postIDs.map((postID, index) => {
            return (<Post
                postData={(this.dataKeys[postID] && this.props.contracts[contract][getPostMethod][this.dataKeys[postID]])
                    ? this.props.contracts[contract][getPostMethod][this.dataKeys[postID]]
                    : null}
                avatarUrl={""}
                postIndex={index}
                postID={postID}
                getFocus={this.props.focusOnPost === postID ? true : false}
                key={postID} />)
        });

        return (
            <div>
                {this.props.recentToTheTop
                    ?posts.slice(0).reverse()
                    :posts
                }
            </div>
        );
    }

    componentDidMount() {
        this.getBlockchainData();
    }

    componentDidUpdate(){
        this.getBlockchainData();
    }
};

const mapStateToProps = state => {
    return {
        contracts: state.contracts,
        drizzleStatus: state.drizzleStatus
    }
};

export default connect(mapStateToProps)(PostList);
