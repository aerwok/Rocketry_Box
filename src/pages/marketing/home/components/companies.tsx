import { Marquee } from '@/components/ui/marquee';
import { motion } from "framer-motion";

// Define company logos array
const companyLogos = [
    "/images/company1.png",
    "/images/company2.png",
    "/images/company3.png",
    "/images/company4.png",
    "/images/company5.png",
    "/images/company6.png",
    "/images/company7.png",
    "/images/company8.png",
    "/images/company9.png",
    "/images/company10.png",
    "/images/company11.png",
    "/images/company12.png",
    "/images/company13.png",
];

const Companies = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl lg:text-4xl font-semibold leading-tight text-center mb-12"
            >
                Anywhere, Anytime - With Your <br className="hidden lg:block" /> Choice of{' '}
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-900"
                >
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        Courier Partners
                    </span>
                </motion.span>
            </motion.h1>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full"
            >
                {/* First row - left to right */}
                <Marquee className="mb-4" pauseOnHover>
                    {companyLogos.slice(0, 6).map((logo, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="mx-2 lg:mx-8 bg-white rounded-lg shadow-sm p-6 flex items-center justify-center"
                            style={{ width: '180px', height: '80px' }}
                        >
                            <motion.img
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                src={logo}
                                alt={`Company ${index + 1}`}
                                className="max-h-10 w-auto object-contain"
                            />
                        </motion.div>
                    ))}
                </Marquee>

                {/* Second row - right to left */}
                <Marquee reverse pauseOnHover>
                    {companyLogos.slice(7).map((logo, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="mx-2 lg:mx-8 bg-white rounded-lg shadow-sm p-6 flex items-center justify-center"
                            style={{ width: '180px', height: '80px' }}
                        >
                            <motion.img
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                src={logo}
                                alt={`Company ${index + 5}`}
                                className="max-h-10 w-auto object-contain"
                            />
                        </motion.div>
                    ))}
                </Marquee>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="absolute left-0 inset-y-0 h-full w-20 bg-gradient-to-r from-[#EEF7FF]"
                />
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="absolute right-0 inset-y-0 h-full w-20 bg-gradient-to-l from-[#EEF7FF]"
                />
            </motion.div>
        </div>
    );
};

export default Companies;
