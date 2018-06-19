import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import { Grid, Divider, Button, Icon, Label } from 'semantic-ui-react'

import TimeAgo from 'react-timeago';
import epochTimeConverter from '../helpers/EpochTimeConverter';
import UserAvatar from 'react-user-avatar';
import ReactMarkdown from 'react-markdown';

class Post extends Component {
    constructor(props, context) {
        super(props);

        this.fetchPost = this.fetchPost.bind(this);

        this.orbitPostData = {
            content: "",
            subject: ""
        };
        this.orbitPostDataFetchStatus = "pending";
    }

    async fetchPost(postID) {
        this.orbitPostDataFetchStatus = "fetching";

        if (this.props.blockchainData[0].returnData[1] === this.props.user.address) {
            this.orbitPostData = this.props.orbitDB.postsDB.get(postID);
        } else {
            const fullAddress = "/orbitdb/" + this.props.blockchainData[0].returnData[0] + "/posts";
            const store = await this.props.orbitDB.orbitdb.keyvalue(fullAddress);
            await store.load();

            let localOrbitData =  store.get(postID);
            if (localOrbitData) {
                this.orbitPostData = localOrbitData;
            } else {
                // Wait until we have received something from the network
                store.events.on('replicated', () => {
                    this.orbitPostData = store.get(postID);
                })
            }
        }
        this.orbitPostDataFetchStatus = "fetched";
    }

    render(){
        let avatarView = (this.props.blockchainData[0].returnData
            ? <UserAvatar
                size="52"
                className="inline"
                src={this.props.avatarUrl}
                name={this.props.blockchainData[0].returnData[2]}/>
            : <div></div>
        );

        return (
            <div className="post">
                <Divider horizontal>
                    <span className="grey-text">#{this.props.postIndex}</span>
                </Divider>
                <Grid>
                    <Grid.Row columns={16} stretched>
                        <Grid.Column width={1} className="user-avatar">
                            {this.props.blockchainData[0].returnData !== null
                                ?<Link to={"/profile/" + this.props.blockchainData[0].returnData[1]
                                    + "/" + this.props.blockchainData[0].returnData[2]}
                                onClick={(event) => {event.stopPropagation()}}>
                                    {avatarView}
                                </Link>
                                :avatarView
                            }
                        </Grid.Column>
                        <Grid.Column width={15}>
                            <div className="">
                                <div className="stretch-space-between">
                                    <span className={this.props.blockchainData[0].returnData !== null ? "" : "grey-text"}>
                                        <strong>
                                            {this.props.blockchainData[0].returnData !== null
                                                ?this.props.blockchainData[0].returnData[2]
                                                :"Username"
                                            }
                                        </strong>
                                    </span>
                                    <span className="grey-text">
                                        {this.props.blockchainData[0].returnData !== null &&
                                            <TimeAgo date={epochTimeConverter(this.props.blockchainData[0].returnData[3])}/>
                                        }
                                    </span>
                                </div>
                                <div className="stretch-space-between">
                                    <span className={this.orbitPostData.subject ? "" : "grey-text"}>
                                        <strong>
                                            Subject: {this.orbitPostData.subject}
                                        </strong>
                                    </span>
                                </div>
                                <div className="post-content">
                                    {this.orbitPostData.content
                                        ? <ReactMarkdown source={this.orbitPostData.content} />
                                        : <p className="grey-text">Post content...</p>
                                    }
                                </div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column floated="right" textAlign="right">
                            <Button icon size='mini' style={{marginRight: "0px"}}>
                                <Icon name='chevron up' />
                            </Button>
                            <Label color="teal">8000</Label>
                            <Button icon size='mini'>
                                <Icon name='chevron down' />
                            </Button>
                            <Button icon size='mini'
                                onClick={() => { this.context.router.push("/topic/"
                                    + this.props.blockchainData[0].returnData[4] + "/"
                                    + this.props.postID)}}>
                                <Icon name='linkify' />
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }

    componentDidUpdate() {
        if (this.props.blockchainData[0].status === "success"
            && this.orbitPostDataFetchStatus === "pending") {
            this.fetchPost(this.props.postID);
        }
    }
};

Post.contextTypes = {
    router: PropTypes.object
};

const mapStateToProps = state => {
    return {
        user: state.user,
        orbitDB: state.orbitDB
    }
};

export default drizzleConnect(withRouter(Post), mapStateToProps);