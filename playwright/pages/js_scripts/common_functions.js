window.__common_functions = {
  getTestProps: function (id) {
    return window.testProps[id];
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
};
