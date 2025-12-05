import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const baseProps: Partial<IconProps> = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconFrontPage: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}>
    {/* Simple little cabin / house */}
    <path d="M4 11.5 12 4l8 7.5" />
    <path d="M6.5 11.5V19a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-7.5" />
    <path d="M10.5 20v-5.5h3v5.5" />
  </svg>
);

export const IconTimeline: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}>
    {/* Clock + small timeline ticks */}
    <circle cx="12" cy="10" r="5" />
    <path d="M12 10V7.5" />
    <path d="M12 10l2 1.5" />
    <path d="M4 18h4" />
    <path d="M16 18h4" />
  </svg>
);

export const IconFood: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}>
    {/* Fork */}
    <path d="M6 4v6" />
    <path d="M4.5 4v3" />
    <path d="M7.5 4v3" />
    <path d="M6 10v7" />
    {/* Plate + knife */}
    <circle cx="14.5" cy="11" r="3.5" />
    <path d="M19 4v13" />
  </svg>
);

export const IconBooze: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}>
    {/* Bottle neck */}
    <path d="M11 3.5h2v2.5h-2z" />
    {/* Bottle body */}
    <path d="M10 6h4l.8 2.5v8a2 2 0 0 1-2 2h-1.6a2 2 0 0 1-2-2v-8z" />
    {/* Fill line */}
    <path d="M10.2 11h3.6" />
  </svg>
);

export const IconRules: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}>
    {/* Scroll / page */}
    <path d="M7 5h8a2 2 0 0 1 2 2v11H9a2 2 0 0 1-2-2z" />
    <path d="M7 5a2 2 0 0 0-2 2v10" />
    <path d="M10 9h5" />
    <path d="M10 12h4" />
  </svg>
);

export const IconAdmin: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}>
    {/* Gear */}
    <circle cx="12" cy="12" r="2.6" />
    <path d="M12 6.3V4.5" />
    <path d="M12 19.5v-1.8" />
    <path d="M7.1 7.1 5.8 5.8" />
    <path d="M18.2 18.2 16.9 16.9" />
    <path d="M6.3 12H4.5" />
    <path d="M19.5 12h-1.8" />
    <path d="M7.1 16.9 5.8 18.2" />
    <path d="M18.2 5.8 16.9 7.1" />
  </svg>
);
