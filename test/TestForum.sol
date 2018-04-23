pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Forum.sol";

contract TestForum {
	Forum forumContract = Forum(DeployedAddresses.Forum());

	function testUserCanSignUp() public {
		//Try to sign up
		bool expected = true;
		bool userSignUpStatus = forumContract.signUp("MrAwesome");
		Assert.equal(userSignUpStatus, expected, "Sign-up failed");
	}

	function testHasUserSignedUp() public {
		//Check if sign-up succeeded
		address myAddress = this;
		require(forumContract.hasUserSignedUp(myAddress));
	}

	/* function testGetUsername() public {
		//require (forumContract.getUsername(this) == "MrAwesome");
	} */

	function testGetUserAddress() public {
		//Try to get user address from user-name
		address expected = this;
		address userAddress = forumContract.getUserAddress("MrAwesome");
		Assert.equal(userAddress, expected, "Getting user address from user-name failed");
	}

	function testIsUserNameTaken() public view {
		//Try to test if a user-name is taken
		bool expected = false;
		bool result = forumContract.isUserNameTaken("somethingElse");
		Assert.equal(result, expected, "Testing if user-name is taken failed");

		/* expected = true;
		result = forumContract.isUserNameTaken("MrAwesome");
		Assert.equal(result, expected, "Testing if user-name is taken failed"); */
	}

	/* function testCreateTopic() public {
		uint expected = 1;
		uint topicId = forumContract.createTopic();
		Assert.equal(topicId, expected, "whatevs");
	}

	function testCreatePost() public {
		uint expected = 1;
		uint postId = forumContract.createPost(1);
		Assert.equal(postId, expected, "whatevs");
	} */

	/* function testGetTopicPosts() public {
	} */

	/* function test () public {
	} */
}