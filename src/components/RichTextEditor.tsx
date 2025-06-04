import React, { useCallback, useRef } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from "react-hot-toast";
import supabase from "../config/states/supabaseClient.ts";

interface Props {
    value: string;
    setValue: (value: string) => void;
    style?: React.CSSProperties;
    className?: string;
    filter?: boolean;
    disabled?: boolean; // Added disabled prop
}

export default function RichTextEditor({ value, setValue, filter = true, disabled = false }: Props) {
    const quillRef = useRef<any>();

    // Resize image before uploading
    const resizeImage = (file: File): Promise<Blob> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const maxWidth = 300;
                    const scaleFactor = maxWidth / img.width;
                    canvas.width = maxWidth;
                    canvas.height = img.height * scaleFactor;
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(blob);
                        }
                    }, file.type);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    // Image upload handler
    const imageHandler = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            try {
                const fileInputs = input?.files ?? [];
                if (fileInputs.length <= 0) {
                    return;
                }
                const file = fileInputs[0];
                const resizedBlob = await resizeImage(file);
                const resizedFile = new File([resizedBlob], file.name, { type: file.type });

                // Upload image to Supabase
                const { data, error } = await supabase.storage
                    .from("images")
                    .upload(`public/${Date.now()}_${resizedFile.name}`, resizedFile, {
                        cacheControl: "3600",
                        upsert: false,
                    });

                if (error) {
                    throw error;
                }

                // Get the public URL
                const { data: publicUrlData } = supabase.storage
                    .from("images")
                    .getPublicUrl(data.path);

                const imageUrl = publicUrlData.publicUrl;

                // Insert image into Quill editor
                const editor = quillRef.current.getEditor();
                const range = editor.getSelection(true);
                editor.insertEmbed(range.index, "image", imageUrl);
            } catch (err: any) {
                console.log(err);
                toast.error(err?.message || "Failed to upload image");
            }
        };
    }, []);

    // Modules for ReactQuill
    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'align': [] }],
                ['image', 'link'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    };

    const handleChange = (content: string) => {
        if (filter === true) {
            const cleanedContent = content
                .replace(/<p><br><\/p>/g, '')
                .replace(/<div><br><\/div>/g, '')
                .replace(/<h[1-6]><br><\/h[1-6]>/g, '')
                .trim();
            setValue(cleanedContent || "");
        } else {
            setValue(content);
        }
    };

    return (
        <div className="rich-text-editor">
            <ReactQuill
                ref={quillRef}
                value={value}
                onChange={handleChange}
                modules={modules}
                theme="snow"
                readOnly={disabled} // Disable editor based on the 'disabled' prop
            />
            <style>{`
        .rich-text-editor .ql-container {
          height: 300px;
          background-color: #ffff;
          color: black;
          overflow-y: auto;
          border-bottom-left-radius: 7px;
          border-bottom-right-radius: 7px;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 7px;
          border-top-right-radius: 7px;
        }
        .rich-text-editor .ql-editor {
          color: black;
          height: auto;
          border-bottom-left-radius: 7px;
          border-bottom-right-radius: 7px;
          height: 100%;
        }
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: black;
          background-color: #ffff;
        }
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: black;
        }
        .rich-text-editor .ql-toolbar .ql-picker-label {
          color: black;
        }
        .rich-text-editor .ql-editor img {
          max-width: 20%;
          height: auto;
        }
      `}</style>
        </div>
    );
}
