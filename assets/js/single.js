var issueContainerElement = document.querySelector("#issues-container");
var limitWarningElement   = document.querySelector("#limit-warning");
var repoNameElement       = document.querySelector("#repo-name");

var getRepoName = function() {
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    
    if (repoName) {
        repoNameElement.textContent = repoName;    
        getRepoIssues(repoName);
    } else {
        document.location.replace("./index.html");
    }
}

var getRepoIssues = function(repo) {
    var myAPIURL = "https://api.github.com/repos/" + repo + "/issues?direction=ASC";

    fetch(myAPIURL).then(function(myResponse) {
        if (myResponse.ok) {
            myResponse.json().then(function(aryGitHub) 
            {
                displayIssues(aryGitHub);
                if (myResponse.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        } else {
            document.location.replace("./index.html");
        }
    });
}

var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerElement.textContent = "This repo has no open issues.";
        return;
    }

    for (var index = 0; index < issues.length; index++) {
        var issueElement = document.createElement("a");
        issueElement.classList = "list-item flex-row justify-space-between align-center";
        issueElement.setAttribute("href", issues[index].html_url);
        issueElement.setAttribute("target", "_blank");

        var titleElement = document.createElement("span");
        titleElement.textContent = (index + 1) + ". " + issues[index].title;

        issueElement.appendChild(titleElement);

        var typeElement = document.createElement("span");

        if (issues[index].pull_requests) {
            typeElement.textContent = "(Pull request)";
        } else {
            typeElement.textContent = "(Issue)";
        }

        issueElement.appendChild(typeElement);
        issueContainerElement.appendChild(issueElement);
    }
}

var displayWarning = function(repo) {
    limitWarningElement.textContent = "To see more than 30 issues, visit ";

    var aElement = document.createElement("a");
    aElement.textContent = "See More Issues on GitHub";
    aElement.setAttribute("href", "https://github.com/" + repo + "/issues");
    aElement.setAttribute("target", "_blank");

    limitWarningElement.appendChild(aElement);
}

getRepoName();
// getRepoIssues("facebook/react");