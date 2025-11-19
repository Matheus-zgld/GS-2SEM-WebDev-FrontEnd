import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import SidebarLayout from '../../components/layout/SideBarLayout.jsx';
import { db } from '../../lib/firebase.js';
import { collection, getDocs } from 'firebase/firestore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Dados estáticos para micro-projetos (poderiam vir do DB também)
const microProjectsData = [
    { id: 'micro-1', titulo: 'Refatorar Componente React', type: 'Micro-Projeto' },
    { id: 'micro-2', titulo: 'Escrever Artigo Técnico', type: 'Micro-Projeto' },
    { id: 'micro-3', titulo: 'Criar um Hook Customizado', type: 'Micro-Projeto' },
];

function Planner() {
    const [tasks, setTasks] = useState({});
    const [columns, setColumns] = useState(null);
    const [columnOrder, setColumnOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('week'); // 'week' or 'month'
    const [currentDate, setCurrentDate] = useState(new Date());
    const [hoveredTask, setHoveredTask] = useState(null);

    const getWeekId = (date) => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return `${d.getUTCFullYear()}-W${weekNo}`;
    };

    // Carrega todas as tarefas (desafios e micro-projetos) uma única vez
    useEffect(() => {
        const fetchAllTasks = async () => {
            setLoading(true);
            try {
                // Fetch challenges
                const challengesSnapshot = await getDocs(collection(db, 'challenges'));
                const challenges = challengesSnapshot.docs.map(doc => ({
                    id: `challenge-${doc.id}`,
                    titulo: doc.data().titulo || 'Desafio sem título',
                    type: 'Desafio'
                }));
    
                // Combine with micro-projects
                const allTasks = [...challenges, ...microProjectsData];
    
                const tasksObject = allTasks.reduce((acc, task) => {
                    acc[task.id] = { id: task.id, content: task.titulo, type: task.type };
                    return acc;
                }, {});
                setTasks(tasksObject);
            } catch (error) {
                console.error("Erro ao carregar tarefas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllTasks();
    }, []);

    // Carrega o estado da semana atual ou cria um novo
    useEffect(() => {
        if (loading) return; // Só executa depois que as tarefas foram carregadas

        const weekId = getWeekId(currentDate);
        const savedState = localStorage.getItem(`planner_state_${weekId}`);

        if (savedState) {
            const state = JSON.parse(savedState);
            setColumns(state.columns);
            setColumnOrder(state.columnOrder);
        } else {
            // Cria um estado inicial para a nova semana
            const allTaskIds = Object.keys(tasks);
            const initialColumns = {
                'column-1': { id: 'column-1', title: 'Tarefas Disponíveis', taskIds: allTaskIds },
                'column-2': { id: 'column-2', title: 'Segunda', taskIds: [] },
                'column-3': { id: 'column-3', title: 'Terça', taskIds: [] },
                'column-4': { id: 'column-4', title: 'Quarta', taskIds: [] },
                'column-5': { id: 'column-5', title: 'Quinta', taskIds: [] },
                'column-6': { id: 'column-6', title: 'Sexta', taskIds: [] },
            };
            setColumns(initialColumns);
            setColumnOrder(['column-1', 'column-2', 'column-3', 'column-4', 'column-5', 'column-6']);
        }
    }, [currentDate, loading, tasks]);

    const saveData = (newColumns, newColumnOrder) => {
        const weekId = getWeekId(currentDate);
        const newState = { columns: newColumns, columnOrder: newColumnOrder };
        localStorage.setItem(`planner_state_${weekId}`, JSON.stringify(newState));
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

        const start = columns[source.droppableId];
        const finish = columns[destination.droppableId];

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1); newTaskIds.splice(destination.index, 0, draggableId);
            const newColumn = { ...start, taskIds: newTaskIds };
            const newColumns = { ...columns, [newColumn.id]: newColumn };
            setColumns(newColumns);
            saveData(newColumns, columnOrder);
            return;
        }

        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = { ...start, taskIds: startTaskIds };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = { ...finish, taskIds: finishTaskIds };

        const newColumns = { ...columns, [newStart.id]: newStart, [newFinish.id]: newFinish };
        setColumns(newColumns);
        saveData(newColumns, columnOrder);
    };

    const handleNavigation = (direction) => {
        const newDate = new Date(currentDate);
        if (view === 'week') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        } else {
            newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        }
        setCurrentDate(newDate);
    };

    const getWeekTitle = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 4);
        return `${startOfWeek.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - ${endOfWeek.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    };

    const getMonthTitle = () => {
        return currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase();
    };

    const renderWeekView = () => (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {columnOrder.map(columnId => {
                    const column = columns[columnId];
                    const columnTasks = column.taskIds.map(taskId => tasks[taskId]);

                    return (
                        <div key={column.id} className="bg-gray-950 border border-gray-800 p-4 rounded-lg flex flex-col">
                            <h2 className="font-bold text-lg mb-4 text-white">{column.title}</h2>
                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`min-h-[200px] rounded-md transition-colors duration-300 flex-grow ${snapshot.isDraggingOver ? 'bg-gray-800' : 'bg-gray-900'}`}
                                    >
                                        {columnTasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`p-3 mb-2 rounded-md shadow-md border-l-4 ${snapshot.isDragging ? 'bg-indigo-700 border-indigo-400' : 'bg-gray-800 border-gray-600'}`}
                                                    >
                                                        <p className="font-semibold text-gray-200">{task.content}</p>
                                                        <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${task.type === 'Desafio' ? 'bg-purple-600/30 text-purple-300' : 'bg-green-600/30 text-green-300'}`}>
                                                            {task.type}
                                                        </span>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );

    const renderMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
        const totalDays = lastDayOfMonth.getDate();

        const startDayIndex = (startDayOfWeek === 0) ? 6 : startDayOfWeek - 1; // Ajusta para semana começar na Segunda

        const days = [];
        // Dias do mês anterior
        for (let i = 0; i < startDayIndex; i++) {
            const day = new Date(year, month, i - startDayIndex + 1);
            days.push({ day, isCurrentMonth: false });
        }
        // Dias do mês atual
        for (let i = 1; i <= totalDays; i++) {
            const day = new Date(year, month, i);
            days.push({ day, isCurrentMonth: true });
        }
        // Dias do próximo mês
        const remainingCells = 35 - days.length > 0 ? 35 - days.length : 42 - days.length; // 5 ou 6 semanas
        for (let i = 1; i <= remainingCells; i++) {
            const day = new Date(year, month + 1, i);
            days.push({ day, isCurrentMonth: false });
        }

        const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

        // Mapeia tarefas para datas (simplificado)
        const tasksByDate = {};
        const monthWeeks = [0, 7, 14, 21, 28, 35];
        monthWeeks.forEach(offset => {
            const weekDate = new Date(year, month, 1 + offset);
            const weekId = getWeekId(weekDate);
            const weekStateRaw = localStorage.getItem(`planner_state_${weekId}`);
            if (weekStateRaw) {
                const weekState = JSON.parse(weekStateRaw);
                const startOfWeekForKanban = new Date(weekDate);
                startOfWeekForKanban.setDate(startOfWeekForKanban.getDate() - (startOfWeekForKanban.getDay() || 7) + 1);

                weekState.columnOrder.forEach((colId, colIndex) => {
                    if (colIndex > 0 && colIndex < 7) { // Ignora a coluna de tarefas e próxima semana
                        const dateForColumn = new Date(startOfWeekForKanban);
                        dateForColumn.setDate(dateForColumn.getDate() + colIndex - 1);
                        const dateString = dateForColumn.toISOString().split('T')[0];
                        tasksByDate[dateString] = (tasksByDate[dateString] || []).concat(
                            weekState.columns[colId].taskIds.map(taskId => tasks[taskId])
                        );
                    }
                });
            }
        });

        return (
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                <div className="grid grid-cols-7 gap-px text-center text-xs font-semibold text-gray-400 mb-2">
                    {weekDays.map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-px">
                    {days.map(({ day, isCurrentMonth }, index) => {
                        const dateString = day.toISOString().split('T')[0];
                        const tasksForDay = tasksByDate[dateString] || [];
                        const isToday = new Date().toISOString().split('T')[0] === dateString;

                        return (
                            <div key={index} className={`h-32 p-2 rounded-md flex flex-col ${isCurrentMonth ? 'bg-gray-900' : 'bg-gray-950/50'} ${isToday ? 'border-2 border-indigo-500' : 'border border-gray-800/50'}`}>
                                <span className={`font-bold ${isCurrentMonth ? 'text-white' : 'text-gray-600'} ${isToday ? 'text-indigo-400' : ''}`}>{day.getDate()}</span>
                                <div className="mt-1 space-y-1 overflow-y-auto">
                                    {tasksForDay.map(task => (
                                        <div
                                            key={task.id}
                                            onMouseEnter={() => setHoveredTask(task)}
                                            onMouseLeave={() => setHoveredTask(null)}
                                            className={`text-xs px-1.5 py-0.5 rounded truncate cursor-pointer ${task.type === 'Desafio' ? 'bg-purple-600/50 text-purple-300' : 'bg-green-600/50 text-green-300'}`}
                                        >
                                            {task.content}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {hoveredTask && <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black border border-gray-700 text-white px-4 py-2 rounded-lg shadow-lg z-50">{hoveredTask.content}</div>}
            </div>
        );
    };

    if (loading || !columns) {
        return <SidebarLayout><div className="p-6 text-white">Carregando planner...</div></SidebarLayout>;
    };

    return (
        <SidebarLayout>
            <div className="p-6 min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">🗓️ Planner</h1>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setView('week')} className={`px-4 py-2 rounded-md text-sm font-semibold ${view === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}>Semana</button>
                        <button onClick={() => setView('month')} className={`px-4 py-2 rounded-md text-sm font-semibold ${view === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}>Mês</button>
                    </div>
                </div>

                <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg mb-6 border border-gray-800">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setCurrentDate(new Date())} className="border border-gray-700 px-4 py-2 rounded-md hover:bg-gray-800">Hoje</button>
                        <div className="flex items-center">
                            <button onClick={() => handleNavigation('prev')} className="p-2 rounded-full hover:bg-gray-800"><ChevronLeft size={20} /></button>
                            <button onClick={() => handleNavigation('next')} className="p-2 rounded-full hover:bg-gray-800"><ChevronRight size={20} /></button>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-200">
                            {view === 'week' ? getWeekTitle() : getMonthTitle()}
                        </h2>
                    </div>
                </div>

                {view === 'week' ? renderWeekView() : renderMonthView()}
            </div>
        </SidebarLayout>
    );
}

export default Planner;