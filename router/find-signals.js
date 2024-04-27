const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

// Load the adjacency matrix from the file
const adjacencyMatrix = JSON.parse(fs.readFileSync('adjacency_matrix.txt', 'utf8'));

function dijkstra(adjacencyMatrix, source, destination) {
    const numVertices = adjacencyMatrix.length;
    const distances = Array(numVertices).fill(Infinity);
    const visited = Array(numVertices).fill(false);
    const previous = Array(numVertices).fill(null);

    distances[source] = 0;

    for (let i = 0; i < numVertices - 1; i++) {
        const minDistanceVertex = findMinDistanceVertex(distances, visited);
        visited[minDistanceVertex] = true;

        for (let j = 0; j < numVertices; j++) {
            if (!visited[j] && adjacencyMatrix[minDistanceVertex][j] !== null && adjacencyMatrix[minDistanceVertex][j].distance !== null && distances[minDistanceVertex] + adjacencyMatrix[minDistanceVertex][j].distance < distances[j]) {
                distances[j] = distances[minDistanceVertex] + adjacencyMatrix[minDistanceVertex][j].distance;
                previous[j] = minDistanceVertex;
            }
        }
    }

    const path = [];
    let vertex = destination;
    while (vertex !== null) {
        // Push vertex details to the path array
        if (adjacencyMatrix[vertex] && adjacencyMatrix[vertex][vertex] && adjacencyMatrix[vertex][vertex].name) {
            path.unshift({
                vertex,
                name: adjacencyMatrix[vertex][vertex].name,
                latitude: adjacencyMatrix[vertex][vertex].latitude,
                longitude: adjacencyMatrix[vertex][vertex].longitude
            });
        }
        // Move to the previous vertex in the path
        vertex = previous[vertex];
    }

    return path;
}

function findMinDistanceVertex(distances, visited) {
    let minDistance = Infinity;
    let minDistanceVertex = -1;

    for (let i = 0; i < distances.length; i++) {
        if (!visited[i] && distances[i] < minDistance) {
            minDistance = distances[i];
            minDistanceVertex = i;
        }
    }

    return minDistanceVertex;
}

app.post('/shortest-path', (req, res) => {
    try {
        const { currentLatitude, currentLongitude, destinationLatitude, destinationLongitude } = req.body;

        // Find the nearest source and destination vertices
        const nearestSourceVertex = findNearestVertex(currentLatitude, currentLongitude);
        const nearestDestinationVertex = findNearestVertex(destinationLatitude, destinationLongitude);

        // Find the shortest path
        const shortestPath = dijkstra(adjacencyMatrix, nearestSourceVertex, nearestDestinationVertex);

        res.status(200).json({ shortestPath });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.toString() });
    }
});

function findNearestVertex(latitude, longitude) {
    let minDistance = Infinity;
    let nearestVertex = -1;

    for (let i = 0; i < adjacencyMatrix.length; i++) {
        if (adjacencyMatrix[i] && adjacencyMatrix[i][i] && adjacencyMatrix[i][i].distance !== null) {
            const distance = calculateDistance(latitude, longitude, adjacencyMatrix[i][i].latitude, adjacencyMatrix[i][i].longitude);
            if (distance < minDistance) {
                minDistance = distance;
                nearestVertex = i;
            }
        }
    }

    return nearestVertex;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

module.exports = app;
