import React, { useEffect, useState } from "react";

type ImageItem = { src: string; caption: string };

export function ServiceGallery({ category }: { category: string }) {
  const [images, setImages] = useState<ImageItem[] | null>(null);

  useEffect(() => {
    let mounted = true;
    const url = `/galleries/${category}/gallery.json`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("No gallery manifest");
        return res.json();
      })
      .then((data: ImageItem[]) => {
        if (mounted) setImages(data);
      })
      .catch(() => setImages(null));
    return () => {
      mounted = false;
    };
  }, [category]);

  if (images === null) {
    return (
      <div className="mt-8 mb-8">
        <p className="text-sm text-gray-600">No gallery found for this service yet.</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="mt-8 mb-8">
        <p className="text-sm text-gray-600">Gallery is empty. Drop images to public/galleries/{category} and run the generator.</p>
      </div>
    );
  }

  return (
    <section className="mt-8">
      <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
        <img src={images[0].src} alt={images[0].caption} className="w-full h-[420px] object-cover" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {images.map((img) => (
          <figure key={img.src} className="group overflow-hidden rounded-xl bg-white">
            <img src={img.src} alt={img.caption} loading="lazy" className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
            <figcaption className="p-3 text-sm text-gray-700">{img.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default ServiceGallery;
