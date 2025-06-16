import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Transaction, Product } from "@/types/inventory";
import Icon from "@/components/ui/icon";

type TransactionsListProps = {
  transactions: Transaction[];
  products: Product[];
};

const TransactionsList = ({
  transactions,
  products,
}: TransactionsListProps) => {
  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "Товар удален";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            <TableHead>Товар</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Количество</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Сумма</TableHead>
            <TableHead>Описание</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-mono text-sm">
                {formatDate(transaction.date)}
              </TableCell>
              <TableCell>{getProductName(transaction.productId)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    transaction.type === "incoming" ? "default" : "secondary"
                  }
                  className="flex items-center gap-1 w-fit"
                >
                  <Icon
                    name={
                      transaction.type === "incoming" ? "ArrowDown" : "ArrowUp"
                    }
                    size={12}
                  />
                  {transaction.type === "incoming" ? "Приход" : "Расход"}
                </Badge>
              </TableCell>
              <TableCell>{transaction.quantity} шт</TableCell>
              <TableCell>{transaction.price.toLocaleString()}₽</TableCell>
              <TableCell className="font-medium">
                {transaction.total.toLocaleString()}₽
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {transaction.description || "—"}
              </TableCell>
            </TableRow>
          ))}
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                Операций пока нет
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsList;
