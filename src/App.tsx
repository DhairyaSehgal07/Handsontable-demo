import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";
import { registerAllModules } from "handsontable/registry";
import { HotTable } from "@handsontable/react-wrapper";
import { useEffect, useRef, useState } from "react";
import usePrivateData from "./hooks/usePrivateData"; // dummy implementation of usePrivateData hook
registerAllModules();

const App = () => {
  const hotRef = useRef(null);
  const { privateData, setPrivateData } = usePrivateData();
  const [data] = useState([
    ["", "Tesla", "Volvo", "Toyota", "Ford"],
    ["2019", 10, 11, 12, 13],
    ["2020", 20, 11, 14, 13],
    ["2021", 30, 15, 12, 13],
  ]);

  const cellMeta = new Map();

  const afterSetCellMeta = (
    row: number,
    col: number,
    key: string,
    value: any
  ) => {
    const mapKey = `${row},${col}`;
    console.log(`Setting metadata for cell ${mapKey}:`, { key, value });

    // Start with existing privateData or empty object
    const currentPrivateData = privateData || {};

    // Update the metadata for the specific cell
    const updatedPrivateData = {
      ...currentPrivateData,
      [mapKey]: {
        ...(currentPrivateData[mapKey] || {}), // Preserve existing cell metadata
        row,
        col,
        [key]: value,
      },
    };

    console.log("Storing in privateData:", updatedPrivateData);
    setPrivateData(updatedPrivateData);
  };

  // Log whenever privateData changes
  useEffect(() => {
    console.log("Private data updated:", privateData);
  }, [privateData]);

  return (
    <div className="ht-theme-main-dark-auto" style={{ margin: "0 100px" }}>
      <HotTable
        ref={hotRef}
        data={data}
        rowHeaders={true}
        colHeaders={true}
        autoColumnSize={true}
        manualColumnResize={true}
        dropdownMenu={[
          "alignment",
          "---------",
          "filter_by_condition",
          "filter_by_value",
          "filter_operators",
          "filter_by_condition2",
          "filter_action_bar",
        ]}
        contextMenu={["copy", "cut", "---------", "alignment"]}
        filters={true}
        columnSorting={{
          indicator: true,
        }}
        height="auto"
        autoWrapRow={true}
        autoWrapCol={true}
        afterSetCellMeta={afterSetCellMeta}
        licenseKey="non-commercial-and-evaluation"
      />

      {/* Debug display of privateData */}
      <div style={{ marginTop: "20px" }}>
        <h3>Current Private Data:</h3>
        <pre>{JSON.stringify(privateData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default App;
