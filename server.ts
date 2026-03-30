import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-"));
    },
  });
  const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  });

  // Static files
  app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // Upload API
  app.post("/api/upload", authenticate, upload.single("image"), (req: any, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  // API Routes
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  });

  app.get("/api/auth/me", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Not logged in" });
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  // News API
  app.get("/api/news", async (req, res) => {
    const { published } = req.query;
    const news = await prisma.berita.findMany({
      where: published === "true" ? { published: true } : {},
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(news);
  });

  app.get("/api/news/:slug", async (req, res) => {
    const news = await prisma.berita.findUnique({
      where: { slug: req.params.slug },
      include: { category: true },
    });
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json(news);
  });

  app.post("/api/news", authenticate, async (req, res) => {
    const { title, content, thumbnail, categoryId, published } = req.body;
    const slug = title.toLowerCase().replace(/ /g, "-") + "-" + Date.now();
    const news = await prisma.berita.create({
      data: { title, slug, content, thumbnail, categoryId: parseInt(categoryId), published: published || false },
    });
    res.json(news);
  });

  app.put("/api/news/:id", authenticate, async (req, res) => {
    const { title, content, thumbnail, categoryId, published } = req.body;
    const news = await prisma.berita.update({
      where: { id: parseInt(req.params.id) },
      data: { title, content, thumbnail, categoryId: parseInt(categoryId), published },
    });
    res.json(news);
  });

  app.delete("/api/news/:id", authenticate, async (req, res) => {
    await prisma.berita.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Deleted" });
  });

  // Categories API
  app.get("/api/categories", async (req, res) => {
    const categories = await prisma.category.findMany();
    res.json(categories);
  });

  // Members API
  app.get("/api/members", async (req, res) => {
    const members = await prisma.member.findMany({ orderBy: { order: "asc" } });
    res.json(members);
  });

  app.post("/api/members", authenticate, async (req, res) => {
    const { name, position, imageUrl, period, order } = req.body;
    const member = await prisma.member.create({
      data: { name, position, imageUrl, period, order: parseInt(order) || 0 },
    });
    res.json(member);
  });

  app.put("/api/members/:id", authenticate, async (req, res) => {
    const { name, position, imageUrl, period, order } = req.body;
    const member = await prisma.member.update({
      where: { id: parseInt(req.params.id) },
      data: { name, position, imageUrl, period, order: parseInt(order) || 0 },
    });
    res.json(member);
  });

  app.delete("/api/members/:id", authenticate, async (req, res) => {
    await prisma.member.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Deleted" });
  });

  // Gallery API
  app.get("/api/gallery", async (req, res) => {
    const gallery = await prisma.gallery.findMany({ orderBy: { createdAt: "desc" } });
    res.json(gallery);
  });

  app.post("/api/gallery", authenticate, async (req, res) => {
    const { title, imageUrl, description } = req.body;
    const item = await prisma.gallery.create({
      data: { title, imageUrl, description },
    });
    res.json(item);
  });

  app.delete("/api/gallery/:id", authenticate, async (req, res) => {
    await prisma.gallery.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Deleted" });
  });

  // Vite middleware for development
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
