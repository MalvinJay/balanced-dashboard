Balanced.MarketplaceImportPayoutsController = Balanced.Controller.extend(Ember.Evented, {
	needs: ['marketplace'],

	init: function() {
		this._super();
		this.refresh();
	},

	refresh: function(text) {
		this.set("csvText", text);
	},

	validateCreditCreators: function() {
		var creditCreators = this.get("creditCreators");
		if (creditCreators.get("isLoaded")) {
			creditCreators.forEach(function(item) {
				item.validate();
			});
		}
	}.observes("creditCreators.isLoaded"),

	creditCreators: function() {
		var text = this.get("csvText");
		this.set("errorMessage", null);

		try {
			return Balanced.CreditCreatorsCollection.fromCsvText(Balanced.currentMarketplace, text);
		} catch (e) {
			this.set("errorMessage", "There was an error reading your CSV file");
			return Balanced.CreditCreatorsCollection.create({
				content: []
			});
		}
	}.property("csvText"),

	save: function(callback) {
		var self = this;
		var collection = self.get('creditCreators');
		collection.save(function() {
			if (callback) {
				callback();
			}
			var count = collection.filterBy('isSaved').get('length');
			self.transitionToRoute('activity');
			self.refresh('');
			self.send('alert', {
				message: '%@ payouts were successfully submitted. Payouts might take a couple seconds to appear in the transactions list.'.fmt(count),
				persists: false,
				type: 'success'
			});
		});
	},

	actions: {
		clearAll: function() {
			var self = this;

			var collection = this.get("creditCreators");
			collection.get("invalid").forEach(function(creator, index) {
				collection.removeObject(creator);
			});
		},

		removeCreditCreator: function(creator) {
			this.get('creditCreators').removeObject(creator);
		},

		openAddFundsModal: function() {
			this.trigger('openAddFundsModal');
		}
	}
});
