import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CircularProgress,
  Container,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Fade,
  Typography,
} from "@mui/material";
import {
  addRow,
  deleteRow,
  logout,
  RootState,
  setData,
  updateRow,
} from "../../store";
import {
  addTableRow,
  deleteTableRow,
  getTableData,
  updateTableRow,
} from "../../api/requests";
import "./TablePage.scss";
import { TableItemType } from "../../types";
import { CRUDTable, TableModal } from "../../components";

export const TablePage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<TableItemType | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const data = useSelector((state: RootState) => state.table.data);
  const token = useSelector((state: RootState) => state.auth.token);

  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      const res = await getTableData(token!);
      console.log(res.data);

      dispatch(setData(res.data));
      setLoading(false);
    };
    loadData();
  }, []);

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

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSave = async (row: TableItemType) => {
    setEditing(true);
    try {
      if (editingRow) {
        await updateTableRow(token!, row.id, row);
        dispatch(updateRow(row));
      } else {
        await addTableRow(token!, row);
        dispatch(addRow(row));
      }
    } catch (err) {
      setError("Ошибка при сохранении данных!");
    }
    setEditing(false);
  };

  const handleDelete = async (rowId: string) => {
    setEditing(true);
    try {
      const res = await deleteTableRow(token!, rowId);
      console.log(res);
      dispatch(deleteRow(rowId));
      setError(null);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Произошла ошибка при попытке удаления");
    }
    setEditing(false);
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return <CircularProgress size={60} />;
  }
  return (
    <Container>
      <Box display="flex" alignItems="start" flexDirection="column" gap={4}>
        <TableModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={editingRow}
        />
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
          gap={1}
          width={"100%"}
          className='action'
          onClick={handleLogout}
        >
          <button>
            <img src="/icons/logout.svg" width={25} />
          </button>
          <Typography color="#2853E1">Выйти</Typography>
        </Box>
        <Box className="table-page__container">
          {data.length ? (
            <CRUDTable
              tableData={data}
              onEdit={(row) => {
                setEditingRow(row);
                setModalOpen(true);
              }}
              onDelete={(id) => {
                setSelectedRowId(id);
                setDeleteDialogOpen(true);
              }}
            />
          ) : (
            <Box>Таблица еще не создана</Box>
          )}
        </Box>
        {editing && <CircularProgress size={30} className='table-page__loading' />}
        <Button
          variant="contained"
          className="primary-button"
          onClick={() => {
            setEditingRow(null);
            setModalOpen(true);
          }}
        >
          Добавить +
        </Button>
      </Box>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          Вы уверены, что хотите удалить эту строку?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => (selectedRowId ? handleDelete(selectedRowId) : "")}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
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
    </Container>
  );
};
