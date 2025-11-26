export default function ProjectCard({ project, onClick }) {
    return (
        <div
            className="card"
            onClick={onClick}
            style={{
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div
                style={{
                    fontSize: '3rem',
                    marginBottom: 'var(--spacing-sm)',
                    textAlign: 'center'
                }}
            >
                {project.icon}
            </div>

            <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>
                {project.title}
            </h3>

            <p style={{
                flex: 1,
                marginBottom: 'var(--spacing-md)',
                color: 'var(--color-text-secondary)'
            }}>
                {project.description}
            </p>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--spacing-xs)',
                marginTop: 'auto'
            }}>
                {project.tech.map((tech) => (
                    <span key={tech} className="badge">
                        {tech}
                    </span>
                ))}
            </div>

            <div
                style={{
                    marginTop: 'var(--spacing-md)',
                    textAlign: 'center'
                }}
            >
                <span
                    className="btn btn-primary"
                    style={{
                        display: 'inline-block',
                        background: project.gradient
                    }}
                >
                    Ver Demo →
                </span>
            </div>
        </div>
    );
}
