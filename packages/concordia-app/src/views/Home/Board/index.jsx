import React, { useMemo } from 'react';
import { Header } from 'semantic-ui-react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import TopicList from '../../../components/TopicList';

const Board = (props) => {
  const { numberOfTopics } = props;
  const userHasSignedUp = useSelector((state) => state.user.hasSignedUp);
  const { t } = useTranslation();

  const boardContents = useMemo(() => {
    if (numberOfTopics > 0) {
      return (<TopicList topicIds={_.rangeRight(0, numberOfTopics)} />);
    } if (!userHasSignedUp) {
      return (
          <div className="vertical-center-in-parent">
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
        <div className="vertical-center-in-parent">
            <Header textAlign="center" as="h2">
                {t('board.header.no.topics.message')}
            </Header>
            <Header textAlign="center" as="h3">
                {t('board.sub.header.no.topics.user')}
            </Header>
        </div>
    );
  }, [numberOfTopics, userHasSignedUp, t]);

  return (boardContents);
};

Board.propTypes = {
  numberOfTopics: PropTypes.number.isRequired,
};

export default Board;
