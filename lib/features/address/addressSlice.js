import { createSlice } from '@reduxjs/toolkit'

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [],
    },
    reducers: {
        setAddresses: (state, action) => {
            state.list = action.payload
        },
        addAddress: (state, action) => {
            state.list.push(action.payload)
        },
        updateAddress: (state, action) => {
            state.list = state.list.map(a => (a.id === action.payload.id || a._id === action.payload._id) ? action.payload : a)
        },
        removeAddress: (state, action) => {
            state.list = state.list.filter(a => a.id !== action.payload && a._id !== action.payload)
        },
    }
})

export const { setAddresses, addAddress, updateAddress, removeAddress } = addressSlice.actions

export default addressSlice.reducer