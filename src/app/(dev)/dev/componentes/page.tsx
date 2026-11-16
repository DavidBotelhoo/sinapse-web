import { notFound } from "next/navigation";
import { ComponentsGallery } from "./ComponentsGallery";

export const dynamic = "force-static";

export default function ComponentsGalleryPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return <ComponentsGallery />;
}
