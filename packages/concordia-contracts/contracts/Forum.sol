//SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

contract Forum {

    //----------------------------------------USER----------------------------------------
    struct User {
        string username;    // TODO: set an upper bound instead of arbitrary string
        uint[] topicIDs;    // IDs of the topics the user created
        uint[] postIDs;    // IDs of the posts the user created
        uint timestamp;
        bool signedUp;    // Helper variable for hasUserSignedUp()
    }

    mapping (address => User) users;
    mapping (string => address) userAddresses;

    event UserSignedUp(string username, address userAddress);
    event UsernameUpdated(string newName, string oldName,address userAddress);

    function signUp(string memory username) public returns (bool) {
        require (!hasUserSignedUp(msg.sender), "User has already signed up.");
        require(!isUserNameTaken(username), "Username is already taken.");
        users[msg.sender] = User(username,
            new uint[](0), new uint[](0), block.timestamp, true);
        userAddresses[username] = msg.sender;
        emit UserSignedUp(username, msg.sender);
        return true;
    }

    function updateUsername(string memory newUsername) public returns (bool) {
        require (hasUserSignedUp(msg.sender), "User hasn't signed up yet.");
        require(!isUserNameTaken(newUsername), "Username is already taken.");
        string memory oldUsername = getUsername(msg.sender);
        delete userAddresses[users[msg.sender].username];
        users[msg.sender].username = newUsername;
        userAddresses[newUsername] = msg.sender;
        emit UsernameUpdated(newUsername, oldUsername, msg.sender);
        return true;
    }

    function getUsername(address userAddress) public view returns (string memory) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up yet.");
        return users[userAddress].username;
    }

    function getUserAddress(string memory username) public view returns (address) {
        return userAddresses[username];
    }

    function hasUserSignedUp(address userAddress) public view returns (bool) {
        return users[userAddress].signedUp;
    }

    function isUserNameTaken(string memory username) public view returns (bool) {
        if (getUserAddress(username)!=address(0))
            return true;
        return false;
    }

    function getUserTopics(address userAddress) public view returns (uint[] memory) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up yet.");
        return users[userAddress].topicIDs;
    }

    function getUserPosts(address userAddress) public view returns (uint[] memory) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up yet.");
        return users[userAddress].postIDs;
    }

    function getUserDateOfRegister(address userAddress) public view returns (uint) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up yet.");
        return users[userAddress].timestamp;
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

    uint numTopics;   // Total number of topics
    uint numPosts;    // Total number of posts

    mapping (uint => Topic) topics;
    mapping (uint => Post) posts;

    event TopicCreated(uint topicID, uint postID);
    event PostCreated(uint postID, uint topicID);

    function createTopic() public returns (uint, uint) {
        require(hasUserSignedUp(msg.sender));  // Only registered users can create topics
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
        require(hasUserSignedUp(msg.sender));  // Only registered users can create posts
        require(topicID<numTopics); // Only allow posting to a topic that exists
        uint postID = numPosts++;
        posts[postID] = Post(postID, msg.sender, block.timestamp, topicID);
        topics[topicID].postIDs.push(postID);
        users[msg.sender].postIDs.push(postID);
        emit PostCreated(postID, topicID);
        return postID;
    }

    function getNumberOfTopics() public view returns (uint) {
        return numTopics;
    }

    function getTopic(uint topicID) public view returns (address, string memory, uint, uint[] memory) {
        require(topicID<numTopics);
        return (
        topics[topicID].author,
        users[topics[topicID].author].username,
        topics[topicID].timestamp,
        topics[topicID].postIDs
        );
    }

    function getTopicPosts(uint topicID) public view returns (uint[] memory) {
        require(topicID<numTopics); // Topic should exist
        return topics[topicID].postIDs;
    }

    function getTopicAuthor(uint topicID) public view returns (address) {
        require(topicID<numTopics); // Topic should exist
        return topics[topicID].author;
    }

    function getPost(uint postID) public view returns (address, string memory, uint, uint) {
        require(postID<numPosts);
        return (
        posts[postID].author,
        users[posts[postID].author].username,
        posts[postID].timestamp,
        posts[postID].topicID
        );
    }
}
