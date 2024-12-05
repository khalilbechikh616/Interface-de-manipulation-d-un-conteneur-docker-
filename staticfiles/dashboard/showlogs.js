// Show Logs button click event
$("#show-logs").click(function() {
    var csrfToken = getCsrfToken();
    var lastMinutes = $("#last-minutes").val()*60;
    var lines = $("#lines").val();

    $.ajax({
        type: 'GET',
        url: '/get_container_logs/',  
        data: { 
            NM: lastMinutes,  
            NL: lines  
        },  
        contentType: 'application/json',
        headers: { 'X-CSRFToken': csrfToken },
        success: function(response) {
            // Open a new window or tab with the logs
            var newWindow = window.open('', '_blank');
            newWindow.document.write('<html><head><title>Container Logs</title>');
            newWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css">');
            newWindow.document.write('</head><body>');
            newWindow.document.write('<div class="container"><h2>Container Logs</h2>');
            
            // Add the download button at the top right of the page
            newWindow.document.write('<button class="download-button btn btn-success" style="position: absolute; top: 0; right: 0; margin: 10px;" onclick="downloadCSV()">Download Logs</button>');
            
            var tableHtml = '<table class="table table-striped" id="logs-table">';
            tableHtml += '<thead><tr><th>Log Index</th><th>Log Message</th></tr></thead><tbody>';
            
            // Populate the table with the logs
            for (var i = 0; i < response.logs.length; i++) {
                tableHtml += '<tr><td>' + (i + 1) + '</td><td>' + response.logs[i] + '</td></tr>';
            }
            
            tableHtml += '</tbody></table>';
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
            newWindow.document.write('    downloadLink.download = "container_logs.csv";');
            newWindow.document.write('    downloadLink.href = window.URL.createObjectURL(csvFile);');
            newWindow.document.write('    downloadLink.click();');
            newWindow.document.write('}');
            newWindow.document.write('<\/script>');
            
            newWindow.document.write('</div></body></html>');
            newWindow.document.close();
        },
        error: function(xhr) {
            alert('Failed to fetch container logs. Status code: ' + xhr.status);
        }
    });
});

// Function to get CSRF token from the cookie
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