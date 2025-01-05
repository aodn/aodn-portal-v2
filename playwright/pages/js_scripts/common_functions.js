function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}

function getPageScrollY() {
  return window.scrollY;
}

window.__custom = {
  scrollToBottom: scrollToBottom,
  getPageScrollY: getPageScrollY,
};
