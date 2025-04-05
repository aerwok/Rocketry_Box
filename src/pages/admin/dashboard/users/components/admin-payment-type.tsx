import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { PaymentTypeInput, paymentTypeSchema } from "@/lib/validations/admin-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

interface AdminPaymentTypeProps {
    onSave: (message?: string) => void;
}

const AdminPaymentType = ({ onSave }: AdminPaymentTypeProps) => {
    const navigate = useNavigate();
    const form = useForm<PaymentTypeInput>({
        resolver: zodResolver(paymentTypeSchema),
        defaultValues: {
            paymentMode: "",
            rateBand: ""
        },
    });

    const onSubmit = (data: PaymentTypeInput) => {
        console.log(data);
        onSave("Payment type saved successfully");
    };

    const handleCreateRateBand = () => {
        navigate("/admin/dashboard/settings/rate-band/create");
    };

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="paymentMode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Payment Mode *
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-[#F8F7FF]">
                                                <SelectValue placeholder="Select payment type" />
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

                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="rateBand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Rate Band *
                                        </FormLabel>
                                        <div className="flex items-center gap-2">
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-[#F8F7FF]">
                                                        <SelectValue placeholder="Select rate band" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="RBX1">RBX1</SelectItem>
                                                    <SelectItem value="RBX2">RBX2</SelectItem>
                                                    <SelectItem value="RBX3">RBX3</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleCreateRateBand}
                                                className="flex items-center gap-1"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Create New
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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

export default AdminPaymentType; 