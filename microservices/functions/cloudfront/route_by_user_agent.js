// cloudfront function name must be "handler"
function handler(event) {
  let request = event.request;
  // TODO:
  console.log("Hello Data Discovery!");

  return request;
}
