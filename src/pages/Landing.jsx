import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, BrainCircuit, Users, Target, ShieldCheck, Zap, Globe,
    HeartHandshake, FileText, BarChart, Settings, Search, Menu, X,
    CheckCircle, Package, Wind, Brain
} from 'lucide-react';

import logo from '../assets/SYNAPSE_semtexto.png';

const FeatureIcon = ({ icon: Icon, color }) => (
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
    </div>
);

// Componente de Card de Funcionalidade
const FeatureCard = ({ icon: Icon, title, description, tags }) => (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 flex flex-col gap-4 transform transition-all duration-300 hover:bg-gray-900 hover:border-gray-700">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-800 border border-gray-700 rounded-lg">
                <Icon className="w-5 h-5 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <p className="text-gray-400 text-base">{description}</p>
        <div className="flex flex-wrap gap-2 mt-auto pt-4">
            {tags.map((tag) => (
                <span key={tag} className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full border border-gray-700">
                    {tag}
                </span>
            ))}
        </div>
    </div>
);

// Componente de Card de Pilar
const PillarCard = ({ icon: Icon, title, description }) => (
    <div className="bg-gray-950/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02] hover:border-gray-700">
        <div className="flex items-center gap-4">
            <Icon className="w-8 h-8 text-gray-300" />
            <h3 className="text-2xl font-semibold text-white">{title}</h3>
        </div>
        <p className="mt-4 text-lg text-gray-400">{description}</p>
    </div>
);

// Componente de Card Revolucionário
const RevolutionCard = ({ icon: Icon, title, description }) => (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 transform transition-all duration-300 hover:bg-gray-900 hover:border-gray-700">
        <Icon className="w-8 h-8 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-base">{description}</p>
    </div>
);

// Componente de Card de Impacto
const ImpactCard = ({ ods, title, description }) => (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 flex flex-col transform transition-all duration-300 hover:bg-gray-900 hover:border-gray-700 hover:scale-105">
        <span className="text-sm font-bold text-gray-400">{ods}</span>
        <h3 className="text-xl font-semibold text-white mt-2 mb-3">{title}</h3>
        <p className="text-gray-400 text-base">{description}</p>
    </div>
);


// --- Componentes de Seção ---

// Componente Header
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'O Problema', href: '#problema' },
        { name: 'A Solução', href: '#solucao' },
        { name: 'Funcionalidades', href: '#funcionalidades' },
        { name: 'Impacto', href: '#impacto' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-lg border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-9 h-9"
                        />
                        <a href="#"><span className="text-2xl font-bold text-white">SYNAPSE</span></a>
                    </div>

                    {/* Navegação Desktop */}
                    <nav className="hidden md:flex md:items-center md:gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-base font-medium text-gray-300 hover:text-white transition-colors duration-200"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Botão CTA Desktop */}
                    <div className="hidden md:flex items-center gap-4"> {/* Adicionado gap-4 */}
                        <Link
                            to="/auth/login"
                            className="relative cursor-pointer py-3 px-8 text-center font-semibold inline-flex justify-center text-sm uppercase text-white rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline focus:outline-2 focus:outline-white focus:outline-offset-4 overflow-hidden"
                        >
                            <span className="relative z-20">Login</span>

                            <span
                                className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out"
                            ></span>

                            <span
                                className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0"
                            ></span>
                            <span
                                className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0"
                            ></span>
                            <span
                                className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0"
                            ></span>
                            <span
                                className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0"
                            ></span>
                        </Link>
                        <Link
                            to="/auth/signup"
                            className="relative cursor-pointer py-3 px-8 text-center font-semibold inline-flex justify-center text-sm uppercase text-white rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline focus:outline-2 focus:outline-white focus:outline-offset-4 overflow-hidden"
                        >
                            <span className="relative z-20">Cadastro</span>

                            <span
                                className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out"
                            ></span>

                            <span
                                className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0"
                            ></span>
                            <span
                                className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0"
                            ></span>
                            <span
                                className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0"
                            ></span>
                            <span
                                className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0"
                            ></span>
                        </Link>
                    </div>

                    {/* Botão Menu Mobile */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Mobile */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-gray-900 border-t border-gray-800 shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                            >
                                {link.name}
                            </a>
                        ))}
                        {/* Link Login Mobile */}
                        <Link
                            to="/auth/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-900 bg-white hover:bg-gray-200 transition-colors duration-200"
                        >
                            Login
                        </Link>
                        
                        {/* Link Cadastro Mobile */}
                        <Link
                            to="/auth/signup"
                            onClick={() => setIsMenuOpen(false)}
                            className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-900 bg-white hover:bg-gray-200 transition-colors duration-200"
                        >
                            Cadastro
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

// Componente Hero
const Hero = () => (
    <section className="relative w-full overflow-hidden bg-black">
        {/* Fundo com gradiente sutil */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/4 w-[48rem] h-[48rem] bg-white-700/15 rounded-full filter blur-[250px] animate-pulse"></div>
            <div className="absolute bottom-120 right-1/4 w-[48rem] h-[48rem] bg-purple-700/15 rounded-full filter blur-[250px] animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-24 md:py-32 lg:py-40 z-10">
            <div className="max-w-3xl mx-auto text-center">
                {/* Badge */}
                <span className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-300 bg-gray-900/70 rounded-full border border-gray-800">
                    <Zap className="w-4 h-4 text-gray-300" />
                    O Futuro do Trabalho é Humano
                </span>

                {/* Título Principal */}
                <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400">
                    A Ponte Pós-Automação
                </h1>

                {/* Slogan */}
                <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
                    Conectando Potencial Humano a Desafios Reais.
                </p>

                {/* Pitch */}
                <p className="mt-8 text-lg text-gray-400">
                    O SYNAPSE inverte o papel da IA: em vez de substituir humanos, a usamos para descobrir, validar e amplificar as habilidades exclusivamente humanas que a automação não pode tocar.
                </p>

                {/* Botões CTA */}
                <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                    <a
                        href="#cta"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-gray-900 bg-white rounded-lg shadow-lg shadow-white/5 hover:bg-gray-200 hover:shadow-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300 transform hover:scale-105"
                    >
                        Descubra seu Potencial
                        <ArrowRight className="w-5 h-5" />
                    </a>
                    <a
                        href="#cta"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-gray-300 bg-transparent border border-gray-700 rounded-lg hover:bg-gray-900 hover:border-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 transition-all duration-300 transform hover:scale-105"
                    >
                        Publique um Desafio
                        <Package className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
    </section>
);

// Seção Problema
const Problem = () => (
    <section id="problema" className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                    A Crise da Dupla Face
                </h2>
                <p className="mt-6 text-lg text-gray-400">
                    A automação e a IA estão criando uma crise de dupla face, um abismo entre o potencial humano inexplorado e as novas demandas complexas do mercado.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Card Pessoas */}
                <div className="bg-gray-950 border border-gray-800 rounded-2xl p-8 lg:p-10">
                    <div className="flex items-center gap-4">
                        <Users className="w-10 h-10 text-red-400" />
                        <h3 className="text-3xl font-semibold text-white">Para as Pessoas</h3>
                    </div>
                    <p className="mt-5 text-xl font-medium text-red-300">
                        O medo da irrelevância.
                    </p>
                    <p className="mt-3 text-base text-gray-400">
                        O modelo de "aprender uma profissão e exercê-la por 40 anos" está morto. A requalificação tradicional é lenta, reativa e não foca no potencial único de cada indivíduo.
                    </p>
                </div>

                {/* Card Empresas */}
                <div className="bg-gray-950 border border-gray-800 rounded-2xl p-8 lg:p-10">
                    <div className="flex items-center gap-4">
                        <Target className="w-10 h-10 text-blue-400" />
                        <h3 className="text-3xl font-semibold text-white">Para as Empresas</h3>
                    </div>
                    <p className="mt-5 text-xl font-medium text-blue-300">
                        A escassez de habilidades humanas.
                    </p>
                    <p className="mt-3 text-base text-gray-400">
                        Empresas não conseguem encontrar talentos com criatividade, pensamento crítico, liderança e inteligência emocional para resolver os problemas complexos de hoje.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

// Seção Solução
const Solution = () => (
    <section id="solucao" className="py-20 md:py-32 bg-black overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8">

            {/* Camada de Conteúdo (z-10) */}
            <div className="relative max-w-3xl mx-auto text-center mb-16 z-10">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                    O Ecossistema SYNAPSE
                </h2>
                <p className="mt-6 text-lg text-gray-400">
                    Funciona em três pilares interconectados para mapear potencial latente e conectá-lo a desafios reais.
                </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
                <PillarCard
                    icon={Brain}
                    title="1. Descoberta"
                    description="Através de um diálogo profundo com uma IA Socrática, mapeamos *como* a pessoa pensa, e não *o que* ela sabe."
                />
                <PillarCard
                    icon={FileText}
                    title="2. Mapeamento"
                    description="Não geramos um currículo, mas um 'Arquétipo de Resolução de Problemas' (ex: 'Conector de Ideias Improváveis')."
                />
                <PillarCard
                    icon={Globe}
                    title="3. Conexão"
                    description="Empresas publicam 'Desafios'. A IA monta 'Equipes-Fantasma' sob demanda, combinando os Arquétipos perfeitos."
                />
            </div>
        </div>
    </section>
);

// Seção Revolucionário
const Revolutionary = () => (
    <section id="revolucionario" className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                    Por que o SYNAPSE é Revolucionário?
                </h2>
                <p className="mt-6 text-lg text-gray-400">
                    Atacamos a causa raiz do problema, não o sintoma, focando em potencial e não em credenciais.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <RevolutionCard
                    icon={CheckCircle}
                    title="Potencial sobre Credencial"
                    description="A IA Socrática ignora diplomas e CEPs. Foca 100% no potencial, criando um recrutamento ético e inclusivo."
                />
                <RevolutionCard
                    icon={Zap}
                    title="IA como Amplificadora"
                    description="A IA não é sua concorrente; é sua 'agente de talentos' 24/7, encontrando seu valor único."
                />
                <RevolutionCard
                    icon={Wind}
                    title="Inovação como Serviço"
                    description="Empresas acessam times de elite montados sob medida, prontos para resolver desafios em dias."
                />
                <RevolutionCard
                    icon={BarChart}
                    title="Carreira Antifrágil"
                    description="Você não tem um 'emprego', tem um 'portfólio de impacto'. Seu Arquétipo se aplica a dezenas de indústrias."
                />
            </div>
        </div>
    </section>
);

// Seção Funcionalidades
const Features = () => (
    <section id="funcionalidades" className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                    Funcionalidades-Chave
                </h2>
                <p className="mt-6 text-lg text-gray-400">
                    A plataforma-mãe que unifica todas as soluções que o futuro do trabalho exige.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FeatureCard
                    icon={BrainCircuit}
                    title="Módulo 1: O 'Potential Hub'"
                    description="O coração da plataforma. Usa a IA Socrática gamificada para descoberta de potencial e identificação de 'gaps' no seu arquétipo."
                    tags={['GS #1 - Upskilling IA', 'GS #6 - Gamificação']}
                />
                <FeatureCard
                    icon={Globe}
                    title="Módulo 2: O 'Challenge Marketplace'"
                    description="Onde empresas e ONGs publicam desafios alinhados aos ODS. A remuneração é via smart contracts, garantindo meritocracia."
                    tags={['GS #5 - Impacto Social', 'GS #10 - Meritocracia']}
                />
                <FeatureCard
                    icon={Users}
                    title="Módulo 3: O 'Ghost Team Workspace'"
                    description="O ambiente de trabalho digital das 'Equipes-Fantasma', com plugins para salas de colaboração imersivas em VR/AR."
                    tags={['GS #8 - Colaboração Híbrida', 'GS #2 - Ambientes VR/AR']}
                />
                <FeatureCard
                    icon={ShieldCheck}
                    title="Módulo 4: O 'Ethical Core'"
                    description="Módulo de governança. Algoritmo 'cego' a vieses, design universal (PCDs) e monitoramento de saúde mental para evitar burnout."
                    tags={['GS #4 - Recrutamento Ético', 'GS #9 - Acessibilidade', 'GS #3 - Bem-Estar']}
                />
                <FeatureCard
                    icon={Settings}
                    title="Módulo 5: O 'Gig Economy OS'"
                    description="A infraestrutura legal e financeira. Cuida de contratos internacionais, pagamentos em múltiplas moedas e gestão de portfólio."
                    tags={['GS #7 - Gig Economy']}
                />
            </div>
        </div>
    </section>
);

// Seção Público-Alvo
const Audience = () => (
    <section id="publico" className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                    Para Quem é o SYNAPSE?
                </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div className="bg-gray-950/50 border border-gray-800 rounded-2xl p-8 lg:p-10">
                    <h3 className="text-3xl font-semibold text-white">Provedores de Potencial</h3>
                    <p className="mt-3 text-lg text-gray-400 mb-4">(Usuários)</p>
                    <ul className="space-y-2">
                        {[
                            "Profissionais em transição de carreira",
                            "Recém-formados com alto potencial",
                            "Jovens aprendizes e especialistas de nicho",
                            "Qualquer pessoa subutilizada em seu trabalho atual"
                        ].map(item => (
                            <li key={item} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                <span className="text-gray-300">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-gray-950/50 border border-gray-800 rounded-2xl p-8 lg:p-10">
                    <h3 className="text-3xl font-semibold text-white">Buscadores de Solução</h3>
                    <p className="mt-3 text-lg text-gray-400 mb-4">(Clientes)</p>
                    <ul className="space-y-2">
                        {[
                            "Empresas de inovação e P&D",
                            "ONGs globais e governos",
                            "Startups que precisam de agilidade",
                            "Quem não pode esperar 6 meses por um processo seletivo"
                        ].map(item => (
                            <li key={item} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                <span className="text-gray-300">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </section>
);

// Seção Impacto ODS
const Impact = () => (
    <section id="impacto" className="py-20 md:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
                    Impacto e Alinhamento ODS
                </h2>
                <p className="mt-6 text-lg text-gray-400">
                    Mais que uma plataforma, um motor de mudança social alinhado aos Objetivos de Desenvolvimento Sustentável da ONU.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ImpactCard
                    ods="ODS 4"
                    title="Educação de Qualidade"
                    description="Muda o foco do 'diploma' para a 'aprendizagem contínua' e descoberta real de potencial."
                />
                <ImpactCard
                    ods="ODS 8"
                    title="Trabalho Decente"
                    description="Cria trabalho significativo, com propósito e remuneração justa, independente de localização."
                />
                <ImpactCard
                    ods="ODS 9"
                    title="Inovação e Infraestrutura"
                    description="É o motor de inovação para a indústria, fornecendo soluções criativas e ágeis sob demanda."
                />
                <ImpactCard
                    ods="ODS 10"
                    title="Redução de Desigualdades"
                    description="Dá acesso ao mercado global para pessoas hoje invisíveis, focando em potencial, não em credencial."
                />
            </div>
        </div>
    </section>
);

// Seção CTA
const CTA = () => (
    <section id="cta" className="py-20 md:py-32 bg-black">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
            <div className="relative bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-12 md:p-16">
                {/* Camada de Fundo (z-0) */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-700/10 rounded-full filter blur-2xl"></div>
                    <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-purple-700/10 rounded-full filter blur-3xl"></div>
                </div>

                {/* Camada de Conteúdo (z-10) */}
                <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                    {/* CTA Pessoas */}
                    <div>
                        <h3 className="text-3xl font-bold text-white">Para Pessoas</h3>
                        <p className="mt-4 text-lg text-gray-300">
                            "A automação é um fato. Sua irrelevância é uma escolha. Descubra seu Arquétipo de Potencial."
                        </p>
                        <a
                            href="#"
                            className="inline-flex items-center justify-center gap-2 mt-8 px-6 py-3 text-base font-semibold text-gray-900 bg-white rounded-lg shadow-lg shadow-white/5 hover:bg-gray-200 hover:shadow-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300 transform hover:scale-105"
                        >
                            Cadastre-se para a Descoberta
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>

                    {/* CTA Empresas */}
                    <div>
                        <h3 className="text-3xl font-bold text-white">Para Empresas</h3>
                        <p className="mt-4 text-lg text-gray-300">
                            "Pare de procurar currículos. Comece a encontrar soluções."
                        </p>
                        <a
                            href="#"
                            className="inline-flex items-center justify-center gap-2 mt-8 px-6 py-3 text-base font-semibold text-gray-300 bg-transparent border border-gray-700 rounded-lg shadow-lg hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300 transform hover:scale-105"
                        >
                            Publique seu Primeiro Desafio
                            <Package className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// Footer
const Footer = () => (
    <footer className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-9 h-9"
                    />
                    <span className="text-xl font-bold text-white">SYNAPSE</span>
                </div>
                <p className="text-base text-gray-500">
                    © {new Date().getFullYear()} SYNAPSE. Todos os direitos reservados.
                </p>
                <div className="flex gap-6">
                    <a href="#" className="text-gray-500 hover:text-gray-400 transition-colors">
                        <span className="sr-only">Twitter</span>
                        {/* Ícone placeholder */}
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-400 transition-colors">
                        <span className="sr-only">LinkedIn</span>
                        {/* Ícone placeholder */}
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </footer>
);


// --- Componente Principal da Página ---

// Este era o seu 'App()', renomeei para 'Landing()' para ser a exportação padrão
// deste arquivo.
export default function Landing() {
    return (
        <div
            className="bg-black text-gray-200 font-sans antialiased"
            style={{
                // Este 'style' inline é o que cria o efeito de grid e aurora sutil
                // inspirado no Linear.
                backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255, 255, 255, 0.02), transparent),
          linear-gradient(rgba(255, 255, 255, 0.01) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px)
        `,
                backgroundSize: 'auto, 70px 70px, 70px 70px',
                backgroundAttachment: 'fixed'
            }}
        >
            <Header />
            <main>
                <Hero />
                <Problem />
                <Solution />
                <Revolutionary />
                <Features />
                <Audience />
                <Impact />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}