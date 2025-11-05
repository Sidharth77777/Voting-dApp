import { ImageCategory, UploadedImageType } from "@/types/types";

export const updateToPinata = async (file: File, category:ImageCategory, prevCID:string): Promise<UploadedImageType | string> => {
    if (!file) return "No File Selected";
    if (!category) return "Category Missing";
    if (!prevCID) return "Current CID of Image Missing";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);  
    formData.append("prevCID", prevCID);  

    try {
        const res = await fetch('/api/updateToPinata', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            let message = "Update failed!";
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