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

  // Replace useState with Map
  const cellMeta: Map<
    string,
    {
      row: number;
      col: number;
      [key: string]: any;
    }
  > = new Map();

  const afterSetCellMeta = (
    row: number,
    col: number,
    key: string,
    value: any
  ) => {
    const mapKey = `${row},${col}`;
    const metaRow = cellMeta.get(mapKey);
    if (metaRow) {
      cellMeta.set(mapKey, { [key]: value, ...metaRow });
    } else {
      cellMeta.set(mapKey, { row, col, [key]: value });
    }

    // Update privateData as before
    const currentPrivateData = privateData || {};
    const updatedPrivateData = {
      ...currentPrivateData,
      [mapKey]: {
        ...(currentPrivateData[mapKey] || {}),
        row,
        col,
        [key]: value,
      },
    };
    setPrivateData(updatedPrivateData);
  };

  // Initialize cell metadata if needed
  useEffect(() => {
    const handsontable = hotRef.current?.hotInstance;
    if (handsontable) {
      // Example: Set initial metadata
      // Replace this with your actual metadata initialization
      const initialMetadata = [
        { row: 0, col: 0, className: "custom-cell" },
        { row: 1, col: 1, className: "highlight-cell" },
      ];

      initialMetadata.forEach((item) => {
        handsontable.setCellMetaObject(item.row, item.col, item);
      });
    }
  }, []);

  return (
    <div className="ht-theme-main-dark-auto" style={{ margin: "0 100px" }}>
      <HotTable
        ref={hotRef}
        data={data}
        rowHeaders={true}
        colHeaders={true}
        autoColumnSize={true}
        cell={cellMeta}
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

      {/* Debug display */}
      <div style={{ marginTop: "20px" }}>
        <h3>Current Private Data:</h3>
        <pre>{JSON.stringify(privateData, null, 2)}</pre>
        <h3>Current Cell Meta:</h3>
        <pre>{JSON.stringify(cellMeta, null, 2)}</pre>
      </div>
    </div>
  );
};

export default App;
