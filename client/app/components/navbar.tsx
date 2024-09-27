import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { 
    HomeIcon, CalendarIcon, CalendarRangeIcon, SettingsIcon, 
    ListIcon, DollarSignIcon, AppleIcon 
} from "../functions/icons";

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
    const pathname = usePathname();  // Get the current path

    // Function to determine if a link is active
    const isActive = (route: string) => pathname === route;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Function to prevent default click action if the link is active
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, route: string) => {
        if (isActive(route)) {
            e.preventDefault();  // Disable navigation if the link is active
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                                <Link 
                                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all border border-transparent ${isActive("/dashboard") ? "text-primary border-primary" : "text-gray-500 dark:text-gray-400"} hover:border-gray-300 dark:hover:border-gray-600`} 
                                    href="/dashboard"
                                    onClick={(e) => handleClick(e, "/dashboard")}
                                >
                                    <HomeIcon />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all border border-transparent ${isActive("/calendar") ? "text-primary border-primary" : "text-gray-500 dark:text-gray-400"} hover:border-gray-300 dark:hover:border-gray-600`} 
                                    href="/calendar"
                                    onClick={(e) => handleClick(e, "/calendar")}
                                >
                                    <CalendarIcon />
                                    Calendar
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all border border-transparent ${isActive("/events") ? "text-primary border-primary" : "text-gray-500 dark:text-gray-400"} hover:border-gray-300 dark:hover:border-gray-600`} 
                                    href="#"
                                    onClick={(e) => handleClick(e, "/events")}
                                >
                                    <CalendarRangeIcon />
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all border border-transparent ${isActive("/settings") ? "text-primary border-primary" : "text-gray-500 dark:text-gray-400"} hover:border-gray-300 dark:hover:border-gray-600`} 
                                    href="#"
                                    onClick={(e) => handleClick(e, "/settings")}
                                >
                                    <SettingsIcon />
                                    Settings
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all border border-transparent ${isActive("/todo") ? "text-primary border-primary" : "text-gray-500 dark:text-gray-400"} hover:border-gray-300 dark:hover:border-gray-600`} 
                                    href="#"
                                    onClick={(e) => handleClick(e, "/todo")}
                                >
                                    <ListIcon />
                                    Todo List
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all border border-transparent ${isActive("/expenses") ? "text-primary border-primary" : "text-gray-500 dark:text-gray-400"} hover:border-gray-300 dark:hover:border-gray-600`} 
                                    href="/expenses"
                                    onClick={(e) => handleClick(e, "/expenses")}
                                >
                                    <DollarSignIcon />
                                    Expenses
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all border border-transparent ${isActive("/ai-helper") ? "text-primary border-primary" : "text-gray-500 dark:text-gray-400"} hover:border-gray-300 dark:hover:border-gray-600`} 
                                    href="#"
                                    onClick={(e) => handleClick(e, "/ai-helper")}
                                >
                                    <AppleIcon />
                                    AI Helper
                                </Link>
                            </li>
                        </ul>
                    </nav>
                ) : (<nav className="flex-1 ml-10"></nav>)}
                {isLoggedIn ? (
                    <div className="flex items-center gap-4 md:ml-4 relative" ref={dropdownRef}>
                        <button 
                            className="rounded-full w-8 h-8"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
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
                        {dropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                                <Link 
                                    href="/settings"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Settings
                                </Link>
                                <Link 
                                    href="/logout"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Logout
                                </Link>
                            </div>
                        )}
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
    );
}
