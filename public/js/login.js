$(document).ready(() => {
  // Getting references to our form and inputs
  const loginForm = $("form.login");
  const emailInput = $("input#email-input");
  const passwordInput = $("input#password-input");

  // When the form is submitted, we validate there's an email and password entered
  loginForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.email, userData.password);
    emailInput.val("");
    passwordInput.val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(email, password) {
    $.post("/api/login", {
      email: email,
      password: password
    })
      .then(() => {
        window.location.replace("/members");
        // If there's an error, log the error
      })
      .catch(err => {
        console.log(err);
      });
  }
});

//code for watch

$(document).ready(() => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  const newDate = new Date();
  newDate.setDate(newDate.getDate());

  setInterval(() => {
    const hours = new Date().getHours();
    $(".hour").html((hours < 10 ? "0" : "") + hours);
    const seconds = new Date().getSeconds();
    $(".second").html((seconds < 10 ? "0" : "") + seconds);
    const minutes = new Date().getMinutes();
    $(".minute").html((minutes < 10 ? "0" : "") + minutes);

    $(".month span,.month2 span").text(monthNames[newDate.getMonth()]);
    $(".date span,.date2 span").text(newDate.getDate());
    $(".day span,.day2 span").text(dayNames[newDate.getDay()]);
    $(".year span").html(newDate.getFullYear());
  }, 1000);

  $(".outer").on({
    mousedown: function() {
      $(".dribbble").css("opacity", "1");
    },
    mouseup: function() {
      $(".dribbble").css("opacity", "0");
    }
  });
});
