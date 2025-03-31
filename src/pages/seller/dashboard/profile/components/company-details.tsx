import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CompanyDetailsInput, companyDetailsSchema } from "@/lib/validations/company-details";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CompanyDetailsProps {
    onSave: () => void;
}

const CompanyDetails = ({ onSave }: CompanyDetailsProps) => {

    const form = useForm<CompanyDetailsInput>({
        resolver: zodResolver(companyDetailsSchema),
        defaultValues: {
            companyName: "",
            sellerName: "",
            email: "",
            contactNumber: "",
            brandName: "",
            website: "",
            supportContact: "",
            supportEmail: "",
            operationsEmail: "",
            financeEmail: "",
            rechargeType: "wallet"
        },
    });

    const onSubmit = (data: CompanyDetailsInput) => {
        console.log(data);
        onSave();
    };

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Company Name *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter company name"
                                            className="bg-[#F8F7FF]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="rechargeType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Recharge Type *
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger disabled className="bg-[#F8F7FF]">
                                                <SelectValue placeholder="Select recharge type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="wallet">Wallet</SelectItem>
                                            <SelectItem value="credit_limit">Credit Limit</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sellerName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Seller Name *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter seller name"
                                            className="bg-[#F8F7FF]"
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
                                        Email Address (Primary) *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter email address"
                                            className="bg-[#F8F7FF]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Contact Number *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="Enter contact number"
                                            className="bg-[#F8F7FF]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="brandName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Brand Name <span className="text-sm text-gray-500">(Optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your brand name"
                                            className="bg-[#F8F7FF]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Website <span className="text-sm text-gray-500">(Optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="url"
                                            placeholder="Enter your website URL"
                                            className="bg-[#F8F7FF]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="supportContact"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Support Contact <span className="text-sm text-gray-500">(Optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="Enter your support contact number"
                                            className="bg-[#F8F7FF]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="supportEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Support Email <span className="text-sm text-gray-500">(Optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter your support email"
                                            className="bg-[#F8F7FF]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="operationsEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Operations Email <span className="text-sm text-gray-500">(Optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter your operations email"
                                            className="bg-[#F8F7FF]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="financeEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Finance Email <span className="text-sm text-gray-500">(Optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter your finance email"
                                            className="bg-[#F8F7FF]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" variant="purple">
                            Save & Next
                            <ArrowRightIcon className="size-4 ml-1" />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CompanyDetails; 