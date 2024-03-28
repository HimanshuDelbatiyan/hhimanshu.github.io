// Name: Himanshu
// Student ID: 100898751
// File Name:  main.scripts
// Folder Name: Assignment-1
// Date Created: 24-01-24
// Description: This file will be used to add the dynamic functionality to the page.


// Telling the JS Compiler to be strict about the coding guidelines suggested by the ECMA Script 6
"use strict";



(function ()
{



    /**
     *This method binds the Click event to all the elements who has
     * "data-attribute"
     */
    function AddNavigationEvents():void
    {
        /**
         * Selecting all the elements which has "Data Attribute."
         */
        let navLinks = $("[data]")

        /**
         * Unbinding the events !
         */
        navLinks.off("click");
        navLinks.off("mouseover");

        /**
         * So, here the "this" keyword is used to "Access the Attributes of the element on which user have clicked."
         * and then using the Jquery we do the next things !
         */
        navLinks.on("click", function()
        {
            /**
             * Again Explicitly Loading the content for the page !
             * using the data attribute of the page !
             * Note: Here "this" keyword return the Whole html of clicked element.
             */
            LoadLink($(this).attr("data") as string)
        });

        /**
         * CSS
         */
        navLinks.on("mouseover", function(){
            $(this).css("cursor", "pointer");
        });
    }


    /**
     * This method takes the "name" of the route which to be loaded as well as
     * the data associated with that route to be used in subsequent functions.
     * @param link
     * @param data
     */
    function LoadLink(link:string, data:string = ""):void
    {
        /**
         * Set the Active Link of the website to passed route.
         */
        router.ActiveLink = link;

        /**
         * Nothing but an Authenticator
         * Which have an "Array" if the current active link is from the array then
         * there are some conditions need to satisfied before proceeding !
         */
        //AuthGuard();

        /**
         * Set the passed data to link data to be used in subsequent functions
         */
        router.linkData = data;

        /**
         * --------- History API ---------
         * Manipulating the browser's history stack
         * By Adding a new entry to the browser history.
         */
        history.pushState({}, "", router.ActiveLink);

        /**
         * Changing the title of the page !
         */
        document.title = CapitalizeFirstLetter(router.ActiveLink);

        /**
         * Make that Nav Link active on which the user is present.
         * using "jquery" {.each()} method to manipulate all the elements specified in the "Element Specifier"
         */
        $("ul>li>a").each(function(){
            $(this).removeClass("active");
        });

        /**
         * Making that link active which is loaded explicitly using this method,
         */
        $('li>a:contains(${document.title})').addClass("active");

        /**
         * Logic Stuff: -
         *  As LoadContent() Method is loading the content based on the "activeLink" property of the
         *  Class which we have changed at the top so the LoadContent() method needed to be called
         *  again as this is called when the page loads.
         */
        LoadContent();

    }


    /**
     * ------------------------------------------------------> Team Page
     */
    function TeamNecessity()
    {
        /**
         * Creating some array which will contain the information of the team members !
         * Like their name, signature tacic etc
         */
        let teamMemberInfo:string[][] = [
            ["Captain Chucklehead", "Ability to turn any serious situation into a hilarious comedy routine.", "The Giggle Grenade – releases a burst of contagious laughter that echoes through the community."],
            ["Guffaw Gadgeteer", "Creates wacky inventions that induce uncontrollable laughter.", "The Snicker Snatcher – a device that steals frowns and replaces them with smiles."],
            ["Punmaster Flex", "Unleashes puns so groan-worthy that enemies are too busy facepalming to fight.", "The Pun-isher – a rapid-fire pun attack that leaves everyone in stitches."],
            ["Chuckling Chemist", "Mixes concoctions that produce hilariously unexpected side effects.", "The Belly Bubbler – a potion that makes everyone burst into spontaneous laughter."],
            ["Tickle Tactician", "Masters the art of strategic tickling to distract and disarm opponents.", "The Tickle Tango – a synchronized tickling routine that confuses adversaries."]
        ];

        /**
         * This Array stores the pic of team members
         * @type {string[]}
         */
        let teamMemberPic: string[] = ["team_1","team_2","team_3","team_4","team_5","team_6"];

        /**
         * Checking the title of the document.
         * if it is team then it team member cards will be populated dynamically.
         */
        if (router.ActiveLink === "team")
        {
            /**
             * Selecting the element inside which the team members will be displayed,
             */
            let mainContainer = $("#teamContainer");

            /**
             * Creating a modal which will be unique to all team cards
             */
            let infoModal = new bootstrap.Modal(document.getElementById("moreInfo") as HTMLElement, {
                backdrop: 'static',
                keyboard: true
            });

            /**
             Using the for loop to print all Team Members and also binding an event handler with them
             **/
            for (let i:number = 0; i < teamMemberInfo.length; i++)
            {
                /**
                 * Creating a Container which will hold the Cards.
                 */
                let divContainer = document.createElement("div");

                /**
                 * Setting Some attributes.
                 */
                divContainer.setAttribute("class", "col-md-5 mb-5");
                divContainer.setAttribute("style", "width:380px");

                /**
                 * Setting the inner html of the div Container for each of the card.
                 */
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


                /**
                 * Appending the child at the end of the container
                 */
                mainContainer.append(divContainer);

                /**
                 * For Each element being appended as child to div
                 * binding an event hanlder which will trigger the show Modal event.
                 */
                $(`#button_${i}`).on("click", function()
                {
                    // Message.
                    console.log("displaying the signature tactics")

                    /**
                     * Setting the inner content of the "Modal Body".
                     */
                    $("#signBody").html(`<b><i>Singnature Tactic:</i> <br> ${teamMemberInfo[i][2]}`);

                    /**
                     * Show the Modal.
                     */
                    infoModal.show();
                });
            }
        }
    }

    /**
     * ---------------------------------------------------------> Events Page
     */
    function LoadEvents()
    {
        /**
         * Definninig some variables!
         */
        let events;
        //Just a Type Notation
        let extraEvents : [{eventName: string,date: string, eventLocation:string, organizer:string
            ,Description:string, instructor:string, isFree: boolean}];
        let counter: number = 0;
        const MAX_EVENT_PER_ROW:Number = 3;

        /**
         * Using the jQuery .get() Shorthand Method to retrieve
         * data from the JSON File !
         */
        $.get("./data/events.json",function (data)
        {
            /**
             * Initializing the global variables with the two arrays of Events
             * retrieved from the JSON File !
             */
            events = data.events;
            extraEvents = data.extraEvents;

            /**
             * Once the Arrays of Events has been retrieved then we would use for loop to generate the
             * Card for Each of the event using the Information present in the event.
             * This will generate the initial 6 records or depending upon the size of events array in JSON
             */
            EventCardGenerator(events);
        });


        /**
         * =================================================================>
         * Binding an Event Listener to the Button !
         * On click it will generate the Extra or remaining cards in the
         * JSON File !
         */
        $("#loadEvents").on("click", ()=>
        {
            /**
             * Loads the events present in the extra Event's Array
             */
            EventCardGenerator(extraEvents);
            /**
             * Hide the load Event button
             */
            $("#loadEvents").hide();
        });


        /**
         * This Function read the array of Events and make a Card for each of the element
         * as well as print them inside the table in 3-cards per row design !
         * @param arrayOfEvents
         * Note: In TypeScript we have to specify all the type of stuuf
         */
        function EventCardGenerator(arrayOfEvents:[{eventName: string,date: string, eventLocation:string, organizer:string
            ,Description:string, instructor:string, isFree: boolean}])
        {
            for (let i:number = 0; i < arrayOfEvents.length; i++) {
                /**
                 * This line will create a new row to hold three Events card
                 */
                if (counter === 0) {
                    $("table>tbody").append(`<tr>`);
                }
                /**
                 * Populating the fields of the cards using the Json Objects !
                 * @type {string}
                 */
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

                /**
                 * Selecting the Events table !
                 */
                $("table>tbody").append(eventCard);

                /**
                 * Increment the Counter by 1
                 */
                counter++;

                /**
                 * Once three event have been processed then it will close the row
                 * and the above one will initiate a new row
                 */
                if (counter === MAX_EVENT_PER_ROW)
                {
                    $("table>tbody").append(`</tr>`);
                    counter = 0;
                }
            }
        }
    }


    /**
     * This function Add Click event handlers to all the searched elements
     * generated by the Search Bar
     * Note: This function also clear the Result box on click on particular searched item.
     */
    function SearchBarNavigation(): void
    {
        /**
         * Selecting all the nav links !
         */
        let navLinks = $("#results-box li>a")

        /**
         * Unbinding the events !
         */
        navLinks.off("click");
        navLinks.off("mouseover");

        /**
         * So, here the "this" keyword is used to "Access the Attributes of the element on which user have clicked."
         * and then using the Jquery we do the next things !
         */
        navLinks.on("click", function()
        {
            /**
             * Again Explicitly Loading the content for the page !
             * using the data attribute of the page !
             * Note: Here "this" keyword return the Whole html of clicked element.
             */
            LoadLink($(this).attr("data") as string)

            /**
             * Once Clicked then it will clear the Searched item list
             */
            $("#results-box").html("");
        });

        /**
         * Setting some css
         */
        navLinks.on("mouseover", function(){
            $(this).css("cursor", "pointer");
        });
    }



    /**
     * -------------------------------------------------------------> Search Bar
     */
    function SearchBar()
    {
        console.log("Search Bar Working");
        /**
         * Selecting the input element.
         */
        let inputElement : JQuery<HTMLElement> = $("#searchText");

        /**
         * Hide the result container
         */
        function Hide() {
            $("#results-box").hide();
        }

        /**
         * Shows the result container
         */
        function Show() {
            $("#results-box").show();
        }

        /**
         * Binding an event listener to the Search input field
         * on "Hover" over the input field "show" the result container
         */
        inputElement.on("mouseover", function () {
            Show();
        })

        /**
         * Binding an event listener to the Search input field
         * on "Hover" over the input field "Hide" the result container
         */
        inputElement.on("mouseleave", function () {
            Hide();
        })


        /**
         * Binding an event listener to the Result Container
         * on "hover" over the input field "show" the result container
         */
        $("#results-box").on("mouseover", function ()
        {
            Show();
        })

        /**
         * Also Selecting the immediate childs of the results box
         */
        $("#results-box>li").on("mouseover", function ()
        {
            Show();
        })

        /**
         * Binding an event listener to the Search input field
         * on "hover leave" over the input field "Hide" the result container
         */
        $("#results-box").on("mouseleave", function () {
            Hide();
        })


        /**
         * Binding the event handler to the Search Box (Input Element)
         * when the user start typing then this event is triggered
         */
        inputElement.on("keyup", function ()
        {
            /**
             * Function Execution Indicator !
             */
            console.log("Someone Started Typing, You better work fine.");

            /**
             * Using the shorthand method called .get()
             * method to make an Asynchronous request to json file !
             */
            $.get("./data/keywords.json", function (data:{keywords:{keyword:string,Url:string}[]})
            {
                // @ts-ignore
                /**
                 * Retrieving the user input !
                 */
                let userInput =  $("#searchText").val() as string;

                /**
                 * Storing the keywords array inside another variable !
                 */
                let matching: {keyword:string,Url:string}[] = data.keywords;

                /**
                 * Using the .filter() method to find the matching elements from the
                 * array and then storing the matching elements to the new array !
                 * called resultsArray
                 *
                 * Note: .filter() is called for each element of the array !
                 */

                let resultsArray: {keyword:string,Url:string}[] = matching.filter((resultItem : {keyword:string,Url:string}) => resultItem.keyword.toLowerCase().includes(userInput.toLowerCase()));

                /**
                 * Testing
                 */
                console.log(resultsArray);
                /**
                 * Display the results in the container  to the user !
                 */
                ShowResult(resultsArray);
            });


            /**
             * This method takes the
             * @param arrayOfResults
             * @returns {null}
             * @constructor
             */
            function ShowResult(arrayOfResults: {keyword:string,Url:string}[]): void
            {
                /**
                 * Selecting the element or container in which the result
                 * elements will be shown
                 */
                let resultContainer = $("#results-box");
                /**
                 * Clear the previous results
                 */
                resultContainer.html("");

                /**
                 * If no results are found then a text will be displayed
                 * and break!
                 */
                if (arrayOfResults.length <= 0) {
                    resultContainer.html("No Search Found");
                    return;
                }
                /**
                 * If something is present inside the array then
                 * iterate over the elements and make Anchor tag for each of the element
                 * with data attribute value set
                 */
                arrayOfResults.forEach(
                    result => {
                        resultContainer.append(`<li><a class = "searchItems" 
                                            data = ${result.Url}>${result.keyword}</a></li>`);
                    }
                )
                /**
                 * Add the click events to all the searched items.
                 */
                SearchBarNavigation();
            }
        });

    }

    /**
     * This function will validate the necessary fields of the register form
     */
    function RegisterFormValidation()
    {
        console.log("Validation in Progress.")
        ValidateField("#firstName_register",/^[a-zA-Z]{2,30}$/,
            "Please enter valid first name");
        ValidateField("#lastName_register",/^[a-zA-Z]{2,30}$/,
            "Please enter valid last name");
        ValidateField("#email_register",/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/,
            "Please enter valid email Address");
        ValidateField("#phone_register",
            /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/,
            "Enter a valid Contact Number")
        ValidateField("#address_register",
            /^[0-9]+(\s[A-Za-z]+\.?(\s[A-Za-z]+\.?)?)?\s[A-Za-z]+(\s[A-Za-z]+)?(\s[0-9A-Za-z]+)?$/,
            "Please enter valid physical address");
    }


    /**
     * This function Dynamically loads the picture from json file
     */
    function GalleryPage()
    {
        /**
         * Selecting the div row tag.
         */
        let divRow = $("#rowDiv");
        /**
         * Getting the picture data from the json file
         */
        $.get("./data/events_picture.json", function(data)
        {
            /**
             * Storing the events array inside the variable
             */
            let eventsPic = data.events;

            /**
             * Using the for loop to iterate over the image data
             */
            for (const pic of eventsPic)
            {
                /**
                 * Creating a new Div element for each picture
                 * using the Jquery
                 */
                let newDiv = $("<div>");

                /**
                 * Setting the attributes of the div class
                 */
                newDiv.addClass("col");
                /**
                 * Setting the html content of new div tag
                 */
                newDiv.html
                (`<a class="gallery-item" href="${pic.imageSrc}">
                                        <img src="${pic.imageSrc}" class="img-fluid" alt="${pic.altText}">
                                   </a>`
                )

                /**
                 * Appending the item at the end of the div row tag.
                 */
                divRow.append(newDiv);
            }
        });
    }


    /**
     * This function is Register the new user to the webiste
     * as well validate the data before registering the user
     */
    function RegisterForm()
    {
        /**
         * Validation of the Register Form
         */
        RegisterFormValidation();

        /**
         * Create the instance of the modal class
         */
        let newRegister:bootstrap.Modal =  new bootstrap.Modal(document.getElementById("registerModal") as HTMLElement,
            {
                // This two options are changing the behavior of the modal.
                backdrop: 'static', // Won't close if we click outside of modal
                keyboard: false //  Escape key will not close the modal.
            });


        /**
         * Initially hiding the modal
         */
        newRegister.hide();

        $("#registerButton").on("click",
            function(event)
            {
                /**
                 * Preventing the default Submission
                 */
                event.preventDefault()
                /**
                 * Getting the main value from the form !
                 */
                let firstName: string = $("#firstName_register").val() as string;
                let lastName: string = $("#lastName_register").val() as string;
                let email: string = $("#email_register").val() as string;
                let password: any = $("#password_register").val();
                let city: any = $("#city_register").val();
                let zip: any = $("#zip_register").val();
                let address: any = $("#address_register").val();
                let phone: any = $("#phone_register").val();


                /**
                 * Some More Validation
                 */
                if (firstName.length === 0 || firstName.trim() === "" || lastName.length === 0 || lastName.trim() === "" || email.length === 0
                    || email.trim() === "" || password.length === 0 || password.trim() === "" || city.length === 0 || city.trim() === ""
                    || zip.length === 0 || zip.trim() === "" || address.length === 0 || address.trim() === "" || phone.length === 0 || phone.trim() === "") {
                    /**
                     * Selecting the are where the Error message will be shown
                     */
                    let messageArea: JQuery<HTMLElement> = $("#messageArea");

                    /**
                     * Adding some error Classes
                     */
                    messageArea.addClass("alert alert-danger")
                        .text("Warninig: None of the Field can be left empty") // Appending again
                    /**
                     * Show the error.
                     */
                    messageArea.show(); // Show the message to the user !

                    $("firstName_register").trigger('focus');

                } else {
                    /**
                     * Declaring and Initializing the user Object
                     */
                    let newUserRegister: core.User = new core.User(firstName, lastName, email, password);

                    /**
                     * Displaying the name
                     */
                    $("#modalContent").text(`${newUserRegister.getFirstName} ${newUserRegister.getLastName}`);

                    /**
                     * Show the Welcome Register Demo
                     */
                    newRegister.show();

                    /**
                     * This request is just sending the request to the server
                     * not appending the data to the file cause JS is a Client Side Scripting and
                     * has nothing to do with the client side {Which can be PHP, etc}
                     */
                    $.ajax(
                        {
                            type: "POST",
                            url: "./data/testing.json",
                            data: JSON.stringify(newUserRegister.toJSON()),
                            contentType: "application/json", // Set the content type to JSON
                            success: function (data) {
                                /**
                                 * Setting the new registered user in the local storage for later use.
                                 */
                                localStorage.setItem(`${newUserRegister.getEmailAddress}`, <string>newUserRegister.serialize());
                            },
                        }
                    )

                    /**
                     * Set the delay for function for some time !
                     */
                    setTimeout
                    (
                        () =>
                        {

                            /**
                             * Hide the modal
                             */

                            newRegister.hide();
                            /**
                             * Redirect the user to the login page !
                             * @type {string}
                             */
                            LoadLink("login");
                        },
                        3000
                    )
                }
           });
    }

    /**
     * A Function Which will check whether the full name matches the Full name expression or not.
     * Accepts three arguments
     * Field ID
     * regular expression
     * error_message
     */
    function ValidateField(input_field_id: string, regular_expression : RegExp, error_message: string): void
    {
        /**
         * Selecting the Message Area Container !
         * @type {*|jQuery|HTMLElement}
         */
        let messageArea = $("#messageArea").hide();

        /**
         * When the Full name filed is left then this validation will occur immediately.
         * And using the named function to specifically refer the Name Field cause Named one has it own "this".
         * blur--> when we leave focus from the element
         */
        $(input_field_id).on("blur",function ()
        {
            /**
             * Since used jQuery ,so we have to use the .val() to get the value of the element.
             * @type {*|string|jQuery}
             */
            let inputFieldText = $(this).val();
            // this refers to the element on which or the element which triggered this
            // event.

            /**
             * if pattern does not match
             */
            if(!regular_expression.test(inputFieldText as string))
            {
                /**
                 * Trigger can force the specific event to occur
                 */
                $(this).trigger("focus").trigger("select"); // Appending the two triggers in jquery
                // (Dazy Change function)

                messageArea.addClass("alert alert-danger").text(error_message); // Appending again

                messageArea.show(); // Show the message to the user !
            }
            else
            {
                /**
                 * Do nothing !
                 */
                messageArea.removeAttr("class").hide(); // Remove class and hide the element.
            }
        });
    }

    /**
     * Form Validation
     */
    function LoginFormValidation()
    {
        ValidateField
        ("#loginEmail",
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/,
            "Please enter a valid email address");
    }


    function displayLoginForm()
    {


            /**
             * Validate the user input
             * using the "Regular Expressions"
             */
            LoginFormValidation();

            /**
             * Binding the event handler to the login button !
             */
            $("#loginButton").on("click", function (event)
            {
                /**
                 * Stop the Default submission of the form !
                 */
                event.preventDefault();

                /**
                 * Getting the input from the user !
                 */
                let emailAddress = document.forms[0].loginEmail.value;
                let password = document.forms[0].loginPassword.value;

                /**
                 * Declaring an empty user Object
                 * @constructor
                 */
                const newUser: core.User = new core.User();

                /**
                 * Selecting the Message Area Container !
                 * and initially hiding it
                 * @type {*|jQuery|HTMLElement}
                 */
                let messageArea:JQuery<HTMLElement> = $("#messageArea").hide();

                /**
                 * Creating the instance of Boostrap Modal Class
                 */
                let welcomeModal: bootstrap.Modal =
                    new bootstrap.Modal(document.getElementById("welcomeModal") as HTMLElement,
            {
                        backdrop: 'static', // Won't close if we click outside of modal
                        keyboard: false //  Escape key will not close the modal.
                    })

                /**
                 * Initially hiding the modal
                 */
                welcomeModal.hide();

                /**
                 * Declaring the conditional variable
                 */
                let success = false;

                /**
                 * Making sure none of the field is empty
                 */
                if (emailAddress === "" || password === "") {
                    /**
                     * Trigger can force the specific event to occur
                     */
                    $("#loginEmail").trigger("focus").trigger("select"); // Appending the two triggers in jquery
                    // (Dazy Change function)

                    /**
                     * Add the Class to the message area
                     */
                    messageArea.addClass("alert alert-danger").text("None of the fields can be left empty"); // Appending again

                    messageArea.show(); // Show the message to the user !

                }
                /**
                 * If the user has already registered and its user Object exists in the LocalStorage then
                 * this block will try to retrieve it from the local storage
                 * if does not exist then .json file will be referred.
                  */
                else if (localStorage.getItem(emailAddress)) {
                    /**
                     * Storing the local Storage data into variable
                     */
                    let exist = localStorage.getItem(emailAddress);

                    /**
                     * Populate the user object from the Local Storage data initialize the session
                     * using that object
                     */
                    newUser.deserialize(exist as string);

                    /**
                     * Adding the user to session storage
                     */
                    sessionStorage.setItem("user", <string> newUser.serialize());

                    /**
                     * Change the content of modal
                     */
                    $("#h1Modal").text(`Welcome ${newUser.getFirstName} ${newUser.getLastName}`);

                    /**
                     * Display the modal to the user !
                     */
                    welcomeModal.show();
                    /**
                     * Set the conditional variable to true !
                     * @type {boolean}
                     */
                    success = true;

                    if(success)
                    {
                        /**
                         * Remove Warning class and hide the element
                         */
                        messageArea.removeAttr("class").hide();

                        /**
                         * using the set timeout.
                         */
                        setTimeout(() =>
                        {
                            /**
                             * Hide the Modal
                             */
                            welcomeModal.hide()
                            /**
                             * Redirect the user to Statistics page .
                             * @type {string}
                             */
                            LoadLink("statistics");

                        }, 4000)

                    }
                    else
                    {
                        /**
                         * If wrong credentials are entered
                         */
                        $("#loginEmail").trigger("focus").trigger("select");
                        messageArea.addClass("alert alert-danger");
                        messageArea.text("Please Enter Valid Credentials");
                        messageArea.show();
                    }
                }
                else
                {
                    /**
                     * Getting the data from the json File
                     * using the Asynchronous Request !
                     */
                    $.get("./data/users.json", function (data) {

                        /**
                         * Storing the retrieved data into the variable !
                         */
                        let users = data.users;

                        /**
                         * Checking whether the user exists in the file or not !
                         */
                        for (const user of users) {
                            /**
                             * Credentials Matching
                             */
                            if (user.EmailAddress === emailAddress && user.Password === password) {
                                /**
                                 * Populate the user object from the json data initialize the session
                                 * using that object
                                 */
                                newUser.fromJSON(user);

                                /**
                                 * Adding the user to session storage
                                 */
                                sessionStorage.setItem("user", <string>newUser.serialize());

                                /**
                                 * Change the content of modal
                                 */
                                $("#h1Modal").text(`Welcome ${newUser.getFirstName} ${newUser.getLastName}`);

                                /**
                                 * Display the modal to the user !
                                 */
                                welcomeModal.show();
                                /**
                                 * Set the conditional variable to true !
                                 * @type {boolean}
                                 */
                                success = true;

                                /**
                                 * Get out
                                 */
                                break;
                            }
                        }
                        if(success)
                        {
                            /**
                             * Remove Warning class and hide the element
                             */
                            messageArea.removeAttr("class").hide();


                            setTimeout(() =>
                            {
                                /**
                                 * Before redirecting the user to the services page hide the modal.
                                 */
                                welcomeModal.hide();
                                /**
                                 * Redirect the user to contact list page !
                                 * @type {string}
                                 */
                                LoadLink("statistics");

                            }, 4000)


                        } else {
                            /**
                             * If wrong credentials are entered
                             */
                            $("#loginEmail").trigger("focus").trigger("select");
                            messageArea.addClass("alert alert-danger");
                            messageArea.text("Please Enter Valid Credentials");
                            messageArea.show();
                        }
                    });
                }


            });

        $("#registerLink").css("color", "blue");

        $("#registerLink").on("mouseover",function()
        {
            $(this).css("cursor", "pointer");
            $(this).css("font=weight", "bold");
        })

        $("#registerLink").on("click",function()
        {
            LoadLink("register");
        })



    }

    /**
     * An Authenticator function which checks the user permission or login
     * if logged in then they can access the page otherwise user will be redirected.
     */
    function AuthGuard()
    {
        /**
         * List of Protected routes
         */
        let protected_routes: string[] = ["statistics","planning"];

        /**
         * if the Current Active Link exists in protected routes
         */
        if (protected_routes.indexOf(router.ActiveLink) > -1)
        {
            if (!sessionStorage.getItem("user"))
            {
                console.log("Breach Detected, Alert");
                LoadLink("login");
            }
        }
    }

    /**
     * This function will change the html content of the
     * Nav Login button to log out if the user is logged in
     */
    function CheckLogin()
    {
        /**
         * Checking the User Login
         */
        console.log("User Login Status is being checked.");

        /**
         * if the user named Item exist in Session Storage / Tab Storage !
         */
        if(sessionStorage.getItem("user"))
        {
            /**
             * Changing the button from log in to log out
             */
            $("#loginNav").html(`<a class="nav-link" id="navLogOut" data="login"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>`);


            /**
             * Everytime the user Login status is Checked which is done after loading each page content
             * it will check whether the nav Links exist or not if does then this block of code won't be executed
             * otherwise with an message the two navlinks will be added into the nav bars
             *
             * This is placed here because it will check everytime while the header it loaded only one time.
             */
            if(!$("#statContainer").length)
            {
                console.log("New Links added in the Navbar"); // Message
                /**
                 * Dynamically adding the nav links
                 */
                $("#navLinks").append(`<li class="nav-item" id="statContainer">
                    <a class="nav-link"  id="stat" data="statistics"> <i class="fa-solid fa-chart-simple"></i> Statistics</a>
                </li>`)

                $("#navLinks").append(`<li class="nav-item" id="planContainer">
                    <a class="nav-link"  id="plan" data="planning"><i class="fa-regular fa-calendar-days"></i> Planning</a>
                </li>`)


                /**
                 * Binding an event handler to the nav links(new ones).
                 */
                $("#stat").on("click", function()
                {
                    LoadLink($(this).attr("data") as string);
                })

                $("#plan").on("click", function()
                {
                    LoadLink($(this).attr("data") as string);
                })



                /**
                 * Binding some CSS event listener to the new links.
                 */
                $("#plan").on("mouseover", function () {
                    $(this).css("cursor", "pointer");
                    $(this).css("font=weight", "bold");
                });

                /**
                 * Binding some CSS event listener to the new links.
                 */
                $("#stat").on("mouseover", function () {
                    $(this).css("cursor", "pointer");
                    $(this).css("font=weight", "bold");
                });



            }
            /**
             Selecting the Logout Button
             */
            let logoutButton:JQuery<HTMLElement> = $("#navLogOut");

            /**
             * Binding some CSS event listener to the logout button.
             */
            logoutButton.on("mouseover", function () {
                $(this).css("cursor", "pointer");
                $(this).css("font=weight", "bold");
            });

            /**
             * Binding the event handler to the button log out click
             */
            logoutButton.on("click", function()
                {
                    /**
                     * Clear the session storage
                     */
                    sessionStorage.clear();

                    /**
                     * Again make the Logout to Login Button !
                     * Changing the html of the logout button
                     */
                    logoutButton.html(`</i><a id="navLogOut" data="login">Login</a>`);

                    /**
                     * Remove the links from the navbar
                     */
                    console.log("Two links removed and user logged out");
                    $("#statContainer").remove();
                    $("#stat").remove();
                    $("#planContainer").remove();
                    $("#plan").remove();

                    /**
                     * Redirect the user to login page !
                     */
                    LoadLink("login");
                }
            )
        }
    }


    /**
     * Defining the CallBack function
     * For Google Map API
     * @FunctionType Async
     */
    async function initMap()
    {

        /**
         * Binding the event hanlder to the button loacted at the home page.
         */
        $("#servicesButton").on("click",function ()
        {
              LoadLink($(this).attr("data") as string);
        })

        /**
         * Declaring the variable which will hold the object of the map class !
         */
        let map;
        /**
         * This is Position of Durham College
         * because I don't know Harmony Hub
         * @type {{lng: number, lat: number}}
         */
        const position: { lng: number; lat: number; } = { lat: 43.94373576253126, lng: -78.89703131534256 };


        /**
         * Using the Destructing Assignment Operator to Extract Specific Properties from the library
         * Like here I am Extracting two Class from the Imported Library !
         */
        const { Map } = await google.maps.importLibrary("maps")  as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

        /**
         * Creating the Object of Classes !
         */
        map = new Map(document.getElementById("map") as HTMLElement, {
            zoom: 15,
            center: position,
            mapId: "harmony_hub",
        });

        /**
         * Creating the Object and Associating the Object with the
         * Map Object and also specifying the location of the marker.
         */
        const marker = new AdvancedMarkerElement({
            map: map,
            position: position,
            title: "Harmony Hub",
        });
    }


    /**
     * This Method Provide Ultimate Functionality to the Statistics page
     * Enabling the users to navigate to different years of visitors data
     * Which is being extracted from the .json file using the Asynchronous Programming
     * and then dynamically changing the chart data on the user navigation
     *
     * @functionType Async
     */
    async function ShowStats()
    {

        /**
         * Ensuring non-logged in user can't access this if does then will be redirected to the
         * "Login Page"
         */
        AuthGuard();
        /**
         * Defining the empty Chart
         */
        let chart: Chart;
        /**
         * Defining the data empty variable
         */
        let data: {months:string[],years:{year: number, visitors: number[]}[]};
        /**
         * Trying to populate the data using the async function
         */
        data = await getWebStats();

        /**
         * Selecting the Canvas Element inside which the Chart will be displayed
         * @type HTMLCanvasElement
         */
        let charContainer: HTMLCanvasElement = document.querySelector('#visitorStats') as HTMLCanvasElement
        /**
         * Creating the new instance of the Chart
         * @type Chart
         */
        chart = new Chart(
                charContainer,
                {
                    type: 'line',
                    data: {
                        labels: data.months,
                        datasets: [
                            {
                                label: `Harmony Hub\'s visitor statistics for ${data.years[parseInt(router.linkData != "" ? router.linkData : "0")].year}`,
                                data: data.years[parseInt(router.linkData != "" ? router.linkData : "0")].visitors,
                                backgroundColor : 'rgba(255,99,132,0.2)',
                                borderColor: 'rgba(255,99,132,1)',
                                fill: false,
                                borderWidth: 1
                            }
                        ]
                    },
                    options:
                    {
                        animation:
                        {
                                duration: 1000,
                                easing: 'linear',
                        }
                    }

                }
            );

        /**
         * Binding the event handler to the "Years Options"s
         * using the Class Attribute
         */
        $(".years").on("click",function ()
        {
            console.log("Clicked Year") // Message

            /**
             * Each button is associated with the data attribute
             * which has an array index at which that year data is present
             */
            let arrayIndex:number = parseInt($(this).attr("data") as string);

            /**
             * It will load the statistics page again as well as make the "statistics" as activeLink
             * of the webiste and the index of the array extracted from the clicked element.
             *
             * On Each click on the specified year the index will be stored inside the
             * {linkData} the data associated with the {activeLink}
             * Note:--> This index is used to change the data array from which the data is getting the error.
             */
            LoadLink("statistics",arrayIndex.toString());

            /**
             * once the "linkDat" is utilized to change the data array then it
             * Updates the chart
             */
            chart.update();

        })



        /**
         * Custom API for Accessing the JSON File
         * Which returns a "Promise Object which
         * takes an Asynchronous Function with two callbacks as an argument"
         * and also have some code inside it, based on the completion of
         * code the "resolve or reject is called."
         *
         * @functionType Async
         * @return Promise<{months: string[], years: {year: number, visitors: number[]}[]}>
         */
        async function getWebStats(): Promise <{months: string[], years: {year: number, visitors: number[]}[]}> // IMP (Define the return type)
        {
            /**
             * Return a Promise Object with "Jquery AJAX get shorthand inside it."
             */
            return new Promise((resolve, reject) =>
            {
                /**
                 * Jquery .get Method
                 */
                $.get("./data/userStatistics.json", function (data)
                {
                    resolve(data); // return the data
                });
            });
        }

    }


    /**
     * This method provide functionality to the "Planinning page"
     * Where the logged in user can see the upcoming events being fetched from .json file
     * and have the options of getting more detail about the event as well as
     * can mark the event which eventually put the copy of that event card inside the marked event table
     * which they can later remove.
     * At last, this function also add the user's proposed event to the events table
     * which after the verfication can be made "public for other"
     */
    function DisplayPlanningPage()
    {
        /**
         * Authentication Checker
         */
        AuthGuard();

        console.log("Planning Page"); //Message

        /**
         *  Creating the modal whose content will be changed Dynamically based on the button the user has clicked
         *  because each button is associated with the "unique" id and which will be used to reference the "unique" event handler block of code
         *  when that event occuur.
         */
        let eventInfoModal : bootstrap.Modal = new bootstrap.Modal(document.getElementById("eventDetails") as HTMLElement, {
            backdrop: 'static',
            keyboard: true
        });


        /**
         * Using the Jquery AJAX .get() shorthand method to get the data from the json
         */
        $.get("./data/planning.json", function (data: {event_name:string, date:string, description:string, address:string}[])
        {



            /**
             * Storing the retrieved data into the array for ease of use.
             */
            let retrievedData: { event_name: string, date: string, description: string, address: string }[] = data;

            /**
             * Using the for loop to iterate over each element.
             */
            for (let i: number = 0; i < retrievedData.length; i++) // Remember code inside the block is for each element --- Himanshu
            {
                /**
                 * Defining the HTML event card element.
                 */
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
                    </li>`

                /**
                 * Appending the element into the selected element.
                 */
                $(".events ul").append(eventName);

                console.log("Event added"); // Message.

                /**
                 * Now here we are binding the event handler to each event card "getDetails" button
                 * and each button on click will show different data.
                 * That is because each button event is unique or we can say "an Picture" of the
                 * event handler for each button is clicked and then referenced when the event on that button occurs.
                 *
                 */
                $(`#eventDetail_${i}`).on("click", function ()
                {
                    console.log("Display event information") // Message

                    /**
                     * Dynamically changing the data of the modal.
                     */
                    $("#event_info").text(retrievedData[i].event_name); // Event Name

                    $("#eventDate").text(retrievedData[i].date); // Event Date

                    $("#eventAddress").text(retrievedData[i].address); // Event Address

                    $("#eventDescription").text(retrievedData[i].description); // Event Description

                    eventInfoModal.show(); // Display's the Modal.
                })


                /**
                 * Binding the event handler to the "Mark Event Button"
                 * Which is triggerd when the user clicks the button
                 * and the event handler dynamically add the event card inside the "Marked Event Table".
                 *
                 * Note: -
                 * The event card added to the marked event table has an button called "Unmark Event"
                 * Which dynamically remove the event card from the table.
                 */
                $(`#markEvent_${i}`).on("click", function ()
                {
                    console.log("Event has been marked"); // Message

                    /**
                     * Dynamically changing the data of the modal.
                     */
                    $("#event_info").text("Event has been Marked"); // Event marked

                    $("#eventDate").text("Event Scheduled on "+ retrievedData[i].date + " has been added to you 'Marked Event Table'."); // Event Date

                    $("#eventAddress").text("Don't forget to reach at "+ retrievedData[i].address +" on " +retrievedData[i].date +"."); // Event Address

                    $("#eventDescription").text("See ya !"); // Message


                    /**
                     * Appending the event to the "Marked Event Table"(Dynamically)
                     */
                                                            // This "id" here is important for removing the records.
                    $(".markedEvents ul").append( `<li id="markedEvent_${i}"> 
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

                    /**
                     * Once the event has been added to then we bind the event handler to "UnmarkEvent Button"
                     * Which will remove the event card from the marked event table
                     */
                    $(`#unmarkEvent_${i}`).on("click", function ()
                    {

                        console.log("An Event card has been removed from the table") // Message

                        /**
                         * Removing the element.
                         */
                        $(`#markedEvent_${i}`).remove();

                        /**
                         * Dynamically changing the data of the modal.
                         */
                        $("#event_info").text("Event has been 'Removed' from the Marked Event Table"); // Event Removed

                        $("#eventDate").text("Event Scheduled on "+ retrievedData[i].date + " has been removed from 'Marked Event Table'."); // Event Date

                        $("#eventAddress").text(""); // Event Address

                        $("#eventDescription").text("Thanks"); // Message

                        eventInfoModal.show(); // Show the Modal

                    })

                    eventInfoModal.show(); // Display's the Modal.
                })




            }
        })


        /**
         * Binding the event hanlder to the "Propose button"
         */
        $("#proposeButton").on("click",function(event)
        {

            console.log("Propose Event Button Clicked");


            event.preventDefault();

            let eventName = document.forms[0].eventName_propose.value;
            let eventDate = document.forms[0].eventDate_propose.value;
            let eventAddress = document.forms[0].eventAddress_propose.value;
            let eventDescription = document.forms[0].eventDescription_propose.value;

            if(eventName.trim().length === 0 || eventDate.trim().length === 0 || eventAddress.trim().length === 0
                || eventDescription.trim().length === 0)
            {
                $("#messageArea").text("None of the Field can be left empty");

                $("#messageArea").addClass("alert alert-danger");
            }
            else
            {
                /**
                 * Defining the HTML event card element.
                 */
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
                    </li>`

                /**
                 * Appending the element into the selected element.
                 */
                $(".events ul").append(eventCard);

                console.log("Event added"); // Message.

                /**
                 * Dynamically changing the data of the modal.
                 */
                $("#event_info").text("Event has been sent to admin for approval"); // Event Removed

                $("#eventDate").text("Event Scheduled on "+ eventDate + " might take a while for approval.."); // Event Date

                $("#eventAddress").text(""); // Event Address

                $("#eventDescription").text("Thanks for contributing to community center"); // Message

                eventInfoModal.show(); // Show the Modal

                /**
                 * Empty the Error Text
                 */
                $("#messageArea").text("");
                /**
                 * Also remove the error class from that.
                 */
                $("#messageArea").removeClass("alert alert-danger");


                document.forms[0].reset(); // reset the form

            }
        })


    }


    /**
     * This function will add the NavBar to each and every page of the
     * Website
     * This function will utilize the jQuery .get() shorthand method !
     */
    function AddHeaders()
    {
        /**
         * Using the Jquery AJAX get Shorthand Method to asynchronously get the
         * data from the JSON File.
         */
        $.get("./views/components/header.html", function(data)
        {
            /**
             * Selecting the header tag
             * and adding the header data
             */
            $("header").append(data)

            /**
             * Dynamically Changing the title of the page.
             */
            document.title = router.ActiveLink;

            /**
             * ========================================>
             * Once the content is loaded then only we do further operations
             * Like Adding the new Element to the navBar
             */
            let newNavLink = document.createElement("li");
            // Setting the attributes for the new element
            newNavLink.setAttribute("class", "nav-item");
            // Setting the content of the li tag
            newNavLink.innerHTML = `<a class="nav-link" data="blogs"><i class="fa-solid fa-arrow-up-right-dots"></i> Careers</a`;
            // Adding the new Element to the document object.
            // Selecting the navbar
            let navCurrentLinks = $("#navLinks") ;
            // Appending the new Element as the last Child element of the selected one !
            navCurrentLinks.append(newNavLink);
            /**
             * Changing the name of the nav element called "Blog" to "News"
             */
            // // Using the already Selected Element !
            // navCurrentLinks[4].html(`<a class="nav-link" data="blogs"> News</a`);


            AddNavigationEvents();
            /**
             * Personal Note: ------
             * As .get() is an asynchronous operation so it was taking some time to load
             * but the executor did not wait for this specifically so it was keep going to the
             * Check login,
             * Now, it is placed inside the .get() so when all links are ready then it will start checking
             */
            CheckLogin();

            /**
             * Implement the search bar logic
             */
            SearchBar();
        })

    }

    /**
     * This method asynchronously Update the content of the page
     * IT uses the Jquery AJAX get shorthand method to fetch the data from the json
     */
    function LoadContent()
    {
        /**
         * Search bar is implemented for each and every page
         * so this should come after the "Header".
         */
        SearchBar();

        /**
         * Defining the page name/file name from which the data will be fetched.
         */
        let page_name = router.ActiveLink;

        /**
         * Storing the Page based Functionality provider function
         * inside the variable for later execution.
         */
        let callback = pageIdentifier();

        /**
         * Now Fetching the data from the json file.
         * and on successful retrieval of data Page based Functionality provider function will be executed.
         */
        $.get(`./views/content/${page_name}.html`, function (html_data)
        {
            /**
             * Changing the content of the "main Element"
             */
            $("main").html(html_data);

            /**
             * Check the login !
             */
            CheckLogin();

            /**
             * Provide the Functionality for the elements required.
             */
            callback();
        });


    }



    /**
     * This function add the footers at the end of  each page !
     */
    function AddFooters()
    {
        /**
         * Adding the Footer at the end of the page
         */

            // Selecting the body Object of the document Object
        let body = document.body;

        // Create a new element div which will contain the footer element !
        let footerContainer = document.createElement("div");

        // Setting the attributes of the container
        footerContainer.setAttribute("Class","container")


        // Declaring the array of footer elements names
        let footerElements = ["Policy","Terms of Service", "Contact"];
        // Also declaring an Array of addresses of the footer elements pages
        let footerElementsPages = ["privacy","terms","contact"];

        let readyFooterElements = ""; // This will store the ready footer links !

        // Using the for loop to print the footer elements !
        for (let i=0; i < footerElements.length; i++)
        {
            readyFooterElements += `<li class="nav-item"><a data="${footerElementsPages[i]}" class="nav-link px-2 text-muted">${footerElements[i]}</a></li>`
        }

        // Setting the inner HTML of the div element
        footerContainer.innerHTML = `
                  <footer class="py-3 my-4">
                    <ul class="nav justify-content-center border-bottom pb-3 mb-3">
                    ${// Print the for loop generated elements here !
            readyFooterElements}                   
                    </ul>
                    <p class="text-center text-muted">&copy; 2024 Harmony Hub, CA</p>
                  </footer>`

        // Adding the new Element as the last child of the body element
        body.appendChild(footerContainer);

    }


    /**
     * ======================================================================> Contact Page
     * This method is related to Contact Page and execute when
     * the contact.html page is loaded !
     * @constructor
     */

    function DisplayContactPage() {

        $("#submitButton").on("click", (event) =>
        {

            /**
             * Preventing the default form submission.
             */
            event.preventDefault();

            /**
             * Getting the values from the Form and storing them inside the variable
             * for this (IN TYPESCRIPT)
             * I have used the document Object forms[] array to access the form and its elements
             */

            let firstName: string = document.forms[0].firstName.value;
            let lastName: string = document.forms[0].lastName.value;
            let email: string = document.forms[0].email.value;
            let subject : string = document.forms[0].contactSubject.value;
            let city: string = document.forms[0].city.value;
            let zip: string = document.forms[0].zip.value;
            let address: string = document.forms[0].address.value;


            /**
             * Data Validation
             */
            if (firstName.length === 0 || firstName.trim() === "" || lastName.length === 0 || lastName.trim() === "" || email.length === 0
                || email.trim() === "" || subject.length === 0 || subject.trim() === "" || city.length === 0 || city.trim() === ""
                || zip.length === 0 || zip.trim() === "" || address.length === 0 || address.trim() === "")
            {

                // Display an Error message in the modal body
                $("#errorBody").html(`<b><i>Please Fill all the Fields.</i></b>`);

                // Create a Bootstrap modal with options
                let myModal: bootstrap.Modal = new bootstrap.Modal(document.getElementById('error') as HTMLElement,
            {
                    backdrop: 'static',
                    keyboard: false
                    });

                // Show the modal
                myModal.show();

            } else
            {
                // Creating the object of Contact Class
                let contact: core.Contact = new core.Contact(firstName, lastName, email, subject, city, zip);

                // Display a thank you message in the modal body
                $("#thanksBody").html
                (
            `<b><i>Thanks for Contacting Us </i> <br> ${contact.getFirstName} ${contact.getLastName} (${contact.getEmail})
                            <br>
                            We will get in Touch with you quikly.
                            .</b>`
                );


                /**
                 * Creating the instance of the bootstrap modal which will be used to programmatically manipulte the modal present in
                 * the contactPage.html document
                 * as well as setting some behaviors of modal
                 */
                let thanksModal = new bootstrap.Modal(document.getElementById('thanksMessage') as HTMLElement, {
                    backdrop: 'static',
                    keyboard: false
                });

                // Show the modal
                thanksModal.show();

                // This will redirect the user to index.html (HomePage) after five seconds after showing the thank-you Message.
                setTimeout(function ()
                {
                    // Explicitly submitting the Form!
                    // $("#ContactForm").submit();


                    thanksModal.hide();

                    // Redirecting the user to index.html
                    LoadLink("home");
                },
                    5000);
            }
        })
    }
    /**
     * =======================================================================> Portfolio Page !
     * This method is specifically created for our portfolio page !
     //  */
    function PortfolioPage()
    {


        function newPortfolio()
        {


            /**
             * Defining the array of Project titiles.
             */
            let projectTitles: string[] =
                [
                    "Fitness BootCamp",
                    "Community CookBook Project",
                    "Teach for Seniors Program"
                ];

            /**
             * Defining the array of Project Description
             */
            let projectDescriptions =
                [
                    "Regular art and craft sessions for individuals of all ages. Activities include painting, pottery, and DIY crafts to foster creativity and provide a platform for artistic expression.",
                    "Collaborative creation of a community cookbook featuring recipes contributed by residents. The project promotes cultural exchange through food and fosters a sense of community.",
                    "Workshops and training sessions tailored for senior citizens to enhance their technological skills. Topics include using smartphones, social media, and online communication tools."
                ];

            /**
             * Defining the images of the Project community center being involved in.
             */
            let imageLocations = ["center_3.jpg", "center_5.jpg", "center_1.jpg"];

            /**
             * Selecting the Element inside which the Project will be displayed as row-cell
             */
            let projectTable = $("#projectTable");

            /**
             * Creating an new Row.
             */
            projectTable.append('<tr id = "onClickLoad" >');

            /**
             * Using the for loop to populate the cards using the card info
             */
            for (let i = 0; i < projectTitles.length; i++) {


                let newRow: JQuery<HTMLElement> = $("#onClickLoad")
                /**
                 * Inserting the new cell in a row.
                 */

                newRow.append(`<td id='${i}'>`);

                let newCell: JQuery<HTMLElement> = $(`td#${i}`);

                // Creating a new div for the content cell
                let newDiv = document.createElement("div");
                newDiv.setAttribute("class", "card w-75 m-5");
                newDiv.innerHTML =
                    `<img src="images/${imageLocations[i]}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${projectTitles[i]}</h5>
                        <p class="card-text">${projectDescriptions[i]}</p>
                        <a href="#" class="btn btn-primary">Get More Details</a>
                    </div>`;

                // Appending the new div to the content cell
                newCell.append(newDiv);
            }
        }

        $("#loadPortfolio").on("click",function()
        {
            newPortfolio();
        })
    }

    /**
     * This page will identify which page the user is on
     * and execute the method related to that page !
     */
    const pageIdentifier  = function () : Function
    {
        /**
         * This switch will implement the functionality needed
         * based on the activeLink of the website
         */
        switch (router.ActiveLink)
        {
            case "home": return initMap;
            case "blogs": return new Function;
            case "contact" : return  DisplayContactPage;
            case "events" : return LoadEvents;
            case "gallery": return GalleryPage;
            case "login" : return displayLoginForm;
            case "portfolio" : return PortfolioPage;
            case "privacy" : return new Function;
            case "register" : return RegisterForm;
            case "services" : return new Function;
            case "team" : return TeamNecessity;
            case "terms" : return new Function;
            case "statistics": return ShowStats;
            case "planning": return DisplayPlanningPage;

            default:
                console.error("ERROR: callback does not exist" + router.ActiveLink);
                return new Function();
        }
    }

    /**
     * Makes the First Character of the passed string Capital
     * as well as remove the first character then concatenate the upper one
     * then return all together
     * @param str
     */
    function CapitalizeFirstLetter(str:string): string
    {

        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    /**
     * This function is change the content of page as well as add some new components like
     * footer dynamically.
     */
    function StartMethod()
    {
        /**
         * Add the nav elements to the header.
         */
        AddHeaders();

        /**
         *
         */
        LoadLink('home');

        /**
         * Add Footers
         */
        AddFooters();
    }

    /**
     This will write something in the console when the window has loaded all its resources !
     */
    window.addEventListener("load",()=>
    {
        /**
         * This function is executed for all the pages on the website
         * as it add nav and footer elements !
         */
        StartMethod();

        console.log("Resources has Loaded")
    })
})();
