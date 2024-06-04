
const https = require('https');
const fs =  require('fs');
const path = require('path');


const testUrl = "https://proof.ovh.net/files/10Mb.dat";


const measureSpeed = async (url) => {
    try {
        return await new Promise((resolve, reject) => {
        const startTime = Date.now();
        let downloadedBytes = 0;

        const request = https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (status code: ${res.statusCode})`));
                return;
            }

            res.on('data', chunk => {
                downloadedBytes += chunk.length;
            });
            

            res.on('end', () => {
                const endTime = Date.now();
                const duration = (endTime - startTime) / 1000; 
                console.log(duration);
                console.log(`${downloadedBytes}bytes`);
                const speedMbps = (downloadedBytes * 8) / (duration * 1000000);
                resolve(speedMbps.toFixed(2));
            });

        });

        request.on('error', (err) => {
            reject(err);
        });
        });
        

    } catch (error) {
        console.error('Error calculating speed', error);
        throw error;
    }
}

var logFilePath =  path.join(__dirname, 'speed-data.json');


const saveSpeedData = async (data) => {
    try {
        let logs = [];

        try {
            const data = await fs.promises.readFile(logFilePath);
            if (data.length > 0){
                logs = JSON.parse(data);
            }
        } catch (error) {
            if (error.code !== 'ENOENT'){
                throw err;
            }
        }

        logs.push(data);

        await fs.promises.writeFile(logFilePath, JSON.stringify(logs, null, 2));
        console.log('Speed data saved!')

    } catch (error) {
        console.error('Error saving speed data', error)
    }
}


const checkSpeed = async () => {
    try {
        const downloadSpeed = await measureSpeed(testUrl);

        const speedData = {
            timeStamp: new Date().toLocaleString("en-GB", {dateStyle: "short", timeStyle: "medium"}),
            downloadSpeed: downloadSpeed + 'Mbps',
            //upload
            //ping
        };

        
        await saveSpeedData(speedData);
        console.log(speedData);

    } catch (error) {
        console.error('Error during speed test', error);
    }
}


const calculateDailyAverage = async () => {
    try {
        const avgFilePath =  path.join(__dirname, 'averages.json');
        const rawData = await fs.promises.readFile(logFilePath);
        const log = JSON.parse(rawData);
        const dailyAvg = {};

        logs.forEach(entry => {
            const date = entry.timeStamp.split(',')[0];
            const speed = parseFloat(entry,downloadSpeed.replace('Mbps', ''));

            if (!dailyAvg[date]) {
                dailyAvg[date] = { totalSpeed: 0, count: 0, peak: { speed: speed, time: entry.timeStamp }, trough: { speed: speed, time: entry.timeStamp } };
            }

            dailyAvg[date].totalSpeed += speed;
            dailyAvg[date].count += 1;

            if (speed > dailyAvg[date].peak.speed) {
                dailyAvg[date].peak = { speed: speed, time: entry.timeStamp };
            }

            if (speed < dailyAvg[date].trough.speed) {
                dailyAvg[date].trough = { speed: speed, time: entry.timeStamp };
            }

        });

        const averages = {};
        for (const [date, data] of Object.entries(dailyAvg)) {
            averages[date] = {
                averageSpeed: (data.totalSpeed / data.count).toFixed(2) + 'Mbps',
                peak: data.peak,
                trough: data.trough
            };
        }

        await fs.promises.writeFile(avgFilePath, JSON.stringify(averages, null, 2));
        console.log('Daily averages saved!');

    } catch (error) {
        console.error('Error in daily averages',error)
    }
}

const hourlyCheck = () => {
    setInterval(checkSpeed, 60 * 60 * 1000);
}

const twelveHourlyCheck = () => {
    setInterval(calculateDailyAverage, 12 * 60 * 60 * 1000);
}

checkSpeed();

hourlyCheck();

twelveHourlyCheck();