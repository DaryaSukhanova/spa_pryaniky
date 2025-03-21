import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TableItemType, TableType } from '../types';

const initialState: TableType  = {
  data: []
}

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<TableItemType[]>) => {
      state.data = action.payload
    },
    addRow: (state, action: PayloadAction<TableItemType>) => {
      state.data.push(action.payload)
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(row => row.id !== action.payload)
    },
    updateRow: (state, action: PayloadAction<TableItemType>) => {
      state.data = state.data.map(row => row.id === action.payload.id ? action.payload : row)
    },
  },
})

export const { setData, addRow, deleteRow, updateRow } = tableSlice.actions
export default tableSlice.reducer
