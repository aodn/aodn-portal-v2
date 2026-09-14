import * as DOMPurify from "dompurify";

/**
 * Every link in the sanitized html opens in a new tab
 */
DOMPurify.default.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
});

class InnerHtmlBuilder {
  private html: string = "";
  constructor() {}

  public addTitle(title: string): InnerHtmlBuilder {
    const sanitizedTitle = DOMPurify.default.sanitize(title);
    this.html = `<b>${sanitizedTitle}</b>` + "<br>" + this.html;
    return this;
  }

  public addText(text: string): InnerHtmlBuilder {
    const sanitizedText = DOMPurify.default.sanitize(text) + "<br>";
    this.html += sanitizedText;
    return this;
  }

  /**
   * This will add a line into html like this: Time Range: 2021-01-01 to 2021-12-31
   * @param title
   * @param startValue
   * @param endValue
   */
  public addRange(
    title: string,
    startValue: string,
    endValue: string
  ): InnerHtmlBuilder {
    const sanitizedTitle = DOMPurify.default.sanitize(title);
    const sanitizedStartValue = DOMPurify.default.sanitize(startValue);
    const sanitizedEndValue = DOMPurify.default.sanitize(endValue);
    this.html += `${sanitizedTitle}: ${sanitizedStartValue} to ${sanitizedEndValue}<br>`;
    return this;
  }

  public getHtml(): string {
    return this.html;
  }
}

export { InnerHtmlBuilder };
