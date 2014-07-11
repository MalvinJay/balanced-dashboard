module("BaseFactory");

test("setValidationErrorsFromServer", function(assert) {
	var subject = Balanced.BaseFactory.create({});
	subject.validate();

	subject.setValidationErrorsFromServer([{
		"description": "Invalid field merchant[phone_number] - \"99.99\" is not an E.164 formatted phone number",
		"extras": {
			"phone_number": "\"99.99\" is not an E.164 formatted phone number"
		},
	}, {
		"description": "Invalid field merchant[honorific] - Doctor Parrot is not a real doctor.",
		"extras": {
			"honorific": "Doctor Parrot is not a real doctor"
		},
	}]);

	var messages = subject.get("validationErrors.fullMessages");
	assert.deepEqual(messages, [
		"Invalid field merchant[phone_number] - \"99.99\" is not an E.164 formatted phone number",
		"Invalid field merchant[honorific] - Doctor Parrot is not a real doctor."
	]);
});
