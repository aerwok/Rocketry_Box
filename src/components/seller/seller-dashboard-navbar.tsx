import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/store/use-sidebar-store';
import { Menu, MenuIcon, Search, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { useState, useEffect } from 'react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const SellerDashboardNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

    useEffect(() => {
        // Check if user is authenticated
        const isAuthenticated = localStorage.getItem('seller_token');
        
        // TEMPORARY BYPASS: Comment this out before deployment
        // This bypass allows access to seller sections without authentication
        /*
        if (!isAuthenticated) {
            navigate('/seller/login');
        }
        */
        
        // TEMPORARY: Set a dummy token for development
        if (!isAuthenticated) {
            localStorage.setItem('seller_token', 'DEVELOPMENT_BYPASS_TOKEN');
            console.warn('⚠️ DEVELOPMENT MODE: Using authentication bypass for seller. REMOVE BEFORE DEPLOYMENT!');
        }
    }, [navigate]);

    const orderSubLinks = [
        { to: "/seller/dashboard/new-order", label: "New Order" },
        { to: "/seller/dashboard/orders", label: "Orders" },
        { to: "/seller/dashboard/shipments", label: "Shipments" },
        { to: "/seller/dashboard/received", label: "Received" },
    ];

    const navLinks = [
        { to: "/seller/dashboard", label: "Home" },
        { to: "/seller/dashboard/orders", label: "Orders", subLinks: orderSubLinks },
        { to: "/seller/dashboard/ndr", label: "NDR" },
        { to: "/seller/dashboard/billing", label: "Billing", },
        { to: "/seller/dashboard/weight-dispute", label: "Weight Dispute" },
        { to: "/seller/dashboard/cod", label: "COD" },
        { to: "/seller/dashboard/tools", label: "Tools" },
    ];

    const isActiveLink = (to: string) => {
        if (to === "/seller/dashboard") {
            return location.pathname === "/seller/dashboard";
        }
        return location.pathname.startsWith(to);
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 border-b border-border z-50 bg-white h-16">
            <div className="px-4 h-full">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-x-4 flex-1">
                        {/* Logo */}
                        <Link to="/" className="flex items-center">
                            <img
                                src="/icons/logo.svg"
                                alt="Rocketry Box"
                                className="h-10"
                            />
                        </Link>

                        {/* Sidebar Toggle Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            className="hidden lg:flex items-center justify-center"
                        >
                            <MenuIcon className="h-5 w-5" />
                        </Button>

                        {/* Search Bar */}
                        <div className="hidden lg:flex items-center max-w-md w-full mx-4">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="pl-10 bg-[#B5D7F6] border-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center space-x-1">
                        <div className="flex items-center justify-center p-1 rounded-lg bg-main text-white gap-x-1">
                            <NavigationMenu>
                                <NavigationMenuList className="gap-x-1">
                                    {navLinks.map((link) => (
                                        <NavigationMenuItem key={link.label}>
                                            {link.subLinks ? (
                                                <>
                                                    <NavigationMenuTrigger className={cn(
                                                        "px-3 h-8 rounded-lg transition-all duration-200 bg-transparent hover:text-white hover:bg-white/10",
                                                        isActiveLink(link.to) && "bg-white/20 font-medium"
                                                    )}>
                                                        {link.label}
                                                    </NavigationMenuTrigger>
                                                    <NavigationMenuContent>
                                                        <div className="grid w-48 p-2 gap-1">
                                                            {link.subLinks.map((subLink) => (
                                                                <Link
                                                                    key={subLink.label}
                                                                    to={subLink.to}
                                                                    className={cn(
                                                                        "px-4 py-2 rounded-lg transition-all duration-200 text-gray-700 hover:bg-sky-500/10",
                                                                        isActiveLink(subLink.to) && "bg-sky-500/20 text-sky-700 font-medium"
                                                                    )}
                                                                >
                                                                    {subLink.label}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </NavigationMenuContent>
                                                </>
                                            ) : (
                                                <Link
                                                    to={link.to}
                                                    className={cn(
                                                        "px-4 py-1.5 rounded-lg transition-all duration-200",
                                                        isActiveLink(link.to)
                                                            ? "bg-white/20 font-medium"
                                                            : "hover:bg-white/10"
                                                    )}
                                                >
                                                    {link.label}
                                                </Link>
                                            )}
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
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
                                        <Accordion type="single" collapsible className="px-2 space-y-2">
                                            {navLinks.map((link) => (
                                                <AccordionItem key={link.label} value={link.label} className="border-none">
                                                    {link.subLinks ? (
                                                        <>
                                                            <AccordionTrigger
                                                                className={cn(
                                                                    "px-4 py-2 rounded-lg transition-all duration-200",
                                                                    isActiveLink(link.to)
                                                                        ? "bg-sky-500/20 text-sky-700 font-medium"
                                                                        : "hover:bg-sky-500/10 text-gray-700"
                                                                )}
                                                            >
                                                                {link.label}
                                                            </AccordionTrigger>
                                                            <AccordionContent>
                                                                <div className="flex flex-col space-y-1 pl-4">
                                                                    {link.subLinks.map((subLink) => (
                                                                        <Link
                                                                            key={subLink.label}
                                                                            to={subLink.to}
                                                                            onClick={handleLinkClick}
                                                                            className={cn(
                                                                                "px-4 py-2 rounded-lg transition-all duration-200",
                                                                                isActiveLink(subLink.to)
                                                                                    ? "bg-sky-500/20 text-sky-700 font-medium"
                                                                                    : "hover:bg-sky-500/10 text-gray-700"
                                                                            )}
                                                                        >
                                                                            {subLink.label}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </AccordionContent>
                                                        </>
                                                    ) : (
                                                        <Link
                                                            to={link.to}
                                                            onClick={handleLinkClick}
                                                            className={cn(
                                                                "flex h-10 items-center px-4 py-2 rounded-lg transition-all duration-200",
                                                                isActiveLink(link.to)
                                                                    ? "bg-sky-500/20 text-sky-700 font-medium"
                                                                    : "hover:bg-sky-500/10 text-gray-700"
                                                            )}
                                                        >
                                                            {link.label}
                                                        </Link>
                                                    )}
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default SellerDashboardNavbar; 