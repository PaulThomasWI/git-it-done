var userFormElement      = document.querySelector("#user-form");
var nameInputElement     = document.querySelector("#idUserName");
var repoContainerElement = document.querySelector("#repos-container");
var repoSearchTerm       = document.querySelector("#repo-search-term");

var getUserRepos = function(myUser) 
{
    var myAPIURL = "https://api.github.com/users/" + myUser + "/repos";

    fetch(myAPIURL).then(function(myResponse) 
    {
        if (myResponse.ok) {
            myResponse.json().then(function(aryGitHub) 
            {
              console.log(aryGitHub);
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
        var myRepoName = repoName.split("/");
        titleElement.textContent = myRepoName[1];

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

// getUserRepos("paulthomaswi");
userFormElement.addEventListener("submit", formSubmitHandler);