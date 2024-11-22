import React, { useState, useEffect } from "react";

const SoccerStandings = () => {
  const initialData = [
    {
      id: 1,
      team: "Persib",
      play: 34,
      win: 22,
      draw: 8,
      lose: 4,
      goals_for: 65,
      goals_against: 28,
      goal_difference: 37,
      points: 74,
    },
    {
      id: 2,
      team: "Persija",
      play: 34,
      win: 20,
      draw: 9,
      lose: 5,
      goals_for: 58,
      goals_against: 30,
      goal_difference: 28,
      points: 69,
    },
    {
      id: 3,
      team: "PSM",
      play: 34,
      win: 19,
      draw: 8,
      lose: 7,
      goals_for: 55,
      goals_against: 35,
      goal_difference: 20,
      points: 65,
    },
    {
      id: 4,
      team: "Arema",
      play: 34,
      win: 18,
      draw: 8,
      lose: 8,
      goals_for: 52,
      goals_against: 38,
      goal_difference: 14,
      points: 62,
    },
    {
      id: 5,
      team: "Bali United",
      play: 34,
      win: 17,
      draw: 9,
      lose: 8,
      goals_for: 50,
      goals_against: 40,
      goal_difference: 10,
      points: 60,
    },
  ];

  const [data, setData] = useState(initialData);
  const [editingCell, setEditingCell] = useState({ rowId: null, field: null });

  // Fungsi untuk mengurutkan data berdasarkan poin dan selisih gol
  const sortDataByPoints = (dataToSort) => {
    return [...dataToSort].sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      // Jika poin sama, urutkan berdasarkan selisih gol
      return b.goal_difference - a.goal_difference;
    });
  };

  // Effect untuk mengurutkan data setiap kali data berubah
  useEffect(() => {
    const sortedData = sortDataByPoints(data);
    if (JSON.stringify(sortedData) !== JSON.stringify(data)) {
      setData(sortedData);
    }
  }, [data]);

  const handleCellClick = (rowId, field) => {
    if (field !== "team" && field !== "goal_difference") {
      setEditingCell({ rowId, field });
    }
  };

  const handleCellChange = (e, rowId, field) => {
    const newValue = parseInt(e.target.value) || 0;
    const updatedData = data.map((row) => {
      if (row.id === rowId) {
        const newRow = { ...row, [field]: newValue };

        // Recalculate goal difference
        if (field === "goals_for" || field === "goals_against") {
          newRow.goal_difference = newRow.goals_for - newRow.goals_against;
        }

        // Recalculate points
        if (field === "win" || field === "draw") {
          newRow.points = newRow.win * 3 + newRow.draw;
        }

        return newRow;
      }
      return row;
    });
    setData(updatedData);
  };

  const handleKeyPress = (e, rowId, field) => {
    if (e.key === "Enter") {
      setEditingCell({ rowId: null, field: null });
    }
  };

  const EditableCell = ({ row, field }) => {
    const isEditing =
      editingCell.rowId === row.id && editingCell.field === field;

    if (isEditing) {
      return (
        <td className="px-4 py-2">
          <input
            type="number"
            className="w-full px-2 py-1 text-center border rounded"
            value={row[field]}
            onChange={(e) => handleCellChange(e, row.id, field)}
            onKeyPress={(e) => handleKeyPress(e, row.id, field)}
            onBlur={() => setEditingCell({ rowId: null, field: null })}
            autoFocus
          />
        </td>
      );
    }

    return (
      <td
        className={`px-4 py-2 text-center ${
          field !== "team" && field !== "goal_difference"
            ? "cursor-pointer hover:bg-gray-100"
            : ""
        }`}
        onClick={() => handleCellClick(row.id, field)}
      >
        {row[field]}
      </td>
    );
  };

  return (
    <div className="w-full max-w-4xl p-4">
      <h2 className="text-2xl font-bold mb-4">Klasemen Liga</h2>
      <p className="text-sm text-gray-600 mb-4">
        Klik pada angka untuk mengedit. Tabel akan otomatis diurutkan
        berdasarkan poin tertinggi.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-sm font-semibold">Pos</th>
              <th className="px-4 py-2 text-sm font-semibold text-left">Tim</th>
              <th className="px-4 py-2 text-sm font-semibold">M</th>
              <th className="px-4 py-2 text-sm font-semibold">M</th>
              <th className="px-4 py-2 text-sm font-semibold">S</th>
              <th className="px-4 py-2 text-sm font-semibold">K</th>
              <th className="px-4 py-2 text-sm font-semibold">GM</th>
              <th className="px-4 py-2 text-sm font-semibold">GK</th>
              <th className="px-4 py-2 text-sm font-semibold">SG</th>
              <th className="px-4 py-2 text-sm font-semibold">Poin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr
                key={row.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2 font-medium">{row.team}</td>
                <EditableCell row={row} field="play" />
                <EditableCell row={row} field="win" />
                <EditableCell row={row} field="draw" />
                <EditableCell row={row} field="lose" />
                <EditableCell row={row} field="goals_for" />
                <EditableCell row={row} field="goals_against" />
                <EditableCell row={row} field="goal_difference" />
                <EditableCell row={row} field="points" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SoccerStandings;
