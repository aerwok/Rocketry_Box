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
import { BankDetailsInput, bankDetailsSchema } from "@/lib/validations/admin-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

interface AdminBankDetailsProps {
    onSave: (message?: string) => void;
}

const AdminBankDetails = ({ onSave }: AdminBankDetailsProps) => {
    const { id } = useParams();
    
    // Prefill with dummy data based on user ID
    const isSeller = id?.includes("SELLER");
    
    const form = useForm<BankDetailsInput>({
        resolver: zodResolver(bankDetailsSchema),
        defaultValues: {
            bankName: isSeller ? "HDFC Bank" : "State Bank of India",
            accountName: isSeller ? "Smith Enterprises Ltd." : "Emma Thompson",
            accountNumber: isSeller ? "10045678901234" : "30045678901234",
            branchName: isSeller ? "Andheri Branch" : "Powai Branch",
            ifscCode: isSeller ? "HDFC0001234" : "SBIN0001234",
            cancelledChequeImage: undefined
        },
    });

    const onSubmit = (data: BankDetailsInput) => {
        console.log(data);
        onSave("Bank details saved successfully");
    };

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Bank Name *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter bank name"
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
                            name="accountName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Account Name *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter account name"
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
                            name="accountNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Account Number *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter account number"
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
                            name="branchName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Branch Name *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter branch name"
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
                            name="ifscCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        IFSC Code *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter IFSC code"
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
                            name="cancelledChequeImage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Cancelled Cheque Image
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="dropzone-file"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-[#F8F7FF] hover:bg-gray-100"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        JPG, PNG or PDF (MAX. 2MB)
                                                    </p>
                                                </div>
                                                <input id="dropzone-file" type="file" className="hidden" onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        field.onChange(e.target.files[0]);
                                                    }
                                                }} />
                                            </label>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" variant="purple">
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AdminBankDetails; 