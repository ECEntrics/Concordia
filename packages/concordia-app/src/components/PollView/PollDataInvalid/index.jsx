import React from 'react';
import { Container, Header, Icon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

const PollDataInvalid = () => {
  const { t } = useTranslation();

  return (
      <Container id="topic-poll-data-invalid-container" textAlign="center">
          <Header as="h3" icon textAlign="center">
              <Icon name="warning sign" color="red" />
              <Header.Content>
                  {t('topic.poll.invalid.data.header')}
                  <Header.Subheader>
                      {t('topic.poll.invalid.data.sub.header')}
                  </Header.Subheader>
              </Header.Content>
          </Header>
      </Container>
  );
};

export default PollDataInvalid;
