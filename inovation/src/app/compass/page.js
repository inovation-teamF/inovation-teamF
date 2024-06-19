import React from 'react';
import Play from '../play/page';

function App() {
  const distance = 0.0020;
  const angle = 180; // 角度を60度に設定

  return (
    <div>
      <Play distance={distance} angle={angle} />
    </div>
  );
}

export default App;
