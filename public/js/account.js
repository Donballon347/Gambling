document.getElementById('switch-to-register').addEventListener('click', function() {
   document.getElementById('login-form').style.display = 'none';
   document.getElementById('register-form').style.display = 'block';
});

document.getElementById('switch-to-login').addEventListener('click', function() {
   document.getElementById('login-form').style.display = 'block';
   document.getElementById('register-form').style.display = 'none';
});