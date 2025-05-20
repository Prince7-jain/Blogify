import { useState, useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bold, Italic, List, ListOrdered, Quote, 
  Heading1, Heading2, Heading3, Save, Send,
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon,
  Code, Undo, Redo, Pilcrow, PenTool
} from "lucide-react";
import { useBlogStore } from "@/stores/BlogStore";
import { debounce } from "@/lib/utils";
import TagInput from "./TagInput";
import { useAuth } from "@/context/AuthContext";

interface BlogEditorProps {
  blogId?: string;
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  onPublish?: (blogData: any) => Promise<boolean>;
}

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

const BlogEditor = ({ 
  blogId,
  initialTitle = '', 
  initialContent = '', 
  initialTags = [],
  onPublish
}: BlogEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [draftId, setDraftId] = useState<string>(blogId || `draft-${Date.now()}`);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const { saveDraft, publishBlog, deleteDraft } = useBlogStore();
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return "What's the title?"
          }
          return 'Start writing your amazing blog post here... Tell your story, share your knowledge or experiences.'
        },
        showOnlyWhenEditable: true,
      }),
    ],
    content: initialContent,
    autofocus: false, // We'll focus on title first
    editorProps: {
      attributes: {
        class: 'focus:outline-none tiptap-editor min-h-[300px] py-4',
      },
    },
  });

  // Function to reset editor state
  const resetEditor = () => {
    setTitle('');
    setTags([]);
    editor?.commands.clearContent();
    setLastSaved(null);
    
    // Focus on title again
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  // Auto-focus on title when creating a new post
  useEffect(() => {
    if (titleInputRef.current && !initialTitle) {
      titleInputRef.current.focus();
    }
  }, [initialTitle]);

  // Handle click anywhere in editor container to focus the editor
  const handleContainerClick = (e: React.MouseEvent) => {
    // Don't focus if clicking on a button or toolbar
    if (
      e.target instanceof HTMLButtonElement || 
      (e.target instanceof HTMLElement && e.target.closest('.editor-toolbar'))
    ) {
      return;
    }
    
    // Focus the editor
    editor?.commands.focus();
  };

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!editor?.getHTML()) return;

    try {
      setIsSaving(true);
      await saveDraft({
        id: draftId, // Use the same draft ID for consistent updates
        title,
        content: editor.getHTML(),
        tags,
        authorId: user?.id || 'user-1',
        authorName: user?.name || 'Anonymous',
      });
      
      setLastSaved(new Date());
      
      toast({
        title: "Draft saved",
        description: "Your changes have been automatically saved",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Failed to save",
        description: "There was an error saving your draft",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [title, tags, editor, draftId, saveDraft, toast, user]);

  // Set up auto-save timer
  useEffect(() => {
    const timer = setInterval(() => {
      if ((title || (editor && editor.getHTML().length > 0)) && !isPublishing) {
        autoSave();
      }
    }, AUTO_SAVE_INTERVAL);
    
    return () => clearInterval(timer);
  }, [autoSave, editor, title, isPublishing]);

  // Debounced save function for input changes - with a longer delay for the title
  const debouncedTitleSave = useCallback(
    debounce(async (newTitle: string) => {
      if (!editor || !editor.getHTML()) return;
      
      setIsSaving(true);
      try {
        await saveDraft({
          id: draftId, // Use the same draft ID for consistent updates
          title: newTitle,
          content: editor.getHTML(),
          tags,
          authorId: user?.id || 'user-1',
          authorName: user?.name || 'Anonymous',
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to save draft:", error);
      } finally {
        setIsSaving(false);
      }
    }, 1000), // Shorter debounce for title - 1 second
    [editor, draftId, tags, saveDraft, user]
  );

  // Debounced save function for editor content changes
  const debouncedContentSave = useCallback(
    debounce(async () => {
      if (!editor || !editor.getHTML()) return;
      await autoSave();
    }, 2000), // Debounce for 2 seconds after typing stops
    [autoSave, editor]
  );

  // Handle title changes with debounce
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (newTitle && editor?.getHTML()) {
      debouncedTitleSave(newTitle);
    }
  };

  // Trigger debounced save when content changes
  useEffect(() => {
    if (editor) {
      editor.on('update', () => {
        debouncedContentSave();
      });
    }
    
    return () => {
      if (editor) {
        editor.off('update');
      }
    };
  }, [editor, debouncedContentSave]);

  // Trigger debounced save when tags change
  useEffect(() => {
    if (tags.length > 0 && editor?.getHTML()) {
      debouncedContentSave();
    }
  }, [tags, debouncedContentSave, editor]);

  // Manual save function
  const handleSave = async () => {
    if (!editor?.getHTML()) {
      toast({
        title: "Content required",
        description: "Please write some content for your blog post",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      await saveDraft({
        id: draftId, // Use the same draft ID for consistent updates
        title,
        content: editor.getHTML(),
        tags,
        authorId: user?.id || 'user-1',
        authorName: user?.name || 'Anonymous',
      });
      
      setLastSaved(new Date());
      
      toast({
        title: "Draft saved",
        description: "Your blog post has been saved as a draft",
      });
    } catch (error) {
      toast({
        title: "Failed to save",
        description: "There was an error saving your draft",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Publish function
  const handlePublish = async () => {
    if (!title || title.trim() === '') {
      toast({
        title: "Title required",
        description: "Please enter a title for your blog post",
        variant: "destructive",
      });
      return;
    }

    if (!editor?.getHTML() || editor.getHTML().trim() === '<p></p>') {
      toast({
        title: "Content required",
        description: "Please write some content for your blog post",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    
    try {
      const blogData = {
        id: blogId || `blog-${Date.now()}`,
        title,
        content: editor.getHTML(),
        tags,
        authorId: user?.id || 'user-1',
        authorName: user?.name || 'Anonymous',
      };
      
      let success = false;
      if (onPublish) {
        success = await onPublish(blogData);
      } else {
        await publishBlog(blogData);
        success = true;
        toast({
          title: "Post published",
          description: "Your blog post has been published successfully",
        });
      }
      
      // If publishing was successful, delete the draft and reset the editor
      if (success) {
        try {
          // Delete the draft after successful publishing
          await deleteDraft(draftId);
        } catch (e) {
          console.error("Failed to delete draft after publishing", e);
        }
        resetEditor();
      }
    } catch (error) {
      toast({
        title: "Failed to publish",
        description: "There was an error publishing your post",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-solid-card shadow-sm rounded-lg p-6 border border-primary/10">
      {/* Title input */}
      <div className="mb-4">
        <Input
          ref={titleInputRef}
          type="text"
          placeholder="Enter your blog title here..."
          value={title}
          onChange={handleTitleChange}
          className="text-2xl font-serif font-bold border-0 focus-visible:ring-primary/20 focus-visible:ring-offset-0 px-0"
        />
      </div>
      
      {/* Tags input */}
      <TagInput 
        tags={tags}
        setTags={setTags}
        suggestions={["technology", "webdev", "programming", "javascript", "react"]}
      />
      
      {/* Toolbar */}
      <div className="editor-toolbar">
        {/* Text style group */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'active' : ''}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'active' : ''}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'active' : ''}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        
        <div className="divider"></div>
        
        {/* Headings group */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'active' : ''}
          title="Paragraph"
        >
          <Pilcrow className="h-4 w-4" />
        </Button>
        
        <div className="divider"></div>
        
        {/* Lists group */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'active' : ''}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'active' : ''}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <div className="divider"></div>
        
        {/* Quote and formatting */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'active' : ''}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <div className="divider"></div>
        
        {/* Undo/redo group */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Editor */}
      <div 
        ref={editorContainerRef}
        className="editor-container flex-grow border-primary/10" 
        onClick={handleContainerClick}
      >
        <EditorContent editor={editor} />
      </div>
      
      {/* Status and action buttons */}
      <div className="flex items-center justify-between mt-4 py-2 border-t border-primary/10">
        <div className="text-sm text-muted-foreground">
          {lastSaved ? (
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          ) : (
            <span>Not saved yet</span>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isSaving}
            className="border-primary/30 bg-background hover:bg-primary/5 font-medium text-foreground"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          
          <Button
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-solid-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            <Send className="h-4 w-4 mr-2" />
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
