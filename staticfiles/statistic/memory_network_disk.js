document.addEventListener('DOMContentLoaded', function() {
    const memoryUsageElement = document.getElementById('memory-usage');
    const networkChartElement = document.getElementById('network-chart');
    const diskChartElement = document.getElementById('disk-chart');

    let networkChart, diskChart;

    function updateChartData(chart, data) {
        if (chart) {
            chart.data.datasets.forEach((dataset, index) => {
                dataset.data = data[index];
            });
            chart.update();
        }
    }

    function fetchStats() {
        fetch('/statistic/memory_network_disk/')
            .then(response => response.json())
            .then(data => {
                // Memory Usage
                if (data.memory_usage !== undefined) {
                    if (memoryUsageElement) {
                        memoryUsageElement.textContent = `Memory Usage: ${data.memory_usage}%`;
                    }
                }

                // Network Traffic (Bar Chart)
                if (data.network_rx !== undefined && data.network_tx !== undefined) {
                    if (networkChartElement) {
                        const ctxNetwork = networkChartElement.getContext('2d');
                        if (!networkChart) {
                            networkChart = new Chart(ctxNetwork, {
                                type: 'bar',
                                data: {
                                    labels: ['RX', 'TX'],
                                    datasets: [{
                                        label: 'Network Traffic',
                                        data: [data.network_rx, data.network_tx],
                                        backgroundColor: ['#ffce56', '#4bc0c0'],
                                    }],
                                },
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        x: { display: true },
                                        y: { display: true }
                                    }
                                }
                            });
                        } else {
                            updateChartData(networkChart, [[data.network_rx, data.network_tx]]);
                        }
                    }
                }

                // Disk I/O (Bar Chart)
                if (data.disk_read !== undefined && data.disk_write !== undefined) {
                    if (diskChartElement) {
                        const ctxDisk = diskChartElement.getContext('2d');
                        if (!diskChart) {
                            diskChart = new Chart(ctxDisk, {
                                type: 'bar',
                                data: {
                                    labels: ['Read', 'Write'],
                                    datasets: [{
                                        label: 'Disk I/O',
                                        data: [data.disk_read, data.disk_write],
                                        backgroundColor: ['#e7e9ed', '#c9cbcf'],
                                    }],
                                },
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        x: { display: true },
                                        y: { display: true }
                                    }
                                }
                            });
                        } else {
                            updateChartData(diskChart, [[data.disk_read, data.disk_write]]);
                        }
                    }
                }
            })
            .catch(error => console.error('Error fetching stats:', error));
    }

    // Fetch stats every 10 seconds
    setInterval(fetchStats, 10000);

    // Initial fetch
    fetchStats();
});
