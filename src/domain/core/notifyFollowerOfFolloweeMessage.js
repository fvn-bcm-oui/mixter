var subscription = require('../../../src/domain/core/subscription');
var message = require('../../../src/domain/core/message');

var _ = require('lodash');

var NotifyFollowerOfFolloweeMessage = function NotifyFollowerOfFolloweeMessage(subscriptionsRepository){
	var self = this;
	this.subscriptions = [];

	function onMessageQuacked(eventPublisher, messageQuacked) {
		var followersSubs = _.filter(this.subscriptions,
			function (s) { return s.followee === messageQuacked.author; });
		_.each(followersSubs, function (subscriptionId) {
			eventPublisher.publish(new subscription.FolloweeMessageQuacked(subscriptionId, messageQuacked.messageId));
		});
	}

    self.register = function register(eventPublisher) {
		eventPublisher.on(subscription.UserFollowed, function(event) {
			self.subscriptions.push(event.subscriptionId);
		});
		eventPublisher.on(message.MessageQuacked, onMessageQuacked.bind(self, eventPublisher));
    };
};

exports.create = function create(subscriptionsRepository){
    return new NotifyFollowerOfFolloweeMessage(subscriptionsRepository);
};

