import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = ({ currentUser, onBack }) => {
    const [myItems, setMyItems] = useState([]);
    const [myBids, setMyBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both in parallel
                const [itemsRes, bidsRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/users/${currentUser.id}/items`),
                    axios.get(`http://localhost:8080/api/users/${currentUser.id}/bids`)
                ]);
                setMyItems(itemsRes.data);

                // Sort bids by newest
                setMyBids(bidsRes.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
                setLoading(false);
            } catch (err) {
                alert("Failed to load profile data");
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser.id]);

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

    return (
        <div className="min-h-screen p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-8 gap-4">
                <button onClick={onBack} className="text-gray-500 hover:text-blue-600 text-lg">
                    ← Back to Dashboard
                </button>
                <h1 className="text-3xl font-bold text-gray-800">My Profile: {currentUser.username}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* COLUMN 1: ITEMS I AM SELLING */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">📦 Items I'm Selling ({myItems.length})</h2>
                    <div className="space-y-4">
                        {myItems.length === 0 && <p className="text-gray-500 italic">You haven't listed any items.</p>}
                        {myItems.map(item => (
                            <div key={item.id} className="flex gap-4 p-3 border rounded-lg hover:bg-gray-50">
                                <img src={item.imageUrl || "https://via.placeholder.com/50"} className="w-16 h-16 object-cover rounded bg-gray-200" alt="" onError={(e)=>e.target.style.display='none'}/>
                                <div>
                                    <h3 className="font-bold">{item.title}</h3>
                                    <p className="text-sm text-gray-600">Current Price: <span className="text-green-600 font-bold">{formatCurrency(item.currentBid || item.startingPrice)}</span></p>
                                    <p className="text-xs text-gray-400">Ends: {new Date(item.endTime).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUMN 2: MY BIDS */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">💰 My Bids ({myBids.length})</h2>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {myBids.length === 0 && <p className="text-gray-500 italic">You haven't placed any bids.</p>}
                        {myBids.map(bid => {
                            // Determine status
                            const isHighest = bid.amount >= (bid.item.currentBid || 0);
                            const isEnded = new Date() > new Date(bid.item.endTime);

                            let statusColor = "bg-gray-100 text-gray-600";
                            let statusText = "Outbid";

                            if (isEnded && isHighest) { statusColor = "bg-green-100 text-green-800"; statusText = "WON"; }
                            else if (isEnded && !isHighest) { statusColor = "bg-red-100 text-red-800"; statusText = "LOST"; }
                            else if (isHighest) { statusColor = "bg-blue-100 text-blue-800"; statusText = "Winning"; }
                            else { statusColor = "bg-yellow-100 text-yellow-800"; statusText = "Outbid"; }

                            return (
                                <div key={bid.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                                    <div>
                                        <h3 className="font-bold text-sm">{bid.item.title}</h3>
                                        <p className="text-xs text-gray-500">{new Date(bid.timestamp).toLocaleString()}</p>
                                        <p className="font-mono font-bold text-blue-600">{formatCurrency(bid.amount)}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                                        {statusText}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserProfile;