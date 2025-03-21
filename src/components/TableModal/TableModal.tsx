import { FC, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Fade,
} from "@mui/material";
import { TableItemType } from "../../types";
import { sanitizeInput } from "../../utils/sanitazedValue";

interface TableModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (row: TableItemType) => void;
  initialData?: TableItemType | null;
}

export const TableModal: FC<TableModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const getDefaultRow = (): TableItemType => ({
    id: uuidv4(),
    documentName: "",
    documentType: "",
    documentStatus: "",
    companySigDate: "",
    companySignatureName: "",
    employeeNumber: "",
    employeeSigDate: "",
    employeeSignatureName: "",
  })  

  const [row, setRow] = useState<TableItemType>(
    initialData || getDefaultRow()
  )
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRow(
      initialData || getDefaultRow()
    )
  }, [initialData])

  useEffect(() => {
    if (error) {
      setShowAlert(true);
      const timer = setTimeout(() => setShowAlert(false), 1500); 
      const removeError = setTimeout(() => setError(null), 2000);
      return () => {
        clearTimeout(timer);
        clearTimeout(removeError);
      };
    }
  }, [error]);
  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()); 
  }

  const handleChange = (field: keyof TableItemType, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setRow({
      ...row,
      [field]: field.includes("Date") ? new Date(sanitizedValue).toISOString() : sanitizedValue,
    })
  }

  const handleSave = () => {
    if (Object.values(row).some((value) => !String(value).trim())) {
      setError("Заполните все поля")
      return
    }
    if (!isValidDate(row.companySigDate) || !isValidDate(row.employeeSigDate)) {
      setError("Некорректная дата");
      return;
    }
    onSave(row)
    setRow(getDefaultRow())
    onClose()
  }
  console.log(row);
  

  return (
    <Dialog open={open} onClose={onClose} className='table-modal'>
      <DialogTitle>
        {initialData ? "Редактировать строку" : "Добавить новую строку"}
      </DialogTitle>
      <DialogContent className='table-modal__content'>
        <TextField
          label="Название"
          fullWidth
          margin="dense"
          value={row.documentName}
          onChange={(e) => handleChange("documentName", e.target.value)}
        />
        <TextField
          label="Тип"
          fullWidth
          margin="dense"
          value={row.documentType}
          onChange={(e) => handleChange("documentType", e.target.value)}
        />
        <TextField
          label="Статус"
          fullWidth
          margin="dense"
          value={row.documentStatus}
          onChange={(e) => handleChange("documentStatus", e.target.value)}
        />
        <TextField
          label="companySigDate"
          fullWidth
          margin="dense"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(e) => handleChange("companySigDate", e.target.value)}
        />
        <TextField
          label="companySignatureName"
          fullWidth
          margin="dense"
          value={row.companySignatureName}
          onChange={(e) => handleChange("companySignatureName", e.target.value)}
        />
        <TextField
          label="employeeNumber"
          fullWidth
          margin="dense"
          value={row.employeeNumber}
          onChange={(e) => handleChange("employeeNumber", e.target.value)}
        />
        <TextField
          label="employeeSigDate"
          fullWidth
          margin="dense"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(e) => handleChange("employeeSigDate", e.target.value)}
        />
        <TextField
          label="employeeSignatureName"
          fullWidth
          margin="dense"
          value={row.employeeSignatureName}
          onChange={(e) =>
            handleChange("employeeSignatureName", e.target.value)
          }
        />
      </DialogContent>
      {error && (
        <Fade in={showAlert} timeout={500}>
          <Alert
            className="alert"
            severity="error"
            onClose={() => setError(null)}
            sx={{ marginBottom: 2 }}
          >
            {error}
          </Alert>
        </Fade>
      )}
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSave}>
          {initialData ? "Сохранить" : "Добавить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
