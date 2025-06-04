import { useEffect, useState } from "react";
import { Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import supabase from "../config/states/supabaseClient.ts";

type ImageItem = {
    url: string;
    fileName: string;
};

const UploadImg = ({
                       setUrlimg,
                       urlimg,
                   }: {
    setUrlimg: (cb: (prev: ImageItem[]) => ImageItem[]) => void;
    urlimg: ImageItem[];
}) => {
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (urlimg && Array.isArray(urlimg)) {
            setFileList(
                urlimg.map((item, index) => ({
                    uid: index.toString(),
                    name: item.fileName || item.url.split("/").pop() || `image-${index}`,
                    status: "done",
                    url: item.url,
                }))
            );
        }
    }, [urlimg]);

    const handleUpload = async (file: File) => {
        setUploading(true);
        const fileName = `${Date.now()}-${file.name}`;

        const { error } = await supabase.storage
            .from("images")
            .upload(fileName, file);

        if (error) {
            message.error("Lỗi upload ảnh!");
            console.error(error);
            setUploading(false);
            return;
        }

        const { data } = supabase.storage
            .from("images")
            .getPublicUrl(fileName);

        const publicUrl = data.publicUrl;

        if (publicUrl) {
            setUrlimg((prev) => [...prev, { url: publicUrl, fileName }]);
        }

        message.success("Upload thành công!");
        setUploading(false);
    };

    const handleRemove = async (file: UploadFile) => {
        const fileName = file.name;

        const { error } = await supabase.storage
            .from("images")
            .remove([fileName]);

        if (error) {
            message.error("Lỗi xoá ảnh!");
            console.error(error);
            return false;
        }

        setUrlimg((prev) => prev.filter((img) => img.fileName !== fileName));
        message.success("Xoá ảnh thành công!");
        return true;
    };

    return (
        <Upload
            listType="picture-card"
            fileList={fileList}
            customRequest={({ file }) => handleUpload(file as File)}
            onRemove={handleRemove}
            showUploadList={true}
            beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                    message.error("Chỉ được upload ảnh!");
                }
                return isImage || Upload.LIST_IGNORE;
            }}
        >
            <Button icon={<UploadOutlined />} loading={uploading} />
        </Upload>
    );
};

export default UploadImg;
