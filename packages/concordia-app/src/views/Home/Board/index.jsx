import React, { useMemo, useState } from 'react';
import { Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

const Board = (props) => {
  const { numberOfTopics, userHasSignedUp } = props;
  const [topicIds, setTopicIds] = useState([]);
  const { t } = useTranslation();

  const boardContents = useMemo(() => {
    if (numberOfTopics > 0) {
      setTopicIds(_.range(0, numberOfTopics));

      return (<div>TODO</div>);
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

  return (
      <div>
          {boardContents}
      </div>
  );
};

const mapStateToProps = (state) => ({
  userHasSignedUp: state.user.hasSignedUp,
});

export default connect(mapStateToProps)(Board);
