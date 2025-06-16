import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import ProductCard from "@/components/ProductCard";
import ProductForm from "@/components/ProductForm";
import TransactionForm from "@/components/TransactionForm";
import TransactionsList from "@/components/TransactionsList";
import StatsCard from "@/components/StatsCard";
import { Product, Transaction, InventoryStats } from "@/types/inventory";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

  // Инициализация с тестовыми данными
  useEffect(() => {
    const testProducts: Product[] = [
      {
        id: "1",
        name: "Ноутбук Lenovo IdeaPad",
        description: "Игровой ноутбук с 16GB RAM и RTX 3060",
        price: 75000,
        stock: 3,
        minStock: 2,
        category: "Электроника",
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Футболка Nike",
        description: "Спортивная футболка из хлопка",
        price: 2500,
        stock: 12,
        minStock: 5,
        category: "Одежда",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "Кофе арабика",
        description: "Зерновой кофе премиум класса",
        price: 850,
        stock: 1,
        minStock: 3,
        category: "Продукты",
        image:
          "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const testTransactions: Transaction[] = [
      {
        id: "1",
        productId: "1",
        type: "incoming",
        quantity: 5,
        price: 70000,
        total: 350000,
        description: "Поставка от DNS",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "2",
        productId: "1",
        type: "outgoing",
        quantity: 2,
        price: 75000,
        total: 150000,
        description: "Продажа клиенту",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    setProducts(testProducts);
    setTransactions(testTransactions);
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats: InventoryStats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
    lowStockItems: products.filter((p) => p.stock <= p.minStock).length,
    todayTransactions: transactions.filter(
      (t) => t.date.toDateString() === new Date().toDateString(),
    ).length,
  };

  const handleProductSubmit = (
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (selectedProduct) {
      setProducts(
        products.map((p) =>
          p.id === selectedProduct.id
            ? {
                ...productData,
                id: p.id,
                createdAt: p.createdAt,
                updatedAt: new Date(),
              }
            : p,
        ),
      );
    } else {
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProducts([...products, newProduct]);
    }
    setIsProductFormOpen(false);
    setSelectedProduct(undefined);
  };

  const handleTransactionSubmit = (transactionData: {
    productId: string;
    type: "incoming" | "outgoing";
    quantity: number;
    price: number;
    description: string;
  }) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...transactionData,
      total: transactionData.quantity * transactionData.price,
      date: new Date(),
    };

    setTransactions([newTransaction, ...transactions]);

    // Обновляем количество товара
    setProducts(
      products.map((p) =>
        p.id === transactionData.productId
          ? {
              ...p,
              stock:
                transactionData.type === "incoming"
                  ? p.stock + transactionData.quantity
                  : p.stock - transactionData.quantity,
              updatedAt: new Date(),
            }
          : p,
      ),
    );

    setIsTransactionFormOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Удалить товар?")) {
      setProducts(products.filter((p) => p.id !== id));
      setTransactions(transactions.filter((t) => t.productId !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Складской учет
          </h1>
          <p className="text-gray-600">Управление товарами и операциями</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Всего товаров"
            value={stats.totalProducts}
            icon="Package"
            description="в каталоге"
          />
          <StatsCard
            title="Стоимость склада"
            value={`${stats.totalValue.toLocaleString()}₽`}
            icon="DollarSign"
            description="общая стоимость"
          />
          <StatsCard
            title="Требуют внимания"
            value={stats.lowStockItems}
            icon="AlertTriangle"
            description="товаров с низким остатком"
          />
          <StatsCard
            title="Операций сегодня"
            value={stats.todayTransactions}
            icon="Activity"
            description="приходов и расходов"
          />
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Товары</TabsTrigger>
            <TabsTrigger value="transactions">Операции</TabsTrigger>
            <TabsTrigger value="reports">Отчеты</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Каталог товаров</CardTitle>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Icon
                        name="Search"
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        placeholder="Поиск товаров..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Dialog
                      open={isProductFormOpen}
                      onOpenChange={setIsProductFormOpen}
                    >
                      <DialogTrigger asChild>
                        <Button onClick={() => setSelectedProduct(undefined)}>
                          <Icon name="Plus" size={16} />
                          Добавить
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {selectedProduct
                              ? "Редактировать товар"
                              : "Добавить товар"}
                          </DialogTitle>
                        </DialogHeader>
                        <ProductForm
                          product={selectedProduct}
                          onSubmit={handleProductSubmit}
                          onCancel={() => {
                            setIsProductFormOpen(false);
                            setSelectedProduct(undefined);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={(product) => {
                        setSelectedProduct(product);
                        setIsProductFormOpen(true);
                      }}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Icon
                      name="Package"
                      size={48}
                      className="mx-auto text-gray-400 mb-4"
                    />
                    <p className="text-gray-500">
                      {searchTerm
                        ? "Товары не найдены"
                        : "Добавьте первый товар"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>История операций</CardTitle>
                  <Dialog
                    open={isTransactionFormOpen}
                    onOpenChange={setIsTransactionFormOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Icon name="Plus" size={16} />
                        Новая операция
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Добавить операцию</DialogTitle>
                      </DialogHeader>
                      <TransactionForm
                        products={products}
                        onSubmit={handleTransactionSubmit}
                        onCancel={() => setIsTransactionFormOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <TransactionsList
                  transactions={transactions}
                  products={products}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Товары с низким остатком</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {products
                      .filter((p) => p.stock <= p.minStock)
                      .map((product) => (
                        <div
                          key={product.id}
                          className="flex justify-between items-center p-3 bg-red-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">
                              {product.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-red-600">
                              {product.stock} шт
                            </p>
                            <p className="text-xs text-gray-500">
                              мин: {product.minStock}
                            </p>
                          </div>
                        </div>
                      ))}
                    {products.filter((p) => p.stock <= p.minStock).length ===
                      0 && (
                      <p className="text-center py-8 text-gray-500">
                        Все товары в наличии ✓
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Топ категории</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      products.reduce(
                        (acc, product) => {
                          acc[product.category] =
                            (acc[product.category] || 0) +
                            product.stock * product.price;
                          return acc;
                        },
                        {} as Record<string, number>,
                      ),
                    )
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, value]) => (
                        <div
                          key={category}
                          className="flex justify-between items-center"
                        >
                          <span>{category}</span>
                          <span className="font-medium">
                            {value.toLocaleString()}₽
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
