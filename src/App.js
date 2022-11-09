import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//screens
import ConnectWalletScreen from "./Screens/ConnectWalletScreen";
import MyNFTScreen from "./Screens/MyNFTScreen";
import MyNFTScreen2 from "./Screens/MyNFTScreen2";

//providers
import { ConnectWalletProvider } from "./Contexts/ConnectWalletContext";

function App() {
  return (
    <ConnectWalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ConnectWalletScreen />} exact />
          <Route path="/my_nft_screen" element={<MyNFTScreen />} exact />
          <Route path="/my_nft_screen_2" element={<MyNFTScreen2 />} exact />
        </Routes>
      </Router>
    </ConnectWalletProvider>
  );
}

export default App;
