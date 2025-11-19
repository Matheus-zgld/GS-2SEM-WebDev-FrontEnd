import { useState } from 'react';
// If you are having issues with react-beautiful-dnd, try restarting the dev server
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import SidebarLayout from '../../components/layout/SideBarLayout';

const initialData = {
    tasks: {
        'task-1': { id: 'task-1', content: 'Módulo de React' },
        'task-2': { id: 'task-2', content: 'Sessão de Mentoria' },
        'task-3': { id: 'task-3', content: 'Módulo de Node.js' },
        'task-4': { id: 'task-4', content: 'Módulo de Python' },
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'Tarefas',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
        },
        'column-2': {
            id: 'column-2',
            title: 'Segunda',
            taskIds: [],
        },
        'column-3': {
            id: 'column-3',
            title: 'Terça',
            taskIds: [],
        },
        'column-4': {
            id: 'column-4',
            title: 'Quarta',
            taskIds: [],
        },
        'column-5': {
            id: 'column-5',
            title: 'Quinta',
            taskIds: [],
        },
        'column-6': {
            id: 'column-6',
            title: 'Sexta',
            taskIds: [],
        },
    },
    columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5', 'column-6'],
};

function Planner() {
    const [data, setData] = useState(initialData);

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start = data.columns[source.droppableId];
        const finish = data.columns[destination.droppableId];

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            };

            const newData = {
                ...data,
                columns: {
                    ...data.columns,
                    [newColumn.id]: newColumn,
                },
            };

            setData(newData);
            return;
        }

        // Moving from one list to another
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
        };

        const newData = {
            ...data,
            columns: {
                ...data.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };
        setData(newData);
    };

    return (
        <SidebarLayout>
            <div className="p-6 min-h-screen bg-gray-900 text-white">
                <h1 className="text-3xl font-bold mb-8">Planner Semanal</h1>
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        {data.columnOrder.map(columnId => {
                            const column = data.columns[columnId];
                            const tasks = column.taskIds.map(taskId => data.tasks[taskId]);

                            return (
                                <div key={column.id} className="bg-gray-800 p-4 rounded-lg">
                                    <h2 className="font-bold text-lg mb-4">{column.title}</h2>
                                    <Droppable droppableId={column.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`min-h-[100px] ${snapshot.isDraggingOver ? 'bg-gray-700' : ''}`}
                                            >
                                                {tasks.map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`p-2 mb-2 rounded-md ${snapshot.isDragging ? 'bg-purple-600' : 'bg-gray-700'}`}
                                                            >
                                                                {task.content}
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
            </div>
        </SidebarLayout>
    );
}

export default Planner;