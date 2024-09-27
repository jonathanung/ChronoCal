import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { 
    HomeIcon, CalendarIcon, CalendarRangeIcon, SettingsIcon, 
    ListIcon, DollarSignIcon, AppleIcon 
} from "../functions/icons";

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
    const pathname = usePathname();
    const isActive = (route: string) => pathname === route;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const [isDesktop, setIsDesktop] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, route: string) => {
        if (isActive(route)) {
            e.preventDefault();
        }
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setMobileMenuOpen(false);
            }
        }

        function handleResize() {
            setIsDesktop(window.innerWidth > 960);
        }

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const NavLinks = () => (
        <ul className="flex flex-col lg:flex-row gap-4 text-sm font-medium">
            {[
                { href: "/dashboard", icon: <HomeIcon />, text: "Home" },
                { href: "/calendar", icon: <CalendarIcon />, text: "Calendar" },
                { href: "#", icon: <CalendarRangeIcon />, text: "Events" },
                { href: "#", icon: <SettingsIcon />, text: "Settings" },
                { href: "#", icon: <ListIcon />, text: "Todo List" },
                { href: "/expenses", icon: <DollarSignIcon />, text: "Expenses" },
                { href: "#", icon: <AppleIcon />, text: "AI Helper" },
            ].map((link) => (
                <li key={link.href}>
                    <Link 
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all border border-transparent ${isActive(link.href) ? "text-primary border-primary" : "text-gray-500 dark:text-gray-400"} hover:border-gray-300 dark:hover:border-gray-600`} 
                        href={link.href}
                        onClick={(e) => handleClick(e, link.href)}
                    >
                        {link.icon}
                        {link.text}
                    </Link>
                </li>
            ))}
        </ul>
    );

    return (
        <div className="flex w-full flex-col">
            <header className="flex h-14 w-full items-center justify-between border-b px-4 lg:px-6">
                <Link className="flex items-center gap-2 text-lg font-semibold" href="#">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient font-bold">
                        ChronoCal
                    </span>
                </Link>
                {!isLoggedIn && (
                    <div className="flex items-center">
                        <Link className="text-sm font-medium text-gray-500 dark:text-gray-400" href="/login">
                            Log in
                        </Link>
                    </div>
                )}
                {isLoggedIn && (
                    <>
                        <nav className={isDesktop ? "flex flex-1 ml-10" : "hidden"}>
                            <NavLinks />
                        </nav>
                        {!isDesktop && (
                            <button 
                                className="ml-auto mr-2"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                Menu
                            </button>
                        )}
                    </>
                )}
                {isLoggedIn && (
                    <div className="flex items-center gap-4 lg:ml-4 relative" ref={dropdownRef}>
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
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-50">
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
                )}
            </header>
            {isLoggedIn && mobileMenuOpen && !isDesktop && (
                <div ref={mobileMenuRef}>
                    <nav className="px-4 py-2 bg-white border-b">
                        <NavLinks />
                    </nav>
                </div>
            )}
            <style jsx global>{`
                @keyframes gradient {
                    0% {background-position: 0% 50%;}
                    50% {background-position: 100% 50%;}
                    100% {background-position: 0% 50%;}
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 5s ease infinite;
                }
            `}</style>
        </div>
    );
}
