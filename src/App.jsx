import ProjectList from './components/ProjectList';
import './index.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1 style={{ fontSize: '2rem', margin: 0, textAlign: 'center' }}>
            Portfolio de Proyectos
          </h1>
          <p style={{
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            margin: '0.5rem 0 0 0'
          }}>
            APIs de alto rendimiento desplegadas en AWS Lambda
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <ProjectList />
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>Portfolio de Proyectos | React + Vite | AWS Amplify</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

