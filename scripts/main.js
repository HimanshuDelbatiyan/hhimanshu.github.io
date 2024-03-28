"use strict";
(function () {
    function AddNavigationEvents() {
        let navLinks = $("[data]");
        navLinks.off("click");
        navLinks.off("mouseover");
        navLinks.on("click", function () {
            LoadLink($(this).attr("data"));
        });
        navLinks.on("mouseover", function () {
            $(this).css("cursor", "pointer");
        });
    }
    function LoadLink(link, data = "") {
        router.ActiveLink = link;
        router.linkData = data;
        history.pushState({}, "", router.ActiveLink);
        document.title = CapitalizeFirstLetter(router.ActiveLink);
        $("ul>li>a").each(function () {
            $(this).removeClass("active");
        });
        $('li>a:contains(${document.title})').addClass("active");
        LoadContent();
    }
    function TeamNecessity() {
        let teamMemberInfo = [
            ["Captain Chucklehead", "Ability to turn any serious situation into a hilarious comedy routine.", "The Giggle Grenade – releases a burst of contagious laughter that echoes through the community."],
            ["Guffaw Gadgeteer", "Creates wacky inventions that induce uncontrollable laughter.", "The Snicker Snatcher – a device that steals frowns and replaces them with smiles."],
            ["Punmaster Flex", "Unleashes puns so groan-worthy that enemies are too busy facepalming to fight.", "The Pun-isher – a rapid-fire pun attack that leaves everyone in stitches."],
            ["Chuckling Chemist", "Mixes concoctions that produce hilariously unexpected side effects.", "The Belly Bubbler – a potion that makes everyone burst into spontaneous laughter."],
            ["Tickle Tactician", "Masters the art of strategic tickling to distract and disarm opponents.", "The Tickle Tango – a synchronized tickling routine that confuses adversaries."]
        ];
        let teamMemberPic = ["team_1", "team_2", "team_3", "team_4", "team_5", "team_6"];
        if (router.ActiveLink === "team") {
            let mainContainer = $("#teamContainer");
            let infoModal = new bootstrap.Modal(document.getElementById("moreInfo"), {
                backdrop: 'static',
                keyboard: true
            });
            for (let i = 0; i < teamMemberInfo.length; i++) {
                let divContainer = document.createElement("div");
                divContainer.setAttribute("class", "col-md-5 mb-5");
                divContainer.setAttribute("style", "width:380px");
                divContainer.innerHTML =
                    `
                                    <div class="card" >
                                        <img src="images/${teamMemberPic[i]}.jpg" class="card-img-top" style="height: 200px; ">
                                        <div class="card-body">
                                            <h5 class="card-title">${teamMemberInfo[i][0]}</h5>
                                            <p class="card-text">${teamMemberInfo[i][1]}</p>
                                            <button class="btn btn-primary" id="button_${i}">More Details</button>
                                        </div>
                                    </div>
                                `;
                mainContainer.append(divContainer);
                $(`#button_${i}`).on("click", function () {
                    console.log("displaying the signature tactics");
                    $("#signBody").html(`<b><i>Singnature Tactic:</i> <br> ${teamMemberInfo[i][2]}`);
                    infoModal.show();
                });
            }
        }
    }
    function LoadEvents() {
        let events;
        let extraEvents;
        let counter = 0;
        const MAX_EVENT_PER_ROW = 3;
        $.get("./data/events.json", function (data) {
            events = data.events;
            extraEvents = data.extraEvents;
            EventCardGenerator(events);
        });
        $("#loadEvents").on("click", () => {
            EventCardGenerator(extraEvents);
            $("#loadEvents").hide();
        });
        function EventCardGenerator(arrayOfEvents) {
            for (let i = 0; i < arrayOfEvents.length; i++) {
                if (counter === 0) {
                    $("table>tbody").append(`<tr>`);
                }
                let eventCard = `
                                    <td>
                                        <div class="card" style="width: 18rem; margin-right: 30px; margin-top: 10vh">
                                            <img class="card-img-top" src="./images/center_1.jpg" alt="Card image cap">
                                            <div class="card-body">
                                                <h5 class="card-title">${arrayOfEvents[i].eventName}</h5>
                                                <p class="card-text">${arrayOfEvents[i].Description}</p>
                                            </div>
                                            <ul class="list-group list-group-flush">
                                                <li class="list-group-item">Location : ${arrayOfEvents[i].eventLocation}</li>
                                                <li class="list-group-item">Date: ${arrayOfEvents[i].date}</li>
                                                <li class="list-group-item">Organizer : ${arrayOfEvents[i].organizer}</li>
                                                <li class="list-group-item">Price : ${arrayOfEvents[i].isFree ? "Free" : "$20.31"}</li>
                                            </ul>
                                            <div class="card-body">
                                                <a href="#" class="card-link">Card link</a>
                                                <a href="#" class="card-link">Another link</a>
                                            </div>
                                        </div>
                                    </td>`;
                $("table>tbody").append(eventCard);
                counter++;
                if (counter === MAX_EVENT_PER_ROW) {
                    $("table>tbody").append(`</tr>`);
                    counter = 0;
                }
            }
        }
    }
    function SearchBarNavigation() {
        let navLinks = $("#results-box li>a");
        navLinks.off("click");
        navLinks.off("mouseover");
        navLinks.on("click", function () {
            LoadLink($(this).attr("data"));
            $("#results-box").html("");
        });
        navLinks.on("mouseover", function () {
            $(this).css("cursor", "pointer");
        });
    }
    function SearchBar() {
        console.log("Search Bar Working");
        let inputElement = $("#searchText");
        function Hide() {
            $("#results-box").hide();
        }
        function Show() {
            $("#results-box").show();
        }
        inputElement.on("mouseover", function () {
            Show();
        });
        inputElement.on("mouseleave", function () {
            Hide();
        });
        $("#results-box").on("mouseover", function () {
            Show();
        });
        $("#results-box>li").on("mouseover", function () {
            Show();
        });
        $("#results-box").on("mouseleave", function () {
            Hide();
        });
        inputElement.on("keyup", function () {
            console.log("Someone Started Typing, You better work fine.");
            $.get("./data/keywords.json", function (data) {
                let userInput = $("#searchText").val();
                let matching = data.keywords;
                let resultsArray = matching.filter((resultItem) => resultItem.keyword.toLowerCase().includes(userInput.toLowerCase()));
                console.log(resultsArray);
                ShowResult(resultsArray);
            });
            function ShowResult(arrayOfResults) {
                let resultContainer = $("#results-box");
                resultContainer.html("");
                if (arrayOfResults.length <= 0) {
                    resultContainer.html("No Search Found");
                    return;
                }
                arrayOfResults.forEach(result => {
                    resultContainer.append(`<li><a class = "searchItems" 
                                            data = ${result.Url}>${result.keyword}</a></li>`);
                });
                SearchBarNavigation();
            }
        });
    }
    function RegisterFormValidation() {
        console.log("Validation in Progress.");
        ValidateField("#firstName_register", /^[a-zA-Z]{2,30}$/, "Please enter valid first name");
        ValidateField("#lastName_register", /^[a-zA-Z]{2,30}$/, "Please enter valid last name");
        ValidateField("#email_register", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please enter valid email Address");
        ValidateField("#phone_register", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Enter a valid Contact Number");
        ValidateField("#address_register", /^[0-9]+(\s[A-Za-z]+\.?(\s[A-Za-z]+\.?)?)?\s[A-Za-z]+(\s[A-Za-z]+)?(\s[0-9A-Za-z]+)?$/, "Please enter valid physical address");
    }
    function GalleryPage() {
        let divRow = $("#rowDiv");
        $.get("./data/events_picture.json", function (data) {
            let eventsPic = data.events;
            for (const pic of eventsPic) {
                let newDiv = $("<div>");
                newDiv.addClass("col");
                newDiv.html(`<a class="gallery-item" href="${pic.imageSrc}">
                                        <img src="${pic.imageSrc}" class="img-fluid" alt="${pic.altText}">
                                   </a>`);
                divRow.append(newDiv);
            }
        });
    }
    function RegisterForm() {
        RegisterFormValidation();
        let newRegister = new bootstrap.Modal(document.getElementById("registerModal"), {
            backdrop: 'static',
            keyboard: false
        });
        newRegister.hide();
        $("#registerButton").on("click", function (event) {
            event.preventDefault();
            let firstName = $("#firstName_register").val();
            let lastName = $("#lastName_register").val();
            let email = $("#email_register").val();
            let password = $("#password_register").val();
            let city = $("#city_register").val();
            let zip = $("#zip_register").val();
            let address = $("#address_register").val();
            let phone = $("#phone_register").val();
            if (firstName.length === 0 || firstName.trim() === "" || lastName.length === 0 || lastName.trim() === "" || email.length === 0
                || email.trim() === "" || password.length === 0 || password.trim() === "" || city.length === 0 || city.trim() === ""
                || zip.length === 0 || zip.trim() === "" || address.length === 0 || address.trim() === "" || phone.length === 0 || phone.trim() === "") {
                let messageArea = $("#messageArea");
                messageArea.addClass("alert alert-danger")
                    .text("Warninig: None of the Field can be left empty");
                messageArea.show();
                $("firstName_register").trigger('focus');
            }
            else {
                let newUserRegister = new core.User(firstName, lastName, email, password);
                $("#modalContent").text(`${newUserRegister.getFirstName} ${newUserRegister.getLastName}`);
                newRegister.show();
                $.ajax({
                    type: "POST",
                    url: "./data/testing.json",
                    data: JSON.stringify(newUserRegister.toJSON()),
                    contentType: "application/json",
                    success: function (data) {
                        localStorage.setItem(`${newUserRegister.getEmailAddress}`, newUserRegister.serialize());
                    },
                });
                setTimeout(() => {
                    newRegister.hide();
                    LoadLink("login");
                }, 3000);
            }
        });
    }
    function ValidateField(input_field_id, regular_expression, error_message) {
        let messageArea = $("#messageArea").hide();
        $(input_field_id).on("blur", function () {
            let inputFieldText = $(this).val();
            if (!regular_expression.test(inputFieldText)) {
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message);
                messageArea.show();
            }
            else {
                messageArea.removeAttr("class").hide();
            }
        });
    }
    function LoginFormValidation() {
        ValidateField("#loginEmail", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid email address");
    }
    function displayLoginForm() {
        LoginFormValidation();
        $("#loginButton").on("click", function (event) {
            event.preventDefault();
            let emailAddress = document.forms[0].loginEmail.value;
            let password = document.forms[0].loginPassword.value;
            const newUser = new core.User();
            let messageArea = $("#messageArea").hide();
            let welcomeModal = new bootstrap.Modal(document.getElementById("welcomeModal"), {
                backdrop: 'static',
                keyboard: false
            });
            welcomeModal.hide();
            let success = false;
            if (emailAddress === "" || password === "") {
                $("#loginEmail").trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text("None of the fields can be left empty");
                messageArea.show();
            }
            else if (localStorage.getItem(emailAddress)) {
                let exist = localStorage.getItem(emailAddress);
                newUser.deserialize(exist);
                sessionStorage.setItem("user", newUser.serialize());
                $("#h1Modal").text(`Welcome ${newUser.getFirstName} ${newUser.getLastName}`);
                welcomeModal.show();
                success = true;
                if (success) {
                    messageArea.removeAttr("class").hide();
                    setTimeout(() => {
                        welcomeModal.hide();
                        LoadLink("statistics");
                    }, 4000);
                }
                else {
                    $("#loginEmail").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger");
                    messageArea.text("Please Enter Valid Credentials");
                    messageArea.show();
                }
            }
            else {
                $.get("./data/users.json", function (data) {
                    let users = data.users;
                    for (const user of users) {
                        if (user.EmailAddress === emailAddress && user.Password === password) {
                            newUser.fromJSON(user);
                            sessionStorage.setItem("user", newUser.serialize());
                            $("#h1Modal").text(`Welcome ${newUser.getFirstName} ${newUser.getLastName}`);
                            welcomeModal.show();
                            success = true;
                            break;
                        }
                    }
                    if (success) {
                        messageArea.removeAttr("class").hide();
                        setTimeout(() => {
                            welcomeModal.hide();
                            LoadLink("services");
                        }, 4000);
                    }
                    else {
                        $("#loginEmail").trigger("focus").trigger("select");
                        messageArea.addClass("alert alert-danger");
                        messageArea.text("Please Enter Valid Credentials");
                        messageArea.show();
                    }
                });
            }
        });
        $("#registerLink").css("color", "blue");
        $("#registerLink").on("mouseover", function () {
            $(this).css("cursor", "pointer");
            $(this).css("font=weight", "bold");
        });
        $("#registerLink").on("click", function () {
            LoadLink("register");
        });
    }
    function AuthGuard() {
        let protected_routes = ["statistics", "planning"];
        if (protected_routes.indexOf(router.ActiveLink) > -1) {
            if (!sessionStorage.getItem("user")) {
                console.log("Breach Detected, Alert");
                LoadLink("login");
            }
        }
    }
    function CheckLogin() {
        console.log("User Login Status is being checked.");
        if (sessionStorage.getItem("user")) {
            $("#loginNav").html(`<a class="nav-link" id="navLogOut" data="login"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>`);
            if (!$("#statContainer").length) {
                console.log("New Links added in the Navbar");
                $("#navLinks").append(`<li class="nav-item" id="statContainer">
                    <a class="nav-link"  id="stat" data="statistics"> <i class="fa-solid fa-chart-simple"></i> Statistics</a>
                </li>`);
                $("#navLinks").append(`<li class="nav-item" id="planContainer">
                    <a class="nav-link"  id="plan" data="planning"><i class="fa-regular fa-calendar-days"></i> Planning</a>
                </li>`);
                $("#stat").on("click", function () {
                    LoadLink($(this).attr("data"));
                });
                $("#plan").on("click", function () {
                    LoadLink($(this).attr("data"));
                });
                $("#plan").on("mouseover", function () {
                    $(this).css("cursor", "pointer");
                    $(this).css("font=weight", "bold");
                });
                $("#stat").on("mouseover", function () {
                    $(this).css("cursor", "pointer");
                    $(this).css("font=weight", "bold");
                });
            }
            let logoutButton = $("#navLogOut");
            logoutButton.on("mouseover", function () {
                $(this).css("cursor", "pointer");
                $(this).css("font=weight", "bold");
            });
            logoutButton.on("click", function () {
                sessionStorage.clear();
                logoutButton.html(`</i><a id="navLogOut" data="login">Login</a>`);
                console.log("Two links removed and user logged out");
                $("#statContainer").remove();
                $("#stat").remove();
                $("#planContainer").remove();
                $("#plan").remove();
                LoadLink("login");
            });
        }
    }
    async function initMap() {
        $("#servicesButton").on("click", function () {
            LoadLink($(this).attr("data"));
        });
        let map;
        const position = { lat: 43.94373576253126, lng: -78.89703131534256 };
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        map = new Map(document.getElementById("map"), {
            zoom: 15,
            center: position,
            mapId: "harmony_hub",
        });
        const marker = new AdvancedMarkerElement({
            map: map,
            position: position,
            title: "Harmony Hub",
        });
    }
    async function ShowStats() {
        AuthGuard();
        let chart;
        let data;
        data = await getWebStats();
        let charContainer = document.querySelector('#visitorStats');
        chart = new Chart(charContainer, {
            type: 'line',
            data: {
                labels: data.months,
                datasets: [
                    {
                        label: `Harmony Hub\'s visitor statistics for ${data.years[parseInt(router.linkData != "" ? router.linkData : "0")].year}`,
                        data: data.years[parseInt(router.linkData != "" ? router.linkData : "0")].visitors,
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        fill: false,
                        borderWidth: 1
                    }
                ]
            },
            options: {
                animation: {
                    duration: 1000,
                    easing: 'linear',
                }
            }
        });
        $(".years").on("click", function () {
            console.log("Clicked Year");
            let arrayIndex = parseInt($(this).attr("data"));
            LoadLink("statistics", arrayIndex.toString());
            chart.update();
        });
        async function getWebStats() {
            return new Promise((resolve, reject) => {
                $.get("./data/userStatistics.json", function (data) {
                    resolve(data);
                });
            });
        }
    }
    function DisplayPlanningPage() {
        AuthGuard();
        console.log("Planning Page");
        let eventInfoModal = new bootstrap.Modal(document.getElementById("eventDetails"), {
            backdrop: 'static',
            keyboard: true
        });
        $.get("./data/planning.json", function (data) {
            let retrievedData = data;
            for (let i = 0; i < retrievedData.length; i++) {
                let eventName = ` <li>
                        <div class="time">
                            <h2>
                                 ${retrievedData[i].date.substring(0, 2)}<br><span style="font-size: 24px"> ${retrievedData[i].date.substring(2)}</span>
                            </h2>
                        </div>
                        <div class="details">
                            <h3>
                                ${retrievedData[i].event_name}
                            </h3>
                            <!-- Each Event Card button will be assciated with the unique id's -->
                            <button id="eventDetail_${i}">Get Details</button>
                            <button id="markEvent_${i}">Mark Event</button>
                            
                        </div>
                        <div style="clear: both;"></div>
                    </li>`;
                $(".events ul").append(eventName);
                console.log("Event added");
                $(`#eventDetail_${i}`).on("click", function () {
                    console.log("Display event information");
                    $("#event_info").text(retrievedData[i].event_name);
                    $("#eventDate").text(retrievedData[i].date);
                    $("#eventAddress").text(retrievedData[i].address);
                    $("#eventDescription").text(retrievedData[i].description);
                    eventInfoModal.show();
                });
                $(`#markEvent_${i}`).on("click", function () {
                    console.log("Event has been marked");
                    $("#event_info").text("Event has been Marked");
                    $("#eventDate").text("Event Scheduled on " + retrievedData[i].date + " has been added to you 'Marked Event Table'.");
                    $("#eventAddress").text("Don't forget to reach at " + retrievedData[i].address + " on " + retrievedData[i].date + ".");
                    $("#eventDescription").text("See ya !");
                    $(".markedEvents ul").append(`<li id="markedEvent_${i}"> 
                        <div class="time">
                            <h2>
                                 ${retrievedData[i].date.substring(0, 2)}<br><span style="font-size: 24px"> ${retrievedData[i].date.substring(2)}</span>
                            </h2>
                        </div>
                        <div class="details">
                            <h3>
                                ${retrievedData[i].event_name}
                                <!--Unmark Event Button-->
                                 <button id="unmarkEvent_${i}">Unmark Event</button>
                            </h3>
                            <p>Event has been marked Successfully.
                            </p>
                        </div>
                        <div style="clear: both;"></div>
                    </li>`);
                    $(`#unmarkEvent_${i}`).on("click", function () {
                        console.log("An Event card has been removed from the table");
                        $(`#markedEvent_${i}`).remove();
                        $("#event_info").text("Event has been 'Removed' from the Marked Event Table");
                        $("#eventDate").text("Event Scheduled on " + retrievedData[i].date + " has been removed from 'Marked Event Table'.");
                        $("#eventAddress").text("");
                        $("#eventDescription").text("Thanks");
                        eventInfoModal.show();
                    });
                    eventInfoModal.show();
                });
            }
        });
        $("#proposeButton").on("click", function (event) {
            console.log("Propose Event Button Clicked");
            event.preventDefault();
            let eventName = document.forms[0].eventName_propose.value;
            let eventDate = document.forms[0].eventDate_propose.value;
            let eventAddress = document.forms[0].eventAddress_propose.value;
            let eventDescription = document.forms[0].eventDescription_propose.value;
            if (eventName.trim().length === 0 || eventDate.trim().length === 0 || eventAddress.trim().length === 0
                || eventDescription.trim().length === 0) {
                $("#messageArea").text("None of the Field can be left empty");
                $("#messageArea").addClass("alert alert-danger");
            }
            else {
                let eventCard = ` <li>
                        <div class="time">
                            <h2>
                                 ${eventDate.substring(0, 2)}<br><span style="font-size: 24px"> ${eventDate.substring(2)}</span>
                            </h2>
                        </div>
                        <div class="details">
                            <h3>
                                ${eventName} 
                            </h3>
                            <p><b>Waiting for Approval from Admin</b></p>
                        </div>
                        <div style="clear: both;"></div>
                    </li>`;
                $(".events ul").append(eventCard);
                console.log("Event added");
                $("#event_info").text("Event has been sent to admin for approval");
                $("#eventDate").text("Event Scheduled on " + eventDate + " might take a while for approval..");
                $("#eventAddress").text("");
                $("#eventDescription").text("Thanks for contributing to community center");
                eventInfoModal.show();
                $("#messageArea").text("");
                $("#messageArea").removeClass("alert alert-danger");
                document.forms[0].reset();
            }
        });
    }
    function AddHeaders() {
        $.get("./views/components/header.html", function (data) {
            $("header").append(data);
            document.title = router.ActiveLink;
            let newNavLink = document.createElement("li");
            newNavLink.setAttribute("class", "nav-item");
            newNavLink.innerHTML = `<a class="nav-link" data="blogs"><i class="fa-solid fa-arrow-up-right-dots"></i> Careers</a`;
            let navCurrentLinks = $("#navLinks");
            navCurrentLinks.append(newNavLink);
            AddNavigationEvents();
            CheckLogin();
            SearchBar();
        });
    }
    function LoadContent() {
        SearchBar();
        let page_name = router.ActiveLink;
        let callback = pageIdentifier();
        $.get(`./views/content/${page_name}.html`, function (html_data) {
            $("main").html(html_data);
            CheckLogin();
            callback();
        });
    }
    function AddFooters() {
        let body = document.body;
        let footerContainer = document.createElement("div");
        footerContainer.setAttribute("Class", "container");
        let footerElements = ["Policy", "Terms of Service", "Contact"];
        let footerElementsPages = ["privacy", "terms", "contact"];
        let readyFooterElements = "";
        for (let i = 0; i < footerElements.length; i++) {
            readyFooterElements += `<li class="nav-item"><a data="${footerElementsPages[i]}" class="nav-link px-2 text-muted">${footerElements[i]}</a></li>`;
        }
        footerContainer.innerHTML = `
                  <footer class="py-3 my-4">
                    <ul class="nav justify-content-center border-bottom pb-3 mb-3">
                    ${readyFooterElements}                   
                    </ul>
                    <p class="text-center text-muted">&copy; 2024 Harmony Hub, CA</p>
                  </footer>`;
        body.appendChild(footerContainer);
    }
    function DisplayContactPage() {
        $("#submitButton").on("click", (event) => {
            event.preventDefault();
            let firstName = document.forms[0].firstName.value;
            let lastName = document.forms[0].lastName.value;
            let email = document.forms[0].email.value;
            let subject = document.forms[0].contactSubject.value;
            let city = document.forms[0].city.value;
            let zip = document.forms[0].zip.value;
            let address = document.forms[0].address.value;
            if (firstName.length === 0 || firstName.trim() === "" || lastName.length === 0 || lastName.trim() === "" || email.length === 0
                || email.trim() === "" || subject.length === 0 || subject.trim() === "" || city.length === 0 || city.trim() === ""
                || zip.length === 0 || zip.trim() === "" || address.length === 0 || address.trim() === "") {
                $("#errorBody").html(`<b><i>Please Fill all the Fields.</i></b>`);
                let myModal = new bootstrap.Modal(document.getElementById('error'), {
                    backdrop: 'static',
                    keyboard: false
                });
                myModal.show();
            }
            else {
                let contact = new core.Contact(firstName, lastName, email, subject, city, zip);
                $("#thanksBody").html(`<b><i>Thanks for Contacting Us </i> <br> ${contact.getFirstName} ${contact.getLastName} (${contact.getEmail})
                            <br>
                            We will get in Touch with you quikly.
                            .</b>`);
                let thanksModal = new bootstrap.Modal(document.getElementById('thanksMessage'), {
                    backdrop: 'static',
                    keyboard: false
                });
                thanksModal.show();
                setTimeout(function () {
                    thanksModal.hide();
                    LoadLink("home");
                }, 5000);
            }
        });
    }
    function PortfolioPage() {
        function newPortfolio() {
            let projectTitles = [
                "Fitness BootCamp",
                "Community CookBook Project",
                "Teach for Seniors Program"
            ];
            let projectDescriptions = [
                "Regular art and craft sessions for individuals of all ages. Activities include painting, pottery, and DIY crafts to foster creativity and provide a platform for artistic expression.",
                "Collaborative creation of a community cookbook featuring recipes contributed by residents. The project promotes cultural exchange through food and fosters a sense of community.",
                "Workshops and training sessions tailored for senior citizens to enhance their technological skills. Topics include using smartphones, social media, and online communication tools."
            ];
            let imageLocations = ["center_3.jpg", "center_5.jpg", "center_1.jpg"];
            let projectTable = $("#projectTable");
            projectTable.append('<tr id = "onClickLoad" >');
            for (let i = 0; i < projectTitles.length; i++) {
                let newRow = $("#onClickLoad");
                newRow.append(`<td id='${i}'>`);
                let newCell = $(`td#${i}`);
                let newDiv = document.createElement("div");
                newDiv.setAttribute("class", "card w-75 m-5");
                newDiv.innerHTML =
                    `<img src="images/${imageLocations[i]}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${projectTitles[i]}</h5>
                        <p class="card-text">${projectDescriptions[i]}</p>
                        <a href="#" class="btn btn-primary">Get More Details</a>
                    </div>`;
                newCell.append(newDiv);
            }
        }
        $("#loadPortfolio").on("click", function () {
            newPortfolio();
        });
    }
    const pageIdentifier = function () {
        switch (router.ActiveLink) {
            case "home": return initMap;
            case "blogs": return new Function;
            case "contact": return DisplayContactPage;
            case "events": return LoadEvents;
            case "gallery": return GalleryPage;
            case "login": return displayLoginForm;
            case "portfolio": return PortfolioPage;
            case "privacy": return new Function;
            case "register": return RegisterForm;
            case "services": return new Function;
            case "team": return TeamNecessity;
            case "terms": return new Function;
            case "statistics": return ShowStats;
            case "planning": return DisplayPlanningPage;
            default:
                console.error("ERROR: callback does not exist" + router.ActiveLink);
                return new Function();
        }
    };
    function CapitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function StartMethod() {
        AddHeaders();
        LoadLink('home');
        AddFooters();
    }
    window.addEventListener("load", () => {
        StartMethod();
        console.log("Resources has Loaded");
    });
})();
//# sourceMappingURL=main.js.map
