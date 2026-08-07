import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { StoryData } from "@/components/StoryCard";

const contentDir = path.join(process.cwd(), "src/content/stories");

export function getAllStories(): StoryData[] {
  // Check if directory exists first (helpful during build if it doesn't)
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(contentDir);
  
  const stories = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(contentDir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      
      const { data } = matter(fileContents);
      
      return {
        slug,
        no: data.catalogNo,
        title: data.title,
        excerpt: data.excerpt,
        category: data.category,
        thread: data.thread,
        readTime: data.readTime,
        publishDate: data.publishDate, // Assuming we want to sort by this
      } as StoryData & { publishDate: string };
    });

  // Sort stories by catalogNo descending for now (or publishDate)
  return stories.sort((a, b) => parseInt(b.no) - parseInt(a.no));
}

export function getStoryBySlug(slug: string) {
  const fullPath = path.join(contentDir, `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  
  return {
    frontmatter: {
      no: data.catalogNo,
      title: data.title,
      excerpt: data.excerpt,
      category: data.category,
      thread: data.thread,
      readTime: data.readTime,
    } as StoryData,
    content,
  };
}
