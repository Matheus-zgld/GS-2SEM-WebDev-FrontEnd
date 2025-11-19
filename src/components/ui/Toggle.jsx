function Toggle({ isOn, onToggle }) {
    return (
        <button onClick={onToggle} className={`w-12 h-6 rounded-full ${isOn ? 'bg-blue-500' : 'bg-gray-300'} relative`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${isOn ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
        </button>
    );
}
export default Toggle;