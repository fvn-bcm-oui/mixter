var message = require('../../../src/domain/core/message');
var timelineMessageProjection = require('../../../src/domain/core/timelineMessageProjection');

var UpdateTimeline = function UpdateTimeline(timelineMessageRepository){
    var self = this;

    self.register = function(eventPublisher) {
		eventPublisher.on(message.MessageQuacked, function(message) {
			const projection = timelineMessageProjection.create(
				message.author,
				message.author,
				message.content,
				message.messageId);
			timelineMessageRepository.save(projection)
		});
		eventPublisher.on(message.MessageDeleted, function(event) {
			timelineMessageRepository.deleteMessage(event.messageId);
		});
    };
};

exports.create = function(timelineMessageRepository){
    return new UpdateTimeline(timelineMessageRepository);
};
