// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

class ResizeObserver {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe() {
    // Trigger the callback immediately to simulate observing behavior
    this.callback([], this);
  }

  unobserve() {}

  disconnect() {}
}

(global as any).ResizeObserver = ResizeObserver;
