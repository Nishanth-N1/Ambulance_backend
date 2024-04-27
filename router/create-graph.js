const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

function convertToAdjacencyMatrix(signals) {
    const signalIndices = {};
    signals.forEach((signal, index) => {
        signalIndices[signal.name] = index;
    });

    const numSignals = signals.length;
    const adjacencyMatrix = Array.from({ length: numSignals }, () => Array(numSignals).fill(null));

    signals.forEach((signal, index) => {
        const signalIndex = signalIndices[signal.name];
        signal.nearestSignals.forEach(neighbor => {
            const neighborName = neighbor.name;
            const neighborDistance = neighbor.distance;
            const neighborIndex = signalIndices[neighborName];
            adjacencyMatrix[signalIndex][neighborIndex] = {
                distance: neighborDistance,
                name: neighborName,
                latitude: signals[neighborIndex].latitude,
                longitude: signals[neighborIndex].longitude
            };
        });

        // Set self distance to 0
        adjacencyMatrix[index][index] = {
            distance: 0,
            name: signal.name,
            latitude: signal.latitude,
            longitude: signal.longitude
        };
    });

    return adjacencyMatrix;
}


app.post('/create-graph', (req, res) => {
    try {
        const signals = req.body.signals;

        const adjacencyMatrix = convertToAdjacencyMatrix(signals);

        fs.writeFileSync('adjacency_matrix.txt', JSON.stringify(adjacencyMatrix));

        res.status(200).json({ message: 'Adjacency matrix created and stored successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = app;
