let stuId;
let stuIdForDelete;
let image;
let firstName;
let lastName;
let Name;
let DOB;
let address;
let contact;
let email;
let guardianName;
let guardianRelationship;
let guardianOccupation;
let guardianContact;
let pathVariable = "/find-by-id/";

loadTable();


// Initialize the preview element
const preview = document.getElementById('preview');
const dropZone = document.getElementById('dropZone');

// Prevent default behavior for drag events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, event => event.preventDefault());
});

// Add visual feedback when dragging over the drop zone
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'));
});

// Remove visual feedback when dragging leaves the drop zone
['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'));
});

// Handle the drop event
dropZone.addEventListener('drop', event => {
    const files = event.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            preview.src = event.target.result;  // Display the image preview
            image = event.target.result;  // Store the image data
        };
        reader.readAsDataURL(file);  // Convert file to Data URL
    }
});

// Handle file selection from the file input
const imageUpload = document.getElementById('imageUpload');

imageUpload.addEventListener('change', function (event) {
    const file = event.target.files[0]; // Get the first file selected
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;  // Set image source to the file data
            image = e.target.result;  // Store the image data
            preview.style.display = 'block';  // Show the image
        };
        reader.readAsDataURL(file);  // Read the image file as Data URL
    } else {
        preview.style.display = 'none';  // Hide the image preview if no valid image is selected
    }
});
// --------------------------------------------Add student----------------------------------------------------------
function addStudent() {
    firstName = document.getElementById("txtFName").value;
    lastName = document.getElementById("txtLName").value;
    Name = firstName + " " + lastName;
    DOB = document.getElementById("txtDOB").value;
    address = document.getElementById("txaAddress").value;
    contact = document.getElementById("txtContact").value;
    email = document.getElementById("txtEmail").value;
    guardianName = document.getElementById("txtGName").value;
    guardianRelationship = document.getElementById("txtGRelation").value;
    guardianOccupation = document.getElementById("txtGOccupation").value;
    guardianContact = document.getElementById("txtGContact").value;

    if (firstName == "") {
        triggerAlartWarning("Please enter the last name");
    } else if (lastName == "") {
        triggerAlartWarning("Please enter the last name");
    } else if (DOB == "") {
        triggerAlartWarning("Please enter the date of birth");
    } else if (address == "") {
        triggerAlartWarning("Please enter the address");
    } else if (image == undefined) {
        triggerAlartWarning("Please an add image");
    } else if (contact == "") {
        triggerAlartWarning("Please the enter contact");
    } else if (email == "") {
        triggerAlartWarning("Please the enter email");
    } else if (guardianName == "") {
        triggerAlartWarning("Please enter the guardian name");
    } else if (guardianRelationship == "") {
        triggerAlartWarning("Please enter the guardian relationship");
    } else if (guardianOccupation == "") {
        triggerAlartWarning("Please enter the guardian occupation");
    } else if (guardianContact == "") {
        triggerAlartWarning("Please enter the guardian contact");
    } else {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "first_name": firstName,
            "last_name": lastName,
            "name": Name,
            "dob": DOB,
            "address": address,
            "image": image,
            "contact": contact,
            "email": email,
            "g_name": guardianName,
            "g_relation": guardianRelationship,
            "g_occupation": guardianOccupation,
            "g_contact": guardianContact
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost:8080", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                loadTable();
                clearAll();
            })
            .catch((error) => console.error(error));
        document.getElementById('allStudents').scrollIntoView({ behavior: 'smooth' });

        triggerAlartSuccess("Student Registered successfully");
    }
}

// --------------------------------------------Clear student----------------------------------------------------------
function clearAll() {
    document.getElementById("txtFName").value = "";
    document.getElementById("txtLName").value = "";
    document.getElementById("txtDOB").value = "";
    document.getElementById("txaAddress").value = "";
    document.getElementById("txtContact").value = "";
    document.getElementById("txtEmail").value = "";
    document.getElementById("txtGName").value = "";
    document.getElementById("txtGRelation").value = "";
    document.getElementById("txtGOccupation").value = "";
    document.getElementById("txtGContact").value = "";
    document.getElementById("imageUpload").value = "";
    document.getElementById('preview').src = "./img/no-preview.png";

    triggerAlartMassage("Cleared successfully");
}

// --------------------------------------------Load table--------------------------------------------------------------

function loadTable() {
    let body = `<tr>
    <th>ID</th>
    <th>NAME</th>
    <th>DOB</th>
    <th>ADDRESS</th>
    <th></th>
    <th></th>
    <th></th>
</tr>`;

    fetch("http://localhost:8080/").then(response =>
        response.json()).then(data => {

            data.forEach(student => {
                body += `<tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.dob}</td>
                <td>${student.address}</td>
                <td>
                    <button class="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="See Details" onclick="showDetails(${student.id})">
                        <i class="bi bi-info-square"></i></button>
                </td>
                <td>
                    <button class="btn btn-outline-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" onclick="triggerAlartDeleteConfirmation(${student.id})">
                        <i class="bi bi-trash3"></i></button>
                </td>
                <td>
                    <button class="btn btn-outline-success" data-bs-toggle="tooltip" data-bs-placement="top" title="Update" onclick="setForUpdateStudent(${student.id})">
                        <i class="bi bi-pencil-square"></i></button>
                </td>
            </tr>`
            });

            document.getElementById("tblStudent").innerHTML = body;

        });
}
// --------------------------------------------Delete student--------------------------------------------------------------
function deleteStudent(id) {
    fetch("http://localhost:8080/" + id, {
        method: "DELETE"
    }).then(() => {
        loadTable();
    })
    triggerAlartSuccess("Student Deleted successfully");
}
// --------------------------------------------Show student details--------------------------------------------------------------
function showDetails(id) {
    fetch("http://localhost:8080/" + id).then(response =>
        response.json()).then(data => {
            document.getElementById("lblStudentID").innerHTML = data.id;
            document.getElementById("lblStudentFirstName").innerHTML = data.first_name;
            document.getElementById("lblStudentLastName").innerHTML = data.last_name;
            document.getElementById("lblStudentDOB").innerHTML = data.dob;
            document.getElementById("lblStudentAddress").innerHTML = data.address;
            document.getElementById("lblStudentContact").innerHTML = data.contact;
            document.getElementById("lblStudentEmail").innerHTML = data.email;
            document.getElementById("lblGuardianName").innerHTML = data.g_name;
            document.getElementById("lblGuardianRelation").innerHTML = data.g_relation;
            document.getElementById("lblGuardianOccupation").innerHTML = data.g_occupation;
            document.getElementById("lblGuardianContact").innerHTML = data.g_contact;
            document.getElementById("displayImage").src = data.image;
        });

    document.getElementById('selectedStudent').scrollIntoView({ behavior: 'smooth' });
}
// --------------------------------------------set for update student--------------------------------------------------------------
function setForUpdateStudent(id) {
    fetch("http://localhost:8080/" + id).then(response =>
        response.json()).then(data => {
            document.getElementById("txtFName").value = data.first_name;
            document.getElementById("txtLName").value = data.last_name;
            document.getElementById("txtDOB").value = data.dob;
            document.getElementById("txaAddress").value = data.address;
            document.getElementById("txtContact").value = data.contact;
            document.getElementById("txtEmail").value = data.email;
            document.getElementById("txtGName").value = data.g_name;
            document.getElementById("txtGRelation").value = data.g_relation;
            document.getElementById("txtGOccupation").value = data.g_occupation;
            document.getElementById("txtGContact").value = data.g_contact;
            document.getElementById('preview').src = data.image;
            stuId = id;
            image = data.image;
        });

    document.getElementById('studentInfoForm').scrollIntoView({ behavior: 'smooth' });
}

// --------------------------------------------update student-----------------------------------------------------------------
function updateStudent() {
    firstName = document.getElementById("txtFName").value;
    lastName = document.getElementById("txtLName").value;
    Name = firstName + " " + lastName;
    DOB = document.getElementById("txtDOB").value;
    address = document.getElementById("txaAddress").value;
    contact = document.getElementById("txtContact").value;
    email = document.getElementById("txtEmail").value;
    guardianName = document.getElementById("txtGName").value;
    guardianRelationship = document.getElementById("txtGRelation").value;
    guardianOccupation = document.getElementById("txtGOccupation").value;
    guardianContact = document.getElementById("txtGContact").value;

    if (firstName == "") {
        triggerAlartWarning("Please enter the last name");
    } else if (lastName == "") {
        triggerAlartWarning("Please enter the last name");
    } else if (DOB == "") {
        triggerAlartWarning("Please enter the date of birth");
    } else if (address == "") {
        triggerAlartWarning("Please enter the address");
    } else if (image == undefined) {
        triggerAlartWarning("Please an add image");
    } else if (contact == "") {
        triggerAlartWarning("Please the enter contact");
    } else if (email == "") {
        triggerAlartWarning("Please the enter email");
    } else if (guardianName == "") {
        triggerAlartWarning("Please enter the guardian name");
    } else if (guardianRelationship == "") {
        triggerAlartWarning("Please enter the guardian relationship");
    } else if (guardianOccupation == "") {
        triggerAlartWarning("Please enter the guardian occupation");
    } else if (guardianContact == "") {
        triggerAlartWarning("Please enter the guardian contact");
    } else {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "id": stuId,
            "first_name": firstName,
            "last_name": lastName,
            "name": Name,
            "dob": DOB,
            "address": address,
            "image": image,
            "contact": contact,
            "email": email,
            "g_name": guardianName,
            "g_relation": guardianRelationship,
            "g_occupation": guardianOccupation,
            "g_contact": guardianContact
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost:8080", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                loadTable();
                clearAll();
            })
            .catch((error) => console.error(error));

        document.getElementById('allStudents').scrollIntoView({ behavior: 'smooth' });

        triggerAlartSuccess("Student Updated successfully");
    }
}

// --------------------------------------------Trigger alart (warning)--------------------------------------------------------------
function triggerAlartWarning(msg) {
    const toastLiveExample = document.getElementById('liveToastWarning')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    document.getElementById("liveToastBodyWarning").innerHTML = msg
    toastBootstrap.show()
}

// --------------------------------------------Trigger alart (massage)--------------------------------------------------------------
function triggerAlartMassage(msg) {
    const toastLiveExample = document.getElementById('liveToastMassage')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    document.getElementById("liveToastBodyMassage").innerHTML = msg
    toastBootstrap.show()
}
// --------------------------------------------Trigger alart (success)--------------------------------------------------------------
function triggerAlartSuccess(msg) {
    const toastLiveExample = document.getElementById('liveToastSuccess')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    document.getElementById("liveToastBodySuccess").innerHTML = msg
    toastBootstrap.show()
}
// --------------------------------------------Trigger alart (deleteConfirmation)--------------------------------------------------------------
function triggerAlartDeleteConfirmation(id) {
    stuIdForDelete = id;
    const toastLiveExample = document.getElementById('liveToastDeleteConfirmation')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastBootstrap.show()
}

function deleteStudentConfirmation() {
    deleteStudent(stuIdForDelete);
}

function selectedCategory(num) {
    if (num == 1) {
        pathVariable = "/find-by-id/";
        document.getElementById("btnCategory").innerHTML = "Find by ID";
    } else if (num == 2) {
        pathVariable = "/find-by-name/";
        document.getElementById("btnCategory").innerHTML = "Find by Name";
    } else if (num == 3) {
        pathVariable = "/find-by-dob/";
        document.getElementById("btnCategory").innerHTML = "Find by DOB";
    } else if (num == 4) {
        pathVariable = "/find-by-address/";
        document.getElementById("btnCategory").innerHTML = "Find by Address";
    } else if (num == 5) {
        pathVariable = "/find-by-email/";
        document.getElementById("btnCategory").innerHTML = "Find by Email";
    }

}

function searchStudent() {
    let body = `<tr>
    <th>ID</th>
    <th>NAME</th>
    <th>DOB</th>
    <th>ADDRESS</th>
    <th></th>
    <th></th>
    <th></th>
</tr>`;

    fetch("http://localhost:8080" + pathVariable + document.getElementById("searchInput").value)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            if (Array.isArray(data)) {
                if (data.length > 0) {
                    data.forEach(student => {
                        body += `<tr>
                        <td>${student.id}</td>
                        <td>${student.first_name} ${student.last_name}</td>
                        <td>${student.dob}</td>
                        <td>${student.address}</td>
                        <td>
                            <button class="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="See Details" onclick="showDetails(${student.id})">
                                <i class="bi bi-info-square"></i></button>
                        </td>
                        <td>
                            <button class="btn btn-outline-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" onclick="triggerAlartDeleteConfirmation(${student.id})">
                                <i class="bi bi-trash3"></i></button>
                        </td>
                        <td>
                            <button class="btn btn-outline-success" data-bs-toggle="tooltip" data-bs-placement="top" title="Update" onclick="setForUpdateStudent(${student.id})">
                                <i class="bi bi-pencil-square"></i></button>
                        </td>
                    </tr>`
                    });
                    document.getElementById('allStudents').scrollIntoView({ behavior: 'smooth' });
                } else {
                    // Case 2: If data is an empty array
                    body += `<tr><td colspan="7" class="text-center">No students found</td></tr>`;
                }
            } else {
                body += `<tr>
                <td>${data.id}</td>
                <td>${data.name}</td>
                <td>${data.dob}</td>
                <td>${data.address}</td>
                <td>
                    <button class="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="See Details" onclick="showDetails(${data.id})">
                        <i class="bi bi-info-square"></i></button>
                </td>
                <td>
                    <button class="btn btn-outline-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" onclick="triggerAlartDeleteConfirmation(${data.id})">
                        <i class="bi bi-trash3"></i></button>
                </td>
                <td>
                    <button class="btn btn-outline-success" data-bs-toggle="tooltip" data-bs-placement="top" title="Update" onclick="setForUpdateStudent(${data.id})">
                        <i class="bi bi-pencil-square"></i></button>
                </td>
            </tr>`
            document.getElementById('allStudents').scrollIntoView({ behavior: 'smooth' });
            }

            // Update the table
            document.getElementById("tblStudent").innerHTML = body;
        })
        .catch(error => {
            // Handle any fetch errors
            body += `<tr><td colspan="7" class="text-center">No records found</td></tr>`;
            triggerAlartMassage("No records found");
            document.getElementById("tblStudent").innerHTML = body;
        });
}
