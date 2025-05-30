import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCmsPageSchema, updateCmsPageSchema, paginationSchema } from "@shared/schema";
import { z } from "zod";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Bearer token authentication middleware
const authenticate = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.API_BEARER_TOKEN || process.env.BEARER_TOKEN || "default-token";
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Bearer token required in Authorization header" 
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  if (token !== expectedToken) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Invalid bearer token" 
    });
  }

  next();
};

// Validation middleware
const validate = (schema: z.ZodSchema) => (req: Request, res: Response, next: Function) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid request data",
        details: error.errors,
      });
    }
    next(error);
  }
};

const validateQuery = (schema: z.ZodSchema) => (req: Request, res: Response, next: Function) => {
  try {
    req.query = schema.parse(req.query);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid query parameters",
        details: error.errors,
      });
    }
    next(error);
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply authentication to all /api/cms-pages routes
  app.use('/api/cms-pages*', authenticate);

  // GET /api/cms-pages - List all CMS pages with pagination
  app.get('/api/cms-pages', validateQuery(paginationSchema), async (req: Request, res: Response) => {
    try {
      const params = req.query as any;
      const result = await storage.getCmsPages(params);
      res.json(result);
    } catch (error) {
      console.error('Error fetching CMS pages:', error);
      res.status(500).json({ 
        error: "Internal Server Error", 
        message: "Failed to fetch CMS pages" 
      });
    }
  });

  // GET /api/cms-pages/:id - Get a specific CMS page
  app.get('/api/cms-pages/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          error: "Bad Request", 
          message: "Invalid page ID" 
        });
      }

      const page = await storage.getCmsPage(id);
      if (!page) {
        return res.status(404).json({ 
          error: "Not Found", 
          message: "CMS page not found" 
        });
      }

      res.json(page);
    } catch (error) {
      console.error('Error fetching CMS page:', error);
      res.status(500).json({ 
        error: "Internal Server Error", 
        message: "Failed to fetch CMS page" 
      });
    }
  });

  // POST /api/cms-pages - Create a new CMS page
  app.post('/api/cms-pages', validate(insertCmsPageSchema), async (req: Request, res: Response) => {
    try {
      // Check if URL key already exists for this store
      const existing = await storage.getCmsPageByStoreAndUrl(req.body.storeId, req.body.urlKey);
      if (existing) {
        return res.status(409).json({ 
          error: "Conflict", 
          message: "A page with this URL key already exists for this store" 
        });
      }

      const newPage = await storage.createCmsPage(req.body);
      res.status(201).json(newPage);
    } catch (error) {
      console.error('Error creating CMS page:', error);
      res.status(500).json({ 
        error: "Internal Server Error", 
        message: "Failed to create CMS page" 
      });
    }
  });

  // PUT /api/cms-pages/:id - Update a CMS page
  app.put('/api/cms-pages/:id', validate(updateCmsPageSchema), async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          error: "Bad Request", 
          message: "Invalid page ID" 
        });
      }

      // Check if page exists
      const existing = await storage.getCmsPage(id);
      if (!existing) {
        return res.status(404).json({ 
          error: "Not Found", 
          message: "CMS page not found" 
        });
      }

      // If updating URL key, check for conflicts
      if (req.body.urlKey && req.body.urlKey !== existing.urlKey) {
        const conflicting = await storage.getCmsPageByStoreAndUrl(existing.storeId, req.body.urlKey);
        if (conflicting && conflicting.id !== id) {
          return res.status(409).json({ 
            error: "Conflict", 
            message: "A page with this URL key already exists for this store" 
          });
        }
      }

      const updatedPage = await storage.updateCmsPage(id, req.body);
      res.json(updatedPage);
    } catch (error) {
      console.error('Error updating CMS page:', error);
      res.status(500).json({ 
        error: "Internal Server Error", 
        message: "Failed to update CMS page" 
      });
    }
  });

  // DELETE /api/cms-pages/:id - Delete a CMS page
  app.delete('/api/cms-pages/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          error: "Bad Request", 
          message: "Invalid page ID" 
        });
      }

      const deleted = await storage.deleteCmsPage(id);
      if (!deleted) {
        return res.status(404).json({ 
          error: "Not Found", 
          message: "CMS page not found" 
        });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting CMS page:', error);
      res.status(500).json({ 
        error: "Internal Server Error", 
        message: "Failed to delete CMS page" 
      });
    }
  });

  // GET /api/cms-pages/stats - Get statistics
  app.get('/api/cms-pages/stats', async (req: Request, res: Response) => {
    try {
      const [totalPages, activePages] = await Promise.all([
        storage.getCmsPageCount(),
        storage.getActiveCmsPageCount(),
      ]);

      res.json({
        totalPages,
        activePages,
        inactivePages: totalPages - activePages,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ 
        error: "Internal Server Error", 
        message: "Failed to fetch statistics" 
      });
    }
  });

  // Health check endpoint (no authentication required)
  app.get('/api/health', async (req: Request, res: Response) => {
    try {
      // Test database connection
      await storage.getCmsPageCount();
      res.json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        service: "CMS Pages API",
        version: "1.0.0"
      });
    } catch (error) {
      res.status(503).json({ 
        status: "unhealthy", 
        timestamp: new Date().toISOString(),
        error: "Database connection failed"
      });
    }
  });

  // Serve Postman collection
  app.get('/postman-collection.json', (req, res) => {
    res.setHeader('Content-Disposition', 'attachment; filename=postman-collection.json');
    res.sendFile(path.join(__dirname, '../postman-collection.json'));
  });

  const httpServer = createServer(app);
  return httpServer;
}
