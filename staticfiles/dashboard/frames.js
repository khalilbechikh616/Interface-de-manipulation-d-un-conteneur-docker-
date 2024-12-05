$(document).ready(function() {
    // Initially hide the forms
    $('#manage-containers-form').addClass('hidden');
    $('#manage-logs-form').addClass('hidden');

    // Toggle form visibility for manage-containers
    $('#manage-containers-link').click(function() {
        $('#manage-logs-form').addClass('hidden'); // Hide logs form
        $('#manage-containers-form').toggleClass('hidden visible');
    });

    // Toggle form visibility for manage-logs
    $('#manage-logs-link').click(function() {
        $('#manage-containers-form').addClass('hidden'); // Hide containers form
        $('#manage-logs-form').toggleClass('hidden visible');
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

    var csrfToken = getCsrfToken();

    // Start button click event
    $("#start-container").click(function() {
        $.ajax({
            type: 'POST',
            url: '/start_container/',
            data: JSON.stringify({ container_id: $('#container-id').val() }),
            contentType: 'application/json',
            headers: { 'X-CSRFToken': csrfToken },
            success: function(response) {
                alert(response.msg.includes("started successfully") ? response.msg : 'Container start failed');
                $('#start-container').addClass('hidden');
                $('#stop-container').removeClass('hidden');
            },
            error: function(xhr) {
                alert('Failed to start container. Status code: ' + xhr.status);
            }
        });
    });

    // Stop button click event
    $("#stop-container").click(function() {
        $.ajax({
            type: 'POST',
            url: '/stop_container/',
            data: JSON.stringify({ container_id: $('#container-id').val() }),
            contentType: 'application/json',
            headers: { 'X-CSRFToken': csrfToken },
            success: function(response) {
                alert(response.msg.includes("stopped successfully") ? response.msg : 'Container stop failed');
                $('#stop-container').addClass('hidden');
                $('#start-container').removeClass('hidden');
            },
            error: function(xhr) {
                alert('Failed to stop container. Status code: ' + xhr.status);
            }
        });
    });

    // Show logs button click event
    $("#show-logs").click(function() {
        var lastMinutes = $("#last-minutes").val();
        var lines = $("#lines").val();

        $.ajax({
            type: 'GET',
            url: '/get_container_logs/', // Adjust this endpoint based on your Django view
            data: {
                last_minutes: lastMinutes,
                lines: lines
            },
            success: function(response) {
                // Handle success - maybe show logs in a table or modal
                console.log(response); // Replace with actual handling code
            },
            error: function(xhr) {
                alert('Failed to retrieve logs. Status code: ' + xhr.status);
            }
        });
    });

    // Show container details button click event
    $("#show-container-details").click(function() {
        $.ajax({
            type: 'GET',
            url: '/get_container_details/', // Adjust this endpoint based on your Django view
            success: function(response) {
                // Handle success - maybe show container details in a table or modal
                console.log(response); // Replace with actual handling code
            },
            error: function(xhr) {
                alert('Failed to retrieve container details. Status code: ' + xhr.status);
            }
        });
    });
});
