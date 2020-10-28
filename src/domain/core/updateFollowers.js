var subscription = require('../../../src/domain/core/subscription');

var UpdateFollowers = function UpdateFollowers(followersRepository){
    var self = this;

    self.register = function register(eventPublisher) {
		eventPublisher.on(subscription.UserFollowed, function onUserFollowed(event) {
			followersRepository.save(event.subscriptionId);
		})
		eventPublisher.on(subscription.UserUnfollowed, function onUserUnfollowed(event) {
			followersRepository.remove(event.subscriptionId);
		})
    };
};

exports.create = function create(followersRepository){
    return new UpdateFollowers(followersRepository);
};
