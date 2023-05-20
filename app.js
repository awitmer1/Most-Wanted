
function app(people) {
    displayWelcome();
    runSearchAndMenu(people);
    return exitOrRestart(people);
}

function displayWelcome() {
    alert('Hello and welcome to the Most Wanted search application!');
}

function runSearchAndMenu(people) {
    const searchResults = searchPeopleDataSet(people);

    if (searchResults.length === 1) {
        const person = searchResults[0];
        mainMenu(person, people);
    }else if (searchResults.length > 1) {
        displayPeople('Search Results', searchResults);

        const continueSearch = prompt('Would you like to continue searching? y/n')
            if (continueSearch == "y") {
                results = runSearchAndMenu (searchResults);
                displayPeople('Search Results', results);
            }else {
                return;
            }
    }else {alert('No one was found in the search.');}
}

function searchPeopleDataSet(people) {

    const searchTypeChoice = validatedPrompt(
        'Please enter in what type of search you would like to perform.',
        ['id', 'name', 'traits']
    );

    let results = [];
    switch (searchTypeChoice) {
        case 'id':
            results = searchById(people);
            break;
        case 'name':
            results = searchByName(people);
            break;
        case 'traits':
            results = searchByTraits(people);
            break;
        default:
            return searchPeopleDataSet(people);
    }

    return results;
}

function searchById(people) {
    const idToSearchForString = prompt('Please enter the id of the person you are searching for.');
    const idToSearchForInt = parseInt(idToSearchForString);
    const idFilterResults = people.filter(person => person.id === idToSearchForInt);
    return idFilterResults;
}

function searchByName(people) {
    const firstNameToSearchFor = prompt('Please enter the first name of the person you are searching for.');
    const lastNameToSearchFor = prompt('Please enter the last name of the person you are searching for.');
    const fullNameSearchResults = people.filter(person => (person.firstName.toLowerCase() === firstNameToSearchFor.toLowerCase() && person.lastName.toLowerCase() === lastNameToSearchFor.toLowerCase()));
    return fullNameSearchResults;
}

function searchByTraits(people) {
    const traitToSearchFor = validatedPrompt('Please enter the trait you are searching for.', ['gender', 'dob', 'height', 'weight', 'eyecolor', 'occupation']);
    
    switch (traitToSearchFor) {
        case "gender":
            results = searchByGender(people);
            break;
        case "dob":
            results = searchByDob(people);
            break;            
        case "height":
            results = searchByHeight(people);
            break;            
        case "weight":
            results = searchByWeight(people);
            break;            
        case "eyecolor":
            results = searchByEyeColor(people);
            break;   
        case "occupation":
            results = searchByOccupation(people);
            break;
        default:
            alert('Invalid input. Please try again.');
            return searchByTraits(people);
    }

    return results;
}

function searchByGender(people) {
    const genderSearch = prompt('Please enter the gender you want to search for.');
    const genderResults = people.filter(person => person.gender === genderSearch);
    return genderResults;
}

function searchByDob (people) {
    const dobSearch = prompt('Please enter the date of birth for the person you are searching.');
    const dobResults = people.filter(person => person.dob === dobSearch);
    return dobResults;
}

function searchByHeight(people) {
    const heightSearch = prompt('Please enter the height of the person you are searching for.');
    const heightResults = people.filter(person => person.height === heightSearch);
    return heightResults;
}

function searchByWeight (people) {
    const weightSearch = prompt('Please enter the weight of the person you are searching for.');
    const weightResults = people.filter(person => person.weight === weightSearch);
    return weightResults;
}

function searchByEyeColor(people) {
    const eyeColorSearch = prompt('Please enter the eye color of the person you are searching for.');
    const eyeColorResults = people.filter(person => person.eyeColor === eyeColorSearch);
    return eyeColorResults;
}

function searchByOccupation(people) {
    const occupationSearch = prompt('Please enter the occupation of the person you are searching for.');
    const occupationResults = people.filter(person => person.occupation === occupationSearch);
    return occupationResults;
}

function mainMenu(person, people) {

    const mainMenuUserActionChoice = validatedPrompt(
        `Person: ${person.firstName} ${person.lastName}\n\nDo you want to know their full information, family, or descendants?`,
        ['info', 'family', 'descendants', 'quit']
    );

    switch (mainMenuUserActionChoice) {
        case "info":
            displayPersonInfo(person);
            break;
        case "family":
            let personFamily = findPersonFamily(person, people);
            displayPeople('Family', personFamily);
            break;
        case "descendants":
            let personDescendants = findPersonDescendants(person, people);
            displayPeople('Descendants', personDescendants);
            break;
        case "quit":
            return;
        default:
            alert('Invalid input. Please try again.');
    }

    return mainMenu(person, people);
}

function displayPeople(displayTitle, peopleToDisplay) {
    const formatedPeopleDisplayText = peopleToDisplay.map(person => `${person.firstName} ${person.lastName}`).join('\n');
    alert(`${displayTitle}\n\n${formatedPeopleDisplayText}`);
}

function displayPersonInfo(person) {
    alert(`
    Id:  ${person.id}
    Name:  ${person.firstName} ${person.lastName}
    Gender:  ${person.gender}
    Date of birth:  ${person.dob}
    Height:  ${person.height}
    Weight:  ${person.weight}
    Eye color:  ${person.eyeColor}
    Occupation:  ${person.occupation}
    Parents:  ${person.parents}
    Current Spouse:  ${person.currentSpouse}`)
}

function findPersonFamily(person, people) {
    
    let family = [];

    // Find Parents //
    for (let i = 0; i < person.parents.length; i++) {
        family = family.concat(people.filter(el => el.id === person.parents[i]));
    }
    
    // Find Siblings //    
    siblings = people.filter(el => el.parents.includes(person.parents) && el.firstName != person.firstName);

    if (siblings) {
        family = family.concat(siblings)        
    }
    
    // Find Spouse //
    family = family.concat(people.filter(el => el.id === person.currentSpouse));
    
    return family;
}

function findPersonDescendants(person, people) {
debugger
    
    descendants = people.filter(el => el.parents[0] === person.id);

    descendants = descendants.concat(people.filter(el => el.parents.includes(descendants.id)));

    return descendants;
}

function validatedPrompt(message, acceptableAnswers) {
    acceptableAnswers = acceptableAnswers.map(aa => aa.toLowerCase());

    const builtPromptWithAcceptableAnswers = `${message} \nAcceptable Answers: ${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')}`;

    const userResponse = prompt(builtPromptWithAcceptableAnswers).toLowerCase();

    if (acceptableAnswers.includes(userResponse)) {
        return userResponse;
    }
    else {
        alert(`"${userResponse}" is not an acceptable response. The acceptable responses include:\n${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')} \n\nPlease try again.`);
        return validatedPrompt(message, acceptableAnswers);
    }
}

function exitOrRestart(people) {
    const userExitOrRestartChoice = validatedPrompt(
        'Would you like to exit or restart?',
        ['exit', 'restart']
    );

    switch (userExitOrRestartChoice) {
        case 'exit':
            return;
        case 'restart':
            return app(people);
        default:
            alert('Invalid input. Please try again.');
            return exitOrRestart(people);
    }

}