$(document).ready(function () {
  $('#manage-containers-form').addClass('hidden');
    $('#manage-logs-form').addClass('hidden');

    // Toggle form visibility for manage-containers
    $('#manage-containers-link').click(function () {
        $('#manage-logs-form').addClass('hidden'); // Hide logs form
        $('#manage-containers-form').toggleClass('hidden visible');
    });

    // Toggle form visibility for manage-logs
    $('#manage-logs-link').click(function () {
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
    $("#start-container").click(function () {
        $.ajax({
            type: 'POST',
            url: '/start_container/',
            data: JSON.stringify({ container_id: $('#container-id').val() }),
            contentType: 'application/json',
            headers: { 'X-CSRFToken': csrfToken },
            success: function (response) {
                alert(response.msg.includes("started successfully") ? response.msg : 'Container start failed');
                $('#start-container').addClass('hidden');
                $('#stop-container').removeClass('hidden');
            },
            error: function (xhr) {
                alert('Failed to start container. Status code: ' + xhr.status);
            }
        });
    });

    // Stop button click event
    $("#stop-container").click(function () {
        $.ajax({
            type: 'POST',
            url: '/stop_container/',
            data: JSON.stringify({ container_id: $('#container-id').val() }),
            contentType: 'application/json',
            headers: { 'X-CSRFToken': csrfToken },
            success: function (response) {
                alert(response.msg.includes("stopped successfully") ? response.msg : 'Container stop failed');
                $('#stop-container').addClass('hidden');
                $('#start-container').removeClass('hidden');
            },
            error: function (xhr) {
                alert('Failed to stop container. Status code: ' + xhr.status);
            }
        });
    });

    

    // Show container details button click event
    $("#show-container-details").click(function () {
        $.ajax({
            type: 'GET',
            url: '/get_container_details/', // Adjust this endpoint based on your Django view
            success: function (response) {
                // Handle success - maybe show container details in a table or modal
                console.log(response); // Replace with actual handling code
            },
            error: function (xhr) {
                alert('Failed to retrieve container details. Status code: ' + xhr.status);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const modifyOdooConfigLink = document.getElementById('modify-odoo-config-link');
    const modifyOdooConfigForm = document.getElementById('modify-odoo-config-form');
    const saveConfigButton = document.getElementById('save-config');
    const odooConfigForm = document.getElementById('odoo-config-form');

    // Use the new URL structure for fetching the Odoo configuration
    const editOdooConfUrl = '/odoo-conf/edit/';  // The URL from your updated urls.py

    // Toggle form visibility when clicking on the frame
    modifyOdooConfigLink.addEventListener('click', function () {
        modifyOdooConfigForm.classList.toggle('visible');

        if (modifyOdooConfigForm.classList.contains('visible')) {
            // Fetch the current Odoo configuration content
            fetch(editOdooConfUrl)
                .then(response => response.text())  // Handle the response as text
                .then(data => {
                    // Update the textarea with the fetched configuration content
                    document.getElementById('conf-content').value = data;
                })
                .catch(error => {
                    console.error('Error fetching Odoo configuration:', error);
                });
        }
    });

    // Handle form submission when saving the configuration
    saveConfigButton.addEventListener('click', function (event) {
        event.preventDefault();  // Prevent default form submission

        // Get the raw text from the textarea (assumed to have id 'conf-content')
        const configContent = document.getElementById('conf-content').value;

        fetch(editOdooConfUrl, {
            method: 'POST',
            body: configContent,  // Send the configuration content as plain text
            headers: {
                'Content-Type': 'text/plain',  // Explicitly set the content type to plain text
                'X-CSRFToken': getCookie('csrftoken')  // Include CSRF token for security
            }
        })
        .then(response => response.text())  // Handle the response as plain text
        .then(data => {
            // Since everything went well, display the success message
            alert('Odoo configuration updated, Odoo container restarted successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the configuration.');
        });
    });

    // Utility function to get the CSRF token from cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
