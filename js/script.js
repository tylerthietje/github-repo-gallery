// targets div with class overview
const overview = document.querySelector(".overview");
const username = "tylerthietje";
const repoList = document.querySelector(".repo-list");

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
    console.log(repos);
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

