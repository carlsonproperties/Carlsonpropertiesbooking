import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { BlogPost } from "../lib/blog-posts";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-NZ', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  if (featured) {
    return (
      <Link to={`/blog/${post.slug}`}>
        <motion.article
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden border border-[#9DA07E]/20 shadow-sm hover:shadow-lg transition-all"
        >
          <div className="aspect-[16/9] md:aspect-auto overflow-hidden">
            <img
              src={post.heroImage}
              alt={post.heroImageAlt || post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
              }}
            />
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#9DA07E] mb-4">
              {post.category}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2D2D2D] mb-4 leading-tight">
              {post.title}
            </h2>
            <p className="text-[#666] leading-relaxed mb-6 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="text-sm text-[#AFAFAF] flex items-center gap-2">
              <span>{formatDate(post.publishDate)}</span>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </motion.article>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${post.slug}`}>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl overflow-hidden border border-[#9DA07E]/20 shadow-sm hover:shadow-lg transition-all h-full flex flex-col"
      >
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={post.heroImage}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
            }}
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#9DA07E] mb-3">
            {post.category}
          </span>
          <h3 className="text-xl md:text-2xl font-serif text-[#2D2D2D] mb-3 leading-tight">
            {post.title}
          </h3>
          <p className="text-sm text-[#666] leading-relaxed mb-4 line-clamp-2 flex-grow">
            {post.excerpt}
          </p>
          <div className="text-xs text-[#AFAFAF] flex items-center gap-2">
            <span>{formatDate(post.publishDate)}</span>
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
