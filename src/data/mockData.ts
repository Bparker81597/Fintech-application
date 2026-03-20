import { BudgetItem, MonthlySpendingPoint, Transaction } from "../types/finance";

export const initialTransactions: Transaction[] = [
  { id: "1", merchant: "Whole Foods", amount: -86.34, category: "Groceries", date: "2026-03-16" },
  { id: "2", merchant: "Payroll Deposit", amount: 1850.0, category: "Income", date: "2026-03-15" },
  { id: "3", merchant: "Consumers Energy", amount: -122.81, category: "Utilities", date: "2026-03-13" },
  { id: "4", merchant: "Netflix", amount: -19.99, category: "Subscriptions", date: "2026-03-12" },
  { id: "5", merchant: "Shell", amount: -47.28, category: "Transportation", date: "2026-03-11" },
  { id: "6", merchant: "Target", amount: -64.17, category: "Shopping", date: "2026-03-10" },
  { id: "7", merchant: "Olive Garden", amount: -34.5, category: "Dining", date: "2026-03-09" },
];

export const budgetData: BudgetItem[] = [
  { category: "Groceries", spent: 410, limit: 600 },
  { category: "Transportation", spent: 150, limit: 250 },
  { category: "Shopping", spent: 310, limit: 400 },
  { category: "Utilities", spent: 220, limit: 250 },
  { category: "Dining", spent: 195, limit: 200 },
];

export const chartData: MonthlySpendingPoint[] = [
  { month: "Nov", spending: 1200 },
  { month: "Dec", spending: 1390 },
  { month: "Jan", spending: 1110 },
  { month: "Feb", spending: 1460 },
  { month: "Mar", spending: 1330 },
];
