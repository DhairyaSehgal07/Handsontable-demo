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

  const [cellMeta, setCellMeta] = useState<
    {
      row: number;
      col: number;
      [key: string]: any;
    }[]
  >([]);

  const afterSetCellMeta = (
    row: number,
    col: number,
    key: string,
    value: any
  ) => {
    console.log("afterSetCellMeta", row, col, key, value);
    const index = cellMeta.findIndex(
      (meta) => meta.row === row && meta.col === col
    );

    if (index === -1) {
      // Cell metadata doesn't exist yet
      setCellMeta([
        ...cellMeta,
        {
          row,
          col,
          [key]: value,
        },
      ]);
    } else {
      // Update existing cell metadata
      const updatedCellMeta = cellMeta.map((meta) => {
        if (meta.row === row && meta.col === col) {
          return {
            ...meta,
            [key]: value,
          };
        }
        return meta;
      });
      setCellMeta(updatedCellMeta);
    }

    // Update privateData as before
    const mapKey = `${row},${col}`;
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

  // Log whenever privateData changes
  useEffect(() => {
    console.log("Private data updated:", privateData);
  }, [privateData]);

  // Add function to handle setting cell metadata
  const handleSetCellMeta = (row: number, col: number, className: string) => {
    const hot = hotRef.current?.hotInstance;
    if (hot) {
      hot.setCellMeta(row, col, "className", className);

      // Update our state to reflect the change
      const newMeta = {
        row,
        col,
        className,
      };

      setCellMeta((prev) => {
        const index = prev.findIndex(
          (meta) => meta.row === row && meta.col === col
        );
        if (index === -1) {
          return [...prev, newMeta];
        }
        const updated = [...prev];
        updated[index] = { ...updated[index], ...newMeta };
        return updated;
      });
    }
  };

  // Example usage - you can call this from a button or other event
  useEffect(() => {
    // Example: Set custom class for cell at row 0, col 0
    handleSetCellMeta(0, 0, "custom-cell");
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

      {/* Example button to set cell metadata */}
      <button onClick={() => handleSetCellMeta(1, 1, "highlight-cell")}>
        Highlight Cell (1,1)
      </button>

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
