import React from 'react';
import { Container, Header, Icon } from 'semantic-ui-react';

const PollDataInvalid = () => (
    <Container id="topic-poll-data-invalid-container">
        <Header as="h3">
            <Icon name="warning sign" color="red" />
            <Header.Content>
                This topic has a poll but the data are untrusted!
                <Header.Subheader>The poll data downloaded from the poster have been tampered with.</Header.Subheader>
            </Header.Content>
        </Header>
    </Container>
);

export default PollDataInvalid;
