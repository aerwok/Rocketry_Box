import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { customerRegisterSchema } from "@/lib/validations/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { CustomerRegisterInput } from "@/lib/validations/customer";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<CustomerRegisterInput>({
        resolver: zodResolver(customerRegisterSchema),
        defaultValues: {
            name: "",
            mobile: "",
            mobileOtp: "",
            email: "",
            emailOtp: "",
            password: "",
            confirmPassword: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            pincode: "",
            acceptTerms: false,
        },
    });

    const onSubmit = (data: CustomerRegisterInput) => {
        console.log(data);
        // TODO: Handle form submission
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Enter your name"
                                    className="bg-[#99BCDDB5]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Mobile & Mobile OTP Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="mobile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Mobile Number
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter mobile number"
                                            className="bg-[#99BCDDB5]"
                                            maxLength={10}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter email address"
                                            type="email"
                                            className="bg-[#99BCDDB5]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="mobileOtp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Mobile OTP
                                    </FormLabel>
                                    <FormControl>
                                        <InputOTP
                                            maxLength={6}
                                            {...field}
                                        >
                                            <InputOTPGroup className="gap-2">
                                                <InputOTPSlot
                                                    index={0}
                                                    className="bg-[#99BCDDB5] rounded-md w-8 h-8"
                                                />
                                                <InputOTPSlot
                                                    index={1}
                                                    className="bg-[#99BCDDB5] rounded-md w-8 h-8"
                                                />
                                                <InputOTPSlot
                                                    index={2}
                                                    className="bg-[#99BCDDB5] rounded-md w-8 h-8"
                                                />
                                                <InputOTPSlot
                                                    index={3}
                                                    className="bg-[#99BCDDB5] rounded-md w-8 h-8"
                                                />
                                                <InputOTPSlot
                                                    index={4}
                                                    className="bg-[#99BCDDB5] rounded-md w-8 h-8"
                                                />
                                                <InputOTPSlot
                                                    index={5}
                                                    className="bg-[#99BCDDB5] rounded-md w-8 h-8"
                                                />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="emailOtp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Email OTP
                                    </FormLabel>
                                    <FormControl>
                                        <InputOTP
                                            maxLength={6}
                                            {...field}
                                        >
                                            <InputOTPGroup className="gap-2">
                                                <InputOTPSlot
                                                    index={0}
                                                    className="bg-[#99BCDDB5] rounded-md w-8 h-8"
                                                />
                                                <InputOTPSlot
                                                    index={1}
                                                    className="bg-[#99BCDDB5] rounded-md w-8 h-8"
                                                />
                                                <InputOTPSlot
                                                    index={2}
                                                    className="bg-[#99BCDDB5] rounded-md w-8 h-8"
                                                />
                                                <InputOTPSlot
                                                    index={3}
                                                    className="bg-[#99BCDDB5] rounded-md w-8 h-8"
                                                />
                                                <InputOTPSlot
                                                    index={4}
                                                    className="bg-[#99BCDDB5] rounded-md w-8 h-8"
                                                />
                                                <InputOTPSlot
                                                    index={5}
                                                    className="bg-[#99BCDDB5] rounded-md w-8 h-8"
                                                />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="bg-[#99BCDDB5] pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Confirm Password
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            className="bg-[#99BCDDB5] pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Address Fields in Two Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="address1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address 1</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter address line 1"
                                        className="bg-[#99BCDDB5]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address 2 (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter address line 2"
                                        className="bg-[#99BCDDB5]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* City, State, Pincode in One Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter city"
                                        className="bg-[#99BCDDB5]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter state"
                                        className="bg-[#99BCDDB5]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pincode</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter pincode"
                                        className="bg-[#99BCDDB5]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    I have read and accept the privacy policy & conditions of use
                                </FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    variant="customer"
                    className="w-full"
                    disabled={!form.watch("acceptTerms")}
                >
                    Register
                </Button>
            </form>
        </Form>
    );
};

export default RegisterForm; 