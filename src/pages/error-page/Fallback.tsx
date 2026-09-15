/*
 * Suspense fallback shown while a lazily-loaded route chunk is in flight.
 *
 * Deliberately renders an empty, viewport-tall box rather than a spinner or a
 * "Loading..." string: anything painted here is replaced the moment the chunk
 * arrives, and a visible placeholder that then disappears is a layout shift.
 * CLS is 25% of the mobile Lighthouse score, so the fallback reserves space
 * and paints nothing.
 */
const Fallback = () => (
  <div
    style={{ minHeight: "100vh", width: "100%" }}
    aria-busy="true"
    aria-live="polite"
  />
);

export default Fallback;
