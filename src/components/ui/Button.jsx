function Button({ children, onClick, variant = 'primary' }) {
    const styles = variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black';
    return <button className={`${styles} px-4 py-2 rounded hover:opacity-80`} onClick={onClick}>{children}</button>;
}
export default Button;