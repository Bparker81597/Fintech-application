import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Transaction } from "../types/finance";

function transactionsCollection(userId: string) {
  return collection(db, "users", userId, "transactions");
}

export const transactionService = {
  async getTransactions(userId: string): Promise<Transaction[]> {
    const q = query(transactionsCollection(userId), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => ({
      id: Number(item.id),
      ...item.data(),
    })) as Transaction[];
  },

  async createTransaction(
    userId: string,
    input: Omit<Transaction, "id" | "date">
  ): Promise<void> {
    await addDoc(transactionsCollection(userId), {
      ...input,
      date: new Date().toISOString().slice(0, 10),
    });
  },

  async updateTransaction(
    userId: string,
    transactionId: string,
    updates: Partial<Omit<Transaction, "id" | "date">>
  ): Promise<void> {
    await updateDoc(doc(db, "users", userId, "transactions", transactionId), updates);
  },

  async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    await deleteDoc(doc(db, "users", userId, "transactions", transactionId));
  },
};
