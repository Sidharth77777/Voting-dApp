import { NextResponse } from "next/server";
import { pinata } from "@/pinata/pinataConfig";
import { UploadResponse } from "pinata";

export async function POST (req:Request) {
    try {
        const formData: FormData = await req.formData();

        const file: File = formData.get("file") as File;
        const category: string = formData.get("category") as string;
        const prevURL: string = formData.get("prevURL") as string;
        const prevCID: string = formData.get("prevCID") as string;
        
        if (!file) return NextResponse.json( { error: "No file !" }, { status: 400 } );
        if (!category) return NextResponse.json( {error: "Provide Image Category !"}, {status: 400} );
        if (!prevCID) return NextResponse.json( {error: "Provide Image CID !"}, {status: 400} );
        
        // CHECK IMAGE IS IN CORRECT FORMAT
        const buffer = Buffer.from(await file.arrayBuffer());
        const hexHeader = buffer.subarray(0, 4).toString("hex");
        const validSignatures = ["89504e47", "ffd8ffe0", "ffd8ffe1", "ffd8ffe2", "47494638", "52494646"];
        const isImage = validSignatures.some(sig => hexHeader.startsWith(sig));
        if (!isImage) return NextResponse.json( {error: "Only valid image formats are allowed!"}, {status:400} );

        const fileName: string = `${category}_${Date.now()}`;

        // UPLOAD TO PINATA
        const update: UploadResponse = await pinata.upload.public
            .file(file)
            .name(fileName)
            .group("6a750d67-d358-4b79-aa6f-08ac9657be1b")

        const pinataGatewayURL: string = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL || "https://ivory-famous-cardinal-181.mypinata.cloud";
        const cid: string = update.cid;
        const url: string = `${pinataGatewayURL}/ipfs/${cid}`;

        // DELETE OLD IMAGE
        try {
            const oldImage = await pinata.files.public
            .list()
            .cid(prevCID);
        
            if (oldImage && oldImage.files.length > 0) {
                const ImageId = oldImage.files[0].id;
                await pinata.files.public.delete([ImageId]);
                console.log("Deleted Old Image !");
            }
        } catch(err:any) {
            console.error("Failed to delete old image:", err);
        }

        return NextResponse.json(
            { success: true, cid, url },
            { status: 200 }
        )

    } catch (err:any) {
        console.error("Pinata upload error:", err);

        return NextResponse.json(
            { error: "Failed to update image !" },
            { status: 500 }
        );
    }
}