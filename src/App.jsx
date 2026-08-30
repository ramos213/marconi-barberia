import { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import SiteView from "./components/SiteView.jsx";
import PanelView from "./components/PanelView.jsx";
import { getBookings, saveBookings } from "./utils/storage.js";

export default function App() {
  const [mode, setMode] = useState(
    () => (typeof window !== "undefined" && window.location.hash === "#painel" ? "panel" : "site")
  );
  const [bookings, setBookings] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onHash = () => setMode(window.location.hash === "#painel" ? "panel" : "site");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const goToSite = () => { window.location.hash = ""; setMode("site"); };

  const loadBookings = async () => {
    const list = await getBookings();
    setBookings(list);
    setLoaded(true);
  };

  useEffect(() => { loadBookings(); }, []);
  useEffect(() => { if (mode === "panel") loadBookings(); }, [mode]);

  const persist = async (list) => {
    setBookings(list);
    await saveBookings(list);
  };

  const addBooking = (booking) => persist([...bookings, booking]);
  const updateBooking = (id, patch) => persist(bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  return (
    <div className="mk-root mk-bg-texture">
      <Header mode={mode} goToSite={goToSite} />
      {mode === "site" ? (
        <SiteView bookings={bookings} addBooking={addBooking} loaded={loaded} />
      ) : (
        <PanelView bookings={bookings} updateBooking={updateBooking} reload={loadBookings} />
      )}
    </div>
  );
}
