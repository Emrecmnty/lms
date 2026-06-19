import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <header className="top-header">
          <div className="search-bar">
            <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>search</span>
            <input placeholder="Search for data..." type="text" />
          </div>
        </header>
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
}