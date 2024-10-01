import { PLACEHOLDER_IMG_URL } from "@/data/constants";

export const getImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) {
    return PLACEHOLDER_IMG_URL;
  }

  return imageUrl;
};
