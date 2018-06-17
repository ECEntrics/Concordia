import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';

import { Grid, Divider } from 'semantic-ui-react'

import TimeAgo from 'react-timeago';
import UserAvatar from 'react-user-avatar';
import ReactMarkdown from 'react-markdown';

class Post extends Component {
    constructor(props, context) {
        super(props);
    }

    render(){
        return (
            <div className="post">
                <Divider horizontal>
                    <span className="grey-text">#0</span>
                </Divider>
                <Grid>
                    <Grid.Row columns={16} stretched>
                        <Grid.Column width={1} className="user-avatar">
                            <UserAvatar
                                size="52"
                                className="inline"
                                src={this.props.user.avatarUrl}
                                name={this.props.user.username}/>
                        </Grid.Column>
                        <Grid.Column width={15}>
                            <div className="">
                                <div className="stretch-space-between">
                                    <span>
                                        <strong>
                                            {this.props.user.username}
                                        </strong>
                                    </span>
                                    <span className="grey-text">
                                        <TimeAgo date={this.props.date}/>
                                    </span>
                                </div>
                                <div className="stretch-space-between">
                                    <span><strong>
                                            Subject: {this.props.subject}
                                    </strong></span>
                                </div>
                                <div className="post-content">
                                    <ReactMarkdown source={this.props.content} />
                                </div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        user: state.user
    }
};

export default drizzleConnect(Post, mapStateToProps);