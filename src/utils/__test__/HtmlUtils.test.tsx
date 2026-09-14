import { InnerHtmlBuilder } from "../HtmlUtils";

describe("InnerHtmlBuilder", () => {
  it("should build title, text and range lines", () => {
    const html = new InnerHtmlBuilder()
      .addText("Data Record Count: 3")
      .addRange("Time Range", "01 Jan 2021", "31 Dec 2021")
      .addTitle("Data Records In This Area:")
      .getHtml();
    expect(html).toBe(
      "<b>Data Records In This Area:</b><br>Data Record Count: 3<br>Time Range: 01 Jan 2021 to 31 Dec 2021<br>"
    );
  });

  it("should open links in a new tab", () => {
    const html = new InnerHtmlBuilder()
      .addText(
        "Reef<a href='https://apps.aims.gov.au/metadata/view/1' target='blank'>Metadata Record</a>"
      )
      .getHtml();
    expect(html).toBe(
      'Reef<a href="https://apps.aims.gov.au/metadata/view/1" target="_blank" rel="noopener noreferrer">Metadata Record</a><br>'
    );
  });

  it("should drop scripts, event handlers and javascript links", () => {
    const html = new InnerHtmlBuilder()
      .addText(
        "<img src=x onerror=alert(1)>evil<script>alert(2)</script><a href='javascript:alert(3)'>x</a>"
      )
      .getHtml();
    expect(html).toBe(
      '<img src="x">evil<a target="_blank" rel="noopener noreferrer">x</a><br>'
    );
  });
});
