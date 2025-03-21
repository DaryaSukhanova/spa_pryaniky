import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { FC } from "react";
import { TableItemType } from "../../types";
import { data } from "react-router-dom";

interface CRUDTableProps {
  tableData:  TableItemType[],
  onEdit: (row: TableItemType) => void
  onDelete: (rowId: string) => void
}

export const CRUDTable: FC<CRUDTableProps> = ({tableData, onEdit, onDelete}) => {
  return <>
  {tableData.length 
    ? 
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell>Тип</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>companySigDate</TableCell>
            <TableCell>companySignatureName</TableCell>
            <TableCell>employeeNumber</TableCell>
            <TableCell>employeeSigDate</TableCell>
            <TableCell>employeeSignatureName</TableCell>
            <TableCell>Изменить</TableCell>
            <TableCell>Удалить</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData &&
            tableData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.documentName}</TableCell>
                <TableCell>{row.documentType}</TableCell>
                <TableCell>{row.documentStatus}</TableCell>
                <TableCell>
                  {new Date(row.companySigDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{row.companySignatureName}</TableCell>
                <TableCell>{row.employeeNumber}</TableCell>
                <TableCell>
                  {new Date(row.employeeSigDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{row.employeeSignatureName}</TableCell>
                <TableCell>
                  <button onClick={() => onEdit(row)} className='action'>
                    <img src="icons/edit.svg" />
                  </button>
                </TableCell>
                <TableCell>
                  <button onClick={() => onDelete(row.id)} className='action'>
                    <img src="icons/delete.svg" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    : <Paper variant="outlined" sx={{ padding: 2, textAlign: "center" }}>
        <Typography variant="h6">Таблица еще не создана</Typography>
      </Paper>
  }
  </>
}