import { ArrowRightIcon } from "lucide-react";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

interface ServiceCardProps {
    title: string;
    description: string;
    imagePath: string;
    index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, imagePath, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-8 rounded-xl mb-6"
            style={{
                background: 'linear-gradient(to top, #E0DDFF, #F7FBFE)'
            }}
        >
            <div className="flex flex-col gap-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    className="space-y-4"
                >
                    <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                        className="text-2xl font-bold text-gray-900"
                    >
                        {title}
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                        className="text-gray-600 text-lg"
                    >
                        {description}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
                    >
                        <Link to="#" className="inline-flex items-center text-purple-600 hover:text-purple-700">
                            Learn More
                            <ArrowRightIcon className="w-4 h-4 ml-1" />
                        </Link>
                    </motion.div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    className="mt-6"
                >
                    <img
                        src={imagePath}
                        alt={title}
                        className="w-full rounded-lg"
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

const Services = () => {
    return (
        <div className="py-16">
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6 order-2 lg:order-1">
                    <ServiceCard
                        title="Effortless NDR management"
                        description="Process your undelivered orders easily using an automated non-delivery tab. Maintain a thorough flow so your return orders don't stay stuck."
                        imagePath="/images/feature-four.png"
                        index={0}
                    />
                    <ServiceCard
                        title="API integration"
                        description="Selling on different eCommerce platforms? Our API integration solution will help you manage your shipping operations on one platform."
                        imagePath="/images/feature-size.png"
                        index={1}
                    />
                </div>

                <div className="space-y-6 order-1 lg:order-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                        className="p-8 mb-8"
                    >
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.05 }}
                            className="text-4xl font-bold"
                        >
                            Shipping automation
                            <br />
                            to{' '}
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                style={{
                                    background: 'linear-gradient(to right, #D5E12B, #B214E2)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}
                            >
                                make your life easy
                            </motion.span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                            className="mt-4 text-gray-600 text-lg"
                        >
                            Improve the way your shipping process functions. Reduce the manual effort to save your time and money.
                        </motion.p>
                    </motion.div>
                    <ServiceCard
                        title="8+ channel integrations"
                        description="Automatically fetch orders and sync inventory from various sales channels and marketplaces like Shopify, Woocommerce, Amazon and the like."
                        imagePath="/images/feature-five.png"
                        index={2}
                    />
                </div>
            </div>
        </div>
    );
};

export default Services; 