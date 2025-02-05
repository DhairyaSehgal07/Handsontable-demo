import { useState } from "react";

const usePrivateData = () => {
  const [privateData, setPrivateDataState] = useState<any>(null);

  const setPrivateData = (value: any) => {
    console.log("Setting private data:", value);
    setPrivateDataState(value);
  };

  return { privateData, setPrivateData };
};

export default usePrivateData;
