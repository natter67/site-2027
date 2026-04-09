import React, { useEffect, useState } from "react";
import { firestore, collection, getDocs } from "utilities/firebaseApp";

// ── Crown SVG ────────────────────────────────────────────────────────────────
function CrownIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="36"
            height="36"
            fill="#6b7280"
        >
            <path d="M2 19h20v2H2v-2zM2 6l5 5 5-7 5 7 5-5-2 11H4L2 6z" />
        </svg>
    );
}

// ── Info SVG ─────────────────────────────────────────────────────────────────
function InfoIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
        >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
    );
}

// ── Podium Block ──────────────────────────────────────────────────────────────
function PodiumBlock({ place, name, height, bgClass }) {
    const fontSize = place === 1 ? "text-4xl" : "text-2xl";

    return (
        <div className="flex flex-col items-center">
            <span className="font-montserrat font-semibold text-gray-700 text-sm mb-2 text-center max-w-[110px] leading-tight">
                {name}
            </span>
            <div
                className={`flex items-center justify-center rounded-t-xl border border-gray-200 ${bgClass}`}
                style={{ height, width: place === 1 ? 120 : 100 }}
            >
                <span className={`${fontSize} font-extrabold text-white`}>
                    {place}
                </span>
            </div>
        </div>
    );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function InfoModal({ onClose }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-xs w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="font-montserrat text-gray-600 text-base mb-4 leading-relaxed">
                    Points are earned from scanning the QR codes at exhibits!
                </p>
                <button
                    onClick={onClose}
                    className="w-full text-center font-montserrat font-semibold text-gray-800 text-base hover:opacity-70 transition-opacity"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Leaderboard() {
    const [exhibits, setExhibits] = useState([]);
    const [users, setUsers] = useState([]);
    const [infoVisible, setInfoVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [snap, userSnap] = await Promise.all([
                getDocs(collection(firestore, "exhibits")),
                getDocs(collection(firestore, "users")),
            ]);

            const ex_data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            ex_data.sort((a, b) => b.points - a.points);
            setExhibits(ex_data);

            const user_data = userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            user_data.sort((a, b) => b.points - a.points);
            setUsers(user_data);
        };

        fetchData();
    }, []);


    const renderBoard = (boardData, label) => {
        const boardTop3 = boardData.slice(0, 3);
        const boardRest = boardData.slice(3, 10);

        return (
            <div className="flex flex-col flex-1 min-w-0">
                {/* Board Title */}
                <h2 className="font-montserrat text-xl font-extrabold text-gray-800 text-center mb-4">
                    {label}
                </h2>

                {/* Podium */}
                {boardTop3.length >= 3 && (
                    <div className="flex flex-col items-center mb-6">
                        <CrownIcon />
                        <div className="flex items-end gap-2 mt-3">
                            <PodiumBlock place={2} name={boardTop3[1].name} height={85} bgClass="bg-theme-orange" />
                            <PodiumBlock place={1} name={boardTop3[0].name} height={110} bgClass="bg-theme-dark-purple" />
                            <PodiumBlock place={3} name={boardTop3[2].name} height={70} bgClass="bg-theme-yellow" />
                        </div>
                    </div>
                )}

                {/* Table Header */}
                <div className="flex justify-between items-center bg-gray-100 border border-gray-200 px-4 py-3 rounded-xl mb-3">
                    <span className="font-montserrat font-semibold text-gray-800 text-sm">Rank</span>
                    <span className="font-montserrat font-semibold text-gray-800 text-sm flex-1 text-center">
                        {label === "Exhibits" ? "Exhibit Name" : "User Name"}
                    </span>
                    <button
                        onClick={() => setInfoVisible(true)}
                        className="flex items-center gap-1 font-montserrat font-semibold text-gray-800 text-sm hover:opacity-60 transition-opacity"
                    >
                        Points <InfoIcon />
                    </button>
                </div>

                {/* Rank List */}
                <div className="flex flex-col gap-2">
                    {boardRest.map((item, index) => (
                        <div
                            key={item.id}
                            className="flex items-center px-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm"
                        >
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100">
                                <span className="font-montserrat font-bold text-gray-500 text-sm">
                                    {index + 4}
                                </span>
                            </div>
                            <span className="flex-1 ml-4 font-montserrat font-semibold text-gray-800 text-base truncate">
                                {item.name}
                            </span>
                            <div className="flex flex-col items-end">
                                <span className="font-montserrat font-bold text-gray-700 text-lg leading-none">
                                    {item.points.toLocaleString()}
                                </span>
                                <span className="font-montserrat text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                                    pts
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen w-full bg-white flex flex-col items-center">
            <div className="w-full max-w-4xl px-4">

                {/* Side-by-side boards */}
                <div className="flex flex-col md:flex-row gap-10">
                    {renderBoard(exhibits, "Exhibits")}
                    <div className="hidden md:block w-px bg-gray-200" />
                    {renderBoard(users, "Users")}
                </div>

            </div>

            {/* Info Modal */}
            {infoVisible && <InfoModal onClose={() => setInfoVisible(false)} />}
        </div>
    );
}
