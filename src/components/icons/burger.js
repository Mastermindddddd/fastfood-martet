export default function BurgerIcon() {
    return (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12"
      >
        <path
          d="M8 18C8 14.6863 10.6863 12 14 12H34C37.3137 12 40 14.6863 40 18V20H8V18Z"
          fill="currentColor"
          opacity="0.8"
        />
        <path d="M8 22H40V24C40 27.3137 37.3137 30 34 30H14C10.6863 30 8 27.3137 8 24V22Z" fill="currentColor" />
        <ellipse cx="24" cy="16" rx="16" ry="2" fill="currentColor" opacity="0.6" />
        <ellipse cx="24" cy="32" rx="16" ry="2" fill="currentColor" opacity="0.6" />
        <circle cx="18" cy="26" r="1" fill="currentColor" opacity="0.7" />
        <circle cx="30" cy="26" r="1" fill="currentColor" opacity="0.7" />
        <circle cx="24" cy="26" r="1" fill="currentColor" opacity="0.7" />
      </svg>
    )
  }
  