import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Product } from "@/types/inventory";

type ProductCardProps = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const isLowStock = product.stock <= product.minStock;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg truncate">{product.name}</CardTitle>
          {isLowStock && (
            <Badge variant="destructive" className="ml-2">
              Мало
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Icon name="Package" size={48} className="text-gray-400" />
          )}
        </div>

        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Цена:</span>
            <span className="font-medium">
              {product.price.toLocaleString()}₽
            </span>
          </div>
          <div className="flex justify-between">
            <span>Остаток:</span>
            <span className={`font-medium ${isLowStock ? "text-red-600" : ""}`}>
              {product.stock} шт
            </span>
          </div>
          <div className="flex justify-between">
            <span>Категория:</span>
            <span>{product.category}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(product)}
          className="flex-1"
        >
          <Icon name="Edit" size={16} />
          Изменить
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(product.id)}
        >
          <Icon name="Trash2" size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
