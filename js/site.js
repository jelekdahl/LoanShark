function displayMessage() {
  //get the text out of our input and assign it to a variable
  let msg = document.getElementById('message').value;

  //alert('Hello Guardian Cohort!');
  Swal.fire(
    {
      backdrop: false,
      title: 'APP NAME',
      text: msg, // <-- replace this text with that variable
    }
  );
}