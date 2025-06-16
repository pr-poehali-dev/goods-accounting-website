import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types/inventory";

type TransactionFormProps = {
  products: Product[];
  onSubmit: (transaction: {
    productId: string;
    type: "incoming" | "outgoing";
    quantity: number;
    price: number;
    description: string;
  }) => void;
  onCancel: () => void;
};

const TransactionForm = ({
  products,
  onSubmit,
  onCancel,
}: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    productId: "",
    type: "incoming" as const,
    quantity: 1,
    price: 0,
    description: "",
  });

  const selectedProduct = products.find((p) => p.id === formData.productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setFormData({
      ...formData,
      productId,
      price: product?.price || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="product">Товар</Label>
        <Select value={formData.productId} onValueChange={handleProductChange}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите товар" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} (остаток: {product.stock})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="type">Тип операции</Label>
        <Select
          value={formData.type}
          onValueChange={(value: "incoming" | "outgoing") =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="incoming">Приход</SelectItem>
            <SelectItem value="outgoing">Расход</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Количество</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max={
              formData.type === "outgoing" ? selectedProduct?.stock : undefined
            }
            value={formData.quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity: parseInt(e.target.value) || 1,
              })
            }
            required
          />
          {formData.type === "outgoing" && selectedProduct && (
            <p className="text-xs text-gray-500 mt-1">
              Доступно: {selectedProduct.stock} шт
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="price">Цена за единицу (₽)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: parseFloat(e.target.value) || 0,
              })
            }
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Описание операции</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Поставщик, причина списания и т.д."
          rows={2}
        />
      </div>

      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium">
          Итого: {(formData.quantity * formData.price).toLocaleString()}₽
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Провести операцию
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
