import React, { useMemo } from 'react';
import { Button, Header } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import TopicList from '../../../components/TopicList';

import './styles.css';

const Board = (props) => {
  const { numberOfTopics } = props;
  const hasSignedUp = useSelector((state) => state.user.hasSignedUp);
  const history = useHistory();
  const { t } = useTranslation();

  const boardContents = useMemo(() => {
    if (numberOfTopics > 0) {
      return (
          <>
              {hasSignedUp
                ? (
                    <Button
                      content="New Topic"
                      icon="plus"
                      labelPosition="left"
                      positive
                      id="new-topic-button"
                      onClick={() => history.push('/topics/new')}
                    />
                )
                : null}
              <TopicList topicIds={_.rangeRight(0, numberOfTopics)} />
          </>
      );
    } if (!hasSignedUp) {
      return (
          <div id="no-topic-message" className="vertical-center-in-parent">
              <Header textAlign="center" as="h2">
                  {t('board.header.no.topics.message')}
              </Header>
              <Header textAlign="center" as="h3">
                  {t('board.sub.header.no.topics.guest')}
              </Header>
          </div>
      );
    }

    return (
        <>
            <Button
              content="New Topic"
              icon="plus"
              labelPosition="left"
              positive
              id="new-topic-button"
              onClick={() => history.push('/topics/new')}
            />
            <div id="no-topic-message" className="vertical-center-in-parent">
                <Header textAlign="center" as="h2">
                    {t('board.header.no.topics.message')}
                </Header>
                <Header textAlign="center" as="h3">
                    {t('board.sub.header.no.topics.user')}
                </Header>
            </div>
        </>

    );
  }, [numberOfTopics, hasSignedUp, t, history]);

  return (boardContents);
};

Board.propTypes = {
  numberOfTopics: PropTypes.number.isRequired,
};

export default Board;
