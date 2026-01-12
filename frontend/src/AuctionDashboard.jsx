import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BidHistoryModal from './BidHistoryModal';

// CONFIGURATION
const API_URL = 'http://localhost:8080/api/auctions';

const AuctionDashboard = ({ currentUser, onLogout, onGoToProfile }) => {
    // --- STATE: Data ---
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // --- STATE: Inputs ---
    // Tracks input for each item: { 1: "500", 5: "1200" }
    const [bidValues, setBidValues] = useState({});

    // --- STATE: Actions ---
    const [showSellForm, setShowSellForm] = useState(false);
    const [newItem, setNewItem] = useState({ title: '', price: '', hours: 24, url: '' });

    // --- STATE: Modal ---
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState([]);
    const [selectedItemTitle, setSelectedItemTitle] = useState("");

    // --- 1. FETCH DATA (POLLING) ---
    const fetchAuctions = async () => {
        try {
            const response = await axios.get(API_URL);
            setAuctions(response.data);
            setLastUpdated(new Date());
            if(loading) setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Backend not reachable. Is Spring Boot running?");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuctions();
        const interval = setInterval(fetchAuctions, 5000);
        return () => clearInterval(interval);
    }, []);

    // --- 2. ACTION HANDLERS ---
    const handleCreateAuction = async () => {
        if (!newItem.title || !newItem.price) return alert("Title and Price are required");
        try {
            await axios.post(API_URL, {
                title: newItem.title,
                startingPrice: parseFloat(newItem.price),
                ownerId: currentUser.id,
                durationInHours: parseInt(newItem.hours),
                imageUrl: newItem.url
            });
            alert("Auction started successfully!");
            setShowSellForm(false);
            setNewItem({ title: '', price: '', hours: 24, url: '' });
            fetchAuctions();
        } catch (err) {
            alert("Failed to create auction.");
        }
    };

    const handleBid = async (itemId, currentHighest) => {
        const val = bidValues[itemId];
        if (!val) return;

        const amount = parseFloat(val);
        if (isNaN(amount) || amount <= currentHighest) {
            alert("Bid must be higher than current price.");
            return;
        }

        try {
            await axios.post(`${API_URL}/${itemId}/bid`, {
                userId: currentUser.id,
                amount: amount
            });
            // Clear input for this item only
            setBidValues({ ...bidValues, [itemId]: '' });
            fetchAuctions();
        } catch (err) {
            alert(err.response?.data || "Bid failed");
        }
    };

    const viewHistory = async (itemId, title) => {
        try {
            const res = await axios.get(`${API_URL}/${itemId}/bids`);
            setSelectedHistory(res.data);
            setSelectedItemTitle(title);
            setModalOpen(true);
        } catch (err) {
            alert("Could not load history");
        }
    };

    // --- 3. RENDER ---
    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    if (loading) return <div className="p-10 text-center text-xl">Loading Auction House...</div>;
    if (error) return <div className="p-10 text-center text-red-600 font-bold">{error}</div>;

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto font-sans">

            {/* HEADER */}
            <header className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight"> Auction</h1>
                    <p className="text-gray-500 mt-1">Welcome, <span className="text-blue-600 font-bold">{currentUser.username}</span>!</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-4">
                        <button
                            onClick={onGoToProfile}
                            className="text-sm font-bold text-blue-600 hover:text-blue-800 underline"
                        >
                            My Profile
                        </button>
                        <button
                            onClick={onLogout}
                            className="text-sm text-red-600 hover:text-red-800 font-medium underline"
                        >
                            Log Out
                        </button>
                    </div>
                    <div className="text-xs text-gray-400">
                        Auto-refreshing <br/> {lastUpdated.toLocaleTimeString()}
                    </div>
                </div>
            </header>

            {/* CONTROL PANEL */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-700">Actions</h2>
                    <button
                        onClick={() => setShowSellForm(!showSellForm)}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition-colors shadow-sm"
                    >
                        {showSellForm ? 'Cancel' : '+ Sell Item'}
                    </button>
                </div>

                {/* Sell Item Form */}
                {showSellForm && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100 animate-fade-in">
                        <h3 className="font-bold text-green-900 mb-3">List New Item</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <input className="border p-2 rounded" placeholder="Item Title" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                            <input className="border p-2 rounded" type="number" placeholder="Start Price ($)" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <input className="border p-2 rounded md:col-span-2" placeholder="Image URL" value={newItem.url} onChange={e => setNewItem({...newItem, url: e.target.value})} />
                            <input className="border p-2 rounded" type="number" placeholder="Duration (Hours)" value={newItem.hours} onChange={e => setNewItem({...newItem, hours: e.target.value})} />
                        </div>
                        <button onClick={handleCreateAuction} className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 shadow-sm">
                            Start Auction
                        </button>
                    </div>
                )}
            </div>

            {/* AUCTION GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {auctions.map((item) => {
                    const currentPrice = item.currentBid || item.startingPrice;
                    const isEnded = new Date() > new Date(item.endTime);

                    return (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                            {/* Image Area */}
                            <div className="h-48 bg-gray-100 relative group">
                                <img
                                    src={item.imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
                                    alt={item.title}
                                    className={`w-full h-full object-cover transition-opacity ${isEnded ? 'opacity-50 grayscale' : ''}`}
                                    // Prevents infinite loops and hides broken images
                                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                />
                                <div className="absolute top-3 right-3">
                                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm ${isEnded ? 'bg-gray-800 text-white' : 'bg-green-500 text-white'}`}>
                                        {isEnded ? 'Ended' : 'Live'}
                                    </span>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">{item.title}</h2>
                                </div>

                                <div className="mt-auto pt-4">
                                    <div className="flex justify-between items-end mb-4">
                                        <div className="text-sm text-gray-500">
                                            {/* FIXED LINE BELOW */}
                                            <p>Seller: <span className="font-semibold text-gray-700">{item.ownerName || 'Unknown'}</span></p>

                                            <button onClick={() => viewHistory(item.id, item.title)} className="text-blue-500 text-xs hover:underline mt-1">
                                                View Bid History
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Current Bid</p>
                                            <p className={`text-2xl font-bold ${isEnded ? 'text-gray-400' : 'text-green-600'}`}>
                                                {formatCurrency(currentPrice)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bidding Controls */}
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            disabled={isEnded}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
                                            value={bidValues[item.id] || ''}
                                            onChange={(e) => setBidValues({ ...bidValues, [item.id]: e.target.value })}
                                        />
                                        <button
                                            onClick={() => handleBid(item.id, currentPrice)}
                                            disabled={isEnded}
                                            className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-sm transition-all whitespace-nowrap ${
                                                isEnded ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                                            }`}
                                        >
                                            Bid
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <BidHistoryModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                history={selectedHistory}
                title={selectedItemTitle}
            />
        </div>
    );
};

export default AuctionDashboard;