import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
    title: string;
    description: string;
    index: number;
}

const features: Omit<FeatureCardProps, 'index'>[] = [
    {
        title: "Affordable shipping",
        description: "Ship to over all over India at the lowest costs. Choose from multiple courier modes based on the delivery speed and price.",
    },
    {
        title: "Shipping rate calculator",
        description: "Calculate shipping rates instantly based on the origin pin code, destination pin code, approximate weight and dimensions of your shipment.",
    },
    {
        title: "25+ courier partners",
        description: "Ship with multiple courier partners from a single platform without depending on a single courier. Reach more than 24000 pin codes across the country.",
    },
    {
        title: "Discounted shipping rates",
        description: "Ship across India with rates starting at just Rs. 20/500 grams. Save big on your shipping costs and increase your profits.",
    },
    {
        title: "No platform or setup fee",
        description: "With Rocketry Box, you can get started for free without paying any platform or setup fees. Just recharge your account and pay only for shipping your orders.",
    },
    {
        title: "Simplified order management",
        description: "Manage all your forward and return orders from one platform. Create, process and track your orders in a few clicks.",
    },
    {
        title: "Label & buyer communication",
        description: "Choose the size of your label and decide the information like address, phone number, etc., you want to mention on the label.",
    },
    {
        title: "Multi-functional dashboard",
        description: "Experience a single-view dashboard where you can see analytics for your forward and return orders, shipments, NDR, RTO, and more.",
    }
];

const FeatureCard = ({ title, description, index }: FeatureCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white rounded-xl p-8 flex flex-col h-full"
    >
        <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="text-xl font-semibold mb-4"
        >
            {title}
        </motion.h3>
        <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="text-muted-foreground mb-6 flex-grow"
        >
            {description}
        </motion.p>
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.05 }}
        >
            <Link
                to="/signup"
                className="text-[#7C3AED] font-medium inline-flex items-center hover:gap-2 transition-all"
            >
                Know More
                <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
        </motion.div>
    </motion.div>
);

const Features = () => {
    return (
        <section className="pb-20 relative z-0">
            <div className="absolute left-1/2 -translate-x-1/2 w-[200%] h-full bg-[#E6F3FF] -z-10"></div>
            <div className="pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                >
                    <h2 className="text-3xl lg:text-4xl font-semibold">
                        An experience that your {' '} <br />customers {' '}
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-r from-[#A40EAC] to-[#C800FF] bg-clip-text text-transparent"
                        >
                            love
                        </motion.span>
                    </h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="text-lg text-muted-foreground mt-4 max-w-xl mx-auto"
                    >
                        Improve eCommerce shipping using a platform packed with powerful features to bring out ease in your shipping process.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10"
                >
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            {...feature}
                            index={index}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features; 