import DashboardPage from "./pages/DashboardPage";
import { AuthCard } from "./components/auth/AuthCard";
import { useAuth } from "./hooks/useAuth";
import { authService } from "./services/authService";

export default function App() {
  const { user, isAuthLoading } = useAuth();

  async function handleSignOut() {
    await authService.signOut();
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthCard />;
  }

  return <DashboardPage userId={user.uid} onSignOut={handleSignOut} />;
}
