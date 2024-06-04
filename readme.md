# Broadband Speed Tester

This Node.js script measures broadband speed by downloading a file from a specified URL and calculates the download speed in Mbps. It saves the speed data along with a timestamp to a JSON file and calculates daily averages, peaks, and troughs.

## Requirements

- Node.js installed on your system

## Installation

1. Clone this repository:

    git clone https://github.com/LewieM1995/Speedtester.git

2. Navigate to the project directory:

    cd Speedtester

3. Install dependencies:

    npm install

## Usage

1. Modify the `testUrl` variable in `index.js` to specify the URL of the file you want to use for speed testing.
2. Run the script:

    node index.js

3. The script will perform an hourly speed test and save the results to `speed-data.json`. It will also calculate daily averages, peaks, and troughs every 12 hours and save the results to `averages.json`.

## File Descriptions

- `index.js`: Main script file containing functions for measuring speed, saving speed data, checking speed, and calculating daily averages.
- `speed-data.json`: JSON file containing speed test data with timestamps.
- `averages.json`: JSON file containing daily average speed, peak speed, and trough speed data.

## Contributing

Contributions are welcome! If you have any suggestions or improvements, feel free to submit a pull request.
