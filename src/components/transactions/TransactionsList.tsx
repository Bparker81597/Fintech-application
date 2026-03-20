import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign } from "lucide-react";
import { Transaction } from "../../types/finance";
import { formatCurrency } from "../../utils/currency";

interface TransactionsListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionsList({ transactions, onDeleteTransaction }: TransactionsListProps) {
  return (
    <Card className="rounded-2xl shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Searchable transaction list with reusable UI.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <CreditCard className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p>No transactions yet</p>
            <p className="text-sm">Add your first transaction above</p>
          </div>
        ) : (
          transactions.map((transaction) => {
            const isIncome = transaction.amount > 0;
            return (
              <div key={transaction.id} className="flex items-center justify-between border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center gap-4">
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${isIncome ? "bg-emerald-100" : "bg-slate-100"}`}>
                    {isIncome ? <DollarSign className="h-5 w-5 text-emerald-600" /> : <CreditCard className="h-5 w-5 text-slate-600" />}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.merchant}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="rounded-xl">{transaction.category}</Badge>
                      <span className="text-xs text-slate-500">{transaction.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className={`font-semibold ${isIncome ? "text-emerald-600" : "text-slate-900"}`}>
                    {isIncome ? "+" : "-"}{formatCurrency(Math.abs(transaction.amount))}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
