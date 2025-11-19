function TaskBoard({ tasks }) {
    return (
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4">Quadro de Tarefas</h3>
            {tasks.map(task => (
                <div key={task.id} className="bg-gray-900 border border-gray-700 p-4 rounded-lg mb-2 text-gray-300 hover:bg-gray-800 transition-colors">
                    {task.title}
                </div>
            ))}
        </div>
    );
}
export default TaskBoard;