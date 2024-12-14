const http = require('http');
const os = require('os');

// Server configuration
const PORT = process.env.PORT || 3000;

// Get container/system information
const getSystemInfo = () => {
    const networkInterfaces = os.networkInterfaces();
    const ipAddresses = Object.values(networkInterfaces)
        .flat()
        .filter(details => details.family === 'IPv4')
        .map(details => details.address)
        .join(', ');

    return {
        hostname: os.hostname(),
        platform: os.platform(),
        architecture: os.arch(),
        cpus: os.cpus().length,
        memory: `${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`,
        ipAddresses: ipAddresses,
        uptime: `${Math.floor(os.uptime() / 60)} minutes`,
        nodeVersion: process.version
    };
};

// HTML template
const getResponseHTML = () => {
    const sysInfo = getSystemInfo();
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Docker Multi-Stage Build Demo</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            width: 100%;
        }
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #2980b9;
            padding-bottom: 15px;
        }
        .header i {
            font-size: 2.5em;
            color: #2980b9;
            margin-right: 15px;
        }
        .header h1 {
            color: #2c3e50;
            margin: 0;
            font-size: 2em;
        }
        .info-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .info-item {
            padding: 10px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid #3498db;
        }
        .info-item h3 {
            margin: 0 0 5px 0;
            color: #2980b9;
            font-size: 0.9em;
        }
        .info-item p {
            margin: 0;
            color: #34495e;
            font-size: 0.85em;
            word-break: break-all;
        }
        .timestamp {
            color: #7f8c8d;
            text-align: right;
            font-size: 0.9em;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <i class="fa-brands fa-docker"></i>
            <h1>Docker Multi-Stage Build Demo</h1>
        </div>
        <div class="info-section">
            <p>Welcome to our Node.js application running in an optimized Docker container!</p>
            <p>This container was built using multi-stage builds for optimal size and performance.</p>
        </div>
        <div class="info-grid">
            <div class="info-item">
                <h3><i class="fas fa-microchip"></i> Hostname</h3>
                <p>${sysInfo.hostname}</p>
            </div>
            <div class="info-item">
                <h3><i class="fas fa-network-wired"></i> IP Addresses</h3>
                <p>${sysInfo.ipAddresses}</p>
            </div>
            <div class="info-item">
                <h3><i class="fas fa-server"></i> Platform</h3>
                <p>${sysInfo.platform} (${sysInfo.architecture})</p>
            </div>
            <div class="info-item">
                <h3><i class="fas fa-memory"></i> Memory</h3>
                <p>${sysInfo.memory}</p>
            </div>
            <div class="info-item">
                <h3><i class="fab fa-node-js"></i> Node Version</h3>
                <p>${sysInfo.nodeVersion}</p>
            </div>
            <div class="info-item">
                <h3><i class="fas fa-clock"></i> Uptime</h3>
                <p>${sysInfo.uptime}</p>
            </div>
        </div>
        <div class="timestamp">
            Server Time: ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>
`;
};

// Create HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Connection': 'close'
    });
    res.end(getResponseHTML());
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Error handling
server.on('error', (error) => {
    console.error('Server error:', error);
});

// Handle process termination
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server shutdown completed');
        process.exit(0);
    });
});