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

  const boardContents = useMemo(() => (
      <>
          {hasSignedUp
            ? (
                <Button
                  id="new-topic-button"
                  className="primary-button"
                  content="New Topic"
                  icon="plus"
                  labelPosition="left"
                  positive
                  onClick={() => history.push('/topics/new')}
                />
            )
            : null}
          {/* eslint-disable-next-line no-nested-ternary */}
          {numberOfTopics > 0
            ? (<TopicList topicIds={_.rangeRight(0, numberOfTopics)} />)
            : (!hasSignedUp
              ? (
                  <div id="no-topic-message" className="vertical-center-in-parent">
                      <Header textAlign="center" as="h2">
                          {t('board.header.no.topics.message')}
                      </Header>
                      <Header textAlign="center" as="h3">
                          {t('board.sub.header.no.topics.guest')}
                      </Header>
                  </div>
              )
              : (
                  <div id="no-topic-message" className="vertical-center-in-parent">
                      <Header textAlign="center" as="h2">
                          {t('board.header.no.topics.message')}
                      </Header>
                      <Header textAlign="center" as="h3">
                          {t('board.sub.header.no.topics.user')}
                      </Header>
                  </div>
              ))}

      </>
  ), [numberOfTopics, hasSignedUp, t, history]);

  return (boardContents);
};

Board.propTypes = {
  numberOfTopics: PropTypes.number.isRequired,
};

export default Board;
