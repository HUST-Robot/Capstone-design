//
// Module : MMM-NotificationTrigger
//


Module.register("MMM-NotificationTrigger", {
	defaults: {
		useWebhook: false,
		triggers:[
			{
				trigger: "SAMPLE_INCOMINIG_NOTIFICATION",
				triggerSenderFilter: (sender) => {
					return true
				},
				triggerPayloadFilter: (payload) => {
					return true
				},
				fires: [
					{
						fire:"SAMPLE_OUTGOING_NOTIFICATION",
						payload: (payload) => {
							return payload
						},
						delay: 0,
						exec: ""
					},
				],
			},
		]
	},

	start: function() {
		this.sendSocketNotification("INIT")
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification == "WEBHOOK" && this.config.useWebhook) {
			this.notificationReceived(payload.notification, payload.payload, payload.sender)
		}
		if (notification == "EXEC_RESULT") {
			this.sendNotification(payload.fire + "_RESULT", payload)
			console.log("[NOTTRG] Execution Result: ", payload)
		}
	},

	notificationReceived: function (notification, payload, sender) {
		var triggers = this.config.triggers
		for(i in triggers) {
			var trigger = triggers[i]
			if (notification == trigger.trigger) {
				var senderFilter = (trigger.triggerSenderFilter)
					? trigger.triggerSenderFilter
					: this.defaults.triggers[0].triggerSenderFilter
				var payloadFilter = (trigger.triggerPayloadFilter)
					? trigger.triggerPayloadFilter
					: this.defaults.triggers[0].triggerPayloadFilter
				if (senderFilter(sender) && payloadFilter(payload)) {
					for(j in trigger.fires) {
						var fire = trigger.fires[j]
						var payload_result = payload
						if (typeof fire.payload == "function") {
							payload_result = fire.payload(payload)
						} else if (fire.payload) {
							payload_result = fire.payload
						}
						var exec_result = fire.exec
						if (exec_result && typeof exec_result == "function") {
							exec_result = exec_result(payload)
						}

						if(fire.delay) {
							setTimeout((fire, trigger, payload, exec) => {
								this.sendNotification(fire, payload)
								if (exec) {
									this.sendSocketNotification("EXEC", {
										trigger:trigger,
										fire: fire,
										exec: exec
									})
								}
							}, fire.delay, fire.fire, trigger.trigger, payload_result, exec_result)
						} else {
							this.sendNotification(fire.fire, payload_result)
							if (exec_result) {
								this.sendSocketNotification("EXEC", {
									trigger:trigger.trigger,
									fire: fire.fire,
									exec: exec_result
								})
							}
						}
					}
				}
			}
		}
	},
})
