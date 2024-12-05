$(document).ready(function() {
    var csrfToken = getCsrfToken();

    // Show Container Details button click event
    $("#show-container-details").click(function() {
        $.ajax({
            type: 'GET',
            url: '/get_container_details/',  // URL updated to match urls.py
            data: { container_id: 'f25f4282f55b' },  // Pass container_id as a query parameter
            contentType: 'application/json',
            headers: { 'X-CSRFToken': csrfToken },
            success: function(response) {
                // Open a new window or tab with the container details
                var newWindow = window.open('', '_blank');
                newWindow.document.write('<html><head><title>Container Details</title>');
                newWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css">');
                newWindow.document.write('</head><body>');
                newWindow.document.write('<div class="container"><h2>Container Details</h2>');
                
                // Add the download button at the top right of the page
                newWindow.document.write('<button class="download-button btn btn-success" style="position: absolute; top: 0; right: 0; margin: 10px;" onclick="downloadCSV()">Download Container Details</button>');
                
                var tableHtml = '<table class="table table-striped" id="container-table">';
                tableHtml += '<thead><tr><th>Key</th><th>Value</th></tr></thead><tbody>';
                
                // Populate the table with the container details
                for (var key in response.container_info) {
                    if (response.container_info.hasOwnProperty(key)) {
                        tableHtml += '<tr><td>' + key + '</td><td>' + JSON.stringify(response.container_info[key]) + '</td></tr>';
                    }
                }
                
                tableHtml += '</tbody></table>';
                newWindow.document.write(tableHtml);
                
                newWindow.document.write('<script>');
                newWindow.document.write('function downloadCSV() {');
                newWindow.document.write('    var csv = \'\';');
                newWindow.document.write('    var rows = document.querySelectorAll("#container-table tr");');
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
                newWindow.document.write('    downloadLink.download = "container_details.csv";');
                newWindow.document.write('    downloadLink.href = window.URL.createObjectURL(csvFile);');
                newWindow.document.write('    downloadLink.click();');
                newWindow.document.write('}');
                newWindow.document.write('<\/script>');
                
                newWindow.document.write('</div></body></html>');
                newWindow.document.close();
            },
            error: function(xhr) {
                alert('Failed to fetch container details. Status code: ' + xhr.status);
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
});