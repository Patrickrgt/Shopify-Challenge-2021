import "./App.css";
import Home from "./components/home.jsx";
import { CookiesProvider } from "react-cookie";

function App() {
  return (
    <CookiesProvider>
      <div className="App">
        <Home></Home>
      </div>
    </CookiesProvider>
  );
}

export default App;
