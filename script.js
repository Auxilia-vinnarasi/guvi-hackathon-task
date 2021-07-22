let api = 'https://api.github.com'


function hideLandingPage() {
    document.getElementById('landing').classList.remove('d-flex');
    document.getElementById('landing').classList.add('hide');
}

async function handleForm(ev) {
    ev.preventDefault();

    let user = ev.target.username.value;
    let repo = "";


    let userData;
    let repoData;


    if (user !== '') {
        userData = await getUserData(user);
        repoData = await getRepoData(user, repo);
        renderUserProfile(userData).then(() => renderRepo(repoData))

    } else {
        document.getElementById('user-error').innerText = 'Please enter the user field';
    }
}


async function getUserData(user) {
    try {
        let response = await fetch(`${api}/users/${user}`);
        if (response.status === 404) {
            document.getElementById('user-error').innerText = 'User or Repo not found';
        } else {
            let userData = await response.json();
            return userData;
        }
    } catch (err) {
        console.log(err);

    }
}


async function getRepoData(user, repo) {
    try {
        let response = await fetch(`${api}/repos/${user}/${repo}`);
        if (response.message === "Not Found") {
            document.getElementById('user-error').innerText = 'User or Repo not found';
        } else {
            let repoData = await response.json();
            return repoData;
        }

    } catch (err) {
        console.error(err);
    }
}

async function getRepoListOfUser(repoListLink) {
    try {
        let response = await fetch(`${repoListLink}`);
        let repolist = await response.json();
        return repolist;
    } catch (err) {
        console.error(err)
    }
}



async function renderUserProfile(user) {
    document.getElementById('user').classList.remove('d-none');
    document.getElementById('profile').innerHTML = `<div class="row align-items-center">
         <div class="col-4 col-md-10">
            <img src="${user.avatar_url}" alt="avatar" class="img-fluid rounded-circle">
        </div>
       `

    let repoList = await getRepoListOfUser(user.repos_url);
    renderRepoList(repoList);
    hideLandingPage();

}

function renderRepoList(repoList) {

    let repoDiv = document.getElementById('repoList');
    if (repoList.size === 0) {
        repoDiv.innerHTML = `User has no repositories`;
    } else {

        repoDiv.innerHTML = `${repoList.map((repo)=>{return `
            <div class="my-2 repo-name-details">
                <h4 class="repo-name text-primary">Repos Name : ${repo.name}</h4>
                <a href="${repo.html_url}"><h6 class="repo-name text-primary">Repos Link : ${repo.html_url}</a></h6>
                <h6 class="repo-name text-primary">ForksCount : ${repo.forks_count}</h6>
                <h6 class="repo-name text-primary">Star Count : ${repo.watchers_count}</h6>
            </div>
            
                `;
        }).join('')}
        
                `;
        
    }
}
document.getElementById('landing-form').addEventListener('submit', handleForm)
