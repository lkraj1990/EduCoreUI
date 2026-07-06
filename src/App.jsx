import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div className="app-shell">
      <main className="main-panel">
        <Header />

        <div className="content-area">
          <AppRoutes />
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default App;
