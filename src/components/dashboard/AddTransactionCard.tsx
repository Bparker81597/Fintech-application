import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TransactionCategory } from "../../types/finance";

interface AddTransactionCardProps {
  onAddTransaction: (input: {
    merchant: string;
    amount: string;
    category: TransactionCategory;
  }) => Promise<boolean>;
}

export function AddTransactionCard({ onAddTransaction }: AddTransactionCardProps) {
  const [form, setForm] = useState<{ merchant: string; amount: string; category: TransactionCategory }>({
    merchant: "",
    amount: "",
    category: "General",
  });

  async function handleSubmit() {
    const parsedAmount = Number(form.amount);
    if (!form.merchant || Number.isNaN(parsedAmount) || parsedAmount === 0) return;
    
    // Optimistic - reset immediately, Firebase saves in background
    const success = await onAddTransaction(form);
    if (success) {
      setForm({ merchant: "", amount: "", category: "General" });
    }
  }

  return (
    <Card className="rounded-2xl shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
        <CardDescription>Quick add with instant UI update.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Merchant"
          value={form.merchant}
          onChange={(e) => setForm((prev) => ({ ...prev, merchant: e.target.value }))}
          className="rounded-2xl"
        />
        <Input
          placeholder="Amount (use negative for expense)"
          value={form.amount}
          onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
          className="rounded-2xl"
        />
        <select
          value={form.category}
          onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as TransactionCategory }))}
          className="w-full h-10 px-3 rounded-2xl border border-slate-300 bg-white"
        >
          <option>General</option>
          <option>Income</option>
          <option>Groceries</option>
          <option>Utilities</option>
          <option>Transportation</option>
          <option>Shopping</option>
          <option>Subscriptions</option>
          <option>Dining</option>
        </select>
        <Button onClick={handleSubmit} className="w-full rounded-2xl">
          Add Transaction
        </Button>
        <p className="text-xs text-slate-500 leading-5">
          Transaction appears instantly, saves to Firebase in background.
        </p>
      </CardContent>
    </Card>
  );
}
