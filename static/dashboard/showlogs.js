$(document).ready(function() {
    var csrfToken = getCsrfToken();

    $("#show-logs").click(function() {
        var lastMinutes = $("#last-minutes").val();
        var lines = $("#lines").val();
        
        $.ajax({
            type: 'GET',
            url: '/get_container_logs/',  
            data: { 
                container_id: 'f25f4282f55b',
                last_minutes: lastMinutes,
                lines: lines
            },
            headers: { 'X-CSRFToken': csrfToken },
            success: function(response) {
                console.log('Logs fetched successfully');  
                console.log('Response:', response);  
                
                var newWindow = window.open('', '_blank');
                if (newWindow) {
                    newWindow.document.write('<html><head><title>Logs</title>');
                    newWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css">');
                    newWindow.document.write('<style> .download-btn { position: absolute; top: 10px; right: 10px; } </style>');
                    newWindow.document.write('</head><body>');
                    newWindow.document.write('<div class="container position-relative"><h2>Logs</h2>');
                    
                    var tableHtml = '<table class="table table-striped" id="logs-table">';
                    tableHtml += '<thead><tr><th>#</th><th>Log Message</th></tr></thead><tbody>';
                    
                    if (response.logs && Array.isArray(response.logs)) {
                        response.logs.forEach(function(log, index) {
                            tableHtml += '<tr><td>' + (index + 1) + '</td><td>' + (log || 'N/A') + '</td></tr>';
                        });
                    } else {
                        console.error('Invalid log data:', response.logs);
                    }
                    
                    tableHtml += '</tbody></table>';
                    tableHtml += '<button class="btn btn-success download-btn" onclick="downloadCSV()">Download Data</button>';
                    newWindow.document.write(tableHtml);
                    
                    newWindow.document.write('<script>');
                    newWindow.document.write('function downloadCSV() {');
                    newWindow.document.write('    var csv = \'\';');
                    newWindow.document.write('    var rows = document.querySelectorAll("#logs-table tr");');
                    newWindow.document.write('    for (var i = 0; i < rows.length; i++) {');
                    newWindow.document.write('        var cols = rows[i].querySelectorAll("td, th");');
                    newWindow.document.write('        var row = [];');
                    newWindow.document.write('        for (var j = 0; j < cols.length; j++) {');
                    newWindow.document.write('            row.push(cols[j].innerText);');
                    newWindow.document.write('        }');
                    newWindow.document.write('        csv += row.join(",") + "\\n";');
                    newWindow.document.write('    }');
                    newWindow.document.write('    var csvFile = new Blob([csv], { type: "text/csv" });');
                    newWindow.document.write('    var downloadLink = document.createElement("a");');
                    newWindow.document.write('    downloadLink.download = "logs.csv";');
                    newWindow.document.write('    downloadLink.href = window.URL.createObjectURL(csvFile);');
                    newWindow.document.write('    downloadLink.click();');
                    newWindow.document.write('}');
                    newWindow.document.write('<\/script>');
                    
                    newWindow.document.write('</div></body></html>');
                    newWindow.document.close();
                } else {
                    console.error('Failed to open new window');  
                }
            },
            error: function(xhr) {
                console.error('Failed to fetch logs. Status code: ' + xhr.status);  
            }
        });
    });

    function getCsrfToken() {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.substring(0, 10) === 'csrftoken=') {
                    cookieValue = decodeURIComponent(cookie.substring(10));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
