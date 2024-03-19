import Link from "next/link"
import { HomeIcon, CalendarIcon, CalendarRangeIcon, SettingsIcon, ListIcon, DollarSignIcon, AppleIcon } from "../functions/icons"

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
    return (
        <div className="flex w-full h-full flex-col">
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
                            <li>
                            <Link className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400" href="#">
                              <ListIcon className="w-4 h-4" />
                              Todo List
                            </Link>
                          </li>
                          <li>
                            <Link className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400" href="#">
                              <DollarSignIcon className="w-4 h-4" />
                              Expenses
                            </Link>
                          </li>
                          <li>
                            <Link className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400" href="#">
                              <AppleIcon className="w-4 h-4" />
                              AI Helper
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