import { LogOut } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, PiggyBank, TrendingUp, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
            <BudgetProgressCard />
          </TabsContent>

          <TabsContent value="insights">
            <InsightsGrid />
          </TabsContent>
        </Tabs>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Engineering Notes</CardTitle>
              <CardDescription>Use these points when explaining the project.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 space-y-3 leading-6">
              <p>• Firebase Authentication protects access to the dashboard.</p>
              <p>• Firestore stores transactions by user in a secure collection.</p>
              <p>• Service and hook layers separate data logic from presentation.</p>
              <p>• The app now reflects a realistic production architecture.</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Backend Architecture</CardTitle>
              <CardDescription>Firebase integration details.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 space-y-3 leading-6">
              <p>1. Auth: Email/Password and Google authentication with Firebase Auth</p>
              <p>2. Firestore: users/{'{userId}'}/transactions subcollection</p>
              <p>3. Security: User data isolated by UID</p>
              <p>4. State: React hooks manage local UI state</p>
            </CardContent>
          </Card>
        </section>

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
