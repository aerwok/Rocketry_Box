import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FileDown, X } from "lucide-react";
import { useState } from "react";

interface BulkDisputeUploadModalProps {
    open: boolean;
    onClose: () => void;
}

const BulkDisputeUploadModal = ({ open, onClose }: BulkDisputeUploadModalProps) => {
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
            setSelectedFile(file);
        } else {
            alert("File size should be less than 10MB");
        }
    };

    const handleSave = async () => {
        if (!selectedFile) return;

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            // TODO: Replace with actual API endpoint
            // const response = await fetch("/api/disputes/bulk-upload", {
            //     method: "POST",
            //     body: formData,
            // });

            // if (response.ok) {
            //     onClose();
            // }

            // For now, just close the modal
            onClose();
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Upload Dispute Report
                    </DialogTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <div className="flex items-baseline justify-between">
                            <label className="text-base font-medium">
                                Select File<span className="text-red-500">*</span>
                            </label>
                            <span className="text-sm text-gray-500">
                                Upto 10MB
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                className="w-32"
                                onClick={() => document.getElementById("dispute-file-upload")?.click()}
                            >
                                Choose file
                            </Button>
                            <span className="text-sm text-gray-500">
                                {selectedFile ? selectedFile.name : "No file chosen"}
                            </span>
                            <input
                                type="file"
                                id="dispute-file-upload"
                                className="hidden"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <FileDown className="h-4 w-4" />
                            Sample file
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-600 border-0"
                        >
                            Close
                        </Button>
                        <Button
                            variant="purple"
                            onClick={handleSave}
                            disabled={!selectedFile}
                        >
                            Upload Dispute
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BulkDisputeUploadModal;