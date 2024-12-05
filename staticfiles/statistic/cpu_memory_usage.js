let cpuChart = null;
let memoryChart = null;

function createChart(ctx, type, data, options) {
    if (ctx.chart) {
        ctx.chart.destroy(); // Destroy existing chart if present
    }
    return new Chart(ctx, {
        type: type,
        data: data,
        options: options
    });
}

function fetchCpuMemoryStats() {
    fetch('/statistic/cpu_memory_usage/')
        .then(response => response.json())
        .then(data => {
            const labels = data.cpu_times.map(time => time.toString());
            const cpuUsageData = data.cpu_values;
            const memoryUsageData = data.memory_values;
            
            // CPU Usage Over Time (Line Chart)
            const cpuCurveChartElement = document.getElementById('cpu-curve-chart');
            if (cpuCurveChartElement) {
                const ctxCpuCurve = cpuCurveChartElement.getContext('2d');
                if (cpuChart) {
                    cpuChart.destroy(); // Destroy existing chart instance
                }
                cpuChart = createChart(ctxCpuCurve, 'line', {
                    labels: labels,
                    datasets: [{
                        label: 'CPU Usage Over Time',
                        data: cpuUsageData,
                        borderColor: '#ff6384',
                        fill: false,
                        tension: 0.1
                    }]
                }, {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            display: true,
                            title: { display: true, text: 'Time (seconds)' }
                        },
                        y: {
                            display: true,
                            title: { display: true, text: 'CPU Usage (%)' }
                        }
                    }
                });
            }

            // Memory Usage Over Time (Line Chart)
            const memoryCurveChartElement = document.getElementById('memory-curve-chart');
            if (memoryCurveChartElement) {
                const ctxMemoryCurve = memoryCurveChartElement.getContext('2d');
                if (memoryChart) {
                    memoryChart.destroy(); // Destroy existing chart instance
                }
                memoryChart = createChart(ctxMemoryCurve, 'line', {
                    labels: labels,
                    datasets: [{
                        label: 'Memory Usage Over Time',
                        data: memoryUsageData,
                        borderColor: '#36a2eb',
                        fill: false,
                        tension: 0.1
                    }]
                }, {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            display: true,
                            title: { display: true, text: 'Time (seconds)' }
                        },
                        y: {
                            display: true,
                            title: { display: true, text: 'Memory Usage (bytes)' }
                        }
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching CPU and memory stats:', error));
}

setInterval(fetchCpuMemoryStats, 10000);
fetchCpuMemoryStats();
