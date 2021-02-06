import React, {
  memo, useCallback, useEffect, useMemo, useState,
} from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import './styles.css';
import { useSelector } from 'react-redux';
import { POST_VOTING_CONTRACT } from '../../../constants/contracts/ContractNames';
import { drizzle } from '../../../redux/store';
import { TRANSACTION_ERROR, TRANSACTION_SUCCESS } from '../../../constants/TransactionStatus';

const CHOICE_DEFAULT = '0';
const CHOICE_UP = '1';
const CHOICE_DOWN = '2';

const {
  contracts: {
    [POST_VOTING_CONTRACT]: {
      methods: {
        getVote: { cacheCall: getVoteChainData },
        getTotalVoteCount: { cacheCall: getTotalVoteCountChainData },
        upvote, downvote, unvote,
      },
    },
  },
} = drizzle;

const PostVoting = (props) => {
  const { postId, postAuthorAddress } = props;
  const drizzleInitialized = useSelector((state) => state.drizzleStatus.initialized);
  const drizzleInitializationFailed = useSelector((state) => state.drizzleStatus.failed);
  const hasSignedUp = useSelector((state) => state.user.hasSignedUp);
  const userAccount = useSelector((state) => state.accounts[0]);

  // Current votes
  const getVoteResults = useSelector((state) => state.contracts[POST_VOTING_CONTRACT].getVote);
  const getTotalVoteCountResult = useSelector((state) => state.contracts[POST_VOTING_CONTRACT].getTotalVoteCount);
  const [getVoteCallHash, setGetVoteCallHash] = useState([]);
  const [getTotalVoteCountCallHash, setGetTotalVoteCountCallHash] = useState([]);
  const [ownVote, setOwnVote] = useState(null);
  const [totalVoteCount, setTotalVoteCount] = useState(null);

  // Voting
  const transactionStack = useSelector((state) => state.transactionStack);
  const transactions = useSelector((state) => state.transactions);
  const [voting, setVoting] = useState(false);
  const [createVoteCacheSendStackId, setVoteCacheSendStackId] = useState('');

  // Current votes
  useEffect(() => {
    const shouldGetTotalVoteCountDataFromChain = totalVoteCount === null;

    if (drizzleInitialized && !drizzleInitializationFailed && shouldGetTotalVoteCountDataFromChain && postId !== null) {
      setGetTotalVoteCountCallHash(getTotalVoteCountChainData(postId));
    }
  }, [drizzleInitializationFailed, drizzleInitialized, postId, totalVoteCount]);

  useEffect(() => {
    const shouldGetOwnVoteFromChain = ownVote === null;

    if (drizzleInitialized && !drizzleInitializationFailed && shouldGetOwnVoteFromChain && postId !== null && userAccount !== null) {
      setGetVoteCallHash(getVoteChainData(postId, userAccount));
    }
  }, [drizzleInitializationFailed, drizzleInitialized, ownVote, postId, totalVoteCount, userAccount]);

  useEffect(() => {
    if (getVoteCallHash && getVoteResults && getVoteResults[getVoteCallHash]) {
      setOwnVote(getVoteResults[getVoteCallHash].value);
    }
  }, [getVoteCallHash, getVoteResults]);

  useEffect(() => {
    if (getTotalVoteCountCallHash && getTotalVoteCountResult && getTotalVoteCountResult[getTotalVoteCountCallHash]) {
      setTotalVoteCount(getTotalVoteCountResult[getTotalVoteCountCallHash].value);
    }
  }, [getTotalVoteCountCallHash, getTotalVoteCountResult]);

  // Voting
  useEffect(() => {
    if (voting && transactionStack && transactionStack[createVoteCacheSendStackId]
        && transactions[transactionStack[createVoteCacheSendStackId]]) {
      if (transactions[transactionStack[createVoteCacheSendStackId]].status === TRANSACTION_SUCCESS || transactions[transactionStack[createVoteCacheSendStackId]].status === TRANSACTION_ERROR) {
        setVoting(false);
      }
    }
  }, [createVoteCacheSendStackId, transactionStack, transactions, voting]);

  const vote = useCallback((choice) => {
    setVoting(true);
    if ((ownVote === CHOICE_DEFAULT || ownVote === CHOICE_DOWN) && choice === CHOICE_UP) setVoteCacheSendStackId(upvote.cacheSend(...[postId], { from: userAccount }));
    else if ((ownVote === CHOICE_DEFAULT || ownVote === CHOICE_UP) && choice === CHOICE_DOWN) setVoteCacheSendStackId(downvote.cacheSend(...[postId], { from: userAccount }));
    else if ((ownVote === CHOICE_UP && choice === CHOICE_UP) || (ownVote === CHOICE_DOWN && choice === CHOICE_DOWN)) setVoteCacheSendStackId(unvote.cacheSend(...[postId], { from: userAccount }));
  }, [ownVote, postId, userAccount]);

  const disableVoting = userAccount === null || !hasSignedUp || postAuthorAddress === null || userAccount === postAuthorAddress;
  return useMemo(() => (
      <div className="post-voting">
          <Button
            compact
            size="mini"
            icon="arrow down"
            negative={ownVote === CHOICE_DOWN}
            disabled={disableVoting}
            onClick={() => vote(CHOICE_DOWN)}
          />
          <span>
              &nbsp;&nbsp;
              {totalVoteCount || 0}
              &nbsp;&nbsp;
          </span>
          <Button
            compact
            size="mini"
            icon="arrow up"
            positive={ownVote === CHOICE_UP}
            disabled={disableVoting}
            onClick={() => vote(CHOICE_UP)}
          />
      </div>
  ), [disableVoting, ownVote, totalVoteCount, vote]);
};

PostVoting.defaultProps = {
  loading: false,
};

PostVoting.propTypes = {
  postId: PropTypes.number.isRequired,
  postAuthorAddress: PropTypes.string,
  totalVoteCount: PropTypes.number,
};

export default memo(PostVoting);
