import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { initialTransactions, categories } from './data/transactions';

function App() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
  });

  // Calculate totals
  const totalIncome = useMemo(() => 
    transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(() => 
    Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)),
    [transactions]
  );

  const balance = totalIncome - totalExpenses;

  // Filter transactions
  const filteredTransactions = useMemo(() => 
    transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
      return matchesSearch && matchesCategory;
    }),
    [transactions, searchTerm, filterCategory]
  );

  // Expense by category for pie chart
  const expensesByCategory = useMemo(() => {
    const categoryTotals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const amount = Math.abs(t.amount);
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amount;
    });
    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  // Monthly data for bar chart
  const monthlyData = useMemo(() => {
    const monthTotals = {};
    transactions.forEach(t => {
      const month = t.date.slice(0, 7);
      const amount = t.type === 'income' ? t.amount : -Math.abs(t.amount);
      monthTotals[month] = (monthTotals[month] || 0) + amount;
    });
    return Object.entries(monthTotals)
      .map(([month, balance]) => ({ month, balance }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const transaction = {
      id: Date.now(),
      description: newTransaction.description,
      amount: newTransaction.type === 'expense' ? -Math.abs(parseFloat(newTransaction.amount)) : parseFloat(newTransaction.amount),
      type: newTransaction.type,
      category: newTransaction.category,
      date: newTransaction.date,
    };
    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      description: '',
      amount: '',
      type: 'expense',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
    });
    setShowAddForm(false);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#14b8a6'];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">💰 SmartFinance Dashboard</h1>
          <p className="text-blue-100">Track your finances with clarity and confidence</p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Balance</h3>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Income</h3>
            <p className="text-3xl font-bold text-green-600">
              +${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Expenses</h3>
            <p className="text-3xl font-bold text-red-600">
              -${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart - Expenses by Category */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Monthly Balance */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Balance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Bar dataKey="balance" fill="#3b82f6" name="Balance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <input
                type="text"
                placeholder="🔍 Search transactions..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {showAddForm ? 'Cancel' : '+ Add Transaction'}
            </button>
          </div>

          {/* Add Transaction Form */}
          {showAddForm && (
            <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Description"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Amount"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                step="0.01"
                min="0.01"
                required
              />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                required
              />
              <button
                type="submit"
                className="md:col-span-5 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Add Transaction
              </button>
            </form>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Description</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Category</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium">Amount</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-700">{t.date}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium">{t.description}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {t.category}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {t.amount >= 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDeleteTransaction(t.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTransactions.length === 0 && (
              <p className="text-center text-gray-500 py-8">No transactions found</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-blue-100 text-sm">
          <p>Built with React, Tailwind CSS & Recharts</p>
          <p className="mt-1">© 2026 SmartFinance Dashboard</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
