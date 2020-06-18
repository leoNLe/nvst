$(document).ready(() => {
  // Getting references to our form and input
  const signUpForm = $("form.signup");
  const emailInput = $("input#email-input");
  const passwordInput = $("input#password-input");
  const fName = $("input#fname");
  const lName = $("input#lname");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      fname: fName.val().trim(),
      lname: lName.val().trim()
    };

    if (
      !userData.email ||
      !userData.password ||
      !userData.fname ||
      !userData.lname
    ) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(
      userData.email,
      userData.password,
      userData.fname,
      userData.lname
    );
    emailInput.val("");
    passwordInput.val("");
    fName.val("");
    lName.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password, fname, lname) {
    $.post("/signup", {
      email: email,
      password: password,
      firstName: fname,
      lastName: lname
    })
      .then(() => {
        // window.location.replace("/portfolio");
        // If there's an error, handle it by throwing up a bootstrap alert
        // window.location.replace("/login.html");
        location.replace("/portfolio");
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
