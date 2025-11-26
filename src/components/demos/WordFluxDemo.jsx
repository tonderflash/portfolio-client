import { useState, useEffect } from 'react';
import { TechnicalDetail } from '../TechnicalDetail';
import { wordFluxService } from '../../services';
import './WordFluxDemo.css';

// Pre-loaded books available on the server
const AVAILABLE_BOOKS = [
    { id: 'moby-dick', path: 'data/moby-dick.txt', name: 'Moby Dick' },
    { id: 'dracula', path: 'data/dracula.txt', name: 'Dracula' },
    { id: 'frankenstein', path: 'data/frankenstein.txt', name: 'Frankenstein' },
];

export default function WordFluxDemo() {
    const [mode, setMode] = useState('books'); // 'books' or 'text'
    const [selectedBooks, setSelectedBooks] = useState(['moby-dick', 'dracula', 'frankenstein']);
    const [text, setText] = useState('');
    const [topN, setTopN] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    // GitHub repository URLs
    const GITHUB_REPO = 'https://github.com/tonderflash/WordFlux';
    const WORD_COUNTER_IMPL = `${GITHUB_REPO}/blob/main/src/wordCounter.js`;
    const WORKER_IMPL = `${GITHUB_REPO}/blob/main/src/worker.js`;
    const PARALLEL_PROCESSOR_IMPL = `${GITHUB_REPO}/blob/main/src/parallelProcessor.js`;
    const INDEX_IMPL = `${GITHUB_REPO}/blob/main/src/index.js`;
    const SERVICE_IMPL = 'https://github.com/tonderflash/portfolio-client/blob/main/src/services/wordFluxService.js';

    // Timer effect for live processing counter
    useEffect(() => {
        let interval;
        if (loading) {
            setElapsedTime(0);
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 0.01);
            }, 10); // Update every 10ms for smooth counter
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [loading]);

    const toggleBook = (bookId) => {
        setSelectedBooks(prev =>
            prev.includes(bookId)
                ? prev.filter(id => id !== bookId)
                : [...prev, bookId]
        );
    };

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            let response;

            if (mode === 'books') {
                if (selectedBooks.length === 0) {
                    setError('Please select at least one book to analyze');
                    setLoading(false);
                    return;
                }

                const filePaths = AVAILABLE_BOOKS
                    .filter(book => selectedBooks.includes(book.id))
                    .map(book => book.path);

                response = await wordFluxService.analyze({
                    files: filePaths,
                    topN,
                });
            } else {
                if (!text.trim()) {
                    setError('Please enter some text to analyze');
                    setLoading(false);
                    return;
                }

                response = await wordFluxService.analyze({
                    texts: [text],
                    topN,
                });
            }

            setResult(response);
        } catch (e) {
            setError(e.message || 'Error analyzing text');
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
                        <h4>📚 WordFlux Stream Processing Demo</h4>
                        <p className="info-subtitle">
                            Node.js streams with worker threads for large‑file word counting
                        </p>
                    </div>
                    {/* Performance Metrics */}
                    <div className="performance-metrics">
                        <div className="metric">
                            <span className="metric-value">4GB+</span>
                            <span className="metric-label">File Size</span>
                        </div>
                        <div className="metric">
                            <span className="metric-value">Parallel</span>
                            <span className="metric-label">Workers</span>
                        </div>
                        <div className="metric">
                            <span className="metric-value">Fast</span>
                            <span className="metric-label">Processing</span>
                        </div>
                    </div>

                    {/* Technical Details con Dropdowns */}
                    <div className="technical-details">
                        <TechnicalDetail title="🌊 Stream-Based Processing" defaultOpen={false}>
                            <p>
                                Uses Node.js streams to process files line-by-line without loading entire files into memory.
                                This allows processing files of any size (4GB+) without running out of memory.
                            </p>
                            <div className="code-example">
                                <code>
                                    const stream = fs.createReadStream('file.txt');<br />
                                    const rl = readline.createInterface(&#123; input: stream &#125;);<br />
                                    for await (const line of rl) &#123;<br />
                                    &nbsp;&nbsp;processLine(line);<br />
                                    &#125;
                                </code>
                            </div>
                            <a href={WORD_COUNTER_IMPL} target="_blank" rel="noopener noreferrer" className="github-link">
                                View stream implementation on GitHub
                            </a>
                        </TechnicalDetail>

                        <TechnicalDetail title="⚡ Worker Threads for Parallelism" defaultOpen={false}>
                            <p>
                                Processes multiple files simultaneously using Node.js Worker Threads:
                            </p>
                            <ul>
                                <li><strong>Parallel Processing:</strong> Each file processed in separate thread</li>
                                <li><strong>CPU Utilization:</strong> Uses all available CPU cores</li>
                                <li><strong>Memory Isolation:</strong> Each worker has its own memory space</li>
                                <li><strong>Error Handling:</strong> One file failure doesn't stop others</li>
                            </ul>
                            <a href={PARALLEL_PROCESSOR_IMPL} target="_blank" rel="noopener noreferrer" className="github-link">
                                View parallel processor on GitHub
                            </a>
                        </TechnicalDetail>

                        <TechnicalDetail title="🔧 Word Counting Algorithm" defaultOpen={false}>
                            <p>Efficient word frequency counting using Map data structure:</p>
                            <ol>
                                <li>Normalize text (lowercase, remove punctuation)</li>
                                <li>Split into words using regex</li>
                                <li>Count frequencies using Map for O(1) lookups</li>
                                <li>Sort by frequency to get top N words</li>
                            </ol>
                            <a href={WORD_COUNTER_IMPL} target="_blank" rel="noopener noreferrer" className="github-link">
                                View word counter code on GitHub
                            </a>
                        </TechnicalDetail>

                        <TechnicalDetail title="🧵 Worker Thread Implementation" defaultOpen={false}>
                            <p>Individual worker thread processes a single file:</p>
                            <ul>
                                <li><strong>Message Passing:</strong> Receives file path via parentPort</li>
                                <li><strong>Stream Processing:</strong> Reads file line-by-line</li>
                                <li><strong>Result Aggregation:</strong> Returns word counts to main thread</li>
                                <li><strong>Error Propagation:</strong> Sends errors back to main thread</li>
                            </ul>
                            <a href={WORKER_IMPL} target="_blank" rel="noopener noreferrer" className="github-link">
                                View worker thread code on GitHub
                            </a>
                        </TechnicalDetail>

                        <TechnicalDetail title="📊 Architecture & Design" defaultOpen={false}>
                            <p>Project structure and design decisions:</p>
                            <ul>
                                <li><strong>CLI Interface:</strong> Command-line tool for file processing</li>
                                <li><strong>Modular Design:</strong> Separate modules for counting, workers, and orchestration</li>
                                <li><strong>Error Resilience:</strong> Continues processing even if individual files fail</li>
                                <li><strong>UTF-8 Support:</strong> Handles international characters and accents</li>
                            </ul>
                            <a href={INDEX_IMPL} target="_blank" rel="noopener noreferrer" className="github-link">
                                View main entry point on GitHub
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

            {/* Lambda Specifications - Visible outside dropdown */}
            <div className="lambda-specs-standalone">
                <h5 style={{ 
                    margin: '0 0 0.75rem 0', 
                    fontSize: '0.85rem', 
                    color: 'var(--color-text-muted)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    ⚙️ Lambda Runtime Specs
                </h5>
                <div className="lambda-specs-grid">
                    <div className="lambda-spec-item">
                        <span className="lambda-spec-label">Memory:</span>
                        <span className="lambda-spec-value">128 MB</span>
                    </div>
                    <div className="lambda-spec-item">
                        <span className="lambda-spec-label">Storage:</span>
                        <span className="lambda-spec-value">512 MB</span>
                    </div>
                    <div className="lambda-spec-item">
                        <span className="lambda-spec-label">Timeout:</span>
                        <span className="lambda-spec-value">1 min</span>
                    </div>
                    <div className="lambda-spec-item">
                        <span className="lambda-spec-label">SnapStart:</span>
                        <span className="lambda-spec-value">Disabled</span>
                    </div>
                </div>
            </div>

            {/* Demo controls */}
            <div className="demo-controls">
                <div className="control-group">
                    <label>Analysis Mode:</label>
                    <select
                        className="input"
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                    >
                        <option value="books">Pre-loaded Classic Books</option>
                        <option value="text">Custom Text</option>
                    </select>
                </div>

                {mode === 'books' ? (
                    <div className="control-group">
                        <label>Select Books to Analyze:</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {AVAILABLE_BOOKS.map(book => (
                                <label key={book.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedBooks.includes(book.id)}
                                        onChange={() => toggleBook(book.id)}
                                    />
                                    <span>{book.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="control-group">
                        <label>Text to analyze:</label>
                        <textarea
                            className="input"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={6}
                            placeholder="Enter text to analyze word frequency... Try pasting a long article or story!"
                        />
                    </div>
                )}

                <div className="control-group">
                    <label>Top Words to Show: {topN}</label>
                    <input
                        type="range"
                        min="5"
                        max="50"
                        value={topN}
                        onChange={(e) => setTopN(Number(e.target.value))}
                        style={{ width: '100%' }}
                    />
                    <small style={{ color: 'var(--color-text-muted)' }}>
                        Display the top {topN} most frequent words
                    </small>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    {loading ? 'Analyzing...' : 'Count Words'}
                </button>
            </div>

            {loading && (
                <div className="loading-container" style={{
                    padding: '1.5rem',
                    background: 'var(--color-surface)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '2px solid var(--color-primary)',
                }}>
                    <div style={{
                        display: 'inline-block',
                        width: '40px',
                        height: '40px',
                        border: '4px solid rgba(var(--color-primary-rgb, 99, 102, 241), 0.3)',
                        borderTop: '4px solid var(--color-primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '1rem'
                    }} />
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-primary)' }}>
                        ⚡ Processing...
                    </h4>
                    <p style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        fontFamily: 'monospace',
                        color: 'var(--color-text)',
                        margin: 0
                    }}>
                        {elapsedTime.toFixed(2)}s
                    </p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}

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
                            <span>{result.summary?.totalWords?.toLocaleString() || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <strong>Unique Words:</strong>
                            <span>{result.summary?.uniqueWords?.toLocaleString() || 'N/A'}</span>
                        </div>
                        <div className="result-item">
                            <strong>Processing Time:</strong>
                            <span>{result.summary?.totalDuration || 'N/A'}ms</span>
                        </div>
                    </div>
                    <h5>Top {topN} Most Frequent Words:</h5>
                    <ul style={{ columns: topN > 10 ? 2 : 1 }}>
                        {result.topWords?.map((item, idx) => (
                            <li key={idx}>
                                <strong>{item.word}</strong>: {item.count.toLocaleString()}
                            </li>
                        ))}
                    </ul>
                    
                    {/* Lambda Logs - Mostrar si están disponibles */}
                    {(result.logs || result.lambdaLogs || result.executionLogs) && (
                        <div className="lambda-logs-section" style={{
                            marginTop: '1.5rem',
                            paddingTop: '1.5rem',
                            borderTop: '1px solid rgba(99, 102, 241, 0.2)'
                        }}>
                            <h5 style={{ 
                                fontSize: '0.9rem', 
                                color: 'var(--color-text-muted)',
                                marginBottom: '0.75rem',
                                fontWeight: 600
                            }}>
                                📋 Lambda Execution Logs
                            </h5>
                            <div className="lambda-logs" style={{
                                background: 'rgba(0, 0, 0, 0.3)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                borderRadius: '6px',
                                padding: '0.75rem',
                                fontFamily: 'monospace',
                                fontSize: '0.8rem',
                                color: '#a5b4fc',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {typeof (result.logs || result.lambdaLogs || result.executionLogs) === 'string' 
                                    ? (result.logs || result.lambdaLogs || result.executionLogs)
                                    : JSON.stringify(result.logs || result.lambdaLogs || result.executionLogs, null, 2)
                                }
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
