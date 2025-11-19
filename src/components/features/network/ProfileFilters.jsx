function ProfileFilters({ onSearch, onFilter }) {
    const handleSearchChange = (e) => onSearch(e.target.value);
    const handleFilterChange = (e) => onFilter({ [e.target.name]: e.target.value });

    return (
        <div className="flex flex-wrap gap-4">
            <input
                type="text"
                placeholder="Buscar por nome, área ou habilidade..."
                onChange={handleSearchChange}
                className="flex-1 min-w-[200px] p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:border-gray-600 focus:outline-none"
            />
            <select
                name="area"
                onChange={handleFilterChange}
                className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 focus:border-gray-600 focus:outline-none"
            >
                <option value="">Todas as Áreas</option>
                <option value="Desenvolvimento">Desenvolvimento</option>
                <option value="Saúde">Saúde</option>
                <option value="Design">Design</option>
                <option value="TI">TI</option>
                <option value="Educação">Educação</option>
                <option value="Sustentabilidade">Sustentabilidade</option>
            </select>
            <select
                name="cidade"
                onChange={handleFilterChange}
                className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 focus:border-gray-600 focus:outline-none"
            >
                <option value="">Todas as Cidades</option>
                <option value="São Paulo">São Paulo/SP</option>
                <option value="Rio de Janeiro">Rio de Janeiro/RJ</option>
                <option value="Belo Horizonte">Belo Horizonte/MG</option>
                <option value="Porto Alegre">Porto Alegre/RS</option>
                <option value="Curitiba">Curitiba/PR</option>
                <option value="Brasília">Brasília/DF</option>
            </select>
            <select
                name="tecnologia"
                onChange={handleFilterChange}
                className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 focus:border-gray-600 focus:outline-none"
            >
                <option value="">Todas as Tecnologias</option>
                <option value="React">React</option>
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="SQL">SQL</option>
                <option value="Node.js">Node.js</option>
                <option value="Kubernetes">Kubernetes</option>
            </select>
        </div>
    );
}

export default ProfileFilters;