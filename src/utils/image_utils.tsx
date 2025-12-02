import imageCompression from "browser-image-compression";

export const compressImage = async (
  file: File,
  quality: "low" | "good"
): Promise<File> => {
  const options =
    quality === "low"
      ? {
          maxSizeMB: 0.05, // 50KB max for thumbnails
          maxWidthOrHeight: 300, // Max 300px width/height for thumbnails
          useWebWorker: true,
          fileType: "image/jpeg",
          initialQuality: 0.5,
        }
      : {
          maxSizeMB: 1, // 1MB max for banners/hero sections
          maxWidthOrHeight: 1920, // Max 1920px width/height for high quality
          useWebWorker: true,
          fileType: "image/jpeg",
          initialQuality: 0.85,
        };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw new Error("Failed to compress image");
  }
};
