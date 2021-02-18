//SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "./Forum.sol";

contract PostVoting {
    Forum public forum;

    constructor(Forum addr) {
        forum = Forum(addr);
    }

    enum Option { DEFAULT, UP, DOWN }  // DEFAULT -> 0, UP -> 1, DOWN -> 2

    struct PostBallot {
        mapping(address => Option) votes;
        mapping(Option => address[]) voters;
    }

    mapping(uint => PostBallot) postBallots;

    event UserVotedPost(address userAddress, uint postID, Option option);

    function getVote(uint postID, address voter) public view returns (Option) {
        require(forum.postExists(postID), forum.POST_DOES_NOT_EXIST());
        return postBallots[postID].votes[voter];
    }

    // Gets vote count for a specific option (Option.UP/ Option.DOWN only!)
    function getVoteCount(uint postID, Option option) private view returns (uint) {
        require(forum.postExists(postID), forum.POST_DOES_NOT_EXIST());
        return (postBallots[postID].voters[option].length);
    }

    function getUpvoteCount(uint postID) public view returns (uint) {
        return (getVoteCount(postID, Option.UP));
    }

    function getDownvoteCount(uint postID) public view returns (uint) {
        return (getVoteCount(postID, Option.DOWN));
    }

    function getTotalVoteCount(uint postID) public view returns (int) {
        int upvoteCount = int(getUpvoteCount(postID));
        int downvoteCount = int(getDownvoteCount(postID));
        return upvoteCount - downvoteCount;
    }

    // Gets voters for a specific option (Option.UP/ Option.DOWN)
    function getVoters(uint postID, Option option) private view returns (address[] memory) {
        require(forum.postExists(postID), forum.POST_DOES_NOT_EXIST());
        return (postBallots[postID].voters[option]);
    }

    function getUpvoters(uint postID) public view returns (address[] memory) {
        return (getVoters(postID, Option.UP));
    }

    function getDownvoters(uint postID) public view returns (address[] memory) {
        return (getVoters(postID, Option.DOWN));
    }

    function getVoterIndex(uint postID, address voter) private view returns (uint) {
        require(forum.hasUserSignedUp(voter), forum.USER_HAS_NOT_SIGNED_UP());
        require(forum.postExists(postID), forum.POST_DOES_NOT_EXIST());

        PostBallot storage postBallot = postBallots[postID];
        Option votedOption = getVote(postID, voter);
        address[] storage optionVoters = postBallot.voters[votedOption];

        for (uint voterIndex = 0; voterIndex < optionVoters.length; voterIndex++)
            if (optionVoters[voterIndex] == voter)
                return voterIndex;

        revert("Couldn't find voter's index!");
    }

    function vote(uint postID, Option option) private {
        address voter = msg.sender;
        require(forum.hasUserSignedUp(voter), forum.USER_HAS_NOT_SIGNED_UP());
        require(forum.postExists(postID), forum.POST_DOES_NOT_EXIST());
        address postAuthor = forum.getPostAuthor(postID);
        require(voter != postAuthor, "Post's author cannot vote for it.");

        PostBallot storage postBallot = postBallots[postID];
        Option prevOption = postBallot.votes[voter];

        if (prevOption == option)
            return;

        // Remove previous vote if exists
        if (prevOption != Option.DEFAULT) {
            uint voterIndex = getVoterIndex(postID, voter);
            // Swap with last voter address and delete vote
            postBallot.voters[prevOption][voterIndex] = postBallot.voters[prevOption][postBallot.voters[prevOption].length - 1];
            postBallot.voters[prevOption].pop();
        }

        // Add new vote
        if (option != Option.DEFAULT)
            postBallot.voters[option].push(voter);
        postBallot.votes[voter] = option;
        emit UserVotedPost(voter, postID, option);
    }

    function upvote(uint postID) public {
        vote(postID, Option.UP);
    }

    function downvote(uint postID) public {
        vote(postID, Option.DOWN);
    }

    function unvote(uint postID) public {
        vote(postID, Option.DEFAULT);
    }
}
