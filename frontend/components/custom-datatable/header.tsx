import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { CustomDatatableHeaderProps } from "@/utils/interfaces/components";
import { Calendar } from "primereact/calendar";

export default function header({
  onClickNew,
  onClickExport,
  globalSearchValue,
  onSearch,
  haveDateSearch,
  globalDateSearchValue,
  DateRangeSearch,
}: CustomDatatableHeaderProps) {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={onClickNew}
        />
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={onClickExport}
        />
      </div>
      <div className="flex items-center gap-2">
        {haveDateSearch && (          
            <Calendar 
              value={globalDateSearchValue}  
              placeholder="Date Range Search" 
              onChange={(e) => DateRangeSearch(e)} 
              selectionMode="range" 
              readOnlyInput  
              showIcon
              className="mr-5"
              showButtonBar
              onClearButtonClick={(e) => {
                e.target.value = ''
                DateRangeSearch(e)
              }}
            />
            )         
          }
          <i className="pi pi-search pl-3" />
          <InputText
            className="pl-3 w-48"
            value={globalSearchValue}
            onChange={onSearch}
            placeholder="Keyword Search"
          /> 
      </div>
    </div>
  );
}
