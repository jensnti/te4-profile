window.addEventListener('load', async () => {
    if (!githubUser) return;

    axios
        .get(`https://api.github.com/users/${githubUser}`)
        .then(response => {
            const template = document.querySelector('template');
            const clone = template.content.cloneNode(true);

            if (response.data.avatar_url) {
                clone.querySelector('.profile__portrait').src =
                    response.data.avatar_url;
            } else {
                clone.querySelector(
                    '.profile__portrait'
                ).src = `https://robohash.org/${githubUser}`;
            }

            clone.querySelector('.profile__heading').textContent =
                response.data.name;
            const login = document.createElement('span');
            login.textContent = response.data.login;
            login.classList.add('profile__lead');
            clone
                .querySelector('.profile__body')
                .insertBefore(login, clone.querySelector('.profile__text'));

            clone
                .querySelector('.profile__body')
                .querySelector('.profile__text').textContent =
                response.data.bio;

            const listData = {
                organization: response.data.company,
                location: response.data.location,
                email: response.data.email,
                link: response.data.blog
            };

            for (const [key, value] of Object.entries(listData)) {
                if (!value) continue;
                const li = document.createElement('li');
                const icon = document.createElement('img');
                icon.src = `images/${key}.svg`;
                icon.alt = `Icon for ${key}`;
                li.classList.add('profile__list-item');
                if (key === 'link') {
                    const a = document.createElement('a');
                    a.href = `https://${value}`;
                    a.textContent = value;
                    li.appendChild(a);
                } else {
                    li.textContent = value;
                }
                li.prepend(icon);
                clone.querySelector('.profile__list').appendChild(li);
            }

            const body = document.querySelector('body');
            body.appendChild(clone);
        })
        .catch(error => {
            console.error(error);
            const section = document.createElement('section');
            section.classList.add('profile');
            const h1 = document.createElement('h1');
            h1.textContent = '404: No profile found for that user.';
            h1.classList.add('profile__heading');
            section.appendChild(h1);
            const body = document.querySelector('body');
            body.appendChild(section);
        });
});
