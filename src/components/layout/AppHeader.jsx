import { useAuth } from '../../hooks/useAuth';
function AppHeader() {
    const { user, logout } = useAuth();
    return (
        <header className="flex justify-between p-6 bg-gray-100 dark:bg-gray-800">
            <h1>SYNAPSE App</h1>
            <div>
                <span>{user?.email}</span>
                <button onClick={logout} className="ml-4">Logout</button>
            </div>
        </header>
    );
}
export default AppHeader;