import DOMPurify from "dompurify";

class InnerHtmlHelper {
  private html: string = "";
  constructor() {}

  public addText(text: string): void {
    const sanitizedText = DOMPurify.sanitize(text) + "<br>";
    this.html += sanitizedText;
  }

  /**
   * This will add a line into html like this: Time Range: 2021-01-01 to 2021-12-31
   * @param title
   * @param startValue
   * @param endValue
   */
  public addRange(title: string, startValue: string, endValue: string): void {
    const sanitizedTitle = DOMPurify.sanitize(title);
    const sanitizedStartValue = DOMPurify.sanitize(startValue);
    const sanitizedEndValue = DOMPurify.sanitize(endValue);
    this.html += `${sanitizedTitle}: ${sanitizedStartValue} to ${sanitizedEndValue}<br>`;
  }

  public getHtml(): string {
    return this.html;
  }
}
