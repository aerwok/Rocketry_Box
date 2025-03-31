import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, UsersIcon, HeartHandshakeIcon, PackageIcon, ClipboardListIcon, SettingsIcon, AlertTriangleIcon, TruckIcon, ChevronDown, Store, User, Users2, MessageSquare, AlertCircle, WalletIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import Icons from "../shared/icons";


const SIDEBAR_LINKS = [
    {
        icon: UsersIcon,
        to: "/admin/dashboard/users",
        label: "Users",
    },
    {
        icon: Icons.team,
        to: "/admin/dashboard/teams",
        label: "Teams",
    },
    {
        icon: HeartHandshakeIcon,
        to: "/admin/dashboard/partners",
        label: "Partners",
    },
    {
        icon: PackageIcon,
        to: "/admin/dashboard/orders",
        label: "Orders",
    },
    {
        icon: TruckIcon,
        to: "/admin/dashboard/shipments",
        label: "Shipments",
    },
    {
        icon: MessageSquare,
        to: "/admin/dashboard/tickets",
        label: "Tickets",
    },
    {
        icon: AlertCircle,
        to: "/admin/dashboard/ndr",
        label: "NDR",
    },
    {
        icon: WalletIcon,
        to: "/admin/dashboard/billing",
        label: "Billing",
    },
    {
        icon: ClipboardListIcon,
        to: "/admin/dashboard/reports",
        label: "Reports",
    },
    {
        icon: AlertTriangleIcon,
        to: "/admin/dashboard/escalation",
        label: "Escalation",
    },
    {
        icon: SettingsIcon,
        to: "/admin/dashboard/settings",
        label: "Settings",
    },
];

const DASHBOARD_LINKS = [
    {
        icon: Store,
        to: "/admin/dashboard",
        label: "Seller Dashboard",
    },
    {
        icon: User,
        to: "/admin/dashboard/customer",
        label: "Customer Dashboard",
    }
];

const AdminDashboardSidebar = () => {

    const { pathname } = useLocation();

    const isExpanded = useSidebarStore((state) => state.isExpanded);

    const [openAccordion, setOpenAccordion] = useState<string | undefined>(
        pathname.includes("/admin/dashboard") && !pathname.includes("/admin/dashboard/") ? "dashboard" : undefined
    );

    const isDashboardActive = pathname === "/admin/dashboard" || pathname === "/admin/dashboard/customer";
    const isSellerDashboardActive = pathname === "/admin/dashboard";
    const isCustomerDashboardActive = pathname === "/admin/dashboard/customer";

    return (
        <aside className={cn(
            "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 z-40",
            isExpanded ? "w-64" : "w-16",
            "lg:sticky lg:top-16"
        )}>
            <div className={cn(
                "flex flex-col items-start px-2 pt-4 space-y-1",
                isExpanded && "min-w-[256px]"
            )}>
                <TooltipProvider delayDuration={0}>
                    {/* Dashboard Accordion */}
                    {!isExpanded ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    to="/admin/dashboard"
                                    className={cn(
                                        "group relative flex items-center justify-center size-10 rounded-lg hover:bg-main/10 mx-auto",
                                        isDashboardActive && "bg-main/10"
                                    )}
                                >
                                    <LayoutDashboard className={cn(
                                        "h-5 w-5 text-muted-foreground group-hover:text-main",
                                        isDashboardActive && "text-main"
                                    )} />
                                    <span className="sr-only">Dashboard</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Dashboard
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <div className="w-full">
                            <Accordion
                                type="single"
                                collapsible
                                value={openAccordion}
                                onValueChange={setOpenAccordion}
                                className="w-full"
                            >
                                <AccordionItem value="dashboard" className="border-none">
                                    <AccordionTrigger
                                        className={cn(
                                            "group relative flex items-center justify-start px-3 h-10 w-full rounded-lg hover:bg-main/10 no-underline",
                                            isDashboardActive && "bg-main/10"
                                        )}
                                    >
                                        <LayoutDashboard className={cn(
                                            "h-5 w-5 text-muted-foreground group-hover:text-main",
                                            isDashboardActive && "text-main"
                                        )} />
                                        <span className={cn(
                                            "ml-3 text-sm text-muted-foreground group-hover:text-main",
                                            isDashboardActive && "text-main"
                                        )}>
                                            Dashboard
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-1 pb-0">
                                        <div className="flex flex-col space-y-1 pl-8">
                                            {DASHBOARD_LINKS.map((link) => {
                                                const Icon = link.icon;
                                                const isActive =
                                                    (link.to === "/admin/dashboard" && isSellerDashboardActive) ||
                                                    (link.to === "/admin/dashboard/customer" && isCustomerDashboardActive);

                                                return (
                                                    <Link
                                                        key={link.label}
                                                        to={link.to}
                                                        className={cn(
                                                            "group relative flex items-center px-3 h-10 w-full rounded-lg hover:bg-main/10",
                                                            isActive && "bg-main/10"
                                                        )}
                                                    >
                                                        <Icon className={cn(
                                                            "h-4 w-4 text-muted-foreground group-hover:text-main",
                                                            isActive && "text-main"
                                                        )} />
                                                        <span className={cn(
                                                            "ml-3 text-sm text-muted-foreground group-hover:text-main",
                                                            isActive && "text-main"
                                                        )}>
                                                            {link.label}
                                                        </span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    )}

                    {/* Other Sidebar Links */}
                    {SIDEBAR_LINKS.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.to;

                        return (
                            <div key={link.label} className="w-full mx-auto">
                                {!isExpanded ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                to={link.to}
                                                className={cn(
                                                    "group relative flex items-center justify-center size-10 rounded-lg hover:bg-main/10 mx-auto",
                                                    isActive && "bg-main/10"
                                                )}
                                            >
                                                <Icon className={cn(
                                                    "h-5 w-5 text-muted-foreground group-hover:text-main",
                                                    isActive && "text-main"
                                                )} />
                                                <span className="sr-only">{link.label}</span>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            {link.label}
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <Link
                                        to={link.to}
                                        className={cn(
                                            "group relative flex items-center px-3 h-10 w-full rounded-lg hover:bg-main/10",
                                            isActive && "bg-main/10"
                                        )}
                                    >
                                        <Icon className={cn(
                                            "h-5 w-5 text-muted-foreground group-hover:text-main",
                                            isActive && "text-main"
                                        )} />
                                        <AnimatePresence>
                                            <motion.span
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                className={cn(
                                                    "ml-3 text-sm text-muted-foreground group-hover:text-main",
                                                    isActive && "text-main"
                                                )}
                                            >
                                                {link.label}
                                            </motion.span>
                                        </AnimatePresence>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </TooltipProvider>
            </div>
        </aside>
    );
};

export default AdminDashboardSidebar; 