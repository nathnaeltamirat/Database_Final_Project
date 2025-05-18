

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById("registering");
  const submit = document.getElementById("submit");
  const email = document.getElementById("email");
  const password = document.getElementById("password"); // This must exist in your HTML or set to ""
  const firstName = document.getElementById("fname");
  const lastName = document.getElementById("lname");
  const woreda = document.getElementById("woreda");
  const city = document.getElementById("city");
  const subcity = document.getElementById("subcity");
  const dateOfBirth = document.getElementById("dob");
  const department = document.getElementById("department")
  let departmentID;

  function getPhoneValues() {
    const phoneInputs = document.querySelectorAll('#phone-fields input[name="phone[]"]');
    return Array.from(phoneInputs).map(input => input.value);
  }

//   function addPhoneField() {
//     const container = document.getElementById('phone-fields');
//     const input = document.createElement('input');
//     input.type = 'tel';
//     input.name = 'phone[]';
//     input.placeholder = '123-456-7890';
//     input.required = true;
//     container.appendChild(document.createElement('br'));
//     container.appendChild(input);
//   }

 



  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    const phonesValues = getPhoneValues();
    departmentID = department.value;
      if (departmentID == "sw") {
            departmentID = 1
        }else if (departmentID == "ee") {
            departmentID = 2
        }else if (departmentID == "me") {
            departmentID = 3
        }else if (departmentID == "em") {
            departmentID = 4
        }else if (departmentID == "bt") {
            departmentID = 5
        }

    try {
      const response = await axios.post('/api/register', {
        email: email.value,
        password: password ? password.value : '', // optional
        firstName: firstName.value,
        lastName: lastName.value,
        phones: phonesValues,
        woreda: woreda.value,
        city: city.value,
        subcity: subcity.value,
        dateOfBirth: dateOfBirth.value,
        DepartmentID:departmentID
      });
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Registration error:", error);
    }
  });
});
