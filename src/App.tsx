import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-primary mb-4">
                  Sarident HC
                </h1>
                <p className="text-muted-foreground">
                  Sistema de Historias Clínicas Odontológicas
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Proyecto en construcción
                </p>
              </div>
            </div>
          } />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
