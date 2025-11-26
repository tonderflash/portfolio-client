import { useState } from 'react';
import { TechnicalDetail } from '../TechnicalDetail';
import './MatrixOracleDemo.css';

const PHASES = [
    {
        id: 'fase-0',
        title: 'Fase 0: Observación Inicial',
        icon: '🔍',
        content: {
            problema: 'Una matriz 32×16 de valores hexadecimales (0x00 a 0x1f)',
            pregunta: '¿Por qué hex? ¿Qué patrón podría ser más fácil de ver en hex que en decimal?',
            insight: 'Las operaciones bitwise (AND, OR, XOR, shifts) se visualizan mejor en hex porque cada dígito hex representa exactamente 4 bits.',
            decision: 'Sospechar que la solución involucra operaciones bitwise.'
        }
    },
    {
        id: 'fase-1',
        title: 'Fase 1: Elección de Metodología',
        icon: '🛠️',
        content: {
            opciones: [
                { name: 'Análisis Manual', pro: 'Simple', contra: '512 valores, muy tedioso', descartado: true },
                { name: 'Excel/Spreadsheet', pro: 'Bueno para visualizar', contra: 'Operaciones bitwise incómodas', descartado: true },
                { name: 'Python', pro: 'Excelente soporte bitwise (^, &, |, <<, >>)', pro2: 'Fácil parsear datos hex', pro3: 'Prueba rápida de hipótesis', descartado: false }
            ],
            decision: 'Usar Python para el análisis.'
        }
    },
    {
        id: 'fase-2',
        title: 'Fase 2: Hipótesis 1 - XOR Directo',
        icon: '💡',
        content: {
            hipotesis: 'valor(row, col) = row XOR col',
            razonamiento: 'XOR es fundamental en muchos patrones matemáticos. La famosa "tabla de nim" usa XOR.',
            prueba: [
                { pos: '(0,0)', real: 1, hipotesis: '0 XOR 0 = 0', coincide: false },
                { pos: '(0,1)', real: 0, hipotesis: '0 XOR 1 = 1', coincide: false },
                { pos: '(1,0)', real: 5, hipotesis: '1 XOR 0 = 1', coincide: false }
            ],
            conclusion: 'XOR probablemente está involucrado, pero no directamente. Necesito encontrar qué transformación se aplica antes del XOR.'
        }
    },
    {
        id: 'fase-3',
        title: 'Fase 3: Hipótesis 2 - Función Separable',
        icon: '🧩',
        content: {
            hipotesis: 'valor(row, col) = f(row) XOR g(col)',
            razonamiento: 'Si XOR simple no funciona, pero sospecho que XOR está involucrado, quizás la fórmula tiene esta forma donde f y g son funciones desconocidas.',
            extraccion: 'Tomando la primera columna (col=0): f(0)=1, f(1)=5, f(2)=1, f(3)=5, f(4)=9...',
            patron: '¡Hay un patrón claro! Los valores se repiten en grupos.',
            verificacion: [
                { pos: '(1,1)', calculado: 'f(1) XOR g(1) = 5 XOR 1 = 4', real: 4, coincide: true },
                { pos: '(2,3)', calculado: 'f(2) XOR g(3) = 1 XOR 3 = 2', real: 2, coincide: true }
            ],
            conclusion: 'La hipótesis f(row) XOR g(col) es CORRECTA. Ahora necesito encontrar las fórmulas para f y g.'
        }
    },
    {
        id: 'fase-4',
        title: 'Fase 4: Análisis Binario',
        icon: '🔬',
        content: {
            enfoque: 'Visualizar f(row) y g(col) en formato binario para detectar cómo se transforman los bits.',
            observaciones: [
                'El bit 0 de f(row) SIEMPRE es 1',
                'El bit 2 de f(row) = bit 0 de row',
                'El bit 3 de f(row) = bit 2 de row',
                'El bit 4 de f(row) = bit 4 de row'
            ],
            patron: 'Los bits de row se "esparcen" hacia posiciones pares, y se añade un 1 en la posición 0.',
            formula: 'f(row) = 1 | (row_bit0 << 2) | (row_bit2 << 3) | (row_bit4 << 4)'
        }
    },
    {
        id: 'fase-5',
        title: 'Fase 5: Reconocimiento del Patrón',
        icon: '🎯',
        content: {
            momento: 'MOMENTO EUREKA',
            reconocimiento: 'Al ver cómo los bits se "esparcen" de una manera específica, reconozco este patrón: es relacionado con el CÓDIGO DE MORTON (Morton Code / Z-Order Curve).',
            que_es: 'El código de Morton es una técnica que "intercala" los bits de dos coordenadas para crear un índice unidimensional.',
            aplicaciones: [
                'Gráficos por computadora (texturas, quadtrees)',
                'Bases de datos espaciales (indexación geográfica)',
                'Sistemas de caché (localidad espacial)'
            ]
        }
    },
    {
        id: 'fase-6',
        title: 'Fase 6: Fórmula Final',
        icon: '✨',
        content: {
            formula: 'valor(row, col) = f(row) XOR g(col) XOR extra(row, col)',
            componentes: {
                f: 'f(row) = 1 | spread_bits(row) << 2',
                g: 'g(col) = spread_bits(col)',
                extra: 'Término de interacción cuando ciertos bits están activos'
            },
            implementacion: 'Usando "magic numbers" para esparcir bits en paralelo sin condicionales.',
            precision: '100% precisión verificada en los 512 valores de la matriz.'
        }
    }
];

const PROPERTIES = [
    {
        title: 'Estructura Casi Separable',
        description: 'valor(row, col) ≈ f(row) XOR g(col), pero con un término de interacción',
        complexity: 'O(1) - tiempo constante'
    },
    {
        title: 'No Simetría',
        description: 'valor(row, col) ≠ valor(col, row) en general',
        example: 'valor(1, 0) = 5, pero valor(0, 1) = 0'
    },
    {
        title: 'Periodicidad en Potencias de 2',
        description: 'f(row) repite parcialmente cada 8 filas',
        pattern: 'Patrón fractal similar a las curvas de Morton'
    },
    {
        title: 'Relación con Curvas de Morton',
        description: 'Similar a las curvas de llenado de espacio',
        uses: 'Texturas en GPUs, bases de datos geoespaciales, quadtrees'
    },
    {
        title: 'Extensibilidad Infinita',
        description: 'La fórmula funciona para CUALQUIER coordenada positiva',
        limit: 'No hay límite teórico de filas/columnas'
    }
];

export default function MatrixOracleDemo() {
    const [activePhase, setActivePhase] = useState(null);
    const [showFormula, setShowFormula] = useState(false);

    // GitHub repository URLs
    const GITHUB_REPO = 'https://github.com/tonderflash/MatrixOracle';
    const BITACORA = `${GITHUB_REPO}/blob/main/bitacora.txt`;
    const SOLUCION = `${GITHUB_REPO}/blob/main/solucion_matrix_oracle.py`;
    const MORTON_ZORDER = `${GITHUB_REPO}/blob/main/morton_zorder.py`;
    const PARSER_MATRIZ = `${GITHUB_REPO}/blob/main/parser_matriz.py`;
    const MATEMATICAS = `${GITHUB_REPO}/blob/main/matematicas_para_papel.txt`;
    const MATRIX_DATA = `${GITHUB_REPO}/blob/main/matrix.txt`;

    const togglePhase = (phaseId) => {
        setActivePhase(activePhase === phaseId ? null : phaseId);
    };

    return (
        <div className="demo-container matrix-oracle-demo">
            {/* Storytelling Section */}
            <div className="storytelling-section">
                <div className="story-header">
                    <h3>🔮 El Viaje del Descubrimiento</h3>
                    <p className="story-subtitle">
                        Un análisis matemático que reveló un patrón oculto: el Código de Morton
                    </p>
                </div>

                <div className="phases-timeline">
                    {PHASES.map((phase, idx) => (
                        <div key={phase.id} className="phase-card">
                            <div 
                                className="phase-header"
                                onClick={() => togglePhase(phase.id)}
                            >
                                <div className="phase-number">{idx + 1}</div>
                                <div className="phase-title-group">
                                    <span className="phase-icon">{phase.icon}</span>
                                    <h4 className="phase-title">{phase.title}</h4>
                                </div>
                                <span className={`phase-arrow ${activePhase === phase.id ? 'expanded' : ''}`}>
                                    ▼
                                </span>
                            </div>

                            {activePhase === phase.id && (
                                <div className="phase-content">
                                    {phase.content.problema && (
                                        <div className="phase-detail">
                                            <strong>📋 Problema:</strong>
                                            <p>{phase.content.problema}</p>
                                        </div>
                                    )}

                                    {phase.content.pregunta && (
                                        <div className="phase-detail">
                                            <strong>❓ Pregunta Clave:</strong>
                                            <p className="highlight">{phase.content.pregunta}</p>
                                        </div>
                                    )}

                                    {phase.content.insight && (
                                        <div className="phase-detail">
                                            <strong>💡 Insight:</strong>
                                            <p>{phase.content.insight}</p>
                                        </div>
                                    )}

                                    {phase.content.decision && (
                                        <div className="phase-detail decision">
                                            <strong>✅ Decisión:</strong>
                                            <p>{phase.content.decision}</p>
                                        </div>
                                    )}

                                    {phase.content.opciones && (
                                        <div className="phase-detail">
                                            <strong>🔧 Opciones Consideradas:</strong>
                                            <div className="options-list">
                                                {phase.content.opciones.map((opt, i) => (
                                                    <div 
                                                        key={i} 
                                                        className={`option ${opt.descartado ? 'discarded' : 'selected'}`}
                                                    >
                                                        <div className="option-name">
                                                            {opt.descartado ? '❌' : '✅'} {opt.name}
                                                        </div>
                                                        {opt.pro && <div className="option-pro">✓ {opt.pro}</div>}
                                                        {opt.pro2 && <div className="option-pro">✓ {opt.pro2}</div>}
                                                        {opt.pro3 && <div className="option-pro">✓ {opt.pro3}</div>}
                                                        {opt.contra && <div className="option-contra">✗ {opt.contra}</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {phase.content.hipotesis && (
                                        <div className="phase-detail">
                                            <strong>🧪 Hipótesis:</strong>
                                            <code className="formula-code">{phase.content.hipotesis}</code>
                                        </div>
                                    )}

                                    {phase.content.razonamiento && (
                                        <div className="phase-detail">
                                            <strong>🧠 Razonamiento:</strong>
                                            <p>{phase.content.razonamiento}</p>
                                        </div>
                                    )}

                                    {phase.content.prueba && (
                                        <div className="phase-detail">
                                            <strong>🔬 Pruebas:</strong>
                                            <table className="test-table">
                                                <thead>
                                                    <tr>
                                                        <th>Posición</th>
                                                        <th>Valor Real</th>
                                                        <th>Hipótesis</th>
                                                        <th>Resultado</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {phase.content.prueba.map((test, i) => (
                                                        <tr key={i}>
                                                            <td><code>{test.pos}</code></td>
                                                            <td>{test.real}</td>
                                                            <td><code>{test.hipotesis}</code></td>
                                                            <td>
                                                                {test.coincide ? (
                                                                    <span className="success">✓ Coincide</span>
                                                                ) : (
                                                                    <span className="fail">✗ No coincide</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {phase.content.conclusion && (
                                        <div className="phase-detail conclusion">
                                            <strong>📝 Conclusión:</strong>
                                            <p>{phase.content.conclusion}</p>
                                        </div>
                                    )}

                                    {phase.content.momento && (
                                        <div className="phase-detail eureka">
                                            <strong>🎉 {phase.content.momento}</strong>
                                            <p className="eureka-text">{phase.content.reconocimiento}</p>
                                        </div>
                                    )}

                                    {phase.content.aplicaciones && (
                                        <div className="phase-detail">
                                            <strong>🌍 Aplicaciones en el Mundo Real:</strong>
                                            <ul>
                                                {phase.content.aplicaciones.map((app, i) => (
                                                    <li key={i}>{app}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {phase.content.formula && (
                                        <div className="phase-detail formula-final">
                                            <strong>✨ Fórmula Final:</strong>
                                            <code className="formula-code large">{phase.content.formula}</code>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Properties Section */}
            <div className="properties-section">
                <h3>🔑 Propiedades Interesantes del Dataset</h3>
                <div className="properties-grid">
                    {PROPERTIES.map((prop, idx) => (
                        <div key={idx} className="property-card">
                            <h4>{prop.title}</h4>
                            <p>{prop.description}</p>
                            {prop.example && (
                                <div className="property-example">
                                    <strong>Ejemplo:</strong> {prop.example}
                                </div>
                            )}
                            {prop.complexity && (
                                <div className="property-complexity">
                                    <strong>Complejidad:</strong> {prop.complexity}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Technical Details */}
            <div className="technical-info-section">
                <TechnicalDetail title="📚 Recursos y Referencias" defaultOpen={false}>
                    <div className="resources-content">
                        <p>
                            Este análisis fue documentado completamente en una bitácora de investigación
                            que detalla cada fase del proceso de descubrimiento.
                        </p>
                        
                        <div className="resource-section">
                            <h4>🔗 Repositorio de GitHub</h4>
                            <div className="resource-links">
                                <a 
                                    href={GITHUB_REPO} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="github-link-primary"
                                >
                                    📦 Ver Repositorio Completo
                                </a>
                            </div>
                        </div>

                        <div className="resource-section">
                            <h4>📄 Archivos Clave del Proyecto</h4>
                            <div className="resource-links">
                                <a 
                                    href={BITACORA} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="resource-link"
                                >
                                    📖 Bitácora Completa de Investigación
                                </a>
                                <a 
                                    href={SOLUCION} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="resource-link"
                                >
                                    ✨ Solución Final (Python)
                                </a>
                                <a 
                                    href={MORTON_ZORDER} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="resource-link"
                                >
                                    🔀 Implementación Morton Z-Order
                                </a>
                                <a 
                                    href={PARSER_MATRIZ} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="resource-link"
                                >
                                    🔧 Parser de Matriz
                                </a>
                                <a 
                                    href={MATEMATICAS} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="resource-link"
                                >
                                    📐 Matemáticas para Papel
                                </a>
                                <a 
                                    href={MATRIX_DATA} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="resource-link"
                                >
                                    📊 Datos de la Matriz Original
                                </a>
                            </div>
                        </div>

                        <div className="resource-section">
                            <h4>🌐 Referencias Externas</h4>
                            <div className="resource-links">
                                <a 
                                    href="https://en.wikipedia.org/wiki/Z-order_curve" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="resource-link"
                                >
                                    📖 Z-Order Curve (Wikipedia)
                                </a>
                                <a 
                                    href="https://en.wikipedia.org/wiki/Morton_code" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="resource-link"
                                >
                                    📖 Morton Code (Wikipedia)
                                </a>
                            </div>
                        </div>

                        <div className="key-insights">
                            <h4>💡 Insights Clave:</h4>
                            <ul>
                                <li>El formato hexadecimal de los datos era una pista crucial</li>
                                <li>Los valores 0-31 caben exactamente en 5 bits (diseño intencional)</li>
                                <li>Los patrones de repetición en potencias de 2 son característicos de operaciones bitwise</li>
                                <li>La estructura multiplicativa sugiere separabilidad (row y col contribuyen independientemente)</li>
                            </ul>
                        </div>
                    </div>
                </TechnicalDetail>
            </div>
        </div>
    );
}

