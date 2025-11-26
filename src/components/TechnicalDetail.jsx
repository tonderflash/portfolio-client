import { useState } from 'react';

// Componente de acordeón reutilizable
export function TechnicalDetail({ title, children, defaultOpen = false }) {
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
