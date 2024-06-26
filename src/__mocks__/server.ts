import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

server.listen({
  onUnhandledRequest: (request) =>
    console.log("Unhandled %s %s", request.method, request.url),
});
