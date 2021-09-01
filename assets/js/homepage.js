var userFormElement        = document.querySelector("#user-form");
var nameInputElement       = document.querySelector("#idUserName");
var repoContainerElement   = document.querySelector("#repos-container");
var repoSearchTerm         = document.querySelector("#repo-search-term");
var languageButtonsElement = document.querySelector("#language-buttons");

var myShowGitHubUser = 0;

var getUserRepos = function(myUser) 
{
    var myAPIURL = "https://api.github.com/users/" + myUser + "/repos";

    fetch(myAPIURL).then(function(myResponse) 
    {
        if (myResponse.ok) {
            myResponse.json().then(function(aryGitHub) 
            {
                myShowGitHubUser = 0;
                displayRepos(aryGitHub, myUser);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to GitHub");
    });    
}

var displayRepos = function(repos, searchTerm) {
    //console.log(repos);
    //console.log(searchTerm);
    if (repos.length === 0) {
        repoContainerElement.textContent = "No repositories found.";
        return;
    }

    repoContainerElement.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    for (var index = 0; index < repos.length; index++) {
        var repoName    = repos[index].owner.login + "/" + repos[index].name;

        //console.log(repoName);

        var repoElement = document.createElement("a");
        repoElement.classList = "list-item flex-row justify-space-between align-center";
        repoElement.setAttribute("href", "./single-repo.html?repo=" + repoName);

        //console.log(repoElement);        

        var titleElement = document.createElement("span");

        if (myShowGitHubUser === 0) {
            myRepoName = repoName.split("/")[1];
        } else {
            myRepoName = repoName;
        }
        
        titleElement.textContent = myRepoName;

        //console.log(titleElement);        

        repoElement.appendChild(titleElement);

        var statusElement = document.createElement("span");
        statusElement.classList = "flex-row align-center";

        if (repos[index].open_issues_count > 0) {
            //statusElement.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[index].open_issues_count + " issue(s)";
            statusElement.innerHTML = repos[index].open_issues_count + " issue(s)";
        } else {
            statusElement.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        repoElement.appendChild(statusElement);
        repoContainerElement.appendChild(repoElement);
    }
}

var getFeaturedRepos = function(language) {
    var myAPIURL = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(myAPIURL).then(function(myReponse) 
    {
        if (myReponse.ok) {
            myReponse.json().then(function(myData) 
            {
                myShowGitHubUser = 1;
                displayRepos(myData.items, language);
            });
            console.log(myReponse);
        } else {
            alert('Error: GitHub User Not Found');
        }
    });
}

var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log(event);

    var myUsername = nameInputElement.value.trim();

    if (myUsername) {
        getUserRepos(myUsername);
        nameInputElement.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
}

var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");

    // console.log(language);
    if (language) {
        getFeaturedRepos(language);
        repoContainerElement.textContent = "";
    }
}

// getUserRepos("paulthomaswi");
userFormElement.addEventListener("submit", formSubmitHandler);

languageButtonsElement.addEventListener("click", buttonClickHandler);