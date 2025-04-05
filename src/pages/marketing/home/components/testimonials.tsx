import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface TestimonialProps {
    content: string;
    author: string;
    role: string;
    rating: number;
    image?: string;
    index: number;
}

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
        ))}
    </div>
);

const testimonials = [
    {
        content: "We took the 4 courses menu. It was incredibly good! Mix of fish and (slow cooked) meat. The dessert was amazing. A small family is running the restaurant and I found the atmosphere super cozy.",
        author: "Janette Berry",
        role: "Food Critic",
        rating: 5,
        image: "/images/user1.jpeg"
    },
    {
        content: "Great place! Delicious food with Asian influence made and served by dedicated people passionate about their work. Keep up the good work!",
        author: "Karry Omer",
        role: "Restaurant Owner",
        rating: 4.5,
        image: "/images/user2.jpeg"
    },
    {
        content: "If you're looking for the best shipping solution, look no further. Perfectly priced, amazing service, and the support team is incredible!",
        author: "James Knight",
        role: "E-commerce Seller",
        rating: 5,
        image: "/images/user3.jpeg"
    },
    {
        content: "This platform has a very friendly interface and serves great solutions with fresh innovations! In times of the Covid-19 they offer tables in line with the national and local measurements.",
        author: "Pam Cornwell",
        role: "Business Owner",
        rating: 5,
        image: "/images/user4.jpeg"
    },
    {
        content: "Exceptional service and super easy to use! Tracking all my deliveries from one place has been a game-changer.",
        author: "Priya M.",
        role: "Handmade Crafts Seller",
        rating: 4.5,
        image: "/images/user5.jpeg"
    },
    {
        content: "The best platform for shipping management. I saved so much time and money with their transparent rate comparisons!",
        author: "Rahul K.",
        role: "E-commerce Seller",
        rating: 4,
        image: "/images/user6.jpeg"
    },
    {
        content: "Thanks to Rocketry Box, I now focus on growing my business while they handle all my shipping needs efficiently.",
        author: "Nikhil R.",
        role: "Apparel Store Owner",
        rating: 3.5,
        image: "/images/user7.jpeg"
    },
    {
        content: "Affordable, efficient, and reliable. My go-to platform for all shipping needs.",
        author: "Sunita J.",
        role: "Wholesale Distributor",
        rating: 4.5,
        image: "/images/user8.jpeg"
    },
    {
        content: "Their platform is so intuitive! Premium shipping services at my fingertips.",
        author: "Meera P.",
        role: "Jewelry Designer",
        rating: 4,
        image: "/images/user9.jpeg"
    }
];

const TestimonialCard = ({ content, author, role, rating, image, index }: TestimonialProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="bg-white rounded-xl p-4 break-inside-avoid mb-6"
    >
        <div className="flex items-start gap-3">
            {image && (
                <motion.img
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                    src={image}
                    alt={author}
                    className="size-12 rounded-full object-cover object-top"
                />
            )}
            <div className="flex-1">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    className="text-sm md:text-base text-gray-800 mb-2"
                >
                    {content}
                </motion.p>
                <div className="flex items-center gap-2">
                    <StarRating rating={rating} />
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="mt-2"
                >
                    <p className="text-sm md:text-base font-semibold">
                        - {author}
                    </p>
                    <p className="text-xs text-gray-600">
                        {role}
                    </p>
                </motion.div>
            </div>
        </div>
    </motion.div>
);

const Testimonials = () => {
    return (
        <section id="customers" className="py-16 relative z-0">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-full -z-10 bg-gradient-to-b from-[#EEF7FF] via-[#EEF7FF]/60 to-[#D6C0FF]"
            />
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl lg:text-4xl font-semibold">
                        Words From{' '}
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-main"
                        >
                            Our Valued Customers
                        </motion.span>
                    </h2>
                </motion.div>

                <div className="max-w-6xl mx-auto">
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard
                                key={index}
                                {...testimonial}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
