import React from 'react';

const BidHistoryModal = ({ isOpen, onClose, history, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 overflow-hidden">
                <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b">
                    <h3 className="font-bold text-gray-800">History: {title}</h3>
                    <button onClick={onClose} className="text-gray-500 font-bold text-xl hover:text-red-500">&times;</button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {history.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">No bids yet.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 sticky top-0">
                            <tr>
                                <th className="px-6 py-3">Bidder</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Time</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {history.map((bid, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-3 font-medium">{bid.bidderName}</td>
                                    <td className="px-6 py-3 text-green-600 font-bold">${bid.amount.toFixed(2)}</td>
                                    <td className="px-6 py-3 text-gray-500 text-sm">{new Date(bid.timestamp).toLocaleTimeString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="px-6 py-4 border-t flex justify-end">
                    <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-lg font-medium hover:bg-gray-300">Close</button>
                </div>
            </div>
        </div>
    );
};

export default BidHistoryModal;