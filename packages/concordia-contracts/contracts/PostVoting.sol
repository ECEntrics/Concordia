//SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "./Forum.sol";

contract PostVoting {
    Forum public forum;

    constructor(Forum addr) {
        forum = Forum(addr);
    }

    enum Option { NONE, UP, DOWN }  // NONE -> 0, UP -> 1, DOWN -> 2

    Option constant defaultOption = Option.NONE;

    function getDefaultChoice() public pure returns (uint) {
        return uint(defaultOption);
    }

    struct PostBallot {
        mapping (address => Option) votes;
        mapping (Option => address[]) voters;
    }

    mapping (uint => PostBallot) postBallots;

    event UserVotedPost(address userAddress, uint postID, Option option);

    function getVote(uint postID, address voter) public view returns (Option) {
        require(forum.postExists(postID));
        return postBallots[postID].votes[voter];
    }

    // Gets vote count for a specific option (Option.UP/ Option.DOWN)
    function getVoteCount(uint postID, Option option) private view returns (uint) {
        require(forum.postExists(postID));
        return (postBallots[postID].voters[option].length);
    }

    function getUpvoteCount(uint postID) public view returns (uint) {
        return (getVoteCount(postID, Option.UP));
    }

    function getDownvoteCount(uint postID) public view returns (uint) {
        return (getVoteCount(postID, Option.DOWN));
    }

    // Gets voters for a specific option (Option.UP/ Option.DOWN)
    function getVoters(uint postID, Option option) private view returns (address[] memory) {
        require(forum.postExists(postID));
        return (postBallots[postID].voters[option]);
    }

    function getUpvoters(uint postID) public view returns (address[] memory) {
        return (getVoters(postID, Option.UP));
    }

    function getDownvoters(uint postID) public view returns (address[] memory) {
        return (getVoters(postID, Option.DOWN));
    }

    function getVoterIndex(uint postID, address voter) private view returns (uint) {
        require(forum.hasUserSignedUp(voter));
        require(forum.postExists(postID));

        PostBallot storage postBallot = postBallots[postID];
        Option votedOption = getVote(postID, voter);
        address[] storage optionVoters = postBallot.voters[votedOption];

        for (uint voterIndex = 0; voterIndex < optionVoters.length; voterIndex++)
            if (optionVoters[voterIndex] == voter)
                return voterIndex;

        revert("Couldn't find voter's index!");
    }

    function vote(uint postID, Option option) private {
        require(forum.hasUserSignedUp(msg.sender));
        require(forum.postExists(postID)); // Only allow voting if post exists

        PostBallot storage postBallot = postBallots[postID];
        address voter = msg.sender;
        Option prevOption = postBallot.votes[voter];

        if(prevOption == option)
            return;

        // Remove previous vote if exists
        if(prevOption != Option.NONE){
            uint voterIndex = getVoterIndex(postID, voter);
            // Swap with last voter address and delete vote
            postBallot.voters[prevOption][voterIndex] = postBallot.voters[prevOption][postBallot.voters[prevOption].length - 1];
            postBallot.voters[prevOption].pop();
        }

        // Add new vote
        if(option != Option.NONE)
            postBallot.voters[option].push(voter);
        postBallot.votes[voter] = option;
        emit UserVotedPost(voter, postID, option);
    }

    function upvote(uint postID) public{
        vote(postID, Option.UP);
    }

    function downvote(uint postID) public{
        vote(postID, Option.DOWN);
    }

    function unvote(uint postID) public{
        vote(postID, Option.NONE);
    }
}
