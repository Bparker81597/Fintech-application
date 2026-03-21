import { useEffect, useMemo, useState, useCallback } from "react";
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

  const addTransaction = useCallback(async (input: AddTransactionInput): Promise<boolean> => {
    if (!userId) return false;
    const parsedAmount = Number(input.amount);
    if (!input.merchant || Number.isNaN(parsedAmount) || parsedAmount === 0) return false;

    const newTransaction: Transaction = {
      id: "temp-" + Date.now(),
      merchant: input.merchant,
      amount: parsedAmount,
      category: input.category,
      date: new Date().toISOString().slice(0, 10),
    };

    // Optimistically update UI immediately
    setTransactions((prev) => [newTransaction, ...prev]);

    // Fire and forget - don't wait for Firebase
    transactionService.createTransaction(userId, {
      merchant: input.merchant,
      amount: parsedAmount,
      category: input.category,
    }).then((id) => {
      // Replace temp id with real id from Firebase
      setTransactions((prev) =>
        prev.map((t) => (t.id === newTransaction.id ? { ...t, id } : t))
      );
    }).catch(() => {
      // Rollback on error
      setTransactions((prev) => prev.filter((t) => t.id !== newTransaction.id));
      setError("Unable to save transaction.");
    });

    return true;
  }, [userId]);

  const deleteTransaction = useCallback(async (transactionId: string): Promise<boolean> => {
    if (!userId) return false;
    
    // Optimistically remove from UI
    setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    
    // Fire and forget
    transactionService.deleteTransaction(userId, transactionId).catch(() => {
      // Reload on error
      transactionService.getTransactions(userId).then(setTransactions);
      setError("Unable to delete transaction.");
    });
    
    return true;
  }, [userId]);

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
