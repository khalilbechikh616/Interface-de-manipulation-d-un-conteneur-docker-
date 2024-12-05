document.addEventListener('DOMContentLoaded', function() {
    function fetchStats() {
        fetch('/statistic/realtime/')
            .then(response => response.json())
            .then(data => {
                // Check if elements are present before updating
                const cpuChartElement = document.getElementById('cpu-chart');
                const memoryChartElement = document.getElementById('memory-chart');
                const networkChartElement = document.getElementById('network-chart');
                const diskChartElement = document.getElementById('disk-chart');

                if (cpuChartElement) {
                    const ctxCpu = cpuChartElement.getContext('2d');
                    new Chart(ctxCpu, {
                        type: 'doughnut',
                        data: {
                            labels: ['CPU Usage'],
                            datasets: [{
                                label: 'CPU Usage',
                                data: [data.cpu_usage],
                                backgroundColor: ['#ff6384'],
                            }],
                        },
                    });
                }

                if (memoryChartElement) {
                    const ctxMemory = memoryChartElement.getContext('2d');
                    new Chart(ctxMemory, {
                        type: 'doughnut',
                        data: {
                            labels: ['Memory Usage'],
                            datasets: [{
                                label: 'Memory Usage',
                                data: [data.memory_usage],
                                backgroundColor: ['#36a2eb'],
                            }],
                        },
                    });
                }

                if (networkChartElement) {
                    const ctxNetwork = networkChartElement.getContext('2d');
                    new Chart(ctxNetwork, {
                        type: 'bar',
                        data: {
                            labels: ['RX', 'TX'],
                            datasets: [{
                                label: 'Network Traffic',
                                data: [data.network_rx, data.network_tx],
                                backgroundColor: ['#ffce56', '#4bc0c0'],
                            }],
                        },
                    });
                }

                if (diskChartElement) {
                    const ctxDisk = diskChartElement.getContext('2d');
                    new Chart(ctxDisk, {
                        type: 'bar',
                        data: {
                            labels: ['Read', 'Write'],
                            datasets: [{
                                label: 'Disk I/O',
                                data: [data.disk_read, data.disk_write],
                                backgroundColor: ['#e7e9ed', '#c9cbcf'],
                            }],
                        },
                    });
                }
            })
            .catch(error => console.error('Error fetching stats:', error));
    }

    // Fetch stats every 10 seconds
    setInterval(fetchStats, 10000);

    // Initial fetch
    fetchStats();
});
