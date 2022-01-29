const Forum = artifacts.require('Forum');

contract('Forum', (accounts) => {
  it('...should succeed.', async () => {
    const forumInstance = await Forum.deployed();

    assert
      .ok(forumInstance
        .signUp('testUsername', { from: accounts[0] }), 'The user was not created.');
  });
});
