import { ImageCategory, UploadedImageType } from "@/types/types";

export const uploadToPinata = async (file: File, category:ImageCategory): Promise<UploadedImageType | string> => {
    if (!file) return "No File Selected";
    if (!category) return "Category Missing";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    try {
        const res = await fetch('/api/uploadToPinata', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            let message = "Upload failed!";
            try {
                const err = await res.json();
                message = err.error || message;
            } catch (_) {}
                return message;
        }

        const data = await res.json();
        return data; 

    } catch (err: any) {
        console.error("Frontend upload error:", err);
        return err.message || "Something went wrong during upload!";
    }
}