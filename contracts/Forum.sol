pragma solidity >=0.5.6 <0.6.0;

import "./Posting.sol";

contract Forum {
    Posting posting;

    constructor(address addr) public {
        posting = Posting(addr);
        posting.setForumContractAddress();
    }

    //----------------------------------------USER----------------------------------------
    struct User {
        string username;    // TODO: set an upper bound instead of arbitrary string
        OrbitDB orbitdb;
        uint[] topicIDs;    // IDs of the topics the user created
        uint[] postIDs;    // IDs of the posts the user created
        uint timestamp;
        bool signedUp;    // Helper variable for hasUserSignedUp()
    }

    mapping (address => User) users;
    mapping (string => address) userAddresses;

    event UserSignedUp(string username, address userAddress);
    event UsernameUpdated(string newName, string oldName,address userAddress);

    function signUp(string memory username, string memory orbitIdentityId,
        string memory orbitIdentityPublicKey, string memory orbitIdentityPrivateKey,
        string memory orbitId, string memory orbitPublicKey, string memory orbitPrivateKey,
        string memory orbitTopicsDB, string memory orbitPostsDB) public returns (bool) {
        require (!hasUserSignedUp(msg.sender), "User has already signed up.");
        require(!isUserNameTaken(username), "Username is already taken.");
        users[msg.sender] = User(username,
            OrbitDB(orbitIdentityId, orbitIdentityPublicKey, orbitIdentityPrivateKey,
            orbitId, orbitPublicKey, orbitPrivateKey, orbitTopicsDB, orbitPostsDB),
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

    //----------------------------------------OrbitDB----------------------------------------
    // TODO: set upper bounds to strings (instead of being of arbitrary length)
    // TODO: not sure if topicsDB//postsDB are actually needed
    struct OrbitDB {
        string identityId;
        string identityPublicKey;
        string identityPrivateKey;
        string orbitId;
        string orbitPublicKey;
        string orbitPrivateKey;
        string topicsDB;
        string postsDB;
    }

    function getOrbitIdentityId(address userAddress) public view returns (string memory) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up.");
        return users[userAddress].orbitdb.identityId;
    }

    function getOrbitIdentityPublicKey(address userAddress) public view returns (string memory) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up.");
        return users[userAddress].orbitdb.identityPublicKey;
    }

    function getOrbitIdentityPrivateKey(address userAddress) public view returns (string memory) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up.");
        return users[userAddress].orbitdb.identityPrivateKey;
    }


    function getOrbitDBId(address userAddress) public view returns (string memory) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up.");
        return users[userAddress].orbitdb.orbitId;
    }

    function getOrbitPublicKey(address userAddress) public view returns (string memory) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up.");
        return users[userAddress].orbitdb.orbitPublicKey;
    }

    //TODO: encrypt using Metamask in the future
    function getOrbitPrivateKey(address userAddress) public view returns (string memory) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up.");
        return users[userAddress].orbitdb.orbitPrivateKey;
    }

    function getOrbitTopicsDB(address userAddress) public view returns (string memory) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up.");
        return users[userAddress].orbitdb.topicsDB;
    }

    function getOrbitPostsDB(address userAddress) public view returns (string memory) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up.");
        return users[userAddress].orbitdb.postsDB;
    }

    function getOrbitIdentityInfo(address userAddress) public view returns (string memory, string memory, string memory) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up.");
        return (
        users[userAddress].orbitdb.identityId,
        users[userAddress].orbitdb.identityPublicKey,
        users[userAddress].orbitdb.identityPrivateKey
        );
    }

    function getOrbitDBInfo(address userAddress) public view returns (string memory, string memory,
        string memory, string memory, string memory) {
        require (hasUserSignedUp(userAddress), "User hasn't signed up.");
        return (
        users[userAddress].orbitdb.orbitId,
        users[userAddress].orbitdb.orbitPublicKey,
        users[userAddress].orbitdb.orbitPrivateKey,
        users[userAddress].orbitdb.topicsDB,
        users[userAddress].orbitdb.postsDB
        );
    }

    //----POSTING-----

    function createTopic() public returns (uint, uint) {
        require(hasUserSignedUp(msg.sender));  // Only registered users can create topics
        (uint topicID, uint postID) = posting.createTopic(msg.sender);
        users[msg.sender].topicIDs.push(topicID);
        users[msg.sender].postIDs.push(postID);
        return (topicID, postID);
    }

    function createPost(uint topicID) public returns (uint) {
        require(hasUserSignedUp(msg.sender));  // Only registered users can create posts
        uint postID = posting.createPost(topicID, msg.sender);
        users[msg.sender].postIDs.push(postID);
        return postID;
    }

    function getTopic(uint topicID) public view returns (string memory, address, string memory, uint, uint[] memory) {
        (address author, uint timestamp, uint[] memory postIDs) = posting.getTopicInfo(topicID);
        return (getOrbitTopicsDB(author),
        author,
        users[author].username,
        timestamp,
        postIDs
        );
    }

    function getPost(uint postID) public view returns (string memory, address, string memory, uint, uint) {
        (address author, uint timestamp, uint topicID) = posting.getPostInfo(postID);
        return (getOrbitPostsDB(author),
        author,
        users[author].username,
        timestamp,
        topicID
        );
    }

}
