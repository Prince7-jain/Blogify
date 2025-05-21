# Blogify - Modern Blog Platform

Blogify is a full-stack blog platform with rich text editing, auto-saving drafts, authentication, and eye-care mode.

## 🚀 Features

- **Rich Text Editor** with formatting options and placeholder text
- **Auto-Save** drafts every 30 seconds with real-time status updates
- **Authentication** system with protected routes and user profiles
- **Enhanced Eye-Care Mode** with optimized settings for both light and dark themes
- **Responsive Design** that adapts to all screen sizes from mobile to large desktops
- **Two-Column Layout** for better content display on larger screens
- **Dashboard** to manage your posts and drafts with separate tabs
- **Dark Mode** with proper white text for improved readability
- **Featured Posts** highlighting popular content

## 🛠️ Tech Stack

### Frontend
- React with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Shadcn/UI component library
- React Router for navigation
- Zustand for state management
- Tanstack Query for data fetching
- TipTap for rich text editing

### Backend
- Node.js with Express
- MongoDB Atlas for database
- JWT for authentication
- RESTful API architecture

## 🎨 UI/UX Features

### Accessibility Features
- **Eye Care Mode**: Reduces blue light with optimized settings for both light and dark themes
- **Dark Mode**: Full dark theme with proper contrast and white text
- **Font Size Controls**: Adjustable text size for better readability
- **Reduce Motion**: Option to minimize animations for users sensitive to motion

### Responsive Design
- **Mobile-First Approach**: Works seamlessly on smartphones and tablets
- **Adaptive Layout**: Switches to two-column layout on larger screens
- **Collapsible Navigation**: Side menu for mobile devices
- **Optimized Reading Experience**: Comfortable line height and spacing

### Performance Optimizations
- **Vercel Deployment Ready**: Optimized for Vercel hosting
- **Efficient Rendering**: Minimized re-renders with proper state management
- **Debounced Auto-Save**: Prevents excessive API calls during typing
- **Lazy Loading**: Components load only when needed

## 📋 Database Schema

Blogify uses MongoDB with the following collections:

### Users Collection
```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "name": "string",
  "password": "string (hashed)",
  "bio": "string (optional)",
  "avatar": "string (optional)",
  "role": "string (USER or ADMIN)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Blogs Collection
```json
{
  "_id": "ObjectId",
  "title": "string",
  "content": "string",
  "status": "string (DRAFT, PUBLISHED, or ARCHIVED)",
  "views": "number",
  "slug": "string (unique)",
  "authorId": "ObjectId (reference to Users)",
  "tags": ["string array"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Comments Collection
```json
{
  "_id": "ObjectId",
  "content": "string",
  "blogId": "ObjectId (reference to Blogs)",
  "authorId": "ObjectId (reference to Users)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Likes Collection
```json
{
  "_id": "ObjectId",
  "blogId": "ObjectId (reference to Blogs)",
  "userId": "ObjectId (reference to Users)",
  "createdAt": "Date"
}
```

## 🚀 Getting Started

### Frontend Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/blogify.git
cd blogify
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. The application will be available at `http://localhost:3000`

### Backend Setup with MongoDB Atlas

1. **Create MongoDB Atlas Account and Cluster**:
   - Sign up for a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (the free tier is sufficient for development)
   - Set up database access with a username and password
   - Configure network access (add your IP address or set to allow access from anywhere for development)
   - Get your MongoDB connection string from the Atlas dashboard

2. **Set up Environment Variables**:
   - Create a `.env` file in the root directory of your project
   - Add the following variables:
   ```
   DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-url>/blogify"
   JWT_SECRET="your-secure-jwt-secret-key"
   PORT=5000
   ```
   - Replace `<username>`, `<password>`, and `<cluster-url>` with your MongoDB Atlas credentials

3. **Start the Backend Server**:
```bash
npm run server
```

4. The server will start at `http://localhost:5000`

## 🌐 Deployment

### Vercel Deployment

Blogify is optimized for deployment on Vercel with the following configuration:

1. **Frontend Configuration**:
   - A `vercel.json` file is included with proper routing and caching settings
   - The build process is optimized for Vite applications

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Configure the build settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Set environment variables as needed
   - Deploy!

## 🧠 Key Features Explained

### Eye Care Mode

Blogify's Eye Care Mode is designed to reduce eye strain:

- **Warm Color Filter**: Reduces blue light emission with optimized settings
- **Dark Mode Integration**: Special adjustments for dark theme to maintain readability
- **Typography Enhancements**: Increased letter spacing and line height for better readability
- **Contrast Adjustments**: Carefully tuned contrast levels for comfortable reading

### Auto-Save Functionality

The auto-save system ensures no work is lost:

- **30-Second Intervals**: Automatically saves drafts every 30 seconds
- **Status Indicators**: Visual feedback when saving or when changes are saved
- **Debounced Saving**: Prevents excessive API calls during rapid typing
- **Draft Management**: Organized dashboard for managing saved drafts

### Responsive Layout System

The responsive design adapts to all screen sizes:

- **Mobile-First**: Optimized for small screens with collapsible navigation
- **Tablet Layout**: Adjusted spacing and component sizes for medium screens
- **Desktop Two-Column**: Efficient use of space with two-column blog layout on larger screens
- **Extra Large Screens**: Optimized container widths to prevent excessive line lengths

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Blogs
- `GET /api/blogs` - Get all published blogs
- `POST /api/blogs` - Create a new blog (protected)
- `GET /api/blogs/:id` - Get a specific blog
- `PUT /api/blogs/:id` - Update a blog (protected)
- `DELETE /api/blogs/:id` - Delete a blog (protected)
- `POST /api/blogs/:id/views` - Increment blog view count

### User
- `GET /api/profile` - Get user profile (protected)
- `PUT /api/profile` - Update user profile (protected)
- `GET /api/users/:id/blogs` - Get blogs by a specific user

### Drafts
- `GET /api/drafts` - Get user's drafts (protected)
- `POST /api/drafts` - Save a draft (protected)
- `DELETE /api/drafts/:id` - Delete a draft (protected)
- `PUT /api/drafts/:id/publish` - Publish a draft (protected)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Installation

This project uses npm for package management. The project is configured to automatically handle platform-specific dependencies.

```bash
# Clone the repository
git clone <repository-url>
cd blogify

# Install dependencies
npm install

# The postinstall script will automatically install platform-specific dependencies
```

## Development

To start the development server:

```bash
npm run dev
```

This will start the Vite development server at http://localhost:3000.

To start the backend server:

```bash
npm run server:dev
```

## Building for Production

```bash
npm run build
```

## Platform-Specific Dependencies

This project uses several native dependencies that require platform-specific binaries:

- `@rollup/rollup`: Used by Vite for bundling
- `@swc/core`: Used for fast JavaScript/TypeScript compilation
- `lightningcss`: Used for CSS processing
- `@tailwindcss/oxide`: Used by Tailwind CSS

The project is configured to automatically install the correct binaries for your platform (Windows, macOS, or Linux) through:

1. Optional dependencies in package.json
2. A postinstall script that checks and installs any missing platform-specific dependencies
3. Configuration in .npmrc to handle platform-specific binaries

If you encounter any issues with native dependencies, you can manually install them:

```bash
# For Windows
npm install @rollup/rollup-win32-x64-msvc @swc/core-win32-x64-msvc lightningcss-win32-x64-msvc @tailwindcss/oxide-win32-x64-msvc

# For macOS (Intel)
npm install @rollup/rollup-darwin-x64 @swc/core-darwin-x64 lightningcss-darwin-x64 @tailwindcss/oxide-darwin-x64

# For macOS (Apple Silicon)
npm install @rollup/rollup-darwin-arm64 @swc/core-darwin-arm64 lightningcss-darwin-arm64 @tailwindcss/oxide-darwin-arm64

# For Linux
npm install @rollup/rollup-linux-x64-gnu @swc/core-linux-x64-gnu lightningcss-linux-x64-gnu @tailwindcss/oxide-linux-x64-gnu
```


