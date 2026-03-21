import { InsightCard } from "./InsightCard";
import { Transaction } from "../../types/finance";
import { formatCurrency } from "../../utils/currency";

interface InsightsGridProps {
  transactions: Transaction[];
}

export function InsightsGrid({ transactions }: InsightsGridProps) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const currentMonthTransactions = transactions.filter((t) =>
    t.date.startsWith(currentMonth)
  );

  const income = currentMonthTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = currentMonthTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const savings = income - expenses;
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : "0";

  const topCategory = Object.entries(
    currentMonthTransactions
      .filter((t) => t.amount < 0)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
      }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])[0];

  const transactionCount = currentMonthTransactions.length;

  const insights = [
    {
      title: "💰 Monthly Summary",
      body: `You've saved ${formatCurrency(savings)} this month (${savingsRate}% of income). ${Number(savingsRate) >= 20 ? "Great job staying on track!" : "Try to increase your savings rate."}`,
    },
    {
      title: "📊 Spending Activity",
      body: `You've made ${transactionCount} transactions this month. ${transactionCount > 20 ? "Consider reviewing recurring expenses." : "Your spending looks controlled."}`,
    },
    topCategory
      ? {
          title: "🏷️ Top Category",
          body: `Your highest spending category is ${topCategory[0]} at ${formatCurrency(topCategory[1])}. Look for ways to reduce costs in this area.`,
        }
      : {
          title: "🏷️ Top Category",
          body: "No expense data yet. Start adding transactions to see insights.",
        },
    {
      title: "🎯 Budget Tip",
      body: "Set up automatic transfers to savings on payday. Even $50/month adds up to $600/year.",
    },
    {
      title: "📈 Financial Health",
      body: expenses < income * 0.8
        ? "You're spending less than 80% of your income. Consider investing the surplus."
        : "Your expenses are high relative to income. Review your budget categories.",
    },
    {
      title: "💡 Smart Move",
      body: "Track every transaction for 30 days. Awareness is the first step to better financial habits.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {insights.map((insight) => (
        <InsightCard key={insight.title} title={insight.title} body={insight.body} />
      ))}
    </div>
  );
}
