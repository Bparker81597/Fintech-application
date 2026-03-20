export type TransactionCategory =
  | "Income"
  | "Groceries"
  | "Utilities"
  | "Transportation"
  | "Shopping"
  | "Subscriptions"
  | "Dining"
  | "General";

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  category: TransactionCategory;
  date: string;
}

export interface BudgetItem {
  category: Exclude<TransactionCategory, "Income" | "General">;
  spent: number;
  limit: number;
}

export interface MonthlySpendingPoint {
  month: string;
  spending: number;
}
