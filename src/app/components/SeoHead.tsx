import { Helmet } from "react-helmet-async";

type SeoHeadProps = {
  title: string;
  description: string;
  canonicalPath: string;
  robots?: string;
  imagePath?: string;
  type?: "website" | "article";
  keywords?: string;
};

const SITE_URL = "https://avainframe.com";

function toAbsoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/")) {
    return `${SITE_URL}${path}`;
  }
  return `${SITE_URL}/${path}`;
}

export function SeoHead({
  title,
  description,
  canonicalPath,
  robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  imagePath = "/preview-shot.jpg",
  type = "website",
  keywords,
}: SeoHeadProps) {
  const canonicalUrl = toAbsoluteUrl(canonicalPath);
  const imageUrl = toAbsoluteUrl(imagePath);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:locale" content="en_CA" />
      <meta property="og:site_name" content="Ava in Frame" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content="Photography portfolio preview by Ava in Frame" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}