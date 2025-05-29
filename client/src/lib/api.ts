import { apiRequest } from "@/lib/queryClient";

export interface CmsPage {
  id: number;
  storeId: number;
  title: string;
  layout: string | null;
  urlKey: string;
  content: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCmsPage {
  storeId: number;
  title: string;
  layout?: string;
  urlKey: string;
  content?: string;
  isActive?: boolean;
}

export interface UpdateCmsPage {
  title?: string;
  layout?: string;
  content?: string;
  isActive?: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
}

export interface ApiStats {
  totalPages: number;
  activePages: number;
  inactivePages: number;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

export class CmsApiClient {
  private bearerToken: string = "";

  setBearerToken(token: string) {
    this.bearerToken = token;
  }

  private async makeRequest(method: string, url: string, data?: unknown) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.bearerToken) {
      headers["Authorization"] = `Bearer ${this.bearerToken}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async getCmsPages(params?: {
    page?: number;
    perPage?: number;
    storeId?: number;
    isActive?: boolean;
  }): Promise<PaginationResponse<CmsPage>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.perPage) searchParams.set("perPage", params.perPage.toString());
    if (params?.storeId) searchParams.set("storeId", params.storeId.toString());
    if (params?.isActive !== undefined) searchParams.set("isActive", params.isActive.toString());

    const url = `/api/cms-pages${searchParams.toString() ? `?${searchParams}` : ""}`;
    return this.makeRequest("GET", url);
  }

  async getCmsPage(id: number): Promise<CmsPage> {
    return this.makeRequest("GET", `/api/cms-pages/${id}`);
  }

  async createCmsPage(data: CreateCmsPage): Promise<CmsPage> {
    return this.makeRequest("POST", "/api/cms-pages", data);
  }

  async updateCmsPage(id: number, data: UpdateCmsPage): Promise<CmsPage> {
    return this.makeRequest("PUT", `/api/cms-pages/${id}`, data);
  }

  async deleteCmsPage(id: number): Promise<void> {
    return this.makeRequest("DELETE", `/api/cms-pages/${id}`);
  }

  async getStats(): Promise<ApiStats> {
    return this.makeRequest("GET", "/api/cms-pages/stats");
  }

  async getHealth(): Promise<HealthStatus> {
    return this.makeRequest("GET", "/api/health");
  }
}

export const cmsApi = new CmsApiClient();
