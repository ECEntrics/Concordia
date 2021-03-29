import React from 'react';
import { Container, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const PollGuestView = () => (
    <Container id="topic-poll-guest-view-container" textAlign="center">
        <Header as="h3" icon textAlign="center">
            <Icon name="signup" />
            <Header.Content>
                Only registered users are able to vote in polls.
                <Header.Subheader>
                    You can register in the&nbsp;
                    <Link to="/auth/register">signup</Link>
                    &nbsp;page.
                </Header.Subheader>
            </Header.Content>
        </Header>
    </Container>
);

export default PollGuestView;
