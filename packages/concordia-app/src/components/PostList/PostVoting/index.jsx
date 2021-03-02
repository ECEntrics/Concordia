import React, {
  memo, useCallback, useEffect, useMemo, useState,
} from 'react';
import { Button, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { POST_VOTING_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { drizzle } from '../../../redux/store';
import { TRANSACTION_ERROR, TRANSACTION_SUCCESS } from '../../../constants/TransactionStatus';
import './styles.css';

const CHOICE_DEFAULT = '0';
const CHOICE_UP = '1';
const CHOICE_DOWN = '2';

const {
  contracts: {
    [POST_VOTING_CONTRACT]: {
      methods: {
        getVoteInfo: { cacheCall: getVoteInfoChainData },
        upvote, downvote, unvote,
      },
    },
  },
} = drizzle;

const PostVoting = (props) => {
  const { postId, postAuthorAddress } = props;
  const hasSignedUp = useSelector((state) => state.user.hasSignedUp);
  const userAccount = useSelector((state) => state.accounts[0]);

  // Current votes
  const [getVoteInfoCallHash, setGetVoteInfoCallHash] = useState(null);

  const getVoteInfoResult = useSelector((state) => state.contracts[POST_VOTING_CONTRACT].getVoteInfo[getVoteInfoCallHash]);

  const [ownVote, setOwnVote] = useState(null);
  const [totalVoteCount, setTotalVoteCount] = useState(null);
  const [upvoteCount, setUpvoteCount] = useState(null);
  const [downvoteCount, setDownvoteCount] = useState(null);

  // Voting
  const transactionStack = useSelector((state) => state.transactionStack);
  const transactions = useSelector((state) => state.transactions);
  const [voting, setVoting] = useState(false);
  const [createVoteCacheSendStackId, setVoteCacheSendStackId] = useState('');

  // Current votes
  useEffect(() => {
    if (postId !== null && getVoteInfoCallHash === null) {
      setGetVoteInfoCallHash(getVoteInfoChainData(postId));
    }
  }, [getVoteInfoCallHash, postId]);

  useEffect(() => {
    if (getVoteInfoResult) {
      setOwnVote(getVoteInfoResult.value[0]);
      setTotalVoteCount(getVoteInfoResult.value[1]);
      setUpvoteCount(getVoteInfoResult.value[2]);
      setDownvoteCount(getVoteInfoResult.value[3]);
    }
  }, [getVoteInfoResult]);

  // Voting
  useEffect(() => {
    if (voting && transactionStack && transactionStack[createVoteCacheSendStackId]
            && transactions[transactionStack[createVoteCacheSendStackId]]) {
      if (transactions[transactionStack[createVoteCacheSendStackId]].status === TRANSACTION_SUCCESS
          || transactions[transactionStack[createVoteCacheSendStackId]].status === TRANSACTION_ERROR) {
        setVoting(false);
      }
    }
  }, [createVoteCacheSendStackId, transactionStack, transactions, voting]);

  const vote = useCallback((e, choice) => {
    e.currentTarget.blur();
    if (voting) return;

    setVoting(true);
    if ((ownVote === CHOICE_DEFAULT || ownVote === CHOICE_DOWN) && choice === CHOICE_UP) setVoteCacheSendStackId(upvote.cacheSend(...[postId], { from: userAccount }));
    else if ((ownVote === CHOICE_DEFAULT || ownVote === CHOICE_UP) && choice === CHOICE_DOWN) setVoteCacheSendStackId(downvote.cacheSend(...[postId], { from: userAccount }));
    else if ((ownVote === CHOICE_UP && choice === CHOICE_UP) || (ownVote === CHOICE_DOWN && choice === CHOICE_DOWN)) setVoteCacheSendStackId(unvote.cacheSend(...[postId], { from: userAccount }));
    else setVoting(false);
  }, [ownVote, postId, userAccount, voting]);

  const disableVoting = userAccount === null || !hasSignedUp || postAuthorAddress === null || userAccount === postAuthorAddress;
  return useMemo(() => (
      <div className="post-voting">
          <Button
            compact
            size="mini"
            icon="arrow down"
            negative={ownVote === CHOICE_DOWN}
            disabled={disableVoting}
            onClick={(e) => vote(e, CHOICE_DOWN)}
          />
          <Popup
            size="tiny"
            trigger={(
                <span className="unselectable">
                        &nbsp;&nbsp;
                    {totalVoteCount || 0}
                        &nbsp;&nbsp;
                </span>
            )}
            disabled={(upvoteCount === null && downvoteCount === null) || (upvoteCount === '0' && downvoteCount === '0')}
            position="bottom center"
          >
              {upvoteCount !== '0' ? (
                  <span className="upvote-count">
                      +
                      {upvoteCount}
                        &nbsp;&nbsp;
                  </span>
              ) : null}

              {downvoteCount !== '0' ? (
                  <span className="downvote-count">
                      -
                      {downvoteCount}
                  </span>
              ) : null}
          </Popup>
          <Button
            compact
            size="mini"
            icon="arrow up"
            positive={ownVote === CHOICE_UP}
            disabled={disableVoting}
            onClick={(e) => vote(e, CHOICE_UP)}
          />
      </div>
  ), [disableVoting, downvoteCount, ownVote, totalVoteCount, upvoteCount, vote]);
};

PostVoting.propTypes = {
  postId: PropTypes.number.isRequired,
  postAuthorAddress: PropTypes.string,
  totalVoteCount: PropTypes.number,
};

export default memo(PostVoting);
