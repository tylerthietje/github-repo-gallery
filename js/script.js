// targets div with class overview
const overview = document.querySelector(".overview");
const username = "tylerthietje";
const repoList = document.querySelector(".repo-list");
const repos = document.querySelector(".repos");
const repoData = document.querySelector(".repo-data");
const backToGallery = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

const getUser = async function () {
    const res = await fetch(`https://api.github.com/users/${username}`);
    const data = await res.json();
    //console.log(data);
    displayUserInfo(data);
};
getUser();

const displayUserInfo = function (data){
    const div =  document.createElement("div");
    div.classList.add("user-info")
    div.innerHTML =`
    <figure>
    <img alt="user avatar" src=${data.avatar_url} />
  </figure>
  <div>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Bio:</strong> ${data.bio}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
  </div> 
  `;
  overview.append(div);
  getRepos(username);
};

const getRepos = async function () {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repos = await res.json();
    // console.log(repos);
    getRepoInfo(repos);
};

// Function that displays all repos
const getRepoInfo = function (repos) {
    filterInput.classList.remove("hide");
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        specificRepoInfo(repoName);
    }
});

const specificRepoInfo = async function (repoName) {
    const getSpecificInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await getSpecificInfo.json();
    // console.log(repoInfo);

    // Grab languages
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();

    // Make a list of languages
    const languages = [];
    for (const language in languageData) {
        languages.push(language);
    }
    // console.log(languages);
    displayRepoInfo(repoInfo, languages);
};

const displayRepoInfo = function (repoInfo, languages) {
    repoData.innerHTML = "";
    const repoDataDiv = document.createElement("div");
    repoDataDiv.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    repoData.append(repoDataDiv);
    repoData.classList.remove("hide");
    repos.classList.add("hide");
    backToGallery.classList.remove("hide");
};

backToGallery.addEventListener("click", function () {
    repos.classList.remove("hide");
    repoData.classList.add("hide");
    backToGallery.classList.add("hide");

});

// Dynamic search
filterInput.addEventListener("input", function (e) {
    const searchValue = e.target.value;
    // selects all elements with class of repo
    const repos = document.querySelectorAll(".repo");
    // converts all input characters to lowercase
    const searchValueLowercase = searchValue.toLowerCase();

    for (const repo of repos) {
        // assigns the lowercase value of each repo to this variable
        const repoLowerText = repo.innerText.toLowerCase();
        if (repoLowerText.includes(searchValueLowercase)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        };

    }
});