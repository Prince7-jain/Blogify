import { useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useBlogStore } from "@/stores/BlogStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Eye } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getBlog, incrementViews } = useBlogStore();
  const { eyeCare } = useTheme();
  
  const blog = getBlog(id!);
  
  useEffect(() => {
    if (blog?.id) {
      // Increment view count when the blog is viewed
      incrementViews(blog.id);
    }
  }, [blog?.id, incrementViews]);
  
  if (!blog) {
    return <Navigate to="/" replace />;
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (e) {
      return 'Unknown date';
    }
  };

  // Apply additional classes based on eye care mode
  const getProseClasses = () => {
    return cn(
      "prose dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-base prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg",
      eyeCare.colorTemperature === "warm" && "eye-care-prose"
    );
  };

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">{blog.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {blog.authorName && blog.authorName.length > 0 ? blog.authorName.charAt(0) : 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{blog.authorName || 'Anonymous'}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(blog.updatedAt)}</span>
                  <span>•</span>
                  <Eye className="h-3.5 w-3.5" />
                  <span>{blog.views || 1} view{(blog.views || 1) !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.tags.map((tag) => (
                  <span key={tag} className="bg-primary/5 text-primary px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative">
            <div 
              className={getProseClasses()}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
          
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {blog.authorName && blog.authorName.length > 0 ? blog.authorName.charAt(0) : 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-lg">{blog.authorName || 'Anonymous'}</div>
                <div className="text-sm text-muted-foreground">Author</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
