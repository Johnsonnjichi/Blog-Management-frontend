const API_BASE_URL = 'http://localhost:8000';  // Adjust to your API base URL
const postList = document.getElementById('post-list');
const postForm = document.getElementById('post-form');
const authToken = localStorage.getItem('authToken');  // Get the auth token from localStorage

// Function to check if the user is authenticated
function isAuthenticated() {
    return authToken !== null;  // Check if the auth token exists
}

// Function to show or hide elements based on authentication
function toggleAuthElements() {
    const authElements = document.querySelectorAll('.auth-element');
    const postFormElement = document.getElementById('post-form');
    
    // Show or hide elements based on authentication status
    if (isAuthenticated()) {
        authElements.forEach(element => element.style.display = 'block');
        if (postFormElement) postFormElement.style.display = 'block';  // Show post form if authenticated
    } else {
        authElements.forEach(element => element.style.display = 'none');
        if (postFormElement) postFormElement.style.display = 'none';  // Hide post form if not authenticated
    }
}

    setTimeout(()=>{
        localStorage.removeItem('authToken');
        window.location.reload()
        
   }, 3000000);


// Function to load posts from the API
function loadPosts() {
    fetch(`${API_BASE_URL}/blog/`)
        .then(response => response.json())
        .then(posts => {
            postList.innerHTML = '';
            posts.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.classList.add('post');
                
                // Create post content
                postDiv.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <p>Author: ${post.author}</p>
                    <p>Posted on: ${post.created_at}</p>
                `;
                
                // Add buttons conditionally
                if (isAuthenticated()) {
                    postDiv.innerHTML += `

                    <button onclick="editPost(${post.id},${post.author})">Edit</button>
                    <button onclick="createPost()
                    <button onclick="deletePost(${post.id})">Delete</button>

                    `;
                }
                
                postList.appendChild(postDiv);
            });
        })
        .catch(error => console.log('Error:', error));
}

// Function to handle form submission for creating a new post
function createPost(event) {
    if (event) event.preventDefault();  // Prevent form from submitting the traditional way

    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    fetch(`${API_BASE_URL}/blog/create_blog/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`  // Include token if user is authenticated
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

// Function to edit a post
async function editPost(postId, author) {
    const title = prompt("Enter new title:");
    const content = prompt("Enter new content:");

    const res = await fetch(`${API_BASE_URL}/blog/update/${postId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`  // Include token if user is authenticated
        },
        body: JSON.stringify({
            title: title,
            content: content,
            author
        })
    })
    console.log(res)
    loadPosts();
    // .then(response => {
    //     if (response.status === 401 || response.status === 403) {
    //         alert('You must be logged in to edit this post.');
    //         return;
    //     } else if(!response.ok) {
    //         alert('Failed to update post.');
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     console.log('Post updated:', data);
    //     loadPosts(); 
    //     // Reload posts after successful edit
    // })
    // .catch(error => console.log('Error editing post:', error));
}

// Function to delete a post
function deletePost(postId) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    fetch(`${API_BASE_URL}/blog/delete/${postId}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${authToken}`  // Include token if user is authenticated
        }
    })
    .then(response => {
        if (response.status === 401 || response.status === 403) {
            alert('You must be logged in to delete this post.');
            return;
        } else if(response.status === 204) {
            // No content returned, no need to call .json()
            console.log('Post deleted successfully');
            loadPosts();  // Reload posts after successful deletion
        } else {
            return response.json().then(data => { throw new Error(data.error || 'Error deleting post') });
        }
    })
    .catch(error => console.log('Error deleting post:', error));
}

// Initial setup
document.addEventListener('DOMContentLoaded', function() {
    toggleAuthElements();  // Show or hide elements based on authentication status
    loadPosts();  // Load posts when the page is loaded
});
















// const API_BASE_URL = 'http://localhost:8000';  // Adjust to your API base URL
// const postList = document.getElementById('post-list');
// const postForm = document.getElementById('post-form');
// const authToken = localStorage.getItem('authToken');  // Get the auth token from localStorage

// // Function to check if the user is authenticated
// function isAuthenticated() {
//     return authToken !== null;  // Check if the auth token exists
// }

// // Function to show or hide elements based on authentication
// function toggleAuthElements() {
//     const authElements = document.querySelectorAll('.auth-element');
//     authElements.forEach(element => {
//         if (isAuthenticated()) {
//             element.style.display = 'block';  // Show if authenticated
//         } else {
//             element.style.display = 'none';  // Hide if not authenticated
//         }
//     });
// }

// // Function to load posts from the API
// function loadPosts() {
//     fetch(`${API_BASE_URL}/blog/`)
//         .then(response => response.json())
//         .then(posts => {
//             postList.innerHTML = '';
//             posts.forEach(post => {
//                 const postDiv = document.createElement('div');
//                 postDiv.classList.add('post');
                
//                 // Create post content
//                 postDiv.innerHTML = `
//                     <h3>${post.title}</h3>
//                     <p>${post.content}</p>
//                     <p>Author: ${post.author}</p>
//                     <p>Posted on: ${post.created_at}</p>
//                 `;
                
//                 // Add buttons conditionally
//                 if (isAuthenticated()) {
//                     postDiv.innerHTML += `
//                         <button onclick="editPost(${post.id})">Edit</button>
//                         <button onclick="deletePost(${post.id})">Delete</button>
//                     `;
//                 }
                
//                 postList.appendChild(postDiv);
//             });
//         })
//         .catch(error => console.log('Error:', error));
// }

// // Function to handle form submission for creating a new post
// function createPost(event) {
//     if (event) event.preventDefault();  // Prevent form from submitting the traditional way

//     const title = document.getElementById('post-title').value;
//     const content = document.getElementById('post-content').value;

//     fetch(`${API_BASE_URL}/blog/create_blog/`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${authToken}`  // Include token if user is authenticated
//         },
//         body: JSON.stringify({
//             title: title,
//             content: content
//         })
//     })
//     .then(response => {
//         if (response.status === 401 || response.status === 403) {
//             alert('You must be logged in to create a post.');
//             return;
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Post created:', data);
//         loadPosts();  // Reload posts after successful creation
//     })
//     .catch(error => console.log('Error creating post:', error));
// }

// // Function to edit a post
// function editPost(postId) {
//     const title = prompt("Enter new title:");
//     const content = prompt("Enter new content:");

//     fetch(`${API_BASE_URL}/blog/update/${postId}/`, {
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${authToken}`  // Include token if user is authenticated
//         },
//         body: JSON.stringify({
//             title: title,
//             content: content
//         })
//     })
//     .then(response => {
//         if (response.status === 401 || response.status === 403) {
//             alert('You must be logged in to edit this post.');
//             return;
//         } else if(!response.ok) {
//             alert('Failed to update post.');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Post updated:', data);
//         loadPosts(); 
//          // Reload posts after successful edit
//     })
//     .catch(error => console.log('Error editing post:', error));
// }

// // Function to delete a post
// function deletePost(postId) {
//     if (!confirm("Are you sure you want to delete this post?")) return;

//     fetch(`${API_BASE_URL}/blog/delete/${postId}/`, {
//         method: 'DELETE',
//         headers: {
//             'Authorization': `Bearer ${authToken}`  // Include token if user is authenticated
//         }
//     })
//     .then(response => {
//         if (response.status === 401 || response.status === 403) {
//             alert('You must be logged in to delete this post.');
//             return;
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Post deleted:', data);
//         loadPosts();  // Reload posts after successful deletion
//     })
//     .catch(error => console.log('Error deleting post:', error));
// }

// // Initial setup
// document.addEventListener('DOMContentLoaded', function() {
//     toggleAuthElements();  // Show or hide elements based on authentication status
//     loadPosts();  // Load posts when the page is loaded
// });













// const API_BASE_URL = 'http://localhost:8000';  // Adjust to your API base URL
// const postForm = document.getElementById('post-form');
// const postList = document.getElementById('post-list');


// // Function to load posts from the API
// function loadPosts() {
//     fetch(`${API_BASE_URL}/blog/`)
//         .then(response => response.json())
//         .then(posts => {
//             postList.innerHTML = '';
//             posts.forEach(post => {
//                 const postDiv = document.createElement('div');
//                 postDiv.classList.add('post');
//                 postDiv.innerHTML = `
//                     <h3>${post.title}</h3>
//                     <p>${post.content}</p>
//                     <p>Author: ${post.author}</p>
//                     <p>Posted on: ${post.created_at}</p>
//                     <button onclick="editPost(${post.id})">Edit</button>
//                     <button onclick="deletePost(${post.id})">Delete</button>
//                     <button onclick="createpost(${post.id})">Post</button>
//                 `;
//                 postList.appendChild(postDiv);
//             });
//         })
//         .catch(error => console.log('Error:', error));
// }

// // Function to handle form submission for creating a new post
// function createPost(event) {
//     event.preventDefault();  // Prevent form from submitting the traditional way
    
//     const title = document.getElementById('post-title').value;
//     const content = document.getElementById('post-content').value;

//     fetch(`${API_BASE_URL}/blog/create_blog/`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             // If using token-based authentication, include the token here
//             'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//         },
//         body: JSON.stringify({
//             title: title,
//             content: content
//         })
//     })
//     .then(response => {
//         if (response.status === 401 || response.status === 403) {
//             alert('You must be logged in to create a post.');
//             return;
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Post created:', data);
//         loadPosts();  // Reload posts after successful creation
//     })
//     .catch(error => console.log('Error creating post:', error));
// }

// // editPost function
// function editPost(postId) {
//     const title = prompt("Enter new title:");
//     const content = prompt("Enter new content:");

//     fetch(`${API_BASE_URL}/blog/update/${postId}/`, {
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('authToken')}`  // Add token if necessary
//         },
//         body: JSON.stringify({
//             title: title,
//             content: content
//         })
//     })
//     .then(response => {
//         if (response.status === 401 || response.status === 403) {
//             alert('You must be logged in to edit this post.');
//             return;
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Post updated:', data);
//         loadPosts();  // Reload posts after successful edit
//     })
//     .catch(error => console.log('Error editing post:', error));
// }


// loadPosts();














// 
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

// 

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

