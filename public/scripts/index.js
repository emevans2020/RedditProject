// DOM elements
const postList = document.querySelector('.posts');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

function createBoard() {
	var boardName = document.getElementById('name').value;
	var descr = document.getElementById('description').value;
	firebase.database().ref('boards/' + name).set({
		name: boardName, description: descr
	});
}

function createPost() {
	var myRef = firebase.database().ref().push();
	var key = myRef.key;
	var newData = {
		id: key,
		content: document.getElementById("content").value,
		name: document.getElementById("title").value,
		upvotes: 0,
		downvotes: 0,
	}
	myRef.push(newData);
}

const setupUI = (user) => {
	var boards = db.collection('boards/');
	if (user) {
		// toggle user UI elements

		loggedInLinks.forEach(item => item.style.display = 'block');
		loggedOutLinks.forEach(item => item.style.display = 'none');
	} else {
		// toggle user elements
		loggedInLinks.forEach(item => item.style.display = 'none');
		loggedOutLinks.forEach(item => item.style.display = 'block');
	}
};

// setup posts
const setupPosts = (data) => {
	var posts = db.collection('posts');
	if (data.length) {
		let html = '';
		data.forEach(doc => {
			const post = doc.data();
			const li = `
        <li>
          <div class="collapsible-header grey lighten-4"> ${post.title} </div>
          <div class="collapsible-body white"> ${post.content} </div>
        </li>
      `;
			html += li;
		});
		postList.innerHTML = html
	}
};

$(document).ready(function () {
	auth.onAuthStateChanged(user => {
		if (user) {
			db.collection('posts').get().then(snapshot => {
				setupPosts(snapshot.docs);
				setupUI(user);
			});
		} else {
			setupUI();
			setupPosts([]);
		}
	});
});