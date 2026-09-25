function showPword() {
  var x = document.getElementById("password-input");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

function showDOBhelp() {
  document.getElementById('signUpHelpBox').style.display = 'inline';
}

function hideDOBhelp() {
  document.getElementById('signUpHelpBox').style.display = 'none';
}

async function signUp() {
  const username = document.getElementById('username-input').value || null;
  const password = document.getElementById('password-input').value || null;
  const dob = document.getElementById('dob').value || null;
  const birthYear = new Date(dob).getFullYear();
  const thisYear = new Date().getFullYear();
  // validation
  // note that checking whether not not username exists in users table happens in the backend in main.js
  if (username === null || password === null) {
    alert("Please fill in both username and password.");
    return;
  } else if (username.length > 24 || username.length < 6) {
    alert("Username must be 6-24 characters long (inclusive).");
    return;
  } else if (!validatePassword(password)) {
    alert("Make sure your password obeys the bullet points below.");
    return;
  } else if (birthYear > thisYear) {
    alert("Date of birth can't be in the future.")
    return;
  }
  // initiate loading
  const btn = document.getElementById('signUpButton');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="loader"></span>';

  // sign up
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, dob })
  });
  const data = await res.json();
  console.log(data);
  // stop loading
  btn.disabled = false;
  btn.innerHTML = originalText;
  if (data.error) {
    alert(data.error);
  } else {
    document.getElementById('successMsg').style.display = 'block';
    window.location.href = 'quiz.html';
  }
}

function validatePassword(password) {
  let upper = false;
  let lower = false;
  let num = false;
  let spec = false;
  for (const character of password) {
    if (character >= 'A' && character <= 'Z') {
      upper = true;
    } else if (character >= 'a' && character <= 'z') {
      lower = true;
    } else if (character >= '0' && character <= '9') {
      num = true;
    } else {
      spec = true;
    }
    if (upper && lower && num && spec) {
      break;
    }
  }
  return upper && lower && num && spec;
}