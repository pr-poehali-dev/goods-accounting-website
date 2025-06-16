export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Transaction = {
  id: string;
  productId: string;
  type: "incoming" | "outgoing";
  quantity: number;
  price: number;
  total: number;
  description: string;
  date: Date;
};

export type InventoryStats = {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  todayTransactions: number;
};
