import { Link, useLocation } from 'react-router-dom';
import { Menu, MenuIcon, Search, UserCircle} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSidebarStore } from '@/store/use-sidebar-store';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const AdminNavbar = () => {

    const { pathname } = useLocation();

    const isAuthPage = pathname.includes('/admin/auth/login') || pathname.includes('/admin/auth/register');
    const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

    const navLinks = [
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/dashboard/users", label: "Users" },
        { to: "/admin/dashboard/partners", label: "Partners" },
        { to: "/admin/dashboard/orders", label: "Orders" },
        { to: "/admin/dashboard/reports", label: "Reports" },
        { to: "/admin/dashboard/settings", label: "Settings" },
    ];

    const handleLinkClick = () => {
        toggleSidebar();
    };

    return (
        <header className="fixed top-0 left-0 right-0 border-b border-border z-50 bg-white h-16">
            <div className="px-4 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Left Section - Logo and Toggle */}
                    <div className="flex items-center gap-x-4">
                        {/* Logo */}
                        <Link to="/admin/dashboard" className="flex items-center">
                            <img
                                src="/icons/logo.svg"
                                alt="Rocketry Box"
                                className="h-10"
                            />
                        </Link>

                        {/* Sidebar Toggle Button - Only show on dashboard pages */}
                        {!isAuthPage && pathname.includes('/admin/dashboard') && (
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={toggleSidebar}
                                className="hidden lg:flex items-center justify-center"
                            >
                                <MenuIcon className="h-5 w-5" />
                            </Button>
                        )}
                    </div>

                    {/* Show navigation and search only for non-auth pages */}
                    {!isAuthPage && (
                        <>
                            {/* Right Section - Search and Profile */}
                            <div className="flex items-center gap-x-4">
                                {/* Search Bar */}
                                <div className="hidden lg:flex items-center relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="search"
                                        placeholder="Search..."
                                        className="pl-10 bg-[#B5D7F6] border-0 w-[250px]"
                                    />
                                </div>

                                {/* Mobile Menu Button */}
                                <div className="lg:hidden">
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Menu />
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="right" className="w-screen p-0">
                                            <div className="flex flex-col h-full pt-12">
                                                {/* Mobile Search */}
                                                <div className="p-4 border-b">
                                                    <div className="relative w-full">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                        <Input
                                                            type="search"
                                                            placeholder="Search..."
                                                            className="pl-10 bg-[#B5D7F6] border-0"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Mobile Navigation Links */}
                                                <div className="flex-1 overflow-auto py-4">
                                                    <nav className="flex flex-col space-y-1 px-2">
                                                        {navLinks.map((link) => (
                                                            <Link
                                                                key={link.label}
                                                                to={link.to}
                                                                className="px-4 py-2 rounded-lg hover:bg-sky-500/10 transition-colors"
                                                                onClick={handleLinkClick}
                                                            >
                                                                {link.label}
                                                            </Link>
                                                        ))}
                                                    </nav>
                                                </div>
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>

                                {/* User Profile */}
                                <Link to="/admin/profile">
                                    <Button variant="ghost" size="icon">
                                        <UserCircle className="h-6 w-6" />
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar; 