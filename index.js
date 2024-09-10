const API_BASE_URL = 'http://localhost:8000';  // Adjust to your API base URL
const postForm = document.getElementById('post-form');
const postList = document.getElementById('post-list');
// const userInfo = document.getElementById('user-info');
// const authLinks = document.getElementById('auth-links');
// const username = document.getElementById('username');
// const createPostSection = document.getElementById('create-post');

// Function to load posts from the API
function loadPosts() {
    fetch(`${API_BASE_URL}/blog/`)
        .then(response => response.json())
        .then(posts => {
            postList.innerHTML = '';
            posts.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.classList.add('post');
                postDiv.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <p>Author: ${post.author}</p>
                    <p>Posted on: ${post.created_at}</p>
                    <button onclick="editPost(${post.id})">Edit</button>
                    <button onclick="deletePost(${post.id})">Delete</button>
                `;
                postList.appendChild(postDiv);
            });
        })
        .catch(error => console.log('Error:', error));
}

// Function to handle form submission for creating a new post
function createPost(event) {
    event.preventDefault();  // Prevent form from submitting the traditional way
    
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    fetch(`${API_BASE_URL}/blog/create_blog/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // If using token-based authentication, include the token here
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
            title: title,
            content: content
        })
    })
    .then(response => {
        if (response.status === 401 || response.status === 403) {
            alert('You must be logged in to create a post.');
            return;
        }
        return response.json();
    })
    .then(data => {
        console.log('Post created:', data);
        loadPosts();  // Reload posts after successful creation
    })
    .catch(error => console.log('Error creating post:', error));
}

loadPosts();

// Function to check if the user is logged in
// function checkAuth() {
//     fetch(`${API_BASE_URL}/auth/user/`, {
//         credentials: 'include'
//     })
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         } else {
//             return null;
//         }
//     })
//     .then(user => {
//         if (user) {
//             userInfo.style.display = 'block';
//             authLinks.style.display = 'none';
//             username.textContent = user.username;
//             createPostSection.style.display = 'block';
//         } else {
//             userInfo.style.display = 'none';
//             authLinks.style.display = 'block';
//         }
//     })
//     .catch(error => console.log('Error:', error));
// }

// // Function to handle new post submission
// postForm.addEventListener('submit', function (e) {
//     e.preventDefault();

//     const formData = new FormData(postForm);
//     fetch(`${API_BASE_URL}/posts/create/`, {
//         method: 'POST',
//         body: formData,
//         headers: {
//             'X-CSRFToken': getCSRFToken()
//         },
//         credentials: 'include'
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             alert('Post created successfully!');
//             postForm.reset();
//             loadPosts();
//         } else {
//             alert('Error creating post');
//         }
//     })
//     .catch(error => console.log('Error:', error));
// });

// Function to edit a post
// function editPost(postId) {
//     const newTitle = prompt("Enter new title:");
//     const newContent = prompt("Enter new content:");

//     if (newTitle && newContent) {
//         fetch(`${API_BASE_URL}/posts/${postId}/edit/`, {
//             method: 'POST',
//             body: JSON.stringify({ title: newTitle, content: newContent }),
//             headers: {
//                 'X-CSRFToken': getCSRFToken(),
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'include'
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 alert('Post updated successfully!');
//                 loadPosts();
//             } else {
//                 alert('Error updating post');
//             }
//         })
//         .catch(error => console.log('Error:', error));
//     }
// }

// Function to delete a post
// function deletePost(postId) {
//     if (confirm('Are you sure you want to delete this post?')) {
//         fetch(`${API_BASE_URL}/posts/${postId}/delete/`, {
//             method: 'POST',
//             headers: {
//                 'X-CSRFToken': getCSRFToken()
//             },
//             credentials: 'include'
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 alert('Post deleted successfully!');
//                 loadPosts();
//             } else {
//                 alert('Error deleting post');
//             }
//         })
//         .catch(error => console.log('Error:', error));
//     }
// }

// Helper function to get the CSRF token from cookies
// function getCSRFToken() {
//     const csrfToken = document.cookie.match(/csrftoken=([^;]+)/);
//     return csrfToken ? csrfToken[1] : null;
// }

// // Initialize the page by loading posts and checking user authentication
// loadPosts();
// checkAuth();

// Logout function
// document.getElementById('logout-btn').addEventListener('click', function () {
//     fetch(`${API_BASE_URL}/auth/logout/`, {
//         method: 'POST',
//         headers: {
//             'X-CSRFToken': getCSRFToken()
//         },
//         credentials: 'include'
//     })
//     .then(() => {
//         alert('Logged out successfully');
//         window.location.reload();
//     });
// });
