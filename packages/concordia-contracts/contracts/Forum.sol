//SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Forum {
    // Error messages for require()
    string public constant USER_HAS_NOT_SIGNED_UP = "User hasn't signed up yet.";
    string public constant USERNAME_TAKEN = "Username is already taken.";
    string public constant TOPIC_DOES_NOT_EXIST = "Topic doesn't exist.";
    string public constant POST_DOES_NOT_EXIST = "Post doesn't exist.";

    //----------------------------------------USER----------------------------------------
    struct User {
        string username;    // TODO: set an upper bound instead of arbitrary string
        uint[] topicIDs;    // IDs of the topics the user created
        uint[] postIDs;    // IDs of the posts the user created
        uint timestamp;
        bool signedUp;    // Helper variable for hasUserSignedUp()
    }

    mapping(address => User) users;
    mapping(string => address) userAddresses;

    event UserSignedUp(string username, address userAddress);
    event UsernameUpdated(string newName, string oldName, address userAddress);

    function signUp(string memory username) public returns (bool) {
        require(!hasUserSignedUp(msg.sender), USER_HAS_NOT_SIGNED_UP);
        require(!isUserNameTaken(username), USERNAME_TAKEN);
        users[msg.sender] = User(username, new uint[](0), new uint[](0), block.timestamp, true);
        userAddresses[username] = msg.sender;
        emit UserSignedUp(username, msg.sender);
        return true;
    }

    function updateUsername(string memory newUsername) public returns (bool) {
        require(hasUserSignedUp(msg.sender), USER_HAS_NOT_SIGNED_UP);
        require(!isUserNameTaken(newUsername), USERNAME_TAKEN);
        string memory oldUsername = getUsername(msg.sender);
        delete userAddresses[users[msg.sender].username];
        users[msg.sender].username = newUsername;
        userAddresses[newUsername] = msg.sender;
        emit UsernameUpdated(newUsername, oldUsername, msg.sender);
        return true;
    }

    function getUsername(address userAddress) public view returns (string memory) {
        require(hasUserSignedUp(userAddress), USER_HAS_NOT_SIGNED_UP);
        return users[userAddress].username;
    }

    function getUserAddress(string memory username) public view returns (address) {
        return userAddresses[username];
    }

    function hasUserSignedUp(address userAddress) public view returns (bool) {
        return users[userAddress].signedUp;
    }

    function isUserNameTaken(string memory username) public view returns (bool) {
        if (getUserAddress(username) != address(0))
            return true;
        return false;
    }

    function getUserTopics(address userAddress) public view returns (uint[] memory) {
        require(hasUserSignedUp(userAddress), USER_HAS_NOT_SIGNED_UP);
        return users[userAddress].topicIDs;
    }

    function getUserPosts(address userAddress) public view returns (uint[] memory) {
        require(hasUserSignedUp(userAddress), USER_HAS_NOT_SIGNED_UP);
        return users[userAddress].postIDs;
    }

    function getUserDateOfRegister(address userAddress) public view returns (uint) {
        require(hasUserSignedUp(userAddress), USER_HAS_NOT_SIGNED_UP);
        return users[userAddress].timestamp;
    }

    function getUser(address userAddress) public view returns (User memory) {
        require(hasUserSignedUp(userAddress), USER_HAS_NOT_SIGNED_UP);
        return users[userAddress];
    }

    //----------------------------------------POSTING----------------------------------------
    struct Topic {
        uint topicID;
        address author;
        uint timestamp;
        uint[] postIDs;
    }

    struct Post {
        uint postID;
        address author;
        uint timestamp;
        uint topicID;
    }

    uint public numTopics;   // Total number of topics
    uint public numPosts;    // Total number of posts

    mapping(uint => Topic) topics;
    mapping(uint => Post) posts;

    event TopicCreated(uint topicID, uint postID);
    event PostCreated(uint postID, uint topicID);

    function createTopic() public returns (uint, uint) {
        require(hasUserSignedUp(msg.sender), USER_HAS_NOT_SIGNED_UP);
        //Creates topic
        uint topicID = numTopics++;
        topics[topicID] = Topic(topicID, msg.sender, block.timestamp, new uint[](0));
        users[msg.sender].topicIDs.push(topicID);

        //Adds first post to topic
        uint postID = numPosts++;
        posts[postID] = Post(postID, msg.sender, block.timestamp, topicID);
        topics[topicID].postIDs.push(postID);
        users[msg.sender].postIDs.push(postID);

        emit TopicCreated(topicID, postID);
        return (topicID, postID);
    }

    function createPost(uint topicID) public returns (uint) {
        require(hasUserSignedUp(msg.sender), USER_HAS_NOT_SIGNED_UP);
        require(topicExists(topicID), TOPIC_DOES_NOT_EXIST);
        uint postID = numPosts++;
        posts[postID] = Post(postID, msg.sender, block.timestamp, topicID);
        topics[topicID].postIDs.push(postID);
        users[msg.sender].postIDs.push(postID);
        emit PostCreated(postID, topicID);
        return postID;
    }

    function topicExists(uint topicID) public view returns (bool) {
        return topicID < numTopics;
    }

    function postExists(uint postID) public view returns (bool) {
        return postID < numPosts;
    }

    function getTopic(uint topicID) public view returns (address, string memory, uint, uint[] memory) {
        require(topicExists(topicID), TOPIC_DOES_NOT_EXIST);
        return (
            topics[topicID].author,
            users[topics[topicID].author].username,
            topics[topicID].timestamp,
            topics[topicID].postIDs
        );
    }

    function getTopicPosts(uint topicID) public view returns (uint[] memory) {
        require(topicExists(topicID), TOPIC_DOES_NOT_EXIST);
        return topics[topicID].postIDs;
    }

    function getTopicAuthor(uint topicID) public view returns (address) {
        require(topicExists(topicID), TOPIC_DOES_NOT_EXIST);
        return topics[topicID].author;
    }

    function getPost(uint postID) public view returns (address, string memory, uint, uint) {
        require(postExists(postID), POST_DOES_NOT_EXIST);
        return (
            posts[postID].author,
            users[posts[postID].author].username,
            posts[postID].timestamp,
            posts[postID].topicID
        );
    }

    function getPostAuthor(uint postID) public view returns (address) {
        require(postExists(postID), POST_DOES_NOT_EXIST);
        return posts[postID].author;
    }
}
