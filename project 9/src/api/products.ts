export interface ApiProduct {
  id: number;
  category_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  stock: number;
  sizes?: string | null;
  image_url?: string | null;
  is_active?: number;
  created_at: string;
  updated_at: string;
}

interface ProductsResponse {
  ok: boolean;
  page?: number;
  per_page?: number;
  count?: number;
  items: ApiProduct[];
  error?: string;
}

const PRODUCTS_ENDPOINT = 'https://arisport.com.tr/api/products/list.php';

export async function fetchProducts(page = 1): Promise<ApiProduct[]> {
  const url = new URL(PRODUCTS_ENDPOINT);
  if (page) {
    url.searchParams.set('page', String(page));
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Ürünler alınamadı (ağ hatası).');
  }

  const data = (await response.json()) as ProductsResponse;

  if (!data.ok) {
    throw new Error(data.error || 'Ürün listesi alınamadı.');
  }

  if (!Array.isArray(data.items)) {
    throw new Error('Beklenmeyen ürün verisi.');
  }

  return data.items;
}
