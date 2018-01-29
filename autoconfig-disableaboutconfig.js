{// Disable about:config, for Firefox 52/Thunderbird 52 and later
  let { classes: Cc, interfaces: Ci, utils: Cu } = Components;
  let { Services } = Cu.import('resource://gre/modules/Services.jsm', {});
  Services.obs.addObserver({
    observe(aSubject, aTopic, aData) {
      if (aSubject.location.href.indexOf('about:config') == 0)
        aSubject.location.replace('about:blank');
    }
  }, 'chrome-document-global-created', false);

  const SSS = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
  Services.obs.addObserver({
    observe(aSubject, aTopic, aData) {
      let style = `
        @-moz-document url-prefix("chrome://messenger/content/preferences/preferences.xul") {
          #configEditor {
            visibility: collapse !important;
            -moz-user-focus: ignore !important;
          }
        }
      `;
      let sheet = Services.io.newURI(`data:text/css,${encodeURIComponent(style)}`);
      if (!SSS.sheetRegistered(sheet, SSS.USER_SHEET))
        SSS.loadAndRegisterSheet(sheet, SSS.USER_SHEET);
    }
  }, 'final-ui-startup', false);
}
