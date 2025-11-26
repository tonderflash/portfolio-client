import { useState } from 'react';
import { TechnicalDetail } from '../TechnicalDetail';
import { languageDetectorService } from '../../services';

export default function LanguageDetectorDemo() {
    const [text, setText] = useState('');
    const [threshold, setThreshold] = useState(50);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleDetect = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await languageDetectorService.detect({
                text,
                threshold,
            });
            setResult(response);
        } catch (e) {
            setError(e.message || 'Error detecting language');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="demo-container">
            {/* Technical info section */}
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
                    {/* Add more technical dropdowns as needed */}
                </TechnicalDetail>
            </div>

            {/* Demo controls */}
            <div className="demo-controls">
                <div className="control-group">
                    <label>Quick Test:</label>
                    <div className="quick-test-buttons" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-outline"
                            onClick={() => setText("In the beginning God created the heaven and the earth.")}
                            style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem' }}
                        >
                            🇺🇸 English
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => setText("En el principio creó Dios los cielos y la tierra.")}
                            style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem' }}
                        >
                            🇪🇸 Español
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => setText("Voy a parkear el carro antes de ir al party.")}
                            style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem' }}
                        >
                            🌮 Spanglish
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => setText("No")}
                            style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem', borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }}
                            title="Click to see why short text fails"
                        >
                            ⚠️ Short Text
                        </button>
                    </div>

                    <label>Text to analyze:</label>
                    <div className="info-note" style={{
                        marginBottom: '0.75rem',
                        fontSize: '0.85rem',
                        color: 'var(--color-text-muted)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        borderLeft: '3px solid var(--color-warning)'
                    }}>
                        <strong>ℹ️ Note:</strong> This model was trained exclusively on biblical data. It may incorrectly detect languages or be confused by modern vocabulary not present in the training set.
                    </div>
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

            {error && (
                <div className="error-message">
                    ❌ {error}
                </div>
            )}

            {result && (
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
            )}
        </div>
    );
}
