import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
const QuantityBtn = ({ counter, setCounter }) => {
  const maxOrderNum = 10
  const handleMinusBtn = () => {
    if (counter > 1) {
      setCounter(counter - 1);
    }
  };
  const handlePlusBtn = () => {
    if (counter >= maxOrderNum) return
    setCounter(counter + 1);
  };
  return (
    <>
      <div className="flex w-fit items-center justify-between">
        <button
          className="bg-white rounded border w-6 h-6 flex cursor-pointer items-center justify-center"
          onClick={handleMinusBtn}
        >
          <FaMinus />
        </button>
        <div className="border w-10 h-6 flex justify-center items-center bg-gray-200">
          {counter}
        </div>
        <button
          className="bg-white border rounded w-6 h-6 flex cursor-pointer items-center justify-center"
          onClick={handlePlusBtn}
        >
          <FaPlus />
        </button>
      </div>
    </>
  );
};

export default QuantityBtn;