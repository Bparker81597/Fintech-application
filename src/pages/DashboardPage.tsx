import { LogOut } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, PiggyBank, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardStat } from "../components/dashboard/DashboardStat";
import { SpendingChartCard } from "../components/dashboard/SpendingChartCard";
import { AddTransactionCard } from "../components/dashboard/AddTransactionCard";
import { TransactionsList } from "../components/transactions/TransactionsList";
import { BudgetProgressCard } from "../components/budgets/BudgetProgressCard";
import { InsightsGrid } from "../components/insights/InsightsGrid";
import { useTransactions } from "../hooks/useTransactions";
import { formatCurrency } from "../utils/currency";
import { authService } from "../services/authService";

interface DashboardPageProps {
  userId: string;
  onSignOut: () => void;
}

export default function DashboardPage({ userId, onSignOut }: DashboardPageProps) {
  const { search, setSearch, filteredTransactions, totals, addTransaction, deleteTransaction, isLoading, error } = useTransactions(userId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        <DashboardHeader search={search} onSearchChange={setSearch} />

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <DashboardStat title="Available Balance" value={formatCurrency(totals.balance)} icon={Wallet} change="Updated today" />
          <DashboardStat title="Monthly Income" value={formatCurrency(totals.income)} icon={ArrowUpRight} change="+4.2% vs last month" />
          <DashboardStat title="Monthly Spending" value={formatCurrency(totals.expenses)} icon={ArrowDownRight} change="-2.1% vs last month" />
          <DashboardStat title="Estimated Savings" value={formatCurrency(totals.savings)} icon={PiggyBank} change="On track this month" />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <SpendingChartCard />
          <AddTransactionCard onAddTransaction={addTransaction} />
        </section>

        {error ? <p className="text-sm text-red-500 mb-4">{error}</p> : null}

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="rounded-2xl bg-slate-200/70">
            <TabsTrigger value="transactions" className="rounded-2xl">Transactions</TabsTrigger>
            <TabsTrigger value="budgets" className="rounded-2xl">Budgets</TabsTrigger>
            <TabsTrigger value="insights" className="rounded-2xl">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            {isLoading ? <p className="text-sm text-slate-500">Loading transactions...</p> : <TransactionsList transactions={filteredTransactions} onDeleteTransaction={deleteTransaction} />}
          </TabsContent>

          <TabsContent value="budgets">
            <BudgetProgressCard transactions={filteredTransactions} />
          </TabsContent>

          <TabsContent value="insights">
            <InsightsGrid transactions={filteredTransactions} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-center mt-8">
          <Button onClick={onSignOut} variant="outline" className="rounded-2xl">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
