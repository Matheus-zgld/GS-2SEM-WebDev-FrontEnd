import { Link } from 'react-router-dom';
function Header() {
    return (
        <header className="flex justify-between p-6">
            <Link to="/" className="text-2xl font-bold">SYNAPSE</Link>
            <nav>
                <Link to="/auth/login" className="mr-4">Login</Link>
                <Link to="/auth/signup">Signup</Link>
            </nav>
        </header>
    );
}
export default Header;