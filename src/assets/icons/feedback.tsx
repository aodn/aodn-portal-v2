import { SVGProps } from "react";

/** Feedback icon supplied with the portal design. */
const FeedbackIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="34"
    height="32"
    viewBox="0 0 34 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.5 7.5h17a2.5 2.5 0 0 1 2.5 2.5v10a2.5 2.5 0 0 1-2.5 2.5H11l-5.5 4v-4H4.5A2.5 2.5 0 0 1 2 20V10a2.5 2.5 0 0 1 2.5-2.5Z"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinejoin="round"
    />
    <path
      d="m16 17.5 9.2-9.2 3 3-9.2 9.2-4.2 1.2 1.2-4.2Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
    <path d="m23.8 8.8 3 3" stroke="white" strokeWidth="1.2" />
    <path
      d="M7.5 13h5M7.5 17h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default FeedbackIcon;
