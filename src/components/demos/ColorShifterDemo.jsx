import { useState } from 'react';
import { colorShifterService } from '../../services';
import './ColorShifterDemo.css';

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

export default function ColorShifterDemo() {
    const [mode, setMode] = useState('rgb-to-hsv');
    const [input, setInput] = useState('255, 128, 64');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // GitHub repository URLs
    const GITHUB_REPO = 'https://github.com/tonderflash/color-shifter';
    const RUST_IMPL = `${GITHUB_REPO}/blob/main/src/lib.rs`;
    const SERVICE_IMPL = 'https://github.com/tonderflash/portfolio-client/blob/main/src/services/colorShifterService.js';

    const handleModeChange = (newMode) => {
        setMode(newMode);
        if (newMode === 'rgb-to-hsv') {
            setInput('255, 128, 64');
        } else {
            setInput('30, 75, 100');
        }
        setResult(null);
        setError(null);
    };

    const handleConvert = async () => {
        if (!input.trim()) {
            setError('Please enter color values');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const values = input.split(',').map(v => parseFloat(v.trim()));

            if (values.length !== 3 || values.some(isNaN)) {
                throw new Error('Please enter 3 comma-separated numbers');
            }

            let response;

            if (mode === 'rgb-to-hsv') {
                const [r, g, b] = values;
                if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
                    throw new Error('RGB values must be between 0 and 255');
                }

                response = await colorShifterService.convertSingleRgbToHsv(
                    r / 255,
                    g / 255,
                    b / 255
                );
            } else {
                const [h, s, v] = values;
                if (h < 0 || h > 360 || s < 0 || s > 100 || v < 0 || v > 100) {
                    throw new Error('H must be 0-360, S and V must be 0-100');
                }

                response = await colorShifterService.convertSingleHsvToRgb(
                    h,
                    s / 100,
                    v / 100
                );
            }

            setResult(response);
        } catch (err) {
            console.error('❌ ColorShifter Error:', err);
            setError(err.message || 'Error converting colors');
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
                        <h4>🚀 High-Performance Color Conversion API</h4>
                        <p className="info-subtitle">
                            Rust-powered SIMD color conversion running on AWS Lambda ARM64
                        </p>
                    </div>

                    {/* Performance Metrics */}
                    <div className="performance-metrics">
                        <div className="metric">
                            <span className="metric-value">256.52</span>
                            <span className="metric-label">Mpx/s</span>
                        </div>
                        <div className="metric">
                            <span className="metric-value">3.90</span>
                            <span className="metric-label">ns/pixel</span>
                        </div>
                        <div className="metric">
                            <span className="metric-value">4K@60fps</span>
                            <span className="metric-label">Capable</span>
                        </div>
                    </div>

                    {/* Technical Details con Dropdowns */}
                    <div className="technical-details">
                        <TechnicalDetail title="🔧 Branchless Design" defaultOpen={false}>
                            <p>
                                Eliminates conditional jumps (if/else) using SIMD masks and blend operations.
                                This prevents branch misprediction penalties (~10-20 CPU cycles) and ensures
                                predictable, consistent execution.
                            </p>
                            <div className="code-example">
                                <code>
                                    mask_r = (max == r)<br />
                                    h = blend(h_if_b, h_if_r, mask_r)
                                </code>
                            </div>
                            <a href={`${RUST_IMPL}#L302-L315`} target="_blank" rel="noopener noreferrer" className="github-link">
                                View implementation on GitHub
                            </a>
                        </TechnicalDetail>

                        <TechnicalDetail title="⚡ SIMD Optimizations">
                            <p>
                                Processes multiple pixels simultaneously using vector instructions:
                            </p>
                            <ul>
                                <li><strong>ARM64 NEON:</strong> 4 floats per vector (128-bit)</li>
                                <li><strong>x86_64 AVX2:</strong> 8 floats per vector (256-bit)</li>
                                <li><strong>Division optimization:</strong> Uses reciprocal approximation + Newton-Raphson refinement (~3x faster)</li>
                            </ul>
                            <a href={`${RUST_IMPL}#L120-L128`} target="_blank" rel="noopener noreferrer" className="github-link">
                                View SIMD intrinsics on GitHub
                            </a>
                        </TechnicalDetail>

                        <TechnicalDetail title="🔄 RGB → HSV Algorithm">
                            <p>Converts RGB to Hue-Saturation-Value color space:</p>
                            <ol>
                                <li>Calculate max and min of (R, G, B)</li>
                                <li>Value = max</li>
                                <li>Saturation = (max - min) / max</li>
                                <li>Hue determined by dominant channel using SIMD masks</li>
                            </ol>
                            <a href={`${RUST_IMPL}#L280-L330`} target="_blank" rel="noopener noreferrer" className="github-link">
                                View RGB→HSV code on GitHub
                            </a>
                        </TechnicalDetail>

                        <TechnicalDetail title="🎨 HSV → RGB Algorithm">
                            <p>Uses a periodic "tent function" for conversion:</p>
                            <ol>
                                <li>Normalize Hue to h' = h / 60</li>
                                <li>Calculate distance to color peaks (R at 0°, G at 120°, B at 240°)</li>
                                <li>Apply tent function: factor = clamp(1 - distance, 0, 1)</li>
                                <li>Scale by saturation and value</li>
                            </ol>
                            <a href={`${RUST_IMPL}#L370-L420`} target="_blank" rel="noopener noreferrer" className="github-link">
                                View HSV→RGB code on GitHub
                            </a>
                        </TechnicalDetail>

                        <TechnicalDetail title="📊 Performance Benchmarks">
                            <ul>
                                <li><strong>Throughput:</strong> 256.52 million pixels/second</li>
                                <li><strong>Latency:</strong> 3.90 nanoseconds per pixel</li>
                                <li><strong>Test:</strong> 10M pixels processed in 38.98ms</li>
                                <li><strong>vs JavaScript:</strong> 25-50x faster</li>
                                <li><strong>vs C++ standard:</strong> 2.5-5x faster</li>
                            </ul>
                            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="github-link">
                                View full benchmark report on GitHub
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

            {/* Demo interactivo */}
            <div className="demo-controls">
                <div className="control-group">
                    <label>Conversion Mode:</label>
                    <select
                        value={mode}
                        onChange={(e) => handleModeChange(e.target.value)}
                        className="input"
                    >
                        <option value="rgb-to-hsv">RGB → HSV</option>
                        <option value="hsv-to-rgb">HSV → RGB</option>
                    </select>
                </div>

                <div className="control-group">
                    <label>
                        {mode === 'rgb-to-hsv'
                            ? 'RGB Values (R, G, B):'
                            : 'HSV Values (H, S, V):'}
                    </label>
                    <input
                        type="text"
                        className="input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={mode === 'rgb-to-hsv' ? '255, 128, 64' : '30, 75, 100'}
                    />
                    <small style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        {mode === 'rgb-to-hsv'
                            ? 'RGB: 0-255 each'
                            : 'H: 0-360, S: 0-100, V: 0-100'}
                    </small>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleConvert}
                    disabled={loading}
                >
                    {loading ? 'Converting...' : 'Convert'}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    ❌ {error}
                </div>
            )}

            {result && (
                <div className="result-container">
                    <h5>Result:</h5>
                    {mode === 'rgb-to-hsv' ? (
                        <div className="result-grid">
                            <div className="result-item">
                                <strong>Hue (H):</strong>
                                <span>{result.h.toFixed(2)}°</span>
                            </div>
                            <div className="result-item">
                                <strong>Saturation (S):</strong>
                                <span>{(result.s * 100).toFixed(2)}%</span>
                            </div>
                            <div className="result-item">
                                <strong>Value (V):</strong>
                                <span>{(result.v * 100).toFixed(2)}%</span>
                            </div>
                        </div>
                    ) : (
                        <div className="result-grid">
                            <div className="result-item">
                                <strong>Red (R):</strong>
                                <span>{Math.round(result.r * 255)}</span>
                            </div>
                            <div className="result-item">
                                <strong>Green (G):</strong>
                                <span>{Math.round(result.g * 255)}</span>
                            </div>
                            <div className="result-item">
                                <strong>Blue (B):</strong>
                                <span>{Math.round(result.b * 255)}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
