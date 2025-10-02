import { supabase } from "@/integrations/supabase/client";

/**
 * Upload image to Supabase storage bucket
 */
export const uploadProductImage = async (
  file: File,
  productId: string
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}-${Date.now()}.${fileExt}`;
    const filePath = `${productId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    return getProductImageUrl(filePath);
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

/**
 * Get public URL for product image from storage
 */
export const getProductImageUrl = (path: string): string => {
  const { data } = supabase.storage
    .from('products')
    .getPublicUrl(path);
  
  return data.publicUrl;
};

/**
 * Delete image from storage
 */
export const deleteProductImage = async (path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('products')
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

/**
 * Extract storage path from full URL
 */
export const getStoragePathFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/products/');
    return pathParts[1] || null;
  } catch {
    return null;
  }
};
