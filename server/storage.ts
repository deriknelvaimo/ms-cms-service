import { cmsPages, type CmsPage, type InsertCmsPage, type UpdateCmsPage, type PaginationParams } from "@shared/schema";
import { db } from "./db";
import { eq, and, count, desc } from "drizzle-orm";

export interface ICmsStorage {
  getCmsPage(id: number): Promise<CmsPage | undefined>;
  getCmsPageByStoreAndUrl(storeId: number, urlKey: string): Promise<CmsPage | undefined>;
  createCmsPage(page: InsertCmsPage): Promise<CmsPage>;
  updateCmsPage(id: number, updates: UpdateCmsPage): Promise<CmsPage | undefined>;
  deleteCmsPage(id: number): Promise<boolean>;
  getCmsPages(params: PaginationParams): Promise<{
    data: CmsPage[];
    meta: {
      currentPage: number;
      perPage: number;
      total: number;
      lastPage: number;
    };
  }>;
  getCmsPageCount(): Promise<number>;
  getActiveCmsPageCount(): Promise<number>;
}

export class DatabaseStorage implements ICmsStorage {
  async getCmsPage(id: number): Promise<CmsPage | undefined> {
    const [page] = await db.select().from(cmsPages).where(eq(cmsPages.id, id));
    return page || undefined;
  }

  async getCmsPageByStoreAndUrl(storeId: number, urlKey: string): Promise<CmsPage | undefined> {
    const [page] = await db
      .select()
      .from(cmsPages)
      .where(and(eq(cmsPages.storeId, storeId), eq(cmsPages.urlKey, urlKey)));
    return page || undefined;
  }

  async createCmsPage(page: InsertCmsPage): Promise<CmsPage> {
    const [newPage] = await db
      .insert(cmsPages)
      .values({
        ...page,
        updatedAt: new Date(),
      })
      .returning();
    return newPage;
  }

  async updateCmsPage(id: number, updates: UpdateCmsPage): Promise<CmsPage | undefined> {
    const [updatedPage] = await db
      .update(cmsPages)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(cmsPages.id, id))
      .returning();
    return updatedPage || undefined;
  }

  async deleteCmsPage(id: number): Promise<boolean> {
    const result = await db.delete(cmsPages).where(eq(cmsPages.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getCmsPages(params: PaginationParams): Promise<{
    data: CmsPage[];
    meta: {
      currentPage: number;
      perPage: number;
      total: number;
      lastPage: number;
    };
  }> {
    const { page, perPage, storeId, isActive } = params;
    const offset = (page - 1) * perPage;

    // Build where conditions
    const conditions = [];
    if (storeId !== undefined) {
      conditions.push(eq(cmsPages.storeId, storeId));
    }
    if (isActive !== undefined) {
      conditions.push(eq(cmsPages.isActive, isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(cmsPages)
      .where(whereClause);

    // Get paginated data
    const data = await db
      .select()
      .from(cmsPages)
      .where(whereClause)
      .orderBy(desc(cmsPages.createdAt))
      .limit(perPage)
      .offset(offset);

    const lastPage = Math.ceil(total / perPage);

    return {
      data,
      meta: {
        currentPage: page,
        perPage,
        total,
        lastPage,
      },
    };
  }

  async getCmsPageCount(): Promise<number> {
    const [{ total }] = await db.select({ total: count() }).from(cmsPages);
    return total;
  }

  async getActiveCmsPageCount(): Promise<number> {
    const [{ total }] = await db
      .select({ total: count() })
      .from(cmsPages)
      .where(eq(cmsPages.isActive, true));
    return total;
  }
}

export const storage = new DatabaseStorage();
