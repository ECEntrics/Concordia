//SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "./Forum.sol";

contract Voting {
    Forum public forum;

    constructor(Forum addr) {
        forum = Forum(addr);
    }

    struct Poll {
        uint topicID;
        uint numOptions;
        string dataHash;
        mapping (address => uint) votes;
        mapping (uint => address[]) voters;
        bool enableVoteChanges;
        uint timestamp;
    }

    mapping (uint => Poll) polls;

    event PollCreated(uint topicID);
    event UserVoted(address userAddress);

    // Verify that poll exists
    function isPollExistent(uint topicID) public view returns (bool) {
        if (polls[topicID].timestamp != 0)
            return true;
        return false;
    }

    function createPoll(uint topicID, uint numOptions, string memory dataHash, bool enableVoteChanges) public returns (uint) {
        require(forum.hasUserSignedUp(msg.sender));  // Only registered users can create polls
        require(topicID<forum.getNumberOfTopics()); // Only allow poll creation if topic exists
        require (forum.getTopicAuthor(topicID) == msg.sender); // Only allow poll creation from the author of the topic
        require(!isPollExistent(topicID)); // Only allow poll creation if it doesn't already exist

        Poll storage poll = polls[topicID];
        poll.topicID = topicID;
        poll.numOptions = numOptions;
        poll.dataHash = dataHash;
        poll.enableVoteChanges = enableVoteChanges;
        poll.timestamp = block.timestamp;

        emit PollCreated(topicID);
        return topicID;
    }

    function getPollInfo(uint topicID) public view returns (uint, string memory, uint, uint) {
        require(isPollExistent(topicID));

        uint totalVotes = getTotalVotes(topicID);

        return (
        polls[topicID].numOptions,
        polls[topicID].dataHash,
        polls[topicID].timestamp,
        totalVotes
        );
    }

    function isOptionValid(uint topicID, uint option) public view returns (bool) {
        require(isPollExistent(topicID));
        if (option <= polls[topicID].numOptions)    // Option 0 is valid as well (no option chosen)
            return true;
        return false;
    }

    function hasVoted(uint topicID, address voter) public view returns (bool) {
        require(isPollExistent(topicID));
        if (polls[topicID].votes[voter] != 0)
            return true;
        return false;
    }

    function getVote(uint topicID, address voter) public view returns (uint) {
        require(hasVoted(topicID, voter));
        return polls[topicID].votes[voter];
    }

    // Gets vote count for a specific option
    function getVoteCount(uint topicID, uint option) public view returns (uint) {
        require(isPollExistent(topicID));
        require(isOptionValid(topicID, option));
        return (polls[topicID].voters[option].length);
    }

    function getTotalVotes(uint topicID) public view returns (uint) {
        require(isPollExistent(topicID));

        Poll storage poll = polls[topicID];
        uint totalVotes = 0;

        for (uint pollOption = 1; pollOption <= poll.numOptions; pollOption++)
            totalVotes += poll.voters[pollOption].length;

        return totalVotes;
    }

    // Gets voters for a specific option
    function getVoters(uint topicID, uint option) public view returns (address[] memory) {
        require(isPollExistent(topicID));
        return (polls[topicID].voters[option]);
    }

    function getVoterIndex(uint topicID, address voter) public view returns (uint) {
        require(isPollExistent(topicID));
        require(hasVoted(topicID, voter));
        Poll storage poll = polls[topicID];
        uint votedOption = getVote(topicID, voter);
        address[] storage optionVoters = poll.voters[votedOption];

        for (uint voterIndex = 0; voterIndex < optionVoters.length; voterIndex++)
            if (optionVoters[voterIndex] == voter)
                return voterIndex;

        revert("Couldn't find voter's index!");
    }

    function vote(uint topicID, uint option) public {
        require(forum.hasUserSignedUp(msg.sender));
        require(isPollExistent(topicID));
        require(isOptionValid(topicID, option));
        Poll storage poll = polls[topicID];
        address voter = msg.sender;
        uint prevOption = poll.votes[voter];
        if(prevOption == option)
            return;

        // Voter hadn't voted before
        if(prevOption == 0){
            poll.voters[option].push(voter);
            poll.votes[voter] = option;
            emit UserVoted(voter);
        }
        else if (poll.enableVoteChanges){
            uint voterIndex = getVoterIndex(topicID, voter);
            // Swap with last voter address and delete vote
            poll.voters[prevOption][voterIndex] = poll.voters[prevOption][poll.voters[prevOption].length - 1];
            poll.voters[prevOption].pop();
            if(option != 0)
                poll.voters[option].push(voter);
            poll.votes[voter] = option;
            emit UserVoted(voter);
        }
    }
}
