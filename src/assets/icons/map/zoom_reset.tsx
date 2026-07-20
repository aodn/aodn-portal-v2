import { portalTheme } from "../../../styles";

export const ZoomResetIcon = ({ hover = false }: { hover?: boolean }) => (
  <svg
    width="39"
    height="39"
    viewBox="0 0 39 39"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <g filter="url(#filter0_d_3464_37348)">
      <circle
        cx="17.1953"
        cy="17.1953"
        r="15"
        fill={hover ? portalTheme.palette.secondary1 : "white"}
      />
    </g>
    {/* Glyph authored on a 40x40 canvas; scale and centre it inside the circle */}
    <g transform="translate(17.1953 17.1953) scale(0.55) translate(-20 -20)">
      <path
        d="M26.1596 29.8599L20.0196 35.9999L19.9996 32.3299C16.6996 32.3299 13.5996 31.0199 11.3096 28.7299C6.66963 24.0999 6.41963 16.4599 11.0096 11.6299C9.13963 15.0799 9.05963 18.9999 11.0996 22.3799C12.9296 25.4099 16.3096 27.4199 19.9996 27.3899L20.0296 23.7299L26.1696 29.8599H26.1596Z"
        fill={hover ? "white" : portalTheme.palette.grey700}
      />
      <path
        d="M20.0138 12.61L19.9837 16.28L13.8438 10.14L19.9837 4L20.0037 7.68C24.7937 7.66 29.1138 10.48 31.1238 14.69C33.2537 19.18 32.5237 24.65 29.0537 28.3C30.8837 24.82 30.9537 20.94 28.8937 17.57C27.0737 14.59 23.7238 12.59 20.0138 12.6V12.61Z"
        fill={hover ? "white" : portalTheme.palette.grey700}
      />
    </g>
    <defs>
      <filter
        id="filter0_d_3464_37348"
        x="-0.00178409"
        y="-0.00178409"
        width="38.7884"
        height="38.7884"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="2.1971" dy="2.1971" />
        <feGaussianBlur stdDeviation="2.1971" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3464_37348"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3464_37348"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
