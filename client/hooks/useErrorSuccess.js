import { useState } from "react";

const useErrorSuccess = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  return {
    errorMsg,
    successMsg,
    setErrorMsg,
    setSuccessMsg,
    clearMsg: () => {
      setSuccessMsg("");
      setErrorMsg("");
    },
  };
};

export default useErrorSuccess;
