import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { BLOG_POSTS } from "../lib/blog-posts";
import { BlogCard } from "../components/BlogCard";
import { SEO } from "../components/SEO";
import { Footer } from "../components/Footer";

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const post = BLOG_POSTS.find(p => p.slug === slug);

  useEffect(() => {
    if (!post) {
      navigate('/blog');
    }
  }, [post, navigate]);

  if (!post) {
    return null;
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-NZ', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const relatedPosts = BLOG_POSTS
    .filter(p => p.slug !== slug)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 3);

  // Split markdown into intro and main body (before/after first H2)
  const firstH2Index = post.bodyMarkdown.indexOf('\n## ');
  const introContent = firstH2Index > 0
    ? post.bodyMarkdown.substring(0, firstH2Index).trim()
    : post.bodyMarkdown;
  const mainContent = firstH2Index > 0
    ? post.bodyMarkdown.substring(firstH2Index).trim()
    : '';

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.secondaryImage || post.heroImage,
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "author": { "@type": "Person", "name": "Matt & Ashleigh Carlson" },
    "publisher": {
      "@type": "Organization",
      "name": "Carlson Properties",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Black%20White%20Minimalist%20Calligraphy%20Signature%20Logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.carlsonproperties.co.nz/blog/${post.slug}`
    },
    "description": post.metaDescription,
    "keywords": post.tags.join(", "),
    "articleSection": post.category
  };

  return (
    <>
      <SEO
        title={post.metaTitle}
        description={post.metaDescription}
        keywords={post.tags.join(', ')}
        image={post.secondaryImage || post.heroImage}
        canonicalUrl={`https://carlsonproperties.co.nz/blog/${post.slug}`}
        type="article"
        schemaData={schemaData}
      />

      <div className="min-h-screen bg-[#fdfcf8]">
        {/* Header */}
        <div className="pt-32 pb-12 px-6">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-[#9DA07E] hover:text-[#2D2D2D] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              All Stories
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#9DA07E] mb-4 block">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-serif text-[#2D2D2D] mb-6 leading-tight max-w-[800px]">
                {post.title}
              </h1>
              <div className="text-sm text-[#AFAFAF] flex items-center gap-2 mb-8">
                <span>{formatDate(post.publishDate)}</span>
                <span>·</span>
                <span>{post.readingTime} min read</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-h-[60vh] overflow-hidden mb-16"
        >
          <img
            src={post.heroImage}
            alt={post.heroImageAlt || post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop';
            }}
          />
        </motion.div>

        {/* Body Content */}
        <article className="px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-[720px] mx-auto prose prose-lg"
          >
            {/* Intro Content */}
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="text-3xl font-serif text-[#9DA07E] mt-12 mb-6 leading-tight">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-serif italic text-[#2D2D2D] mt-8 mb-4 leading-tight">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-[17px] leading-[1.7] text-[#2D2D2D] mb-6">
                    {children}
                  </p>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[#9DA07E] pl-6 my-8 italic text-[#666]">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9DA07E] underline-offset-4 hover:underline transition-all"
                  >
                    {children}
                  </a>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 mb-6 text-[#2D2D2D]">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-6 text-[#2D2D2D]">
                    {children}
                  </ol>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-[#2D2D2D]">
                    {children}
                  </strong>
                ),
              }}
            >
              {introContent}
            </ReactMarkdown>

            {/* Secondary Image */}
            {post.secondaryImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="my-12"
              >
                <img
                  src={post.secondaryImage}
                  alt={post.title}
                  className="w-full aspect-video object-cover rounded-2xl"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop';
                  }}
                />
              </motion.div>
            )}

            {/* Main Content */}
            {mainContent && (
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-3xl font-serif text-[#9DA07E] mt-12 mb-6 leading-tight">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl font-serif italic text-[#2D2D2D] mt-8 mb-4 leading-tight">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-[17px] leading-[1.7] text-[#2D2D2D] mb-6">
                      {children}
                    </p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[#9DA07E] pl-6 my-8 italic text-[#666]">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9DA07E] underline-offset-4 hover:underline transition-all"
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-2 mb-6 text-[#2D2D2D]">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-2 mb-6 text-[#2D2D2D]">
                      {children}
                    </ol>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-[#2D2D2D]">
                      {children}
                    </strong>
                  ),
                }}
              >
                {mainContent}
              </ReactMarkdown>
            )}
          </motion.div>
        </article>

        {/* CTA Button */}
        <div className="px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-[720px] mx-auto text-center"
          >
            <Link
              to={post.ctaUrl}
              className="inline-block bg-[#9DA07E] text-white px-12 py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#8A8D6D] transition-all shadow-lg shadow-[#9DA07E]/20"
            >
              {post.ctaLabel}
            </Link>
          </motion.div>
        </div>

        {/* Tags */}
        <div className="px-6 pb-16">
          <div className="max-w-[720px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full bg-[#9DA07E]/10 text-[#9DA07E] text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="px-6 pb-24">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-serif text-[#2D2D2D] mb-12 text-center">
                  More from <span className="italic text-[#9DA07E]">the Journal</span>
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.div
                      key={relatedPost.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <BlogCard post={relatedPost} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  );
}
