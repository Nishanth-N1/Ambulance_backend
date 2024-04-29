// const express = require('express');
// const bodyParser = require('body-parser');
// const { digraph } = require('graphviz');

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(bodyParser.json());

// app.post('/create-graph', async (req, res) => {
//   console.log('Received create-graph request');

//   const { signals } = req.body;
//   console.log('Signals:', signals);

//   const graph = digraph("TrafficSignals");

//   signals.forEach(async signal => {
//     graph.addNode(signal.name);
//     await signal.nearestSignals.forEach(nearestSignal => {
//       graph.addEdge(signal.name, nearestSignal);
//       //res.status(200).json({ success: true, message: 'Graph created and saved'});
//     });
//   });

//   const fileName = 'traffic_graph.png';
//   const renderPromise = new Promise((resolve, reject) => {
//     graph.render('png', fileName, (error, result) => {
//         if (error) {
//             console.error('Error creating graph:', error);
//             reject(error); // Reject the promise with the error
//         } else {
//             console.log('Graph created and saved as', fileName);
//             resolve(fileName); // Resolve the promise with the file name
//         }
//     });
// });

// // Send response once the promise is settled
// renderPromise.then((fileName) => {
//     res.status(200).json({ success: true, message: 'Graph created and saved', fileName: fileName });
// }).catch((error) => {
//     res.status(500).json({ success: false, message: 'Error creating graph', error: error.message });
// });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


const express = require('express');
const fs = require('fs');
const create_graph = require('./router/create-graph.js');
const find_signal = require('./router/find-signals.js');
const register = require('./router/regsiter');
const esp = require('./router/esp.js');

const cors = require('cors');

const db = require('./models/database');
const app = express();
app.use(express.json());
app.use(cors());

function convertToAdjacencyMatrix(signals) {
    const signalIndices = {};
    signals.forEach((signal, index) => {
        signalIndices[signal.name] = index;
    });

    const numSignals = signals.length;
    const adjacencyMatrix = Array.from({ length: numSignals }, () => Array(numSignals).fill(Infinity));

    signals.forEach(signal => {
        const signalIndex = signalIndices[signal.name];
        signal.nearestSignals.forEach(neighbor => {
            const neighborName = neighbor.name;
            const neighborDistance = neighbor.distance;
            const neighborIndex = signalIndices[neighborName];
            adjacencyMatrix[signalIndex][neighborIndex] = neighborDistance;
        });
    });

    return adjacencyMatrix;
}
app.use("/graph",create_graph);
app.use("/signal",find_signal);
app.use("/auth",register);
app.use("/esp",esp);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
