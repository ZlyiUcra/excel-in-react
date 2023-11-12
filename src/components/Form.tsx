import { useState } from "react";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";

type FormType = Array<{ value?: string | number; readOnly?: boolean }>;

/**
 * Renders a form component.
 *
 * @return {JSX.Element} The rendered form component.
 */
export const Form = () => {
  const [data, setData] = useState<FormType>([
    { value: "" },
    { value: "" },
    { value: 0, readOnly: true },
  ]);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    columnIndex: number
  ) => {
    const fieldValue = e.target.value;
    setData((prevData) => {
      const newData = [...prevData];
      newData[columnIndex].value = fieldValue;

      onChangeTable(newData, false); // Call onChangeTable with newData

      return newData;
    });
  };

  const onChangeTable = (
    newData: FormType | Array<FormType>,
    flagTable: boolean
  ) => {
    let baseData: Array<{
      value?: string | number | undefined;
      readOnly?: boolean | undefined;
    }> = [];
    if (flagTable) {
      baseData = newData[0] as FormType;
    } else {
      baseData = newData as FormType;
    }
    const sum: number = baseData.slice(0, -1).reduce(
      (
        acc: number,
        curr: {
          value?: string | number | undefined;
          readOnly?: boolean | undefined;
        }
      ) => acc + (Number(curr?.value) || 0),
      0
    );
    baseData[baseData.length - 1].value = sum;

    setData(baseData as FormType);
  };

  return (
    <div>
      <h1>Form</h1>
      {data.map((cell, columnIndex) => (
        <input
          key={`${columnIndex}`}
          value={typeof cell.value === "undefined" ? "" : cell.value}
          onChange={(e) => handleFieldChange(e, columnIndex)}
        />
      ))}
      <hr />
      <Spreadsheet
        data={[data] as Matrix<CellBase<any>>}
        onChange={(data) => onChangeTable(data as any, true)}
      />
    </div>
  );
};
