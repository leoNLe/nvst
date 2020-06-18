$(document).ready(() => {
  // Getting references to our form and input
  const updateForm = $(".account");
  const emailInput = $("#email-input");
  const passwordInput = $("#password-input");
  const fName = $("#fname");
  const lName = $("#lname");
  const delBtn = $(".delBtn");
  // When the signup button is clicked, we validate the email and password are not blank
  updateForm.on("submit", event => {
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
    // If we have an email and password, run the updateUser function
    updateUser(
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

  delBtn.on("click", event => {
    event.preventDefault();
    $.ajax({
      url: "/api/delete",
      type: "DELETE",
      contentType: "application/json; charset=utf-8"
    }).then(() => {
      // window.location.replace("/signup.html");
      // location.reload();
      console.log("account");
      window.location.replace("/login");
    });
  });
  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function updateUser(email, password, fname, lname) {
    const dataObj = {
      email: email,
      password: password,
      firstName: fname,
      lastName: lname
    };
    $.ajax({
      url: "/update",
      type: "POST",
      data: JSON.stringify(dataObj),
      contentType: "application/json; charset=utf-8"
    })
      .done(() => {
        //add if condition for err
        // If there's an error, handle it by throwing up a bootstrap alert
        window.location.replace("/login");
        // location.reload();
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
