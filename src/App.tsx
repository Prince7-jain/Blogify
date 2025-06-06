import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import EditorPage from "@/pages/EditorPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import SignupPage from "@/pages/SignupPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-solid-background text-foreground">
              <Header />
              <main className="flex-grow w-full">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/editor/:id" element={
                    <ProtectedRoute>
                      <EditorPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/blog/:id" element={<BlogDetailPage />} />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <footer className="py-8 border-t border-border text-center text-muted-foreground text-sm w-full">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      © {new Date().getFullYear()} Blogify. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                      <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                        Terms
                      </a>
                      <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                        Privacy
                      </a>
                      <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                        Contact
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
