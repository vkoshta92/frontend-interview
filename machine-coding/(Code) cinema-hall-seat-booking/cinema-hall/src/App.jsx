import CinemaSeatBooking from "./components/cinema-seat-booking";

const App = () => {
  const handleBookingComplete = (bookingDetails) => {
    console.log("Booking completed:", bookingDetails);
  };

  return (
    <CinemaSeatBooking
      onBookingComplete={handleBookingComplete}
      bookedSeats={["A1", "A8", "B3", "C12", "F5", "G2"]}
    />
  );
};

export default App;
