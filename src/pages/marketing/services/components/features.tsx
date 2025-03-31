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
        title: "Seamless channel integration",
        description: "Integrate all your shopping carts and marketplaces to sync all your inventory and orders",
    },
    {
        title: "Courier recommendation engine",
        description: "Boost your delivery performance by shipping with a courier recommended by AI.",
    },
    {
        title: "Bulk order creation",
        description: "Handle order surges easily by adding multiple orders instantly",
    },
    {
        title: "Auto-documentation",
        description: "Our system auto-generates invoices and manifests, speeding up the shipping process",
    },
    {
        title: "Shipping rate calculator",
        description: "Estimate shipping rates based on origin pin code destination pin code, weight and dimensions",
    },
    {
        title: "Smart NDR redressal",
        description: "Automate delivery validation and reattempt more successfully with our AI assistant",
    }
];

const FeatureCard = ({ title, description, index }: FeatureCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
            duration: 0.3,
            delay: index * 0.05
        }}
        className="bg-white rounded-xl p-8 flex flex-col h-full"
    >
        <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.3,
                delay: 0.1 + index * 0.05
            }}
            className="text-xl font-semibold mb-4"
        >
            {title}
        </motion.h3>
        <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.3,
                delay: 0.2 + index * 0.05
            }}
            className="text-muted-foreground mb-6 flex-grow"
        >
            {description}
        </motion.p>
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.3,
                delay: 0.3 + index * 0.05
            }}
        >
            <Link
                to="#"
                className="text-purple-600 font-medium inline-flex items-center hover:gap-2 transition-all group"
            >
                Know More
                <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <ArrowRight className="w-4 h-4 ml-1" />
                </motion.div>
            </Link>
        </motion.div>
    </motion.div>
);

const Features = () => {
    return (
        <section className="pb-20 relative z-0">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="absolute left-1/2 -translate-x-1/2 w-[200%] h-full bg-[#E6F3FF] -z-10"
            />
            <div className="pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                >
                    <h2 className="text-3xl lg:text-4xl font-semibold">
                        Streamline logistics with{' '}
                        <br />
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="text-red-500"
                        >
                            robust
                        </motion.span>
                        {' '}and{' '}
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className="text-red-500"
                        >
                            efficient solutions
                        </motion.span>
                    </h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                        className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto"
                    >
                        Improve eCommerce shipping using a platform packed with powerful services
                        to bring out ease in your shipping process.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-16">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            {...feature}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features; 