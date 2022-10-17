import React from 'react';
import './App.css';
import {motion} from "framer-motion";
function App() {
  return <motion.div animate={{y:100}}>
    Hello World
  </motion.div>;
}

export default App;
