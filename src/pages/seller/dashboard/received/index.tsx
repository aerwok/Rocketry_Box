import FileUpload from "@/components/seller/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { toast } from "sonner";

const SellerReceivedPage = () => {

    const handleFileSelect = async (file: File) => {
        try {
            toast.success("File uploaded successfully!");
        } catch (error) {
            toast.error("Error uploading file. Please try again.");
        }
    };

    const handleDownloadSample = () => {
        toast.info("Downloading sample file...");
    };

    return (
        <div className="space-y-8">
            <h1 className="text-xl lg:text-2xl font-semibold">
                Received
            </h1>

            <Card className="shadow-none border-none">
                <CardHeader>
                    <CardTitle>
                        Upload File
                    </CardTitle>
                    <CardDescription>
                        Upload your file in Excel format (.xls, .xlsx, .csv)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={handleDownloadSample}
                        >
                            <Download className="h-4 w-4" />
                            Download Sample Excel
                        </Button>
                    </div>

                    <FileUpload
                        onFileSelect={handleFileSelect}
                        accept=".xls,.xlsx,.csv"
                        maxSize={5}
                    />

                    <div className="mt-4 text-sm text-gray-500">
                        <p className="font-medium">
                            Instructions:
                        </p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>
                                File should be in Excel format (.xls, .xlsx) or CSV format
                            </li>
                            <li>
                                Maximum file size allowed is 5MB
                            </li>
                            <li>
                                Make sure to follow the sample format for successful upload
                            </li>
                            <li>
                                All required fields must be filled
                            </li>
                            <li>
                                Date format should be DD/MM/YYYY
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SellerReceivedPage; 