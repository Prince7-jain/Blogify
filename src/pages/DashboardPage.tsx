import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Eye, PlusCircle, FileText, Clock, Send } from "lucide-react";
import { useBlogStore } from "@/stores/BlogStore";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DashboardPage = () => {
  const { getUserBlogs, bulkDeleteBlogs, publishBlog } = useBlogStore();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedPublishedItems, setSelectedPublishedItems] = useState<string[]>([]);
  const [selectedDraftItems, setSelectedDraftItems] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("published");
  const [publishingDraft, setPublishingDraft] = useState<string | null>(null);
  
  const userId = user?.id || 'user-1'; // Use actual user ID or fallback for demo
  const publishedBlogs = getUserBlogs(userId, 'published');
  const draftBlogs = getUserBlogs(userId, 'draft');

  const handleSelectPublishedItem = (id: string) => {
    setSelectedPublishedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleSelectDraftItem = (id: string) => {
    setSelectedDraftItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleSelectAllPublished = (items: any[]) => {
    if (selectedPublishedItems.length === items.length) {
      setSelectedPublishedItems([]);
    } else {
      setSelectedPublishedItems(items.map(item => item.id));
    }
  };

  const handleSelectAllDrafts = (items: any[]) => {
    if (selectedDraftItems.length === items.length) {
      setSelectedDraftItems([]);
    } else {
      setSelectedDraftItems(items.map(item => item.id));
    }
  };

  const handleBulkDeletePublished = async () => {
    if (selectedPublishedItems.length === 0) return;
    
    try {
      await bulkDeleteBlogs(selectedPublishedItems);
      toast({
        title: "Success",
        description: `${selectedPublishedItems.length} published post(s) deleted successfully`,
      });
      setSelectedPublishedItems([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete selected items",
        variant: "destructive",
      });
    }
  };

  const handleBulkDeleteDrafts = async () => {
    if (selectedDraftItems.length === 0) return;
    
    try {
      await bulkDeleteBlogs(selectedDraftItems);
      toast({
        title: "Success",
        description: `${selectedDraftItems.length} draft(s) deleted successfully`,
      });
      setSelectedDraftItems([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete selected items",
        variant: "destructive",
      });
    }
  };

  const handlePublishDraft = async (draft: any) => {
    setPublishingDraft(draft.id);
    
    try {
      await publishBlog({
        ...draft,
        status: 'published',
      });
      
      toast({
        title: "Success",
        description: "Draft published successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish draft",
        variant: "destructive",
      });
    } finally {
      setPublishingDraft(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-serif font-bold">My Content</h1>
          <Button asChild className="bg-solid-primary text-primary-foreground hover:bg-primary/90 font-medium">
            <Link to="/editor/new" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="published" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="published" className="text-base">
              Published Posts
            </TabsTrigger>
            <TabsTrigger value="drafts" className="text-base">
              Saved Drafts
            </TabsTrigger>
          </TabsList>
          
          {/* Published Posts Tab */}
          <TabsContent value="published">
            {selectedPublishedItems.length > 0 && (
              <div className="mb-4">
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected ({selectedPublishedItems.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete {selectedPublishedItems.length} post(s)?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        the selected posts.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBulkDeletePublished} className="bg-destructive">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
            
            {publishedBlogs.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Published Posts</CardTitle>
                  <CardDescription>
                    Manage your published blog posts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={selectedPublishedItems.length === publishedBlogs.length && publishedBlogs.length > 0}
                            onCheckedChange={() => handleSelectAllPublished(publishedBlogs)}
                          />
                        </TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {publishedBlogs.map((blog) => (
                        <TableRow key={blog.id} className={selectedPublishedItems.includes(blog.id) ? "bg-muted/50" : ""}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedPublishedItems.includes(blog.id)} 
                              onCheckedChange={() => handleSelectPublishedItem(blog.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{blog.title}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {blog.tags.map((tag) => (
                                <Badge key={tag} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(blog.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{blog.views || 0}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              asChild
                            >
                              <Link to={`/blog/${blog.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              asChild
                            >
                              <Link to={`/editor/${blog.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Blog Post?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete
                                    your blog post.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => bulkDeleteBlogs([blog.id])}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No published posts yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start creating content and publish your first post!
                </p>
                <Button asChild className="bg-solid-primary text-primary-foreground hover:bg-primary/90 font-medium">
                  <Link to="/editor/new" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Create New Post
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Drafts Tab */}
          <TabsContent value="drafts">
            {selectedDraftItems.length > 0 && (
              <div className="mb-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected ({selectedDraftItems.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete {selectedDraftItems.length} draft(s)?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        the selected drafts.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBulkDeleteDrafts} className="bg-destructive">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
            
            {draftBlogs.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Saved Drafts</CardTitle>
                  <CardDescription>
                    Continue working on your saved drafts or publish them
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={selectedDraftItems.length === draftBlogs.length && draftBlogs.length > 0}
                            onCheckedChange={() => handleSelectAllDrafts(draftBlogs)}
                          />
                        </TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Last Saved</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {draftBlogs.map((blog) => (
                        <TableRow key={blog.id} className={selectedDraftItems.includes(blog.id) ? "bg-muted/50" : ""}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedDraftItems.includes(blog.id)} 
                              onCheckedChange={() => handleSelectDraftItem(blog.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {blog.title || <span className="text-muted-foreground italic">Untitled Draft</span>}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {blog.tags && blog.tags.length > 0 ? (
                                blog.tags.map((tag) => (
                                  <Badge key={tag} variant="outline">
                                    {tag}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-xs">No tags</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{new Date(blog.updatedAt).toLocaleString()}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              asChild
                            >
                              <Link to={`/editor/${blog.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handlePublishDraft(blog)}
                              disabled={publishingDraft === blog.id}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Draft?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete
                                    your draft.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => bulkDeleteBlogs([blog.id])}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No saved drafts</h3>
                <p className="text-muted-foreground mb-6">
                  Start a new post and save it as a draft to continue later
                </p>
                <Button asChild className="bg-solid-primary text-primary-foreground hover:bg-primary/90 font-medium">
                  <Link to="/editor/new" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Create New Post
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
