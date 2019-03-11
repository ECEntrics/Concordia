import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router'
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import ContentLoader from "react-content-loader"
import { Transition } from 'semantic-ui-react'
import { Grid, Divider, Button, Icon, Label } from 'semantic-ui-react'

import TimeAgo from 'react-timeago';
import epochTimeConverter from '../helpers/EpochTimeConverter';
import UserAvatar from 'react-user-avatar';
import ReactMarkdown from 'react-markdown';

class Post extends Component {
    constructor(props) {
        super(props);

        this.getBlockchainData = this.getBlockchainData.bind(this);
        this.fetchPost = this.fetchPost.bind(this);
        if (props.getFocus){
            this.postRef = React.createRef();
        }

        this.state = {
            fetchPostDataStatus: 'pending',
            postContent: '',
            postSubject: '',
            readyForAnimation: false,
            animateOnToggle: true
        }
    }

    getBlockchainData() {
        if (this.props.postData &&
            this.props.orbitDB.orbitdb &&
            this.state.fetchPostDataStatus === "pending") {
            this.setState({ fetchPostDataStatus: 'fetching' });
            this.fetchPost(this.props.postID);
        }
    }

    async fetchPost(postID) {
        let orbitPostData;
        if (this.props.postData.value[1] === this.props.user.address) {
            orbitPostData = this.props.orbitDB.postsDB.get(postID);
        } else {
            const fullAddress = "/orbitdb/" + this.props.postData.value[0] + "/posts";
            const store = await this.props.orbitDB.orbitdb.keyvalue(fullAddress);
            await store.load();

            let localOrbitData =  store.get(postID);
            if (localOrbitData) {
                orbitPostData = localOrbitData;
            } else {
                // Wait until we have received something from the network
                store.events.on('replicated', () => {
                    orbitPostData = store.get(postID);
                })
            }
        }

        this.setState({
            postContent: orbitPostData.content,
            postSubject: orbitPostData.subject,
            fetchPostDataStatus: 'fetched',
            readyForAnimation: true
        });
    }

    render(){
        let avatarView = (this.props.postData
            ? <UserAvatar
                size="52"
                className="inline"
                src={this.props.avatarUrl}
                name={this.props.postData.value[2]}/>
            : <div className="user-avatar">
                <ContentLoader height={52} width={52} speed={2}
                    primaryColor="#b2e8e6" secondaryColor="#00b5ad">
                    <circle cx="26" cy="26" r="26" />
                </ContentLoader>
            </div>
        );

        return (
            <Transition animation='tada' duration={500} visible={this.state.animateOnToggle}>
                <div className="post" ref={this.postRef ? this.postRef : null}>
                    <Divider horizontal>
                        <span className="grey-text">#{this.props.postIndex}</span>
                    </Divider>
                    <Grid>
                        <Grid.Row columns={16} stretched>
                            <Grid.Column width={1} className="user-avatar">
                                {this.props.postData !== null
                                    ?<Link to={"/profile/" + this.props.postData.value[1]
                                        + "/" + this.props.postData.value[2]}
                                    onClick={(event) => {event.stopPropagation()}}>
                                        {avatarView}
                                    </Link>
                                    :avatarView
                                }
                            </Grid.Column>
                            <Grid.Column width={15}>
                                <div className="">
                                    <div className="stretch-space-between">
                                        <span className={this.props.postData !== null ? "" : "grey-text"}>
                                            <strong>
                                                {this.props.postData !== null
                                                    ?this.props.postData.value[2]
                                                    :"Username"
                                                }
                                            </strong>
                                        </span>
                                        <span className="grey-text">
                                            {this.props.postData !== null &&
                                                <TimeAgo date={epochTimeConverter(this.props.postData.value[3])}/>
                                            }
                                        </span>
                                    </div>
                                    <div className="stretch-space-between">
                                        <span className={this.state.postSubject === '' ? "" : "grey-text"}>
                                            <strong>
                                                {this.state.postSubject === ''
                                                ? <ContentLoader height={5.8} width={300} speed={2}
                                                primaryColor="#b2e8e6" secondaryColor="#00b5ad" >
                                                    <rect x="0" y="0" rx="3" ry="3" width="75" height="5.5" />
                                                </ContentLoader>
                                                : 'Subject:' + this.state.postSubject
                                                }
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="post-content">
                                        {this.state.postContent !== ''
                                            ? <ReactMarkdown source={this.state.postContent} />
                                            : <ContentLoader height={11.2} width={300} speed={2}
                                            primaryColor="#b2e8e6" secondaryColor="#00b5ad" >
                                                <rect x="0" y="0" rx="3" ry="3" width="180" height="4.0" />
                                                <rect x="0" y="6.5" rx="3" ry="3" width="140" height="4.0" />
                                            </ContentLoader>
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
                                    onClick={this.props.postData
                                        ? () => { this.props.navigateTo("/topic/"
                                            + this.props.postData.value[4] + "/"
                                            + this.props.postID)}
                                        : () => {}}>
                                    <Icon name='linkify' />
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </Transition>
        );
    }

    componentDidMount() {
        this.getBlockchainData();
    }

    componentDidUpdate(){
        this.getBlockchainData();
        if (this.state.readyForAnimation){
            if (this.postRef){
                setTimeout(() => {
                    this.postRef.current.scrollIntoView({ block: 'start',  behavior: 'smooth' });
                    setTimeout(() => {
                        this.setState({ animateOnToggle: false });
                    }, 300);
                }, 100);
                this.setState({ readyForAnimation: false });
            }
        }
    }
};

const mapDispatchToProps = dispatch => bindActionCreators({
    navigateTo: (location) => push(location)
}, dispatch);

const mapStateToProps = state => {
    return {
        user: state.user,
        orbitDB: state.orbit
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Post));