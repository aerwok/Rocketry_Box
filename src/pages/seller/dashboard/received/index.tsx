import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileSpreadsheet, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface UploadedFile {
    name: string;
    size: number;
    status: 'uploading' | 'success' | 'error';
    progress: number;
}

const SellerReceivedPage = () => {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [dragActive, setDragActive] = useState(false);

    const handleFileSelect = async (files: FileList | null) => {
        if (!files) return;

        const newFiles: UploadedFile[] = Array.from(files).map(file => ({
            name: file.name,
            size: file.size,
            status: 'uploading',
            progress: 0
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);

        // Simulate file upload progress
        for (let i = 0; i < newFiles.length; i++) {
            const fileIndex = uploadedFiles.length + i;
            for (let progress = 0; progress <= 100; progress += 10) {
                await new Promise(resolve => setTimeout(resolve, 200));
                setUploadedFiles(prev => {
                    const updated = [...prev];
                    updated[fileIndex] = {
                        ...updated[fileIndex],
                        progress,
                        status: progress === 100 ? 'success' : 'uploading'
                    };
                    return updated;
                });
            }
        }

        toast.success("Files uploaded successfully!");
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleDownloadSample = () => {
        toast.info("Downloading sample file...");
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-xl lg:text-2xl font-semibold">
                    Received
                </h1>
                <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleDownloadSample}
                >
                    <Download className="h-4 w-4" />
                    Download Sample Excel
                </Button>
            </div>

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
                    <div
                        className={`relative border-2 border-dashed rounded-lg p-8 ${
                            dragActive
                                ? "border-violet-500 bg-violet-50"
                                : "border-gray-300 bg-gray-50"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            multiple
                            accept=".xls,.xlsx,.csv"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => handleFileSelect(e.target.files)}
                        />
                        <div className="text-center">
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">
                                Drag and drop your files here, or click to browse
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Supported formats: .xls, .xlsx, .csv (Max 5MB per file)
                            </p>
                        </div>
                    </div>

                    {uploadedFiles.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>File Name</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead className="w-[100px]">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {uploadedFiles.map((file, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="flex items-center gap-2">
                                            <FileSpreadsheet className="h-4 w-4 text-violet-500" />
                                            {file.name}
                                        </TableCell>
                                        <TableCell>
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                file.status === 'success' ? 'bg-green-100 text-green-800' :
                                                file.status === 'error' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Progress value={file.progress} className="w-[100px]" />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeFile(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

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