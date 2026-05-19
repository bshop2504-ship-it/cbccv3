import { supabase } from "./supabaseClient";

export const convertToWebP = (file, quality = 0.8) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(null);

            const webpFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, "") + ".webp",
              {
                type: "image/webp",
              },
            );

            resolve(webpFile);
          },
          "image/webp",
          quality,
        );
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
};
