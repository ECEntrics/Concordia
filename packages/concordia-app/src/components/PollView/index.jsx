import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VOTING_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import {
  Container, Header, Icon, Tab,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { POLLS_DATABASE } from 'concordia-shared/src/constants/orbit/OrbitDatabases';
import { breeze, drizzle } from '../../redux/store';
import PollGraph from './PollGraph';
import CustomLoadingTabPane from '../CustomLoadingTabPane';
import { GRAPH_TAB, VOTE_TAB } from '../../constants/polls/PollTabs';
import PollVote from './PollVote';
import { FETCH_USER_DATABASE } from '../../redux/actions/peerDbReplicationActions';
import { generatePollHash } from '../../utils/hashUtils';
import { POLL_OPTIONS, POLL_QUESTION } from '../../constants/orbit/PollsDatabaseKeys';
import PollDataInvalid from './PollDataInvalid';
import PollGuestView from './PollGuestView';

const { contracts: { [VOTING_CONTRACT]: { methods: { getPoll: { cacheCall: getPollChainData } } } } } = drizzle;
const { orbit } = breeze;

const PollView = (props) => {
  const { topicId } = props;
  const userAddress = useSelector((state) => state.user.address);
  const hasSignedUp = useSelector((state) => state.user.hasSignedUp);
  const getPollResults = useSelector((state) => state.contracts[VOTING_CONTRACT].getPoll);
  const polls = useSelector((state) => state.orbitData.polls);
  const [getPollCallHash, setGetPollCallHash] = useState(null);
  const [pollHash, setPollHash] = useState('');
  const [pollChangeVoteEnabled, setPollChangeVoteEnabled] = useState(false);
  const [pollOptions, setPollOptions] = useState([]);
  const [voteCounts, setVoteCounts] = useState([]);
  const [voters, setVoters] = useState([]);
  const [pollHashValid, setPollHashValid] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [chainDataLoading, setChainDataLoading] = useState(true);
  const [orbitDataLoading, setOrbitDataLoading] = useState(true);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!getPollCallHash) {
      setGetPollCallHash(getPollChainData(topicId));
    }
  }, [getPollCallHash, topicId]);

  useEffect(() => {
    dispatch({
      type: FETCH_USER_DATABASE,
      orbit,
      dbName: POLLS_DATABASE,
      userAddress,
    });
  }, [dispatch, userAddress]);

  useEffect(() => {
    if (getPollCallHash && getPollResults && getPollResults[getPollCallHash]) {
      setPollHash(getPollResults[getPollCallHash].value[1]);
      setPollChangeVoteEnabled(getPollResults[getPollCallHash].value[2]);
      setVoteCounts(getPollResults[getPollCallHash].value[4].map((voteCount) => parseInt(voteCount, 10)));

      const cumulativeSum = getPollResults[getPollCallHash].value[4]
        .map((voteCount) => parseInt(voteCount, 10))
        .reduce((accumulator, voteCount) => (accumulator.length === 0
          ? [voteCount]
          : [...accumulator, accumulator[accumulator.length - 1] + voteCount]), []);

      setVoters(cumulativeSum
        .map((subArrayEnd, index) => getPollResults[getPollCallHash].value[5]
          .slice(index > 0 ? cumulativeSum[index - 1] : 0,
            subArrayEnd)));

      setChainDataLoading(false);
    }
  }, [getPollCallHash, getPollResults]);

  useEffect(() => {
    const pollFound = polls
      .find((poll) => poll.id === topicId);

    if (pollHash && pollFound) {
      if (generatePollHash(pollFound[POLL_QUESTION], pollFound[POLL_OPTIONS]) === pollHash) {
        setPollHashValid(true);
        setPollQuestion(pollFound[POLL_QUESTION]);
        setPollOptions([...pollFound[POLL_OPTIONS]]);
      } else {
        setPollHashValid(false);
      }

      setOrbitDataLoading(false);
    }
  }, [pollHash, polls, topicId]);

  const userHasVoted = useMemo(() => hasSignedUp && voters
    .some((optionVoters) => optionVoters.includes(userAddress)),
  [hasSignedUp, userAddress, voters]);

  const userVoteIndex = useMemo(() => {
    if (!chainDataLoading && !orbitDataLoading && userHasVoted) {
      return voters
        .findIndex((optionVoters) => optionVoters.includes(userAddress));
    }

    return -1;
  }, [chainDataLoading, orbitDataLoading, userAddress, userHasVoted, voters]);

  const pollVoteTab = useMemo(() => {
    if (!hasSignedUp) {
      return <PollGuestView />;
    }

    if (chainDataLoading || orbitDataLoading) {
      return null;
    }

    return (
        <PollVote
          topicId={topicId}
          pollOptions={pollOptions}
          enableVoteChanges={pollChangeVoteEnabled}
          hasUserVoted={userHasVoted}
          userVoteIndex={userVoteIndex}
        />
    );
  }, [
    chainDataLoading, hasSignedUp, orbitDataLoading, pollChangeVoteEnabled, pollOptions, topicId, userHasVoted,
    userVoteIndex,
  ]);

  const pollGraphTab = useMemo(() => (
    !chainDataLoading || orbitDataLoading
      ? (
          <PollGraph
            pollOptions={pollOptions}
            voteCounts={voteCounts}
            hasUserVoted={userHasVoted}
            userVoteIndex={userVoteIndex}
          />
      )
      : null
  ), [chainDataLoading, orbitDataLoading, pollOptions, userHasVoted, userVoteIndex, voteCounts]);

  const panes = useMemo(() => {
    const pollVotePane = (
        <CustomLoadingTabPane loading={chainDataLoading || orbitDataLoading}>
            {pollVoteTab}
        </CustomLoadingTabPane>
    );
    const pollGraphPane = (
        <CustomLoadingTabPane loading={chainDataLoading || orbitDataLoading}>
            {pollGraphTab}
        </CustomLoadingTabPane>
    );

    return ([
      { menuItem: t(VOTE_TAB.intl_display_name_id), render: () => pollVotePane },
      { menuItem: t(GRAPH_TAB.intl_display_name_id), render: () => pollGraphPane },
    ]);
  }, [chainDataLoading, orbitDataLoading, pollGraphTab, pollVoteTab, t]);

  return (
      <Container id="topic-poll-container" textAlign="left">
          {!chainDataLoading && !orbitDataLoading && pollHashValid
            ? (
                <>
                    <Header as="h3">
                        <Icon name="chart pie" size="large" />
                        {pollQuestion}
                    </Header>
                    <Tab panes={panes} />
                </>
            )
            : <PollDataInvalid />}
      </Container>
  );
};

PollView.propTypes = {
  topicId: PropTypes.number.isRequired,
};

export default PollView;
