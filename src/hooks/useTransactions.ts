import { useEffect, useMemo, useState } from "react";
import { Transaction, TransactionCategory } from "../types/finance";
import { transactionService } from "../services/transactionService";

interface AddTransactionInput {
  merchant: string;
  amount: string;
  category: TransactionCategory;
}

export function useTransactions(userId?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTransactions() {
      if (!userId) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await transactionService.getTransactions(userId);
        setTransactions(data);
      } catch {
        setError("Unable to load transactions right now.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTransactions();
  }, [userId]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) =>
      `${transaction.merchant} ${transaction.category}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [transactions, search]);

  const totals = useMemo(() => {
    const income = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return {
      income,
      expenses,
      savings: income - expenses,
      balance: 5420.88,
    };
  }, [transactions]);

  async function addTransaction(input: AddTransactionInput) {
    if (!userId) return false;
    const parsedAmount = Number(input.amount);
    if (!input.merchant || Number.isNaN(parsedAmount) || parsedAmount === 0) return false;

    try {
      await transactionService.createTransaction(userId, {
        merchant: input.merchant,
        amount: parsedAmount,
        category: input.category,
      });

      const refreshed = await transactionService.getTransactions(userId);
      setTransactions(refreshed);
      return true;
    } catch {
      setError("Unable to save transaction.");
      return false;
    }
  }

  async function deleteTransaction(transactionId: string) {
    if (!userId) return false;
    try {
      await transactionService.deleteTransaction(userId, transactionId);
      const refreshed = await transactionService.getTransactions(userId);
      setTransactions(refreshed);
      return true;
    } catch {
      setError("Unable to delete transaction.");
      return false;
    }
  }

  return {
    search,
    setSearch,
    filteredTransactions,
    totals,
    addTransaction,
    deleteTransaction,
    isLoading,
    error,
  };
}
