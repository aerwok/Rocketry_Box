import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { useState } from "react"

const TrackOrders = () => {

    const [awbNumber, setAwbNumber] = useState<string>("")
    const [error, setError] = useState<string>("")

    const validateAwbNumber = (value: string) => {
        const digitsOnly = value.replace(/\D/g, "")
        setAwbNumber(digitsOnly)

        if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
            setError("AWB number must be exactly 10 digits")
        } else {
            setError("")
        }
    };

    const handleSubmit = () => {
        if (awbNumber.length !== 10) {
            setError("AWB number must be exactly 10 digits")
            return
        }

        console.log("Tracking AWB:", awbNumber)
    };

    return (
        <div className="flex flex-col items-start justify-start relative py-20">
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="text-3xl lg:text-4xl font-semibold leading-tight"
            >
                Track Your <br className="hidden lg:block" /> {' '}
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-900"
                >
                    <span className="bg-gradient-to-b from-[#FCE712] to-[#C711D7] bg-clip-text text-transparent">
                        Orders Easily
                    </span>
                </motion.span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-lg text-gray-600 max-w-2xl mt-4"
            >
                Enter your Mobile Number or AWB ID to track Your Order
            </motion.p>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="lg:w-1/2"
            >
                <img
                    src="/images/track-order.png"
                    alt="Track order"
                    className="w-full h-auto"
                />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="hidden lg:block absolute -top-10 right-0 z-10"
            >
                <motion.img
                    transition={{ type: "spring", stiffness: 300 }}
                    src="/images/ship-order.png"
                    alt="Ship order"
                    className="w-full h-96"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="lg:absolute top-1/4 right-1/4 z-20 max-w-md w-full mt-8 lg:mt-0"
            >
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="flex flex-col items-start gap-4 lg:gap-6 p-4 lg:p-8 rounded-lg bg-white shadow-lg shadow-neutral-400/20 w-full"
                >
                    <motion.h5
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="text-xl font-medium"
                    >
                        Track Your Order
                    </motion.h5>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col gap-1 w-full"
                    >
                        <Label htmlFor="awb">
                            AWB Number
                        </Label>
                        <Input
                            id="awb"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={10}
                            value={awbNumber}
                            onChange={(e) => validateAwbNumber(e.target.value)}
                            placeholder="Enter your 10-digit AWB number"
                            className={`border-0 w-full bg-neutral-100 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        />
                        {error && (
                            <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Button
                            variant="primary"
                            className="w-full"
                            onClick={handleSubmit}
                            disabled={!!error || awbNumber.length !== 10}
                        >
                            Track Now
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default TrackOrders
