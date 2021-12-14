// targets div with class overview
const overview = document.querySelector(".overview");
const username = "tylerthietje";
const repoList = document.querySelector(".repo-list");
const repos = document.querySelector(".repos");
const repoData = document.querySelector(".repo-data");

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
  getRepos()
};

const getRepos = async function () {
    const res = await fetch(`
        https://api.github.com/users/${username}/repos?sort=updated&per_page=100
    `);
    const repos = await res.json();
    // console.log(repos);
    getRepoInfo(repos);
};

const getRepoInfo = function (repos) {
    for (let repo of repos) {
        const repoItem = document.createElement("li");
        //const h3 = document.createElement("h3");
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
};