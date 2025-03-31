import { Marquee } from '@/components/ui/marquee';

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
        <section className="py-20 bg-gradient-to-t from-[#E3DFFF]">
            <div className="container mx-auto px-4">
                <div className="text-left space-y-4">
                    <h2 className="text-3xl lg:text-4xl font-semibold">
                        Chosen by over <span className="text-[#F63636]">10,000+</span> eCommerce businesses
                        <br />
                        and other companies
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        Join the community that experiences faster shipping, reduced costs, increased
                        customer satisfaction.
                    </p>
                </div>
            </div>

            <div className="relative w-full overflow-hidden pt-10">
                {/* First row - left to right */}
                <Marquee className="mb-8" pauseOnHover>
                    {companyLogos.map((logo, index) => (
                        <div
                            key={`first-${index}`}
                            className="mx-4 bg-white rounded-lg p-6 flex items-center justify-center"
                            style={{ width: '180px', height: '80px' }}
                        >
                            <img
                                src={logo}
                                alt={`Courier Partner ${index + 1}`}
                                className="max-h-10 w-auto object-contain"
                            />
                        </div>
                    ))}
                </Marquee>

                {/* Second row - right to left */}
                <Marquee reverse pauseOnHover>
                    {companyLogos.reverse().map((logo, index) => (
                        <div
                            key={`second-${index}`}
                            className="mx-4 bg-white rounded-lg p-6 flex items-center justify-center"
                            style={{ width: '180px', height: '80px' }}
                        >
                            <img
                                src={logo}
                                alt={`Courier Partner ${index + 1}`}
                                className="max-h-10 w-auto object-contain"
                            />
                        </div>
                    ))}
                </Marquee>

                {/* Gradient overlays */}
                <div className="absolute left-0 inset-y-0 h-full w-20 bg-gradient-to-r from-[#EDF2FF]"></div>
                <div className="absolute right-0 inset-y-0 h-full w-20 bg-gradient-to-l from-[#EDF2FF]"></div>
            </div>
        </section>
    );
};

export default Companies; 