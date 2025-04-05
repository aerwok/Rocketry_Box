import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MDEditor from "@uiw/react-md-editor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PolicyValues, policySchema } from "@/lib/validations/policy";
import { useNavigate } from "react-router-dom";

const PolicyEditPage = () => {
    
    const navigate = useNavigate();

    const form = useForm<PolicyValues>({
        resolver: zodResolver(policySchema),
        defaultValues: {
            title: "",
            slug: "",
            content: "",
        },
    });

    const onSubmit = (data: PolicyValues) => {
        toast.success("Policy updated successfully");
        console.log(data);
        navigate("/admin/dashboard/settings/policy");
    };

    return (
        <div className="space-y-6" data-color-mode="light">
            <div className="flex items-center justify-between">
                <h1 className="text-xl lg:text-2xl font-semibold">
                    Edit Policy
                </h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6">
                        <div className="space-y-4">
                            <div className="grid gap-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium">
                                                Title
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter title" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium">
                                                Slug
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter slug" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="rounded-lg border">
                            <div className="p-6 space-y-4">
                                <h3 className="font-medium">Content</h3>
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <MDEditor
                                                    value={field.value}
                                                    onChange={(value) => field.onChange(value || "")}
                                                    preview="edit"
                                                    height={500}
                                                    className="!border-0"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/admin/dashboard/settings/policy")}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default PolicyEditPage; 