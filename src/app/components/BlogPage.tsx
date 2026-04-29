import { BlogTips } from "./BlogTips";
import { SeoHead } from "./SeoHead";

export function BlogPage() {
  return (
    <>
      <SeoHead
        title="Photography Tips & Blog | Ava in Frame"
        description="Photography tips, session advice, and inspiration from Ava in Frame. Learn how to get the most from your Toronto photo session."
        canonicalPath="/blog"
        keywords="photography tips, Toronto photographer blog, wedding photography advice, family photo tips"
        type="article"
      />
      <BlogTips />
    </>
  );
}
