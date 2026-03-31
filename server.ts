import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(express.json());
  app.use(cookieParser());

  // CORS untuk development
  if (process.env.NODE_ENV === "development") {
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "http://localhost:5173");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      if (req.method === "OPTIONS") {
        return res.sendStatus(200);
      }
      next();
    });
  }

  // Multer configuration untuk file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
      const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-");
      cb(null, Date.now() + "-" + sanitized);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed"));
      }
    },
  });

  // Static files
  app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

  // =============== AUTH MIDDLEWARE ===============
  const authenticate = (req: any, res: any, next: any) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: "Unauthorized - No token" });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
      next();
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // =============== AUTH ROUTES ===============
  
  // Register (opsional, bisa di-disable)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email dan password required" });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || email.split("@")[0],
          role: "user",
        },
      });

      res.json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email dan password required" });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  });

  // Get current user
  app.get("/api/auth/me", authenticate, async (req: any, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, email: true, name: true, role: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // =============== FILE UPLOAD ===============

app.post("/api/upload", authenticate, upload.single("image"), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "ukm-public-speaking" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.json({ url: (result as any).secure_url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

  // =============== NEWS ROUTES ===============
  app.get("/api/news", async (req, res) => {
    try {
      const { published } = req.query;
      const news = await prisma.berita.findMany({
        where: published === "true" ? { published: true } : {},
        include: { category: true },
        orderBy: { createdAt: "desc" },
      });
      res.json(news);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/news/:slug", async (req, res) => {
    try {
      const news = await prisma.berita.findUnique({
        where: { slug: req.params.slug },
        include: { category: true },
      });
      if (!news) {
        return res.status(404).json({ error: "News not found" });
      }
      res.json(news);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/news", authenticate, async (req: any, res) => {
    try {
      const { title, content, thumbnail, categoryId, published } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: "Title and content required" });
      }

      const slug = title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

      const news = await prisma.berita.create({
        data: {
          title,
          slug,
          content,
          thumbnail: thumbnail || null,
          categoryId: parseInt(categoryId) || 1,
          published: published || false,
        },
        include: { category: true },
      });

      res.status(201).json(news);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/news/:id", authenticate, async (req: any, res) => {
    try {
      const { title, content, thumbnail, categoryId, published } = req.body;
      const newsId = parseInt(req.params.id);

      const news = await prisma.berita.update({
        where: { id: newsId },
        data: {
          title,
          content,
          thumbnail: thumbnail || undefined,
          categoryId: categoryId ? parseInt(categoryId) : undefined,
          published,
        },
        include: { category: true },
      });

      res.json(news);
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "News not found" });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/news/:id", authenticate, async (req: any, res) => {
    try {
      const newsId = parseInt(req.params.id);
      await prisma.berita.delete({ where: { id: newsId } });
      res.json({ message: "News deleted successfully" });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "News not found" });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // =============== CATEGORIES ROUTES ===============
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await prisma.category.findMany();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // =============== MEMBERS ROUTES ===============
  app.get("/api/members", async (req, res) => {
    try {
      const members = await prisma.member.findMany({
        orderBy: { order: "asc" },
      });
      res.json(members);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/members", authenticate, async (req: any, res) => {
    try {
      const { name, position, imageUrl, period, order } = req.body;

      const member = await prisma.member.create({
        data: {
          name,
          position,
          imageUrl: imageUrl || null,
          period: period || null,
          order: parseInt(order) || 0,
        },
      });

      res.status(201).json(member);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/members/:id", authenticate, async (req: any, res) => {
    try {
      const { name, position, imageUrl, period, order } = req.body;
      const memberId = parseInt(req.params.id);

      const member = await prisma.member.update({
        where: { id: memberId },
        data: { name, position, imageUrl, period, order: parseInt(order) || 0 },
      });

      res.json(member);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/members/:id", authenticate, async (req: any, res) => {
    try {
      const memberId = parseInt(req.params.id);
      await prisma.member.delete({ where: { id: memberId } });
      res.json({ message: "Member deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // =============== GALLERY ROUTES ===============
  app.get("/api/gallery", async (req, res) => {
    try {
      const gallery = await prisma.gallery.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json(gallery);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/gallery", authenticate, async (req: any, res) => {
    try {
      const { title, imageUrl, description } = req.body;

      const item = await prisma.gallery.create({
        data: {
          title,
          imageUrl,
          description: description || null,
        },
      });

      res.status(201).json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/gallery/:id", authenticate, async (req: any, res) => {
    try {
      const galleryId = parseInt(req.params.id);
      await prisma.gallery.delete({ where: { id: galleryId } });
      res.json({ message: "Gallery item deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // =============== VITE MIDDLEWARE ===============
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // =============== ERROR HANDLER ===============
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Error:", err);
    res.status(500).json({
      error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    });
  });

  // =============== START SERVER ===============
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Node Environment: ${process.env.NODE_ENV}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});