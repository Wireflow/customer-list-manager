"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Upload, X } from "lucide-react";

type Props = {
  onImageSelect: (file: File | null) => void;
  image: File | null;
  previewUrl?: string;
  height?: number;
};

const ImageUpload = ({
  onImageSelect,
  image,
  previewUrl: defaultPreview,
  height = 200,
}: Props) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(
    image || null
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultPreview || null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  useEffect(() => {
    onImageSelect(selectedImage);
  }, [selectedImage]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
      <div
        style={{ height }}
        className={`relative w-full  border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden`}
        onClick={() => fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt="Preview"
              layout="fill"
              objectFit="contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Click to upload image</p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
    </>
  );
};

export default ImageUpload;
