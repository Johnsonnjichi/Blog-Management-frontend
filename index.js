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
    const postFormElement = document.getElementById('create-post');
    
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

// Function to format date in a more user-friendly way
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to load posts from the API
function loadPosts() {
    fetch(`${API_BASE_URL}/blog/`)
        .then(response => response.json())
        .then(posts => {
            postList.innerHTML = '';
            posts.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.classList.add('post');

                console.log(post);
                
                // Create post content
                postDiv.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <p>Author: ${post.author_name}</p>
                    <p>Posted on: ${post.created_at}</p>
                    
                `;
                
                // Add buttons conditionally
                if (isAuthenticated()) {
                    postDiv.innerHTML += `

                    <button onclick="editPost(${post.id},'${post.author}')">Edit</button>
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

    fetch(`${API_BASE_URL}/blog/post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`  // Include token if user is authenticated
        },
        body: JSON.stringify({
            title: title,
            content: content,
        

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
        postForm.reset()
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
    });

    if (res.ok) {
        console.log('Post updated successfully');
        loadPosts(); // Reload posts after a successful update
    } else {
        alert('Failed to update post.');
    }
}

async function deletePost(postId) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    const res = await fetch(`${API_BASE_URL}/blog/delete/${postId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    });


    // Check for successful deletion
    if (res.ok) {
        alert('Post deleted successfully')
        console.log('Post deleted successfully');
        loadPosts(); 
    } else {
        alert('Failed to delete post.');
    }
}
    


// Initial setup
// Show or hide elements based on authentication status
document.addEventListener('DOMContentLoaded', function() {
    toggleAuthElements();  
    loadPosts();  

    postForm.addEventListener('submit', createPost)
});

