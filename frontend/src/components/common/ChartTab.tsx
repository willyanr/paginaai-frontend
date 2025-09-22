import React, { useState } from "react";

interface ChartTabProps {
  onChangeFilter: (filter: "week" | "month" | "year") => void;
}

const ChartTab: React.FC<ChartTabProps> = ({ onChangeFilter }) => {
  const [selected, setSelected] = useState<"optionOne" | "optionTwo" | "optionThree">("optionOne");

  const getButtonClass = (option: "optionOne" | "optionTwo" | "optionThree") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white text-white bg-brand-500 hover:text-white"
      : "text-gray-500 dark:text-gray-400";

  const handleClick = (option: "optionOne" | "optionTwo" | "optionThree") => {
    setSelected(option);

    // Atualiza o filtro no componente pai
    if (option === "optionOne") onChangeFilter("week");
    if (option === "optionTwo") onChangeFilter("month");
    if (option === "optionThree") onChangeFilter("year");
  };

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => handleClick("optionOne")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass("optionOne")}`}
      >
        Semana
      </button>

      <button
        onClick={() => handleClick("optionTwo")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass("optionTwo")}`}
      >
        Mês
      </button>

      <button
        onClick={() => handleClick("optionThree")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass("optionThree")}`}
      >
        Ano
      </button>
    </div>
  );
};

export default ChartTab;
