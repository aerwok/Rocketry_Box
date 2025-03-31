import { Marquee } from '@/components/ui/marquee';
import { motion } from 'framer-motion';

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
        <section className="pt-20 pb-40">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-left space-y-4"
                >
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="text-3xl lg:text-4xl font-semibold"
                    >
                        Trusted by <span className="text-[#F63636]">500+</span> courier partners
                        <br />
                        worldwide for tracking
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="text-lg text-muted-foreground max-w-3xl"
                    >
                        Track shipments from multiple courier partners in one place with our
                        comprehensive tracking system.
                    </motion.p>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="relative w-full overflow-hidden pt-10"
            >
                {/* First row - left to right */}
                <Marquee className="mb-8" pauseOnHover>
                    {companyLogos.map((logo, index) => (
                        <motion.div
                            key={`first-${index}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                            className="mx-4 bg-white rounded-lg p-6 flex items-center justify-center"
                            style={{ width: '180px', height: '80px' }}
                        >
                            <motion.img
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2, delay: 0.1 + index * 0.02 }}
                                src={logo}
                                alt={`Courier Partner ${index + 1}`}
                                className="max-h-10 w-auto object-contain"
                            />
                        </motion.div>
                    ))}
                </Marquee>

                {/* Second row - right to left */}
                <Marquee reverse pauseOnHover>
                    {companyLogos.reverse().map((logo, index) => (
                        <motion.div
                            key={`second-${index}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                            className="mx-4 bg-white rounded-lg p-6 flex items-center justify-center"
                            style={{ width: '180px', height: '80px' }}
                        >
                            <motion.img
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2, delay: 0.1 + index * 0.02 }}
                                src={logo}
                                alt={`Courier Partner ${index + 1}`}
                                className="max-h-10 w-auto object-contain"
                            />
                        </motion.div>
                    ))}
                </Marquee>

                {/* Gradient overlays */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                    className="absolute left-0 inset-y-0 h-full w-20 bg-gradient-to-r from-[#EEF7FF]"
                />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                    className="absolute right-0 inset-y-0 h-full w-20 bg-gradient-to-l from-[#EEF7FF]"
                />
            </motion.div>
        </section>
    );
};

export default Companies; 