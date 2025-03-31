import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRightIcon } from "lucide-react";
import { primaryAddressSchema } from "@/lib/validations/primary-address";
import { PrimaryAddressInput } from "@/lib/validations/primary-address";

interface PrimaryAddressProps {
    onSave: () => void;
}

const PrimaryAddress = ({ onSave }: PrimaryAddressProps) => {

    const form = useForm<PrimaryAddressInput>({
        resolver: zodResolver(primaryAddressSchema),
        defaultValues: {
            contactPersonName: "",
            contactPersonEmail: "",
            contactNumber: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            pincode: "",
            isBillingAndPickup: false
        },
    });

    const onSubmit = (data: PrimaryAddressInput) => {
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
                            name="contactPersonName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Contact Person Name *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter contact person name"
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
                            name="contactPersonEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Contact Person Email <span className="text-sm text-gray-500">(Optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter contact person email"
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
                            name="addressLine1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Address Line One *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter address line 1"
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
                            name="addressLine2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Address Line Two *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter address line 2"
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
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        City *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter city"
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
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        State *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter state"
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
                            name="pincode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Pincode *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter pincode"
                                            className="bg-[#F8F7FF]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <FormField
                            control={form.control}
                            name="isBillingAndPickup"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        This address is the same as my billing & pickup address
                                    </FormLabel>
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

export default PrimaryAddress; 