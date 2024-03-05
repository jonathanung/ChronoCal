import Link from "next/link"

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
    return (
        <div className="flex w-full h-full min-h-screen flex-col">
            <header className="flex h-14 w-full items-center border-b px-4 md:px-6">
                <Link className="flex items-center gap-2 text-lg font-semibold" href="#">
                    Chronocal
                </Link>
                {isLoggedIn ? (
                    <nav className="flex-1 ml-10">
                        <ul className="flex gap-4 text-sm font-medium">
                            <li>
                                <Link className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400" href="#">
                                    <HomeIcon/>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400" href="#">
                                    <CalendarIcon/>
                                    Calendar
                                </Link>
                            </li>
                            <li>
                                <Link className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400" href="#">
                                    <CalendarRangeIcon />
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400" href="#">
                                    <SettingsIcon />
                                    Settings
                                </Link>
                            </li>
                        </ul>
                    </nav>
                ) : (<nav className="flex-1 ml-10"></nav>)}
                {isLoggedIn ? (
                    <div className="flex items-center gap-4 md:ml-4">
                        <button className="rounded-full w-8 h-8">
                            <img
                                alt="Avatar"
                                className="rounded-full"
                                height="32"
                                src="../default_profile.jpg"
                                style={{
                                    aspectRatio: "32/32",
                                    objectFit: "cover",
                                }}
                                width="32"
                            />
                            <span className="sr-only">Toggle user menu</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 md:ml-4">
                        <Link className="text-sm font-medium text-gray-500 dark:text-gray-400" href="/login">
                            Log in
                        </Link>
                    </div>
                )}
            </header>
        </div>
    )
}

function CalendarIcon() {
  return (
    <svg
      className="w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}


function CalendarRangeIcon() {
  return (
      <svg
      className="w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M17 14h-6" />
      <path d="M13 18H7" />
      <path d="M7 14h.01" />
      <path d="M17 18h.01" />
    </svg>
  )
}


function HomeIcon() {
  return (
      <svg
      className="w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}




function SettingsIcon() {
  return (
      <svg
      className="w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
