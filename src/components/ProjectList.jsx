import { useState } from 'react';
import ColorShifterDemo from './demos/ColorShifterDemo';
import LanguageDetectorDemo from './demos/LanguageDetectorDemo';
import WordFluxDemo from './demos/WordFluxDemo';
import MatrixOracleDemo from './demos/MatrixOracleDemo';

const projects = [
    {
        id: 'color-shifter',
        name: 'ColorShifter',
        icon: '🎨',
        description: 'Conversión RGB ↔ HSV de alto rendimiento con SIMD',
        tech: ['Rust', 'SIMD', 'AWS Lambda'],
        apiInfo: {
            endpoint: 'POST /color-convert',
            features: [
                'Conversión RGB a HSV',
                'Conversión HSV a RGB',
                'Procesamiento paralelo con worker threads',
                'Optimización SIMD (AVX2/NEON)'
            ]
        }
    },
    {
        id: 'lang-detector',
        name: 'Language Detector',
        icon: '🌍',
        description: 'Detección de idiomas con n-gramas (ES/EN/Spanglish)',
        tech: ['Python', 'NLP', 'AWS Lambda'],
        apiInfo: {
            endpoint: 'POST /detect',
            features: [
                'Detección de Español e Inglés',
                'Identificación de Spanglish',
                'Análisis de confianza (0-100%)',
                'Proporciones por idioma'
            ]
        }
    },
    {
        id: 'word-flux',
        name: 'WordFlux',
        icon: '📚',
        description: 'Procesador de texto con streams y worker threads',
        tech: ['Node.js', 'Streams', 'Worker Threads', 'AWS Lambda'],
        apiInfo: {
            endpoint: 'POST /count',
            features: [
                'Conteo de palabras en archivos',
                'Análisis de texto directo',
                'Procesamiento paralelo con worker threads',
                'Top N palabras más frecuentes'
            ]
        }
    },
    {
        id: 'matrix-oracle',
        name: 'Matrix Oracle',
        icon: '🔮',
        description: 'Análisis matemático: descubriendo el patrón de Morton en una matriz hexadecimal',
        tech: ['Python', 'Análisis Matemático', 'Bitwise Operations', 'Morton Code'],
        apiInfo: {
            endpoint: 'N/A - Análisis de investigación',
            features: [
                'Análisis de patrones en matrices hexadecimales',
                'Descubrimiento de fórmula matemática pura',
                'Implementación sin condicionales (branchless)',
                'Relación con curvas Z-order/Morton'
            ]
        }
    }
];

export default function ProjectList() {
    const [expandedProject, setExpandedProject] = useState(null);

    const toggleProject = (projectId) => {
        setExpandedProject(expandedProject === projectId ? null : projectId);
    };

    const renderDemo = (projectId) => {
        switch (projectId) {
            case 'color-shifter':
                return <ColorShifterDemo />;
            case 'lang-detector':
                return <LanguageDetectorDemo />;
            case 'word-flux':
                return <WordFluxDemo />;
            case 'matrix-oracle':
                return <MatrixOracleDemo />;
            default:
                return null;
        }
    };

    return (
        <div className="project-list">
            {projects.map((project) => {
                const isExpanded = expandedProject === project.id;

                return (
                    <div key={project.id} className="project-item">
                        {/* Header */}
                        <button
                            className="project-header"
                            onClick={() => toggleProject(project.id)}
                            aria-expanded={isExpanded}
                        >
                            <div className="project-header-content">
                                <span className="project-icon">{project.icon}</span>
                                <div className="project-info">
                                    <h3 className="project-name">{project.name}</h3>
                                    <p className="project-description">{project.description}</p>
                                </div>
                            </div>
                            <span className={`dropdown-arrow ${isExpanded ? 'expanded' : ''}`}>
                                ▼
                            </span>
                        </button>

                        {/* Dropdown Content */}
                        {isExpanded && (
                            <div className="project-content">
                                {/* API Info - Only show if not matrix-oracle */}
                                {project.id !== 'matrix-oracle' && (
                                    <div className="api-info-section">
                                        <h4>📡 API Information</h4>
                                        <div className="api-endpoint">
                                            <code>{project.apiInfo.endpoint}</code>
                                        </div>

                                        <div className="tech-stack">
                                            {project.tech.map((tech) => (
                                                <span key={tech} className="badge">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="features-list">
                                            <h5>Features:</h5>
                                            <ul>
                                                {project.apiInfo.features.map((feature, idx) => (
                                                    <li key={idx}>{feature}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Tech Stack for matrix-oracle */}
                                {project.id === 'matrix-oracle' && (
                                    <div className="api-info-section">
                                        <h4>🔬 Investigación y Análisis</h4>
                                        <div className="tech-stack">
                                            {project.tech.map((tech) => (
                                                <span key={tech} className="badge">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="features-list">
                                            <h5>Características del Análisis:</h5>
                                            <ul>
                                                {project.apiInfo.features.map((feature, idx) => (
                                                    <li key={idx}>{feature}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Demo Section */}
                                <div className="demo-section">
                                    <h4>{project.id === 'matrix-oracle' ? '📖 El Viaje del Descubrimiento' : '🧪 Try it out'}</h4>
                                    {renderDemo(project.id)}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
