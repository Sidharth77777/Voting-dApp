"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { UploadedImageType, VoterDataType } from "@/types/types";
import { useWeb3 } from "../context/Web3Context";
import toast from "react-hot-toast";
import { updateToPinata } from "@/pinata/updateToPinata";
import { updateVoterImageFunction } from "../context/contractFunctions";

export default function UpdateImageDialog({profile}: {profile:VoterDataType}) {
    const {account, contract} = useWeb3();
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("No file selected");
    const [image, setImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setFileName(file.name);
            setImage(file);
        }
    };

    const updateImage = async(): Promise<void> => {
        if (!account || !contract) return;

        if (!image) {
            toast.error("Provide new Image");
            return;
        }
        
        try {
            setUploading(true);
            const ImageRes = await updateToPinata(image, "voter", profile.ipfs);
            if (typeof ImageRes === "string") {
                toast.error(ImageRes);
                setUploading(false);
                return;
            }

            try {
                const res = await updateVoterImageFunction(contract, ImageRes.cid, ImageRes.url);
                if (typeof res === "string") {
                    toast.error(res);
                    setUploading(false);
                    return;
                } else {
                    toast.success("Image Updated");
                    setImage(null);
                    setPreview(null);
                    setFileName("No file selected")
                }
               setUploading(false); 

            } catch (err:any) {
                console.error("Error updating Image", err);
                toast.error("Error Updating Image");
                return;
            }

            setUploading(false);

        } catch (err:any) {
            console.error(err);
            setUploading(false);
            toast.error("Error Updating Image");
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="mt-4 cursor-pointer bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-2 rounded-full font-semibold hover:from-indigo-500 hover:to-blue-500 transition-all duration-300 flex items-center gap-2">
                    Update Image <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-gray-900 border border-gray-800 text-white rounded-2xl shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Update Profile Image
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-sm">
                        Upload a new profile image.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 mt-4">
                    <div className="flex flex-col items-center gap-4">
                        <label className="text-sm font-semibold text-gray-200 self-start">
                            New Profile Image
                        </label>

                        <div className="w-36 h-36 rounded-2xl border-2 border-dashed border-gray-700 bg-gray-900/60 hover:bg-gray-800/80 transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                onChange={handleFileChange}
                            />

                            {preview ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="max-w-full max-h-full object-cover w-full h-full rounded-xl transition-all duration-300"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-gray-400 group-hover:text-gray-100 z-10 transition-colors duration-300">
                                    <Upload className="w-8 h-8 mb-1 text-violet-500 group-hover:text-violet-400 transition-colors" />
                                    <span className="text-xs font-medium">Click to upload</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-center">
                            <p className="text-xs text-gray-400 truncate max-w-[200px]">
                                {fileName}
                            </p>
                            <p className="text-xs text-gray-500">JPG, PNG, or GIF up to 5MB</p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        disabled={uploading || !image}
                        onClick={updateImage}
                        className={`mt-2 w-full cursor-pointer bg-[#a48fff] hover:bg-[#6e51ef] text-black text-center font-bold transition-all duration-100 rounded-xl font-semibold text-sm py-2 shadow-md flex items-center justify-center ${
                            uploading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                        {uploading ? "Uploading..." : "Update Image"}
                        {uploading && <Loader2 className="w-5 h-5 ml-2 text-violet-800 animate-spin" />}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
