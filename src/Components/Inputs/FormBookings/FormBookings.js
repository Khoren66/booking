import React, { useState, memo, useEffect } from 'react';
import { getBookingsThunk, createBookingThunk, getVisitorsThunk, getRoomsThunk } from '../../../Thunks'
import { connect } from 'react-redux';
import './FormBookings.css'

let booking = {
    personId: "",
    personName:"",
    roomId: "",
    roomNumber:"",
    bookedAt: "",
}
const FormBookings = ({ getBookings, createBooking, formData, getVisitors, getRooms, visitorsData, roomsData }) => {
    const [newBooking, setNewBooking] = useState(booking)
    useEffect(() => {
        getVisitors()
        getRooms()
    }, [])


    useEffect(() => {
        setNewBooking({
            ...booking,
            ...formData
        })
    }, [formData])

    const handleSubmit = () => {
        createBooking(newBooking)
        setTimeout(()=>getBookings(),0)
        setNewBooking(booking)
    }
    const handleInputChange = (event,data) => {
        const { target: { name, value} } = event; 
        if(name ==="personId"){
            let person = visitorsData.find(p=>p.personId===value).personName 
            setNewBooking({
                ...newBooking,
                [name]:value,
                "personName":person         
            })
        }
        else if(name==="roomId"){
            let room = roomsData.find(r=>r.id===value).roomId
            setNewBooking({
                ...newBooking,
                [name]:value,
                "roomNumber":room         
            })
        }
        else{
            setNewBooking({
                ...newBooking,
                [name]:value, 
            })
        }
    }
    return (
        <div className='formBookings'>
            <div>
                <h3>New Booking</h3>
                <label>
                    <span>Person Name</span>
                    <select name='personId' value={newBooking.personId}  onChange={(data)=>handleInputChange(data)} >
                        <option hidden defaultValue>Select</option>
                        {visitorsData.map((i) => {
                        return <option value={i.personId} data={i}  key={i.id}>{i.personName}</option>
                        })}
                    </select>
                </label>
                <label>
                    <span>Person ID</span>
                    <input disabled type="text" onChange={handleInputChange}  value={newBooking.personId} name='personId' id="personId"></input>
                </label>
                <label>
                    <span>Room Number</span>
                    <select name='roomId' value={newBooking.roomId} onChange={handleInputChange}>
                        <option hidden defaultValue>Select</option>
                        {roomsData.map((i) => {
                            return <option value={i.id} key={i.id}>Room:{i.roomId} - Beds:{i.beds} - Floor:{i.floor} - Balcony:{i.balcony ? "Yes" : "No"}</option>
                        })}
                    </select>
                </label>
                <label>
                    <span>Date</span>
                    <input type="date" onChange={handleInputChange} value={newBooking.bookedAt} name='bookedAt' id="bookedAt"></input>
                </label>
            </div>
            <div>
                <button onClick={handleSubmit} className="formButton" >{newBooking.id ? "Update" : "Create"}</button>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    const { bookings: { bookingsData } } = state;
    const { visitors: { visitorsData } } = state;
    const { rooms: { roomsData } } = state;
    return {
        bookingsData,
        visitorsData,
        roomsData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createBooking: (data) => {
            dispatch(createBookingThunk(data))
        },
        getBookings: () => {
            dispatch(getBookingsThunk())
        },
        getVisitors: () => {
            dispatch(getVisitorsThunk())
        },
        getRooms: () => {
            dispatch(getRoomsThunk())
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(memo(FormBookings));