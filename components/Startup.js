/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const ID = 'disableaboutconfig@clear-code.com';

const Cc = Components.classes;
const Ci = Components.interfaces;
Components.utils.import('resource://gre/modules/XPCOMUtils.jsm');

const kCID  = Components.ID('{07e31d53-07f3-486e-8c43-78031b578217}');
const kID   = '@clear-code.com/disableaboutconfig/startup;1';
const kNAME = 'DisableAboutConfigStartupService';

const ObserverService = Cc['@mozilla.org/observer-service;1']
		.getService(Ci.nsIObserverService);

const STARTUP_TOPIC = XPCOMUtils.generateNSGetFactory ?
					'profile-after-change' : // for gecko 2.0
					'app-startup' ;

function DisableAboutConfigStartupService() {
}
DisableAboutConfigStartupService.prototype = {
	listening : false,

	observe : function(aSubject, aTopic, aData)
	{
		switch (aTopic)
		{
			case 'app-startup':
				this.listening = true;
				ObserverService.addObserver(this, 'profile-after-change', false);
				return;

			case 'profile-after-change':
				if (this.listening) {
					ObserverService.removeObserver(this, 'profile-after-change');
					this.listening = false;
				}
				ObserverService.addObserver(this, 'chrome-document-global-created', false);
				return;

			case 'chrome-document-global-created':
				if (aSubject.location.href.indexOf('about:config') == 0)
					aSubject.location.replace('about:blank');
				return;
		}
	},

	classID : kCID,
	contractID : kID,
	classDescription : kNAME,
	QueryInterface : XPCOMUtils.generateQI([Ci.nsIObserver]),
	_xpcom_categories : [
		{ category : STARTUP_TOPIC, service : true }
	]

};

if (XPCOMUtils.generateNSGetFactory)
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([DisableAboutConfigStartupService]);
else
	var NSGetModule = XPCOMUtils.generateNSGetModule([DisableAboutConfigStartupService]);
