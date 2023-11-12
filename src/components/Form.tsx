import { useCallback, useState } from "react";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";

//type FormType = Array<{ value?: string | number; readOnly?: boolean }>;
interface FormType
  extends Array<{
    value?: string | number;
    readOnly?: boolean;
  }> {}

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

  const onChangeTable = useCallback(
    (newData: FormType | Array<FormType>, flagTable: boolean) => {
      const baseData = flagTable
        ? ([...newData[0]] as FormType)
        : ([...newData] as FormType);

      const sum = baseData
        .slice(0, -1)
        .reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);

      const updatedData = [...baseData];
      updatedData[baseData.length - 1] = {
        ...updatedData[baseData.length - 1],
        value: sum,
      };

      const changes =
        data.filter((cell, index) => cell.value !== updatedData[index].value)
          .length > 0;

      changes && setData(updatedData);
    },
    [data]
  );

  const handleFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, columnIndex: number) => {
      const fieldValue = e.target.value;
      setData((prevData) => {
        const newData = [...prevData];
        newData[columnIndex] = { ...newData[columnIndex], value: fieldValue };

        const changes =
          data.filter((cell, index) => cell.value !== newData[index].value)
            .length > 0;

        changes && onChangeTable(newData, false); // Call onChangeTable with newData

        return newData;
      });
    },
    [onChangeTable]
  );

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
