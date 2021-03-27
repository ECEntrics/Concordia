import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { VOTING_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import {
  Container, Header, Icon, Tab,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { drizzle } from '../../redux/store';
import PollGraph from './PollGraph';
import CustomLoadingTabPane from '../CustomLoadingTabPane';
import { GRAPH_TAB, VOTE_TAB } from '../../constants/polls/PollTabs';
import PollVote from './PollVote';

const { contracts: { [VOTING_CONTRACT]: { methods: { pollExists: { cacheCall: pollExistsChainData } } } } } = drizzle;

const hashOption = (val) => {
  let hash = 0;
  let i;
  let chr;

  for (i = 0; i < val.length; i++) {
    chr = val.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }

  return `${hash}`;
};

const PollView = (props) => {
  const { topicId } = props;
  const userAddress = useSelector((state) => state.user.address);
  const hasSignedUp = useSelector((state) => state.user.hasSignedUp);
  const getPollInfoResults = useSelector((state) => state.contracts[VOTING_CONTRACT].getPollInfo);
  const [getPollInfoCallHash, setGetPollInfoCallHash] = useState(null);
  const [pollOptions, setPollOptions] = useState([
    {
      label: 'option 1',
      hash: hashOption('option 1'),
    },
    {
      label: 'option 2',
      hash: hashOption('option 2'),
    },
    {
      label: 'option 3',
      hash: hashOption('option 3'),
    },
    {
      label: 'option 4',
      hash: hashOption('option 4'),
    },
    {
      label: 'option 5',
      hash: hashOption('option 5'),
    },

  ]);
  const [voteCounts, setVoteCounts] = useState([2, 8, 4, 12, 7]);
  const [voteLoading, setVoteLoading] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const { t } = useTranslation();

  // TODO: get vote options

  // TODO: get current results

  // TODO: check poll hash validity, add invalid view

  const pollVoteTab = useMemo(() => (
      <PollVote pollOptions={pollOptions} enableVoteChanges hasUserVoted userVoteHash={pollOptions[2].hash} />
  ), [pollOptions]);

  const pollGraphTab = useMemo(() => (
      <PollGraph pollOptions={pollOptions} voteCounts={voteCounts} hasUserVoted userVoteHash={pollOptions[2].hash} />
  ), [pollOptions, voteCounts]);

  const panes = useMemo(() => {
    const pollVotePane = (<CustomLoadingTabPane loading={voteLoading}>{pollVoteTab}</CustomLoadingTabPane>);
    const pollGraphPane = (<CustomLoadingTabPane loading={resultsLoading}>{pollGraphTab}</CustomLoadingTabPane>);

    return ([
      { menuItem: t(VOTE_TAB.intl_display_name_id), render: () => pollVotePane },
      { menuItem: t(GRAPH_TAB.intl_display_name_id), render: () => pollGraphPane },
    ]);
  }, [pollGraphTab, pollVoteTab, resultsLoading, t, voteLoading]);

  return (
      <Container id="topic-poll-container" textAlign="left">
          <Header as="h3">
              <Icon name="chart pie" size="large" />
              Do you thing asdf or fdsa?
          </Header>
          <Tab panes={panes} />
      </Container>
  );
};

export default PollView;
