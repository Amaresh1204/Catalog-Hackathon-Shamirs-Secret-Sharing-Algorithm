const { createInterface } = require('readline');
const fs = require('fs');

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});

function calculateShamirSecret(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        const { keys, ...points } = data;

        if (!keys || !keys.n || !keys.k) {
            throw new Error("Invalid input format. Expected 'keys' object with 'n' and 'k' values.");
        }

        const n = keys.n;
        const k = keys.k;

        if (Object.keys(points).length !== n) {
            throw new Error(`Expected ${n} points, but found ${Object.keys(points).length}.`);
        }

        const convertedPoints = Object.entries(points).map(([x, point]) => ({
            x: parseInt(x),
            y: parseInt(point.value, parseInt(point.base))
        }));

        let secret = 0;

        for (let i = 0; i < k; i++) {
            let term = convertedPoints[i].y;
            for (let j = 0; j < k; j++) {
                if (i !== j) {
                    term *= -convertedPoints[j].x / (convertedPoints[i].x - convertedPoints[j].x);
                }
            }
            secret += term;
        }

        return secret.toFixed(2);
    } catch (error) {
        throw error;
    }
}

rl.question('Enter the path to the JSON file: ', (filePath) => {
    try {
        const jsonData = fs.readFileSync(filePath, 'utf8');
        const secret = calculateShamirSecret(jsonData);
        console.log(`The constant term (secret) is: ${secret}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
    rl.close();
});