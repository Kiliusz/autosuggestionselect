import React, { useState } from 'react';
import AutosuggestionSelect from './components/AutosuggestionSelect/AutoSuggestionSelect';

const ENDPOINT = 'http://universities.hipolabs.com/search?name=';

function App() {
  const [selectedData, setSelectedData] = useState<any>();
  return (
    <div style={{ display: 'flex', alignContent: 'start' }} className="App">
      <div style={{ padding: '1rem' }}>
        <AutosuggestionSelect
          title="Universities"
          onItemSelect={(item, array) => setSelectedData({ item, array })}
          endpoint={ENDPOINT}
          propertyKey="name"
        />
      </div>

      {/* This is made for the preview of functioning component 
      instead of console log  */}

      <div style={{ padding: '1rem', margin: '0 auto' }}>
        <p>
          <strong>Last selected item:</strong>
        </p>
        {selectedData && selectedData.item}
        <br />
        <p>
          <strong>Array of selected items:</strong>
        </p>
        <pre>{selectedData && JSON.stringify(selectedData.array, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
