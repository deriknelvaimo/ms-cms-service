import { pgTable, text, integer, boolean, timestamp, bigserial, index, unique } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const cmsPages = pgTable("cms_pages", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  storeId: integer("store_id").notNull(),
  title: text("title").notNull(),
  layout: text("layout").default("1column"),
  urlKey: text("url_key").notNull(),
  content: text("content"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Optimized indexes for performance
  storeActiveIdx: index("idx_store_active").on(table.storeId, table.isActive),
  storeUrlIdx: unique("idx_store_url").on(table.storeId, table.urlKey),
  createdAtIdx: index("idx_created_at").on(table.createdAt),
  titleIdx: index("idx_title").on(table.title),
}));

// Insert schema (omit auto-generated fields)
export const insertCmsPageSchema = createInsertSchema(cmsPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema (make all fields optional except id)
export const updateCmsPageSchema = insertCmsPageSchema.partial();

// Select schema
export const selectCmsPageSchema = createSelectSchema(cmsPages);

// Types
export type InsertCmsPage = z.infer<typeof insertCmsPageSchema>;
export type UpdateCmsPage = z.infer<typeof updateCmsPageSchema>;
export type CmsPage = typeof cmsPages.$inferSelect;

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(15),
  storeId: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
