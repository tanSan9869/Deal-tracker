import { supabase } from "./supabase";

export const updateUserAvatar = async (userId, base64Image) => {
  const { data, error } = await supabase
    .from("users")
    .update({ avatar: base64Image })
    .eq("id", userId);

  if (error) {
    console.error("Error updating avatar:", error);
    return null;
  }

  return data;
};


export const getUserAvatar = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("avatar")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching avatar:", error);
    return null;
  }

  return data?.avatar || null;
};