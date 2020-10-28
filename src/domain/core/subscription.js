var valueType = require('../../valueType');
var decisionProjection = require('../decisionProjection');

var SubscriptionId = exports.SubscriptionId = valueType.extends(function SubscriptionId(follower, followee){
    this.follower = follower;
    this.followee = followee;

    Object.freeze(this);
}, function toString() {
    return 'Subscription:' + this.follower + ' -> ' + this.followee;
});

var UserFollowed = exports.UserFollowed = function UserFollowed(subscriptionId){
    this.subscriptionId = subscriptionId;

    Object.freeze(this);
};

UserFollowed.prototype.getAggregateId = function getAggregateId(){
    return this.subscriptionId;
};

var UserUnfollowed = exports.UserUnfollowed = function UserUnfollowed(subscriptionId){
    this.subscriptionId = subscriptionId;

    Object.freeze(this);
};

UserUnfollowed.prototype.getAggregateId = function getAggregateId(){
    return this.subscriptionId;
};

var FolloweeMessageQuacked = exports.FolloweeMessageQuacked = function FolloweeMessageQuacked(subscriptionId, messageId){
    this.subscriptionId = subscriptionId;
    this.messageId = messageId;

    Object.freeze(this);
};

FolloweeMessageQuacked.prototype.getAggregateId = function getAggregateId(){
    return this.subscriptionId;
};

var Subscription = function Subscription(events){
    var self = this;

	var projection = decisionProjection.create()
		.register(UserFollowed, function(event) {
			this.subscriptionId = event.subscriptionId;
		})
		.register(UserUnfollowed, function(event) {
			if(this.subscriptionId = event.subscriptionId) {
				this.subscriptionId = undefined;
			}
		})
		.apply(events);

    self.unfollow = function unfollow(publishEvent) {
        publishEvent(new UserUnfollowed(projection.subscriptionId));
	};

	self.notifyFollower = function notifyFollower(publishEvent, messageId) {
		if(projection.subscriptionId) {
			publishEvent(new FolloweeMessageQuacked(projection.subscriptionId, messageId));
		}
	}
};


exports.followUser = function(publishEvent, follower, followee) {
    publishEvent(new UserFollowed(new SubscriptionId(follower, followee)));
};

exports.create = function(events) {
	return new Subscription(events);
}
