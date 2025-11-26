import { useState } from 'react';
import { wordFluxService } from '../../services';
import './WordFluxDemo.css';

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

export default function WordFluxDemo() {
    const [mode, setMode] = useState('text');
    const [textInput, setTextInput] = useState('The quick brown fox jumps over the lazy dog. The dog was sleeping under the tree. The fox was very quick and clever.');
    const [topN, setTopN] = useState(10);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // GitHub repository URLs
    const GITHUB_REPO = 'https://github.com/tonderflash/WordFlux';
    const WORD_COUNTER_IMPL = `${GITHUB_REPO}/blob/main/src/wordCounter.js`;
    const PARALLEL_IMPL = `${GITHUB_REPO}/blob/main/src/parallelProcessor.js`;
    const WORKER_IMPL = `${GITHUB_REPO}/blob/main/src/worker.js`;
    const SERVICE_IMPL = 'https://github.com/tonderflash/portfolio-client/blob/main/src/services/wordFluxService.js';

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            let response;

            if (mode === 'text') {
                if (!textInput.trim()) {
                    throw new Error('Please enter some text');
                }
                response = await wordFluxService.analyzeRawTexts([textInput], topN);
            } else {
                // Files mode - using pre-loaded example files
                response = await wordFluxService.analyzeFiles([
                    'data/moby-dick.txt',
                    'data/dracula.txt',
                    'data/frankenstein.txt'
                ], topN);
            }

            setResult(response);
        } catch (err) {
            setError(err.message || 'Error analyzing text');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="demo-container">
            {/* Sección técnica - Justo después del título del proyecto, cerrada por defecto */}
            <div className="technical-info-section">

                <div className="control-group">
                    <label>Analysis Mode:</label>
                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        className="input"
                    >
                        <option value="text">Analyze Text</option>
                        <option value="files">Analyze Pre-loaded Files</option>
                    </select>
                </div>

                {mode === 'text' && (
                    <div className="control-group">
                        <label>Text to analyze:</label>
                        <textarea
                            className="input"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Enter text to analyze word frequency..."
                            rows={6}
                        />
                    </div>
                )}

                {mode === 'files' && (
                    <div className="info-box">
                        <p>📚 This will analyze pre-loaded classic books:</p>
                        <ul>
                            <li>Moby Dick</li>
                            <li>Dracula</li>
                            <li>Frankenstein</li>
                        </ul>
                    </div>
                )}

                <div className="control-group">
                    <label>Top N words: {topN}</label>
                    <input
                        type="range"
                        min="5"
                        max="50"
                        value={topN}
                        onChange={(e) => setTopN(Number(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    {loading ? 'Analyzing...' : 'Analyze'}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    ❌ {error}
                </div>
            )}

            {result && (
                <div className="result-container">
                    <h5>Analysis Summary:</h5>
                    <div className="result-grid">
                        <div className="result-item">
                            <strong>Total Words:</strong>
                            <span>{result.summary.totalWords.toLocaleString()}</span>
                        </div>
                        <div className="result-item">
                            <strong>Unique Words:</strong>
                            <span>{result.summary.uniqueWords.toLocaleString()}</span>
                        </div>
                        <div className="result-item">
                            <strong>Files Processed:</strong>
                            <span>{result.summary.totalFiles}</span>
                        </div>
                        <div className="result-item">
                            <strong>Duration:</strong>
                            <span>{result.summary.totalDuration}s</span>
                        </div>
                    </div>

                    <h5>Top {topN} Most Frequent Words:</h5>
                    <div className="word-list">
                        {result.topWords.map((word, idx) => (
                            <div key={idx} className="word-item">
                                <span className="word-rank">#{idx + 1}</span>
                                <span className="word-text">{word.word}</span>
                                <span className="word-count">{word.count.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sección técnica - Dentro de un dropdown maestro */}
            <div className="technical-info-section">
                <TechnicalDetail title="🛠️ How I Built This" defaultOpen={false}>
                    <div className="info-header">
                        <h4>📚 High-Performance Text Processing System</h4>
                        <p className="info-subtitle">
                            Stream-based processing with parallel worker threads for memory efficiency
                        </p>
                    </div>

                    {/* Performance Metrics */}
                    <div className="performance-metrics">
                        <div className="metric">
                            <span className="metric-value">Streams</span>
                            <span className="metric-label">Memory Efficient</span>
                        </div>
                        <div className="metric">
                            <span className="metric-value">Workers</span>
                            <span className="metric-label">Parallel Processing</span>
                        </div>
                        <div className="metric">
                            <span className="metric-value">Node.js</span>
                            <span className="metric-label">Runtime</span>
                        </div>
                    </div>

                    {/* Technical Details con Dropdowns */}
                    <div className="technical-details">
                        <TechnicalDetail title="🌊 Stream-Based Processing" defaultOpen={false}>
                            <p>
                                Uses Node.js streams to process large files (4GB+) without loading them entirely into memory.
                                This prevents "JavaScript heap out of memory" errors.
                            </p>
                            <div className="code-example">
                                <code>
                                    // ❌ BAD - Loads entire file into memory<br />
                                    const data = fs.readFileSync('4gb-file.txt');<br />
                                    <br />
                                    // ✅ GOOD - Processes in ~64KB chunks<br />
                                    const stream = fs.createReadStream('4gb-file.txt');<br />
                                    for await (const line of readline.createInterface(stream)) &#123;<br />
                                    &nbsp;&nbsp;processLine(line); // Only one line in memory<br />
                                    &#125;
                                </code>
                            </div>
                            <ul>
                                <li><strong>Chunk Size:</strong> ~64KB per read operation</li>
                                <li><strong>Memory Usage:</strong> Constant, regardless of file size</li>
                                <li><strong>Line-by-line:</strong> Uses readline interface for text processing</li>
                            </ul>
                            <a href={`${WORD_COUNTER_IMPL}`} target="_blank" rel="noopener noreferrer" className="github-link">
                                View stream implementation on GitHub
                            </a>
                        </TechnicalDetail>

                        <TechnicalDetail title="⚡ Worker Thread Parallelization">
                            <p>
                                Node.js is single-threaded by default. Worker threads enable true parallel processing
                                across multiple CPU cores for processing multiple files simultaneously.
                            </p>
                            <div className="code-example">
                                <code>
                                    // Without workers: 1 file at a time (1 CPU)<br />
                                    CPU 1: ████████████████ file1.txt<br />
                                    <br />
                                    // With workers: 8 files in parallel (8 CPUs)<br />
                                    CPU 1: ████ file1.txt<br />
                                    CPU 2: ████ file2.txt<br />
                                    CPU 3: ████ file3.txt<br />
                                    ...
                                </code>
                            </div>
                            <ul>
                                <li><strong>Worker Pool:</strong> Configurable number of workers (default: CPU count)</li>
                                <li><strong>Message Passing:</strong> Workers communicate via structured clone</li>
                                <li><strong>Error Isolation:</strong> Worker failures don't crash main thread</li>
                                <li><strong>Load Balancing:</strong> Automatic task distribution</li>
                            </ul>
                            <a href={`${PARALLEL_IMPL}`} target="_blank" rel="noopener noreferrer" className="github-link">
                                View parallel processor on GitHub
                            </a>
                        </TechnicalDetail>

                        <TechnicalDetail title="🏗️ Architecture & Design">
                            <p>
                                Modular architecture separating concerns between CLI, processing logic, and worker orchestration:
                            </p>
                            <ul>
                                <li><strong>index.js:</strong> CLI interface and entry point</li>
                                <li><strong>wordCounter.js:</strong> Stream-based word counting logic</li>
                                <li><strong>worker.js:</strong> Individual worker thread implementation</li>
                                <li><strong>parallelProcessor.js:</strong> Worker pool orchestrator</li>
                                <li><strong>Data Structures:</strong> Map for O(1) word lookups vs Object</li>
                            </ul>
                            <div className="code-example">
                                <code>
                                    WordFlux/<br />
                                    ├── src/<br />
                                    │   ├── index.js<br />
                                    │   ├── wordCounter.js<br />
                                    │   ├── worker.js<br />
                                    │   └── parallelProcessor.js<br />
                                    └── data/
                                </code>
                            </div>
                            <a href={`${GITHUB_REPO}`} target="_blank" rel="noopener noreferrer" className="github-link">
                                View full repository on GitHub
                            </a>
                        </TechnicalDetail>

                        <TechnicalDetail title="🎯 Text Normalization & Counting">
                            <p>
                                Implements robust text processing with normalization strategies:
                            </p>
                            <ul>
                                <li><strong>Case Normalization:</strong> Converts to lowercase for consistent counting</li>
                                <li><strong>Punctuation Removal:</strong> Strips non-alphanumeric characters</li>
                                <li><strong>Word Extraction:</strong> Regex-based tokenization</li>
                                <li><strong>Frequency Map:</strong> JavaScript Map for efficient counting</li>
                                <li><strong>Top-N Selection:</strong> Efficient sorting and slicing</li>
                            </ul>
                            <div className="code-example">
                                <code>
                                    const words = line.toLowerCase().match(/\b\w+\b/g);<br />
                                    words.forEach(word =&gt; &#123;<br />
                                    &nbsp;&nbsp;wordMap.set(word, (wordMap.get(word) || 0) + 1);<br />
                                    &#125;);
                                </code>
                            </div>
                            <a href={`${WORD_COUNTER_IMPL}#L20-L50`} target="_blank" rel="noopener noreferrer" className="github-link">
                                View normalization logic on GitHub
                            </a>
                        </TechnicalDetail>

                        <TechnicalDetail title="🛡️ Error Handling & Resilience">
                            <p>
                                Graceful error handling ensures processing continues even when individual files fail:
                            </p>
                            <ul>
                                <li><strong>Per-File Isolation:</strong> One file failure doesn't stop others</li>
                                <li><strong>Detailed Logging:</strong> Timestamps and error messages</li>
                                <li><strong>Summary Reports:</strong> Success/failure counts</li>
                                <li><strong>Worker Recovery:</strong> Failed workers are replaced</li>
                            </ul>
                            <div className="code-example">
                                <code>
                                    [2025-11-25 10:30:15] ✅ file1.txt processed<br />
                                    [2025-11-25 10:30:16] ❌ file2.txt failed: ENOENT<br />
                                    [2025-11-25 10:30:18] ✅ file3.txt processed<br />
                                    Summary: 2 successful, 1 failed
                                </code>
                            </div>
                            <a href={`${WORKER_IMPL}`} target="_blank" rel="noopener noreferrer" className="github-link">
                                View worker error handling on GitHub
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
        </div>
    );
}

