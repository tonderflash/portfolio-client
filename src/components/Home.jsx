import ProjectCard from './ProjectCard';

const projects = [
    {
        id: 'matrix-oracle',
        title: 'MatrixOracle',
        description: 'Algoritmo Morton Z-Order para consultas espaciales eficientes en matrices 2D',
        tech: ['Python', 'Bitwise Operations', 'Spatial Indexing'],
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        icon: '🔮'
    },
    {
        id: 'word-flux',
        title: 'WordFlux',
        description: 'Procesador de archivos de texto grandes usando streams y worker threads',
        tech: ['Node.js', 'Streams', 'Worker Threads'],
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        icon: '📚'
    },
    {
        id: 'color-shifter',
        title: 'ColorShifter',
        description: 'Conversión RGB ↔ HSV de alto rendimiento con SIMD en Rust',
        tech: ['Rust', 'SIMD', 'WebAssembly'],
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        icon: '🎨'
    },
    {
        id: 'lang-detector',
        title: 'N-Gram Language Detector',
        description: 'Detección de idiomas usando modelos discriminativos con n-gramas',
        tech: ['Python', 'NLP', 'Machine Learning'],
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        icon: '🌍'
    }
];

export default function Home({ onNavigate }) {
    return (
        <div className="home">
            <header className="hero section">
                <div className="container text-center">
                    <h1 className="fade-in">Portfolio de Proyectos</h1>
                    <p className="fade-in" style={{ animationDelay: '0.1s', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto' }}>
                        Colección de proyectos de alto rendimiento en diferentes lenguajes y paradigmas
                    </p>
                </div>
            </header>

            <section className="projects section">
                <div className="container">
                    <div className="grid grid-2">
                        {projects.map((project, index) => (
                            <div
                                key={project.id}
                                className="fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <ProjectCard
                                    project={project}
                                    onClick={() => onNavigate(project.id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="section" style={{ textAlign: 'center', paddingTop: 0 }}>
                <div className="container">
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Desarrollado con React + Vite | Desplegado con AWS Amplify
                    </p>
                </div>
            </footer>
        </div>
    );
}
