import { useState } from "react";
import { supabase } from "./supabaseClient";
import { logger } from "./utils/logger";

const handleUpload = async (file) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `FoodCategory/${fileName}`;

    const { data, error } = await supabase.storage
      .from("restaurant-img")
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data: url, error: urlError } = supabase.storage
      .from("restaurant-img")
      .getPublicUrl(filePath);

    if (urlError) {
      throw urlError;
    }

    logger.log("url - ", url.publicUrl);
    return url.publicUrl;
  } catch (error) {
    logger.error("Error uploading file:", error);
    throw error;
  }
};

export { handleUpload };
