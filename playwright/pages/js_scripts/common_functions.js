window.__common_functions = {
  // See map_functions.js: testProps is registered from a useEffect, so it can
  // be missing while the page is still booting.
  getTestProps: function (id) {
    return (window.testProps || {})[id];
  },
  scrollToBottom: function () {
    window.scrollTo(0, document.body.scrollHeight);
  },
  getPageScrollY: function () {
    return window.scrollY;
  },
  getSelectedLocationIntersects: function (propId) {
    return this.getTestProps(propId).getSelectedLocationIntersects();
  },
  getTemporalDuring: function (propId) {
    return this.getTestProps(propId).getTemporalDuring();
  },
};
