import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface PerkCardProps {
    title: string;
    description: string;
    image: string;
    index: number;
}

const perks: Omit<PerkCardProps, 'index'>[] = [
    {
        title: "Multiple payment options",
        description: "Give your buyers the freedom to choose between prepaid and COD (Cash-On-Delivery) modes, processing both efficiently.",
        image: "/images/feature-one.png"
    },
    {
        title: "Real-time tracking updates",
        description: "Keep your buyers informed about their orders through live SMS, email and WhatsApp updates. Also, capture delivery preference for undelivered orders.",
        image: "/images/feature-two.png"
    },
    {
        title: "Customer delight",
        description: "Increase revenue by improving your post-ship experience using a custom-branded tracking page and an easy returns and refunds solution.",
        image: "/images/feature-three.png"
    }
];

const PerkCard = ({ title, description, image, index }: PerkCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="rounded-xl p-4 flex flex-col h-full"
    >
        <motion.div
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-lg lg:rounded-xl p-4"
        >
            <motion.img
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                src={image}
                alt={title}
                className="w-full h-64 object-contain"
            />
        </motion.div>
        <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            className="text-xl font-semibold mt-4"
        >
            {title}
        </motion.h3>
        <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
            className="text-muted-foreground text-sm mt-2 flex-grow"
        >
            {description}
        </motion.p>
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
        >
            <Link
                to="#"
                className="text-[#6D15E0] font-medium inline-flex items-center hover:gap-2 transition duration-300 mt-4"
            >
                Know More
                <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
        </motion.div>
    </motion.div>
);

const Perks = () => {
    return (
        <section className="py-20 lg:py-40 mt-20 lg:mt-0">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="text-center"
            >
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl lg:text-4xl font-semibold"
                >
                    ECommerce{' '}
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.05 }}
                        className="text-[#0E2BAC]"
                    >
                        shipping made for the new age
                    </motion.span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto"
                >
                    Always keep your shipping process in line with the experience your customers want.
                </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
                {perks.map((perk, index) => (
                    <PerkCard
                        key={index}
                        {...perk}
                        index={index}
                    />
                ))}
            </div>
        </section>
    );
};

export default Perks; 