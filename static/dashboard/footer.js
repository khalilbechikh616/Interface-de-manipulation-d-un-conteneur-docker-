$(document).ready(function() {
    // Function to check footer visibility
    function checkFooterVisibility() {
      var scrollTop = $(window).scrollTop();
      var windowHeight = $(window).height();
      var documentHeight = $(document).height();
  
      console.log('Checking footer visibility...');
      console.log('scrollTop:', scrollTop);
      console.log('windowHeight:', windowHeight);
      console.log('documentHeight:', documentHeight);
  
      if (scrollTop >= 100) { // Show footer when scrolled down 100 pixels
        console.log('Showing footer...');
        $('.footer').addClass('show');
      } else {
        console.log('Hiding footer...');
        $('.footer').removeClass('show');
      }
    }
  
    // Call the checkFooterVisibility function on scroll
    $(window).scroll(function() {
      checkFooterVisibility();
    });
  
    // Call the checkFooterVisibility function on page load
    checkFooterVisibility();
  });
 
  document.addEventListener('DOMContentLoaded', (event) => {
    const logoutLink = document.getElementById('logout-link');
    
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior
            window.location.href = '/login/'; // Redirect to the login page
        });
    }
});

