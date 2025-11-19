// If you are having issues with recharts, try restarting the dev server
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SkillsChart = ({ userSkills, demandedSkills }) => {
    const data = demandedSkills.map(skill => ({
        name: skill.name,
        'Suas Skills': userSkills.includes(skill.name) ? skill.demand : 0,
        'Skills em Demanda': skill.demand,
    }));

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-4">Skills Adquiridas vs. Demandadas</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="name" stroke="#A0AEC0" />
                    <YAxis stroke="#A0AEC0" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#2D3748', border: 'none' }}
                        labelStyle={{ color: '#E2E8F0' }}
                    />
                    <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                    <Bar dataKey="Suas Skills" fill="#4299E1" />
                    <Bar dataKey="Skills em Demanda" fill="#ED8936" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SkillsChart;