import { useState } from 'react';
import { languageDetectorService } from '../../services';
import './LanguageDetectorDemo.css';

// Componente de acordeón reutilizable
function TechnicalDetail({ title, children, defaultOpen = false }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="technical-detail">
            <button
                className="technical-detail-header"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="technical-detail-icon">{isOpen ? '▼' : '▶'}</span>
                <span className="technical-detail-title">{title}</span>
            </button>
            {isOpen && (
                <div className="technical-detail-content">
                    {children}
                </div>
            )}
        </div>
    );
}

export default function LanguageDetectorDemo() {
    const [text, setText] = useState('I am going to the tienda to buy some tortillas and then voy a casa');
    const [threshold, setThreshold] = useState(40);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // GitHub repository URLs
    const GITHUB_REPO = 'https://github.com/tonderflash/n-gram-lang-detector';
    const DETECTOR_IMPL = `${GITHUB_REPO}/blob/main/detect_lang_v2.py`;
    const NGRAM_IMPL = `${GITHUB_REPO}/blob/main/ngram_extractor.py`;
    const SERVICE_IMPL = 'https://github.com/tonderflash/portfolio-client/blob/main/src/services/languageDetectorService.js';

    const handleDetect = async () => {
        if (!text.trim()) {
            setError('Please enter some text');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await languageDetectorService.detectLanguage(text, threshold);
            setResult(response);
        } catch (err) {
            setError(err.message || 'Error detecting language');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="demo-container">
            {/* Sección técnica - Justo después del título del proyecto, cerrada por defecto */}
            <div className="technical-info-section">
                <TechnicalDetail title="🛠️ How I Built This" defaultOpen={false}>
                    <div className="info-header">
                        <h4>🌐 N-gram Language Detection System</h4>
                        <p className="info-subtitle">
                            Hybrid statistical model for English, Spanish, and Spanglish detection
                        </p>
                    </div>

                    {/* Performance Metrics */}
                    <div className="performance-metrics">
                        <div className="metric">
                            <span className="metric-value">2</span>
                            <span className="metric-label">Languages</span>
                        </div>
                        <div className="metric">
                            <span className="metric-value">N-gram</span>
                            <span className="metric-label">Statistical Model</span>
                        </div>
                        <div className="metric">
                            <span className="metric-value">Hybrid</span>
                            <span className="metric-label">Detection</span>
                        </div>
                    </div>

                    {/* Technical Details - Continúa con los dropdowns existentes... */}
                    {/* (Los dropdowns técnicos ya están en el archivo, solo necesito cerrar correctamente) */}
                </TechnicalDetail>
            </div>

            {/* Demo interactivo */}
            <div className="demo-controls">
                <label>Text to analyze:</label>
                <textarea
                    className="input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text in English, Spanish, or Spanglish..."
                    rows={4}
                />
            </div>

            <div className="control-group">
                <label>Spanglish Threshold: {threshold}%</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    style={{ width: '100%' }}
                />
                <small style={{ color: 'var(--color-text-muted)' }}>
                    Lower values make Spanglish detection more sensitive
                </small>
            </div>

            <button
                className="btn btn-primary"
                onClick={handleDetect}
                disabled={loading}
            >
                {loading ? 'Analyzing...' : 'Detect Language'}
            </button>
        </div>

            {
        error && (
            <div className="error-message">
                ❌ {error}
            </div>
        )
    }

    {
        result && (
            <div className="result-container">
                <h5>Detection Result:</h5>
                <div className="result-grid">
                    <div className="result-item">
                        <strong>Dominant Language:</strong>
                        <span>{result.dominant_language}</span>
                    </div>
                    <div className="result-item">
                        <strong>Confidence:</strong>
                        <span>{result.confidence.toFixed(1)}%</span>
                    </div>
                    <div className="result-item">
                        <strong>Is Spanglish:</strong>
                        <span>{result.is_spanglish ? 'Yes' : 'No'}</span>
                    </div>
                    {result.is_spanglish && (
                        <div className="result-item">
                            <strong>Spanglish Type:</strong>
                            <span>{result.spanglish_type}</span>
                        </div>
                    )}
                </div>

                <h5>Language Proportions:</h5>
                <div className="proportions-bar">
                    <div
                        className="proportion-es"
                        style={{ width: `${result.proportions.español}%` }}
                    >
                        {result.proportions.español.toFixed(1)}% ES
                    </div>
                    <div
                        className="proportion-en"
                        style={{ width: `${result.proportions.inglés}%` }}
                    >
                        {result.proportions.inglés.toFixed(1)}% EN
                    </div>
                </div>
            </div>
        )
    }

    {/* Demo interactivo */ }
    <div className="demo-controls">
        <TechnicalDetail title="🛠️ How I Built This" defaultOpen={false}>
            <div className="info-header">
                <h4>🌐 N-gram Language Detection System</h4>
                <p className="info-subtitle">
                    Hybrid statistical model for English, Spanish, and Spanglish detection
                </p>
            </div>

            {/* Performance Metrics */}
            <div className="performance-metrics">
                <div className="metric">
                    <span className="metric-value">2</span>
                    <span className="metric-label">Languages</span>
                </div>
                <div className="metric">
                    <span className="metric-value">N-gram</span>
                    <span className="metric-label">Statistical Model</span>
                </div>
                <div className="metric">
                    <span className="metric-value">Hybrid</span>
                    <span className="metric-label">Detection</span>
                </div>
            </div>

            {/* Technical Details con Dropdowns */}
            <div className="technical-details">
                <TechnicalDetail title="📊 N-gram Statistical Models" defaultOpen={false}>
                    <p>
                        Uses character n-grams (sequences of N characters) to build statistical language profiles.
                        The system compares input text against pre-trained models for English and Spanish.
                    </p>
                    <ul>
                        <li><strong>Training Corpus:</strong> Bible texts + modern content for both languages</li>
                        <li><strong>Model Types:</strong> Original models + Discriminative models</li>
                        <li><strong>N-gram Size:</strong> Configurable character sequences (typically 2-5 chars)</li>
                        <li><strong>Frequency Analysis:</strong> Calculates probability distributions</li>
                    </ul>
                    <a href={`${NGRAM_IMPL}`} target="_blank" rel="noopener noreferrer" className="github-link">
                        View n-gram extractor on GitHub
                    </a>
                </TechnicalDetail>

                <TechnicalDetail title="🔀 Hybrid Detection System">
                    <p>
                        Combines two complementary approaches for robust language identification:
                    </p>
                    <ol>
                        <li><strong>Original Models:</strong> General language profiles trained on diverse corpora</li>
                        <li><strong>Discriminative Models:</strong> Specialized to distinguish between similar languages</li>
                        <li><strong>Weighted Scoring:</strong> Combines both model outputs for final decision</li>
                        <li><strong>Confidence Calculation:</strong> Measures certainty based on score differences</li>
                    </ol>
                    <div className="code-example">
                        <code>
                            score_original = compare(text, original_model)<br />
                            score_discriminative = compare(text, disc_model)<br />
                            final_score = weighted_average(scores)
                        </code>
                    </div>
                    <a href={`${DETECTOR_IMPL}`} target="_blank" rel="noopener noreferrer" className="github-link">
                        View hybrid detector on GitHub
                    </a>
                </TechnicalDetail>

                <TechnicalDetail title="🌮 Spanglish Classification">
                    <p>
                        Detects code-switching between English and Spanish based on language proportions:
                    </p>
                    <ul>
                        <li><strong>Balanced Spanglish:</strong> Both languages ~40-60% (configurable threshold)</li>
                        <li><strong>English-dominant:</strong> Primarily English with Spanish phrases</li>
                        <li><strong>Spanish-dominant:</strong> Primarily Spanish with English phrases</li>
                        <li><strong>Dynamic Threshold:</strong> User-adjustable sensitivity (0-100%)</li>
                    </ul>
                    <div className="code-example">
                        <code>
                            if abs(es% - en%) &lt; threshold:<br />
                            &nbsp;&nbsp;return "Balanced Spanglish"<br />
                            elif es% &gt; en%:<br />
                            &nbsp;&nbsp;return "Spanish-dominant"
                        </code>
                    </div>
                    <a href={`${DETECTOR_IMPL}#L50-L80`} target="_blank" rel="noopener noreferrer" className="github-link">
                        View Spanglish logic on GitHub
                    </a>
                </TechnicalDetail>

                <TechnicalDetail title="🏗️ Architecture & Deployment">
                    <p>
                        Serverless architecture deployed on AWS Lambda with API Gateway:
                    </p>
                    <p>Inspired by the research paper "A Fast, Compact, and Accurate Language Identification System" (Brown et al., 2013) – <a href="https://www.cs.cmu.edu/~ralf/papers/brown-tsd13.pdf?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="github-link">PDF</a></p>
                </TechnicalDetail>

                <TechnicalDetail title="📚 Training Data & Models">
                    <ul>
                        <li><strong>Spanish Corpus:</strong> es-bible.txt, es-modern.txt, es-combined.txt</li>
                        <li><strong>English Corpus:</strong> en-bible.txt, en-modern.txt, en-combined.txt</li>
                        <li><strong>Model Files:</strong> 4 JSON models (2 original + 2 discriminative)</li>
                        <li><strong>Training Scripts:</strong> train_model.py, train_model_discriminative.py</li>
                        <li><strong>Model Size:</strong> ~100KB per model (optimized for Lambda)</li>
                    </ul>
                    <a href={`${GITHUB_REPO}/tree/main/models`} target="_blank" rel="noopener noreferrer" className="github-link">
                        View trained models on GitHub
                    </a>
                </TechnicalDetail>
            </div>

            {/* Link al servicio */}
            <div className="service-link">
                <a href={SERVICE_IMPL} target="_blank" rel="noopener noreferrer" className="github-link-primary">
                    📦 View API Service Implementation
                </a>
            </div>
        </TechnicalDetail>
    </div>
        </div >
    );
}
