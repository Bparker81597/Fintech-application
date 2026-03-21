import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Transaction, TransactionCategory } from "../../types/finance";
import { formatCurrency } from "../../utils/currency";

interface BudgetProgressCardProps {
  transactions: Transaction[];
}

const budgetLimits: Record<string, number> = {
  Groceries: 600,
  Transportation: 250,
  Shopping: 400,
  Utilities: 250,
  Dining: 200,
  Subscriptions: 100,
  General: 300,
};

export function BudgetProgressCard({ transactions }: BudgetProgressCardProps) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const spentByCategory = transactions
    .filter((t) => t.date.startsWith(currentMonth) && t.amount < 0)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const budgetData = Object.entries(budgetLimits).map(([category, limit]) => ({
    category: category as TransactionCategory,
    spent: spentByCategory[category] || 0,
    limit,
  }));

  return (
    <Card className="rounded-2xl shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle>Budget Progress</CardTitle>
        <CardDescription>Compare current spending against monthly limits.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {budgetData.map((item) => {
          const percentage = Math.min((item.spent / item.limit) * 100, 100);
          const isOverBudget = item.spent > item.limit;
          return (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.category}</span>
                <span className={`text-slate-500 ${isOverBudget ? "text-red-500 font-semibold" : ""}`}>
                  {formatCurrency(item.spent)} / {formatCurrency(item.limit)}
                </span>
              </div>
              <Progress value={percentage} className={`h-3 ${isOverBudget ? "bg-red-100" : ""}`} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
