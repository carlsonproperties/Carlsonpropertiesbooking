import React, { useState } from "react";
import { motion } from "motion/react";
import { BLOG_POSTS } from "../lib/blog-posts";
import { BlogCard } from "../components/BlogCard";
import { SEO } from "../components/SEO";
import { Footer } from "../components/Footer";

type Category = 'All' | 'Events' | 'Local Guide' | 'Food & Drink';

export function Blog() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const categories: Category[] = ['All', 'Events', 'Local Guide', 'Food & Drink'];

  const sortedPosts = [...BLOG_POSTS].sort((a, b) => {
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });

  const filteredPosts = activeCategory === 'All'
    ? sortedPosts
    : sortedPosts.filter(post => post.category === activeCategory);

  const [featuredPost, ...remainingPosts] = filteredPosts;

  return (
    <>
      <SEO
        title="Journal - Stories from Taupō | One Eleven on the Mile"
        description="Discover the best of Taupō with our local guide. Events, activities, dining recommendations, and insider tips from your hosts at One Eleven on the Mile."
        keywords="Taupō blog, Taupō events, things to do in Taupō, Taupō restaurants, Taupō guide, Lake Taupō"
        canonicalUrl="https://carlsonproperties.co.nz/blog"
      />

      <div className="min-h-screen bg-[#fdfcf8]">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-serif text-[#2D2D2D] mb-4">
              Journal
            </h1>
            <p className="text-xl md:text-2xl font-serif italic text-[#9DA07E]">
              Stories from Taupō
            </p>
          </motion.div>
        </section>

        {/* Category Tabs - Sticky */}
        <div className="sticky top-0 z-40 bg-[#fdfcf8]/95 backdrop-blur-sm border-b border-[#F1F1EE] mb-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-8 overflow-x-auto py-6 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`text-sm uppercase tracking-widest font-bold whitespace-nowrap pb-2 transition-colors relative ${
                    activeCategory === category
                      ? 'text-[#9DA07E]'
                      : 'text-[#AFAFAF] hover:text-[#2D2D2D]'
                  }`}
                >
                  {category}
                  {activeCategory === category && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9DA07E]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 pb-24">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#AFAFAF] text-lg">No posts found in this category.</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-16"
                >
                  <BlogCard post={featuredPost} featured />
                </motion.div>
              )}

              {/* Post Grid */}
              {remainingPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {remainingPosts.map((post, index) => (
                    <motion.div
                      key={post.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <BlogCard post={post} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
