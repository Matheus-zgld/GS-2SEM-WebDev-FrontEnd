import SidebarLayout from '../../components/layout/SideBarLayout';
import TaskBoard from '../../components/features/workspace/TaskBoard';
import ARWorkspace from '../../components/features/workspace/ARWorkspace';

function Workspace() {
    const tasks = [{ id: 1, title: 'Resolver dilema ético' }, { id: 2, title: 'Brainstorming VR' }];

    return (
        <SidebarLayout>
            <div className="p-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-white">Ghost Team Workspace</h2>
                <TaskBoard tasks={tasks} />
                <ARWorkspace />
            </div>
        </SidebarLayout>
    );
}

export default Workspace;