import React from 'react';
import { Container, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PollGuestView = () => {
  const { t } = useTranslation();

  return (
      <Container id="topic-poll-guest-view-container" textAlign="center">
          <Header as="h3" icon textAlign="center">
              <Icon name="signup" />
              <Header.Content>
                  {t('topic.poll.guest.header')}
                  <Header.Subheader>
                      {t('topic.poll.guest.sub.header.pre')}
                      <Link to="/auth/register">{t('topic.poll.guest.sub.header.link')}</Link>
                      {t('topic.poll.guest.sub.header.post')}
                  </Header.Subheader>
              </Header.Content>
          </Header>
      </Container>
  );
};

export default PollGuestView;
