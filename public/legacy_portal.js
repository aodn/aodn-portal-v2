// Migrate of old portal function that is use by some of the geoserver popup box so do not DELETE, not ideal code.
// This js will be auto import by the code as needed.

window.showChannel = (css_id, facilityName) => {
  document
    .querySelectorAll(`div.feature[id^="${facilityName}"]`)
    .forEach((el) => (el.style.display = "none"));

  const elm = document.getElementById(facilityName + css_id);
  if (elm) {
    elm.style.display = "block";

    elm.querySelectorAll("a").forEach((a) => {
      a.href = a.href.replace(/^http:\/\//, "https://");
    });

    elm.querySelectorAll("img").forEach((img) => {
      const src = img.src;
      img.src = src.replace(/^http:\/\//, "https://");
      img.style.display = "block";
      img.style.minHeight = "100%";
      img.style.minWidth = "100%";
    });
  }
};
